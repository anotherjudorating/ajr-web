// The language and the dictionary on the server: pages, generateMetadata, server
// components. Never in lib/api.ts and the other "use cache" readers (eslint
// no-restricted-imports): a cached function that read the language would be
// cached once per language, and the database read N times.

import { permanentRedirect, redirect } from "next/navigation";
import { lang } from "next/root-params";

import { type Dict, en } from "@/i18n/en";
import { DEFAULT_LANG, isLang, type Lang, localePath } from "@/i18n/locales";
import { ru } from "@/i18n/ru";

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

// redirect() and permanentRedirect() to a page of the site, in the page's language.
export async function redirectTo(path: string): Promise<never> {
  redirect(localePath(await currentLang(), path));
}

export async function permanentRedirectTo(path: string): Promise<never> {
  permanentRedirect(localePath(await currentLang(), path));
}
