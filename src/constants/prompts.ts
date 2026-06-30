/**
 * Reflection prompts. Kept deliberately open-ended and non-clinical — this is a
 * journaling/self-knowledge tool, not therapy. The "of the day" pick is
 * deterministic per calendar day so the prompt is stable across app opens.
 *
 * Only the IDs live here; each prompt's text lives in the i18n dictionaries
 * under `prompt.items.<id>`, so prompts are translated per language. IDs are
 * stored on entries (entry.promptId), so they are stable — never renumber them.
 */

import { dayKey } from '../lib/date';
import { translate } from '../i18n';

/** Canonical prompt IDs, in display order. */
export const PROMPT_IDS = [
  'p01',
  'p02',
  'p03',
  'p04',
  'p05',
  'p06',
  'p07',
  'p08',
  'p09',
  'p10',
  'p11',
  'p12',
  'p13',
  'p14',
] as const;

export type PromptId = (typeof PROMPT_IDS)[number];

/** Localized text for a prompt id, in the current language (safe outside React). */
export function promptText(id: string): string {
  return translate(`prompt.items.${id}`);
}

/** Returns the id if it's a known prompt, else undefined. */
export function promptById(id: string | undefined): PromptId | undefined {
  return PROMPT_IDS.find((p) => p === id);
}

/** Stable prompt id for a given day (defaults to today). */
export function promptOfTheDay(d = new Date()): PromptId {
  const key = dayKey(d);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % PROMPT_IDS.length;
  return PROMPT_IDS[idx];
}
