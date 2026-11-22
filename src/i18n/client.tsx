"use client";

// The language and the dictionary in the browser. The provider for each language is
// its own client file (providers/en.tsx, providers/ru.tsx), so that a visitor
// downloads one dictionary, not all of them, and none travels in the page's payload.

import { createContext, type ReactNode, useContext } from "react";

import type { Dict } from "@/i18n/en";
import { DEFAULT_LANG, type Lang, localePath } from "@/i18n/locales";

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

// p("/rankings/men-73") -> "/ru/rankings/men-73" on a Russian page: for router.push
// and the other navigations that are not a <Link>.
export function useLocalePath(): (path: string) => string {
  const lang = useLang();
  return (path) => localePath(lang, path);
}
