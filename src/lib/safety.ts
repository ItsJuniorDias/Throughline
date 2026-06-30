/**
 * Safety — a deliberately minimal, client-side check for crisis language.
 *
 * This is NOT detection-as-diagnosis and it never blocks the user from writing.
 * Its only job is the product's crisis guardrail: if someone writes about
 * self-harm, we surface a caring note pointing toward real support instead of
 * letting any future insight/LLM layer try to "advise" on it. Expand the terms
 * and wire to localized resources for production.
 */

import { translate } from '../i18n';

const PATTERNS: RegExp[] = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bsuicid/i,
  /\bself[-\s]?harm\b/i,
  /\bhurt myself\b/i,
  /\bdon'?t want to (be alive|live)\b/i,
  /\bno reason to (live|go on)\b/i,
];

export function containsCrisisLanguage(text: string): boolean {
  return PATTERNS.some((re) => re.test(text));
}

export interface CrisisSupport {
  title: string;
  message: string;
}

/**
 * Localized crisis-support copy for the current language. A getter (not a const)
 * so it always reflects the active language at the moment it's shown.
 */
export function crisisSupport(): CrisisSupport {
  return {
    title: translate('crisis.title'),
    message: translate('crisis.message'),
  };
}
