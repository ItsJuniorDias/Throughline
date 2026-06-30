/**
 * i18n configuration — the languages Throughline ships with.
 *
 * The six most-spoken languages in the world (by total speakers), with
 * Portuguese (Brazil) included by request. All are left-to-right, so no RTL
 * layout handling is needed. To add Arabic later you'd flip `rtl: true` here and
 * wire I18nManager / a flipped layout — left out deliberately for now.
 *
 *   code   → our short key, also the storage value
 *   label  → the language's own name, shown in the picker (autonym)
 *   english→ the English name, shown as a subtitle
 *   locale → BCP-47 tag handed to Intl for date/number formatting
 *   ai     → how we tell the model which language to write the reads in
 */

export type LangCode = 'en' | 'pt' | 'es' | 'zh' | 'hi' | 'fr';

export interface LanguageMeta {
  code: LangCode;
  label: string;
  english: string;
  locale: string;
  ai: string;
  rtl: boolean;
}

export const LANGUAGES: Record<LangCode, LanguageMeta> = {
  en: { code: 'en', label: 'English', english: 'English', locale: 'en-US', ai: 'English', rtl: false },
  pt: {
    code: 'pt',
    label: 'Português (Brasil)',
    english: 'Portuguese',
    locale: 'pt-BR',
    ai: 'Brazilian Portuguese',
    rtl: false,
  },
  es: { code: 'es', label: 'Español', english: 'Spanish', locale: 'es-ES', ai: 'Spanish', rtl: false },
  zh: {
    code: 'zh',
    label: '中文',
    english: 'Chinese',
    locale: 'zh-CN',
    ai: 'Simplified Chinese',
    rtl: false,
  },
  hi: { code: 'hi', label: 'हिन्दी', english: 'Hindi', locale: 'hi-IN', ai: 'Hindi', rtl: false },
  fr: { code: 'fr', label: 'Français', english: 'French', locale: 'fr-FR', ai: 'French', rtl: false },
};

/** Stable display order for the language picker. */
export const LANGUAGE_ORDER: LangCode[] = ['en', 'pt', 'es', 'zh', 'hi', 'fr'];

export const DEFAULT_LANG: LangCode = 'en';

/**
 * Best-effort device-language detection (no extra native dependency).
 * Reads the locale Intl resolved for this device and maps its primary subtag to
 * one of our supported languages. Falls back to English when unsupported or when
 * Intl is unavailable.
 */
export function detectDeviceLanguage(): LangCode {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().locale || '';
    const primary = resolved.toLowerCase().split('-')[0];
    if (primary in LANGUAGES) return primary as LangCode;
  } catch {
    /* Intl unavailable — fall through to default */
  }
  return DEFAULT_LANG;
}
