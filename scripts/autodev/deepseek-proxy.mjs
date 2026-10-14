import { createServer } from 'node:http';
import { appendFile, readFile, rename, writeFile } from 'node:fs/promises';

const port = Number(process.env.AUTODEV_PROXY_PORT ?? 4317);
const key = process.env.DEEPSEEK_API_KEY;
const authToken = process.env.AUTODEV_PROXY_TOKEN;
const statePath = process.env.AUTODEV_USAGE_FILE;
const dailyLimit = Number(process.env.AUTODEV_DAILY_REMAINING ?? 5);
const attemptLimit = Number(process.env.AUTODEV_ATTEMPT_BUDGET ?? 2);
const prices = { input: 0.3, output: 1.2 };
const maxInputBytes = 65_536;
const maxOutputTokens = 4096;
let spent = 0;
let reserved = 0;
let requests = 0;

if (!key || !authToken || !statePath) throw new Error('Missing DeepSeek proxy configuration');

async function saveUsage() {
  const temporary = `${statePath}.tmp`;
  await writeFile(temporary, JSON.stringify({ spent, reserved, requests }));
  await rename(temporary, statePath);
}

function authorize(req) {
  return req.headers.authorization === `Bearer ${authToken}`;
}

function requestPayload(raw) {
  const body = JSON.parse(raw.toString('utf8'));
  const inputSize = Buffer.byteLength(JSON.stringify(body));
  if (inputSize > maxInputBytes)
    throw Object.assign(new Error('Prompt exceeds the 64 KiB request budget'), { status: 413 });
  if (body.stream) body.stream_options = { ...body.stream_options, include_usage: true };
  body.max_tokens = Math.min(
    Number(body.max_tokens ?? body.max_completion_tokens ?? maxOutputTokens),
    maxOutputTokens,
  );
  delete body.max_completion_tokens;
  return { body, inputSize };
}

function billedCost(usage) {
  const input = Number(usage?.prompt_tokens ?? usage?.input_tokens ?? 0);
  const output = Number(usage?.completion_tokens ?? usage?.output_tokens ?? 0);
  return (input * prices.input + output * prices.output) / 1_000_000;
}

async function handle(req, res) {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ ok: true }));
    return;
  }
  if (!authorize(req)) {
    res.writeHead(401).end('Unauthorized');
    return;
  }
  const route = req.url?.split('?')[0];
  if (req.method !== 'POST' || !['/chat/completions', '/v1/chat/completions'].includes(route)) {
    res.writeHead(404).end('Not found');
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  let prepared;
  try {
    prepared = requestPayload(Buffer.concat(chunks));
  } catch (error) {
    res.writeHead(error.status ?? 400).end(error.message);
    return;
  }

  const requestReservation =
    (prepared.inputSize * prices.input + maxOutputTokens * prices.output) / 1_000_000;
  const totalLimit = Math.min(dailyLimit, attemptLimit);
  if (spent + reserved + requestReservation > totalLimit) {
    res.writeHead(429, { 'content-type': 'application/json' }).end(
      JSON.stringify({
        error: { message: 'Autodev token budget exhausted', type: 'rate_limit_error' },
      }),
    );
    return;
  }

  reserved += requestReservation;
  requests++;
  await saveUsage();
  let settled = false;
  const settle = async (usage) => {
    if (settled) return;
    settled = true;
    reserved -= requestReservation;
    const actual = billedCost(usage);
    spent += actual || requestReservation;
    await saveUsage();
  };

  try {
    const apiBase = process.env.AUTODEV_DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com';
    const upstream = await fetch(new URL('/chat/completions', apiBase), {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(prepared.body),
      signal: AbortSignal.timeout(240_000),
    });
    const contentType = upstream.headers.get('content-type') ?? '';
    if (!upstream.ok || !upstream.body) {
      const data = Buffer.from(await upstream.arrayBuffer());
      res
        .writeHead(upstream.status, { 'content-type': contentType || 'application/json' })
        .end(data);
      await settle(null);
      return;
    }

    res.writeHead(upstream.status, {
      'content-type': contentType,
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    });
    if (!contentType.includes('text/event-stream')) {
      const data = Buffer.from(await upstream.arrayBuffer());
      try {
        const response = JSON.parse(data.toString('utf8'));
        await settle(response.usage);
      } catch {
        await settle(null);
      }
      res.end(data);
      return;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let pending = '';
    let usage = null;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        pending += text;
        for (const line of pending.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const event = JSON.parse(payload);
            if (event.usage) usage = event.usage;
          } catch {
            // Ignore partial SSE records; the complete response is still forwarded.
          }
        }
        pending = pending.slice(pending.lastIndexOf('\n') + 1);
        if (!res.write(value)) await new Promise((resolve) => res.once('drain', resolve));
      }
      await settle(usage);
      res.end();
    } catch (error) {
      await settle(null);
      res.destroy(error);
    }
  } catch (error) {
    await settle(null);
    if (!res.headersSent) res.writeHead(502, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({ error: { message: 'DeepSeek request failed', type: 'upstream_error' } }),
    );
  }
}

const server = createServer((req, res) => {
  void handle(req, res).catch(async (error) => {
    await appendFile(`${statePath}.errors`, `${new Date().toISOString()} ${error.message}\n`);
    if (!res.headersSent) res.writeHead(500);
    res.end('Proxy error');
  });
});

server.listen(port, '0.0.0.0');
process.on('SIGTERM', () => server.close(() => process.exit(0)));
