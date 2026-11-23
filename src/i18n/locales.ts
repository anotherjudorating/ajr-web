// The site's languages and its address scheme: English without a prefix (the 25
// thousand addresses in the index), every other language under "/<code>/"
// (docs/audits/2026-11-21-i18n-plan-v2.md §3). Plain data and pure functions: this
// file is read on the server, in the browser and by the proxy.

export type Lang = "en" | "ru" | "fr" | "es" | "it" | "pt";

export type Locale = {
  code: Lang;
  name: string; // the language's own name, as the switcher lists it
  short: string; // the switcher's label next to the icon
  htmlLang: string;
  ogLocale: string;
  // A language is published when all its strings are proofread: only then is it in
  // the hreflang alternates, the sitemap, the switcher and the first-visit redirect.
  // An unpublished language's pages still render (for checking), with noindex.
  published: boolean;
};

export const LOCALES: readonly Locale[] = [
  {
    code: "en",
    name: "English",
    short: "EN",
    htmlLang: "en",
    ogLocale: "en_GB",
    published: true,
  },
  {
    code: "ru",
    name: "Русский",
    short: "RU",
    htmlLang: "ru",
    ogLocale: "ru_RU",
    published: true,
  },
  // The four below are translated and wait for a native proofreader: the owner
  // publishes each after review (published: true).
  {
    code: "fr",
    name: "Français",
    short: "FR",
    htmlLang: "fr",
    ogLocale: "fr_FR",
    published: false,
  },
  {
    code: "es",
    name: "Español",
    short: "ES",
    htmlLang: "es",
    ogLocale: "es_ES",
    published: false,
  },
  {
    code: "it",
    name: "Italiano",
    short: "IT",
    htmlLang: "it",
    ogLocale: "it_IT",
    published: false,
  },
  {
    // Brazilian Portuguese: the larger judo audience, written without regional words
    code: "pt",
    name: "Português",
    short: "PT",
    htmlLang: "pt-BR",
    ogLocale: "pt_BR",
    published: false,
  },
];

export const DEFAULT_LANG: Lang = "en";
export const LANGS: readonly Lang[] = LOCALES.map((l) => l.code);
export const PUBLISHED: readonly Locale[] = LOCALES.filter((l) => l.published);

// The switcher's cookie: the language a visitor chose, kept a year.
export const LANG_COOKIE = "lang";
export const LANG_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

// Whether a language's pages beyond the core are built ahead at a deploy. English:
// every page the site builds ahead (the tables, the 26 records, one athlete, one
// tournament, one nation). The other languages: the core (the home, the tables, the
// lists, the long pages) and one page of each dynamic route, which Cache Components
// want, the rest on its first visit (ISR). Six languages built every page 2.7 times
// over (580 pages, 88 MB of HTML, against 216 and 33 MB with two).
export function builtAhead(lang: string): boolean {
  return lang === DEFAULT_LANG;
}

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

export function localeOf(lang: Lang): Locale {
  return LOCALES.find((l) => l.code === lang) ?? LOCALES[0];
}

// "/rankings/men-73" in Russian: "/ru/rankings/men-73"; in English unchanged. The
// home page: "/ru" (no trailing slash, as Next redirects it away). Only the site's
// pages: the API, assets and outside addresses are left alone.
export function localePath(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG || !path.startsWith("/") || path.startsWith("/api/") || path.startsWith("//")) return path;
  if (path === "/") return `/${lang}`;
  if (path.startsWith("/?") || path.startsWith("/#")) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path}`;
}

// A path with its language -> the language and the path without the prefix:
// "/ru/rankings/men-73" -> { lang: "ru", path: "/rankings/men-73" }, "/ru" -> "/".
// "/en/..." too: the browser never shows it (the proxy sends it away), but it is the
// path the server renders an English page under, and usePathname() gives it there.
export function stripLocale(pathname: string): { lang: Lang; path: string } {
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)$/);
  if (match && isLang(match[1])) {
    return { lang: match[1], path: match[2] || "/" };
  }
  return { lang: DEFAULT_LANG, path: pathname || "/" };
}

// The same page in another language: the path without its prefix, with the new
// one, the same query and hash (the methodology's anchors).
export function switchPath(pathname: string, search: string, hash: string, to: Lang): string {
  return `${localePath(to, stripLocale(pathname).path)}${search}${hash}`;
}

// The cookie's value as the browser holds it, if any.
export function readLangCookie(cookie: string): Lang | null {
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=([a-z]{2})`));
  return match && isLang(match[1]) ? match[1] : null;
}

// The first of the browser's languages the site is published in ("ru-RU" -> ru).
export function preferredLang(languages: readonly string[]): Lang | null {
  for (const tag of languages) {
    const code = tag.slice(0, 2).toLowerCase();
    if (PUBLISHED.some((l) => l.code === code)) return code as Lang;
  }
  return null;
}
