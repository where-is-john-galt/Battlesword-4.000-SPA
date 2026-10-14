import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';

test('proxy keeps the provider key private, caps output, and enforces attempt budgets', async () => {
  let providerRequests = 0;
  const provider = createServer(async (req, res) => {
    providerRequests++;
    assert.equal(req.headers.authorization, 'Bearer provider-secret');
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    assert.equal(body.max_tokens, 4096);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        id: 'test',
        choices: [
          { index: 0, message: { role: 'assistant', content: 'ok' }, finish_reason: 'stop' },
        ],
        usage: { prompt_tokens: 2, completion_tokens: 3500, total_tokens: 3502 },
      }),
    );
  });
  await new Promise((resolve) => provider.listen(0, '127.0.0.1', resolve));
  const providerPort = provider.address().port;
  const proxyPort = providerPort + 1;
  const temp = await mkdtemp(path.join(os.tmpdir(), 'battlesword-proxy-'));
  const usagePath = path.join(temp, 'usage.json');
  const token = 'local-proxy-token';
  const proxy = spawn(process.execPath, ['scripts/autodev/deepseek-proxy.mjs'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DEEPSEEK_API_KEY: 'provider-secret',
      AUTODEV_PROXY_TOKEN: token,
      AUTODEV_PROXY_PORT: String(proxyPort),
      AUTODEV_DEEPSEEK_BASE_URL: `http://127.0.0.1:${providerPort}`,
      AUTODEV_DAILY_REMAINING: '0.0053',
      AUTODEV_ATTEMPT_BUDGET: '0.0053',
      AUTODEV_USAGE_FILE: usagePath,
    },
    stdio: 'ignore',
  });

  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        ready = (await fetch(`http://127.0.0.1:${proxyPort}/health`)).ok;
        if (ready) break;
      } catch {
        await delay(25);
      }
    }
    assert.equal(ready, true, 'proxy starts and exposes a health endpoint');

    const endpoint = `http://127.0.0.1:${proxyPort}/v1/chat/completions`;
    const payload = {
      model: 'deepseek-flash',
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 99_999,
    };
    assert.equal(
      (await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) })).status,
      401,
    );

    const request = () =>
      fetch(endpoint, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    const response = await request();
    assert.equal(response.status, 200);
    assert.equal((await response.json()).choices[0].message.content, 'ok');

    const limited = await request();
    assert.equal(
      limited.status,
      429,
      'the next request is stopped before exceeding the attempt budget',
    );
    const oversized = await fetch(endpoint, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-flash',
        messages: [{ role: 'user', content: 'x'.repeat(300_000) }],
      }),
    });
    assert.equal(oversized.status, 413);
    assert.equal(providerRequests, 1);

    const usage = JSON.parse(await readFile(usagePath, 'utf8'));
    assert.equal(usage.requests, 1);
    assert.ok(usage.spent > 0);
    assert.equal(usage.reserved, 0);
  } finally {
    proxy.kill('SIGTERM');
    provider.close();
    await rm(temp, { recursive: true, force: true });
  }
});
