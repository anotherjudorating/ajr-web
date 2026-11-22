// The language and the dictionary on the server: pages, generateMetadata, server
// components. Never in lib/api.ts and the other "use cache" readers (eslint
// no-restricted-imports): a cached function that read the language would be
// cached once per language, and the database read N times.

import { permanentRedirect, redirect } from "next/navigation";
import { lang } from "next/root-params";

import { type Dict, en } from "@/i18n/en";
import { type Format, localeFormat } from "@/i18n/format";
import { DEFAULT_LANG, isLang, type Lang, localePath } from "@/i18n/locales";
import { ru } from "@/i18n/ru";
import { type Plural, plural, t, type Vars } from "@/i18n/t";

const DICTS: Record<Lang, Dict> = { en, ru };

// The page's language: the root parameter. The proxy rewrites every path whose
// first segment is not a language into /en/..., so it is always one of ours.
export async function currentLang(): Promise<Lang> {
  const value = await lang();
  return isLang(value) ? value : DEFAULT_LANG;
}

export async function dict(): Promise<Dict> {
  return DICTS[await currentLang()];
}

// The dates, places and numbers in the page's language (src/i18n/format.ts).
export async function format(): Promise<Format> {
  const lang = await currentLang();
  return localeFormat(lang, DICTS[lang]);
}

// Everything a server component or generateMetadata needs in one call: the dictionary
// `d`, the formats `f`, `t` to fill a string, `n` for a count with its noun, the language.
export async function i18n(): Promise<{ lang: Lang; d: Dict; f: Format; t: (template: string, vars: Vars) => string; n: (forms: Plural, count: number, shown?: string | number) => string }> {
  const lang = await currentLang();
  const d = DICTS[lang];
  return { lang, d, f: localeFormat(lang, d), t, n: (forms, count, shown) => plural(lang, forms, count, shown) };
}

// redirect() and permanentRedirect() to a page of the site, in the page's language.
export async function redirectTo(path: string): Promise<never> {
  redirect(localePath(await currentLang(), path));
}

export async function permanentRedirectTo(path: string): Promise<never> {
  permanentRedirect(localePath(await currentLang(), path));
}
