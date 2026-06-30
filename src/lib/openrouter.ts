/**
 * OpenRouter client — a tiny, dependency-free wrapper over the OpenAI-compatible
 * /chat/completions endpoint. The key is read from EXPO_PUBLIC_OPENROUTER_API_KEY.
 *
 * SECURITY: EXPO_PUBLIC_* values are inlined into the JS bundle — they are NOT
 * secret. For production, proxy these calls through a small backend (or a
 * server-side function) and keep the real key there. This client is fine for
 * development and personal builds.
 */

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? '';

/**
 * Model slugs. Both default to a free Llama for zero-cost dev. For the monthly
 * report you'll likely want a stronger (paid) model in production — swap
 * `report` for e.g. 'anthropic/claude-sonnet-4-6' or 'openai/gpt-4.1'.
 */
export const MODELS = {
  fast: 'meta-llama/llama-3.3-70b-instruct:free',
  report: 'meta-llama/llama-3.3-70b-instruct:free',
} as const;

export function isConfigured(): boolean {
  return API_KEY.trim().length > 0;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CompleteOpts {
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

export async function complete({
  model,
  messages,
  maxTokens = 700,
  temperature = 0.6,
  signal,
}: CompleteOpts): Promise<string> {
  if (!isConfigured()) {
    throw new Error('OpenRouter key missing. Set EXPO_PUBLIC_OPENROUTER_API_KEY in .env.');
  }

  // 45s timeout unless the caller supplied its own signal
  const ctrl = signal ? null : new AbortController();
  const timeout = ctrl ? setTimeout(() => ctrl.abort(), 45000) : null;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        // OpenRouter uses these for attribution / rankings (optional)
        'HTTP-Referer': 'https://throughline.app',
        'X-Title': 'Throughline',
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
      signal: signal ?? ctrl?.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      if (res.status === 401) throw new Error('OpenRouter rejected the API key (401).');
      if (res.status === 402) throw new Error('OpenRouter is out of credits (402).');
      if (res.status === 429) throw new Error('Rate limited (429) — try again in a moment.');
      throw new Error(`OpenRouter error ${res.status}: ${body.slice(0, 160)}`);
    }

    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content;
    if (typeof text !== 'string') throw new Error('Unexpected response from OpenRouter.');
    return text.trim();
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

/** Extract a JSON object from a model reply that may be fenced or wrapped in prose. */
export function parseJSON<T>(text: string): T {
  let s = text.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first !== -1 && last !== -1 && (first > 0 || last < s.length - 1)) {
    s = s.slice(first, last + 1);
  }
  return JSON.parse(s) as T;
}

export async function completeJSON<T>(opts: CompleteOpts): Promise<T> {
  return parseJSON<T>(await complete(opts));
}
