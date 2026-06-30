/**
 * Mood metadata. The mood scale is core product data (it drives the seam color,
 * the trend chart, and insights), so its labels and ordering live in one place.
 *
 * `label`/`short` stay as English fallbacks; `key` points at the i18n resource
 * (mood.rough … mood.great) so any UI showing a mood name can localize it with
 * `moodLabel(meta)` (non-React) or `tr('mood.' + meta.key)` inside a component.
 */

import { moodColor, moodScale } from '../theme/colors';
import type { Mood } from '../data/types';
import { translate } from '../i18n';

export type MoodKey = 'rough' | 'low' | 'okay' | 'good' | 'great';

export interface MoodMeta {
  value: Mood;
  key: MoodKey;
  label: string;
  short: string;
  color: string;
}

export const MOODS: MoodMeta[] = [
  { value: 1, key: 'rough', label: 'Rough', short: 'Rough', color: moodScale[1] },
  { value: 2, key: 'low', label: 'Low', short: 'Low', color: moodScale[2] },
  { value: 3, key: 'okay', label: 'Okay', short: 'Okay', color: moodScale[3] },
  { value: 4, key: 'good', label: 'Good', short: 'Good', color: moodScale[4] },
  { value: 5, key: 'great', label: 'Great', short: 'Great', color: moodScale[5] },
];

export function moodMeta(mood: Mood | undefined | null): MoodMeta {
  return MOODS.find((m) => m.value === mood) ?? MOODS[2];
}

/** Localized mood label for the current language (safe outside React). */
export function moodLabel(mood: Mood | undefined | null): string {
  return translate(`mood.${moodMeta(mood).key}`);
}

export { moodColor };
