"use client";

// The language and the dictionary in the browser. The provider for each language is
// its own client file (providers/en.tsx, providers/ru.tsx), so that a visitor
// downloads one dictionary, not all of them, and none travels in the page's payload.

import { createContext, type ReactNode, useContext, useMemo } from "react";

import type { Dict } from "@/i18n/en";
import { type Format, localeFormat } from "@/i18n/format";
import { DEFAULT_LANG, type Lang, localePath } from "@/i18n/locales";
import { type Plural, plural, t, type Vars } from "@/i18n/t";

type Locale = { lang: Lang; dict: Dict | null };

const LocaleContext = createContext<Locale>({ lang: DEFAULT_LANG, dict: null });

export function LocaleProvider({ lang, dict, children }: { lang: Lang; dict: Dict; children: ReactNode }) {
  return <LocaleContext value={{ lang, dict }}>{children}</LocaleContext>;
}

export function useLang(): Lang {
  return useContext(LocaleContext).lang;
}

export function useDict(): Dict {
  const { dict } = useContext(LocaleContext);
  if (!dict) throw new Error("useDict() outside the layout's language provider");
  return dict;
}

// The dates, places and numbers in the page's language (src/i18n/format.ts).
export function useFormat(): Format {
  const { lang, dict } = useContext(LocaleContext);
  if (!dict) throw new Error("useFormat() outside the layout's language provider");
  return useMemo(() => localeFormat(lang, dict), [lang, dict]);
}

// Everything a client component needs in one call: the dictionary `d`, the formats
// `f`, `t` to fill a string, `n` for a count with its noun, and the language.
export function useI18n(): { lang: Lang; d: Dict; f: Format; t: (template: string, vars: Vars) => string; n: (forms: Plural, count: number, shown?: string | number) => string } {
  const { lang, dict } = useContext(LocaleContext);
  if (!dict) throw new Error("useI18n() outside the layout's language provider");
  return useMemo(
    () => ({ lang, d: dict, f: localeFormat(lang, dict), t, n: (forms, count, shown) => plural(lang, forms, count, shown) }),
    [lang, dict],
  );
}

// p("/rankings/men-73") -> "/ru/rankings/men-73" on a Russian page: for router.push
// and the other navigations that are not a <Link>.
export function useLocalePath(): (path: string) => string {
  const lang = useLang();
  return (path) => localePath(lang, path);
}
