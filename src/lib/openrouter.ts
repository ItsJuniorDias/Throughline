/**
 * OpenRouter client — a tiny, dependency-free wrapper over the OpenAI-compatible
 * /chat/completions endpoint. The key is read from EXPO_PUBLIC_OPENROUTER_API_KEY.
 *
 * Rate-limit resilience (free tier is 20 req/min, 50 req/day per account):
 *   - on 429/503 we retry the same model with backoff (respecting Retry-After);
 *   - if it keeps failing we fall through a chain of free models — each routes to
 *     a different provider with its own limit, so a busy model isn't a dead end.
 *
 * SECURITY: EXPO_PUBLIC_* values are inlined into the JS bundle — they are NOT
 * secret. For production, proxy these calls through a small backend and keep the
 * real key there. This client is fine for development and personal builds.
 */

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? '';

/**
 * Model slugs. Both default to a free Llama for zero-cost dev. For the daily
 * read you'll likely want a stronger (paid) model in production — swap
 * `report` for e.g. 'anthropic/claude-sonnet-4-6' or 'openai/gpt-4.1'.
 */
export const MODELS = {
  fast: 'meta-llama/llama-3.3-70b-instruct:free',
  report: 'meta-llama/llama-3.3-70b-instruct:free',
} as const;

/**
 * Tried in order when a model is rate-limited. Different models route to
 * different providers (each with its own limit), and `openrouter/free` lets
 * OpenRouter auto-pick any available free model — the most reliable 429 escape.
 */
export const FREE_FALLBACKS: string[] = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'openrouter/free',
];

export function isConfigured(): boolean {
  return API_KEY.trim().length > 0;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CompleteOpts {
  /** single model; ignored if `models` is provided */
  model?: string;
  /** fallback chain, tried in order on 429/503 */
  models?: string[];
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
  /** retries per model on 429/503 before moving to the next model (default 1) */
  maxRetriesPerModel?: number;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Thrown for statuses worth retrying / falling back on (429, 503). */
class RetryableError extends Error {
  status: number;
  retryAfterMs?: number;
  constructor(status: number, retryAfterMs?: number) {
    super(`Rate limited (${status})`);
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

/** Account-level failure (bad key / no credits) — never worth a fallback. */
class AuthError extends Error {}

async function attempt(model: string, opts: CompleteOpts): Promise<string> {
  const { messages, maxTokens = 700, temperature = 0.6, signal } = opts;

  // 45s timeout per attempt unless the caller supplied its own signal
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

    if (res.status === 429 || res.status === 503) {
      const raw = res.headers.get('retry-after');
      const secs = raw ? parseFloat(raw) : NaN;
      throw new RetryableError(res.status, Number.isFinite(secs) ? secs * 1000 : undefined);
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      if (res.status === 401) throw new AuthError('OpenRouter rejected the API key (401).');
      if (res.status === 402) throw new AuthError('OpenRouter is out of credits (402).');
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

export async function complete(opts: CompleteOpts): Promise<string> {
  if (!isConfigured()) {
    throw new Error('OpenRouter key missing. Set EXPO_PUBLIC_OPENROUTER_API_KEY in .env.');
  }

  const chain = opts.models?.length ? opts.models : [opts.model ?? MODELS.fast];
  const maxRetries = opts.maxRetriesPerModel ?? 1;
  let lastError: unknown;

  for (const model of chain) {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await attempt(model, opts);
      } catch (e) {
        lastError = e;
        if (e instanceof AuthError) throw e; // account-level — other models won't help
        if (e instanceof RetryableError && i < maxRetries) {
          const backoff =
            e.retryAfterMs ?? Math.min(8000, 1500 * 2 ** i) + Math.floor(Math.random() * 400);
          await sleep(backoff);
          continue; // retry same model
        }
        break; // out of retries, or a model-specific error → next model in the chain
      }
    }
  }

  if (lastError instanceof RetryableError) {
    throw new Error('All free models are busy right now (429). Try again in a moment.');
  }
  throw lastError instanceof Error ? lastError : new Error('OpenRouter request failed.');
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
