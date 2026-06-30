/**
 * Reflection prompts. Kept deliberately open-ended and non-clinical — this is a
 * journaling/self-knowledge tool, not therapy. The "of the day" pick is
 * deterministic per calendar day so the prompt is stable across app opens.
 */

import { dayKey } from '../lib/date';

export const PROMPTS: { id: string; text: string }[] = [
  { id: 'p01', text: 'What pulled at your attention most today, and why that?' },
  { id: 'p02', text: 'Name one thing you decided today. What were you weighing?' },
  { id: 'p03', text: 'Where did you feel most like yourself today?' },
  { id: 'p04', text: 'What drained you, and what was worth the cost?' },
  { id: 'p05', text: 'What would you tell yourself from this morning, knowing how the day went?' },
  { id: 'p06', text: 'Something small that went better than expected.' },
  { id: 'p07', text: 'What are you avoiding, and what is it protecting you from?' },
  { id: 'p08', text: 'Who crossed your mind today that you didn’t reach out to?' },
  { id: 'p09', text: 'What did today teach you that yesterday hadn’t?' },
  { id: 'p10', text: 'If today had a single sentence, what would it be?' },
  { id: 'p11', text: 'What felt heavier than it should have? Sit with why.' },
  { id: 'p12', text: 'A moment you’d want to remember a year from now.' },
  { id: 'p13', text: 'What did you give your energy to, and was it on purpose?' },
  { id: 'p14', text: 'Where did you change your mind, even slightly?' },
];

export function promptById(id: string | undefined) {
  return PROMPTS.find((p) => p.id === id);
}

/** Stable prompt for a given day (defaults to today). */
export function promptOfTheDay(d = new Date()) {
  const key = dayKey(d);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % PROMPTS.length;
  return PROMPTS[idx];
}
