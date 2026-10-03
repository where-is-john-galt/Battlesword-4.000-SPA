import { setTimeout as sleep } from 'node:timers/promises';

export async function requestJson(
  messages,
  {
    apiKey,
    model = 'deepseek-flash',
    fetchImpl = fetch,
    wait = sleep,
    onUsage = () => {},
    maxTokens = 32768,
  } = {},
) {
  if (!apiKey)
    throw new Error('Set DEEPSEEK_API_KEY to run extraction (not needed for --plan or --validate)');
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try {
      response = await fetchImpl('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          response_format: { type: 'json_object' },
          thinking: { type: 'disabled' },
          temperature: 0,
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(180_000),
      });
    } catch {
      if (attempt === 2) throw new Error('DeepSeek network error or timeout after 3 attempts');
      await wait(1000 * 2 ** attempt);
      continue;
    }
    if (!response.ok) {
      // Never log provider bodies or request headers; they can contain sensitive material.
      if ((response.status === 429 || response.status >= 500) && attempt < 2) {
        await wait(1000 * 2 ** attempt);
        continue;
      }
      throw new Error(`DeepSeek HTTP ${response.status}`);
    }
    const body = await response.json();
    onUsage(body.usage ?? {});
    const choice = body.choices?.[0];
    if (choice?.finish_reason !== 'stop')
      throw new Error('DeepSeek response incomplete or truncated');
    if (!choice.message?.content?.trim()) throw new Error('DeepSeek returned empty JSON content');
    try {
      return JSON.parse(choice.message.content);
    } catch {
      throw new Error('DeepSeek returned invalid JSON');
    }
  }
}
