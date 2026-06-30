/**
 * i18n engine — Throughline
 * ---------------------------------------------------------------------------
 * A tiny, dependency-free translation layer that mirrors the app's existing
 * zustand + AsyncStorage pattern (see src/data/store.ts). No i18next, no extra
 * native module — just typed dictionaries, a persisted current language, a hook
 * for components, and plain accessors for non-React code (date helpers, the
 * insights store, the purchases layer).
 *
 * Why a store and not just context: the chosen language must survive restarts
 * and must be readable outside React (e.g. when formatting a date inside a
 * background insight generation). The store gives us both; the `useT` hook
 * subscribes components so a language change re-renders the whole tree.
 *
 * NOTE on the translator name: components already bind the THEME to `t`
 * (`const t = useTheme()`), so the translator is exposed as `tr` to avoid a
 * collision. Use `const tr = useT();` then `tr('you.title')`.
 */

import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LANGUAGES,
  DEFAULT_LANG,
  detectDeviceLanguage,
  type LangCode,
  type LanguageMeta,
} from './config';
import en, { type Resources } from './en';
import pt from './pt';
import es from './es';
import zh from './zh';
import hi from './hi';
import fr from './fr';

export { LANGUAGES, LANGUAGE_ORDER, DEFAULT_LANG } from './config';
export type { LangCode, LanguageMeta } from './config';
export type { Resources } from './en';

const RESOURCES: Record<LangCode, Resources> = { en, pt, es, zh, hi, fr };

export type TParams = Record<string, string | number>;

// ─── Store ───────────────────────────────────────────────────────────────────

interface LocaleState {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
}

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      // first launch: follow the device; later launches: the persisted choice
      // (loaded by the persist middleware) wins.
      lang: detectDeviceLanguage(),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'throughline.locale.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ lang: s.lang }),
    },
  ),
);

// ─── Resolver ────────────────────────────────────────────────────────────────

function lookup(dict: Resources, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => {
    if (node && typeof node === 'object' && key in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
}

function interpolate(template: string, params?: TParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    name in params ? String(params[name]) : `{${name}}`,
  );
}

/**
 * Resolve a key for a language, falling back to English for any missing key, and
 * finally to the raw key path so nothing renders blank. Handles { one, other }
 * plural objects (selected by `params.count`) and plain strings.
 */
function resolve(lang: LangCode, path: string, params?: TParams): string {
  let value = lookup(RESOURCES[lang], path);
  if (value === undefined && lang !== 'en') value = lookup(en, path);
  if (value === undefined) return path;

  // plural form
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const forms = value as { one?: string; other?: string };
    if ('one' in forms || 'other' in forms) {
      const count = typeof params?.count === 'number' ? params.count : 0;
      const picked = count === 1 ? forms.one ?? forms.other ?? '' : forms.other ?? forms.one ?? '';
      return interpolate(picked, params);
    }
  }

  if (typeof value === 'string') return interpolate(value, params);
  return path;
}

function resolveList(lang: LangCode, path: string): string[] {
  let value = lookup(RESOURCES[lang], path);
  if (value === undefined && lang !== 'en') value = lookup(en, path);
  return Array.isArray(value) ? (value as string[]) : [];
}

// ─── Non-React accessors (for date helpers, stores, services) ────────────────

/** Translate using the current language. Safe to call outside React. */
export function translate(key: string, params?: TParams): string {
  return resolve(useLocale.getState().lang, key, params);
}

/** Translate a string list (e.g. suggested tags) using the current language. */
export function translateList(key: string): string[] {
  return resolveList(useLocale.getState().lang, key);
}

/** Current BCP-47 locale for Intl date/number formatting. */
export function getActiveLocale(): string {
  return LANGUAGES[useLocale.getState().lang]?.locale ?? LANGUAGES[DEFAULT_LANG].locale;
}

/** Metadata (autonym, English name, AI name, rtl) for the current language. */
export function getActiveLanguage(): LanguageMeta {
  return LANGUAGES[useLocale.getState().lang] ?? LANGUAGES[DEFAULT_LANG];
}

// ─── React hooks ─────────────────────────────────────────────────────────────

export type TFn = (key: string, params?: TParams) => string;

/**
 * The translator hook. Subscribes the component to the active language so a
 * switch re-renders it. Returns the `tr` function:
 *
 *   const tr = useT();
 *   <Text>{tr('you.title')}</Text>
 *   <Text>{tr('streak.days', { count })}</Text>
 */
export function useT(): TFn {
  const lang = useLocale((s) => s.lang);
  return useMemo<TFn>(() => (key, params) => resolve(lang, key, params), [lang]);
}

/** A list-returning translator for array resources (suggested tags, etc.). */
export function useTList(): (key: string) => string[] {
  const lang = useLocale((s) => s.lang);
  return useMemo(() => (key: string) => resolveList(lang, key), [lang]);
}

/** Full translation context: the function plus current language metadata. */
export function useTranslation() {
  const lang = useLocale((s) => s.lang);
  const setLang = useLocale((s) => s.setLang);
  const tr = useMemo<TFn>(() => (key, params) => resolve(lang, key, params), [lang]);
  return { tr, lang, setLang, locale: LANGUAGES[lang].locale, meta: LANGUAGES[lang] };
}
