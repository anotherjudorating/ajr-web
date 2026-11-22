"use client";

import { Icon } from "@/components/Icon";
import { CONTROL } from "@/components/rankings/TableParts";
import { useDict, useLang } from "@/i18n/client";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, type Lang, localePath, PUBLISHED, stripLocale } from "@/i18n/locales";

// Remembered for a year: the home page jumps to this language, the redirect stays quiet.
export function rememberLang(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; Max-Age=${LANG_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

// The header's language choice: the site's own select (the toolbars' control) with the
// "language" icon in it (a globe; not "translate", which says machine translation), the
// languages by their own names, on a phone by their codes. Choosing one remembers it and
// opens the same page (path, query and hash) in that language; crawlers find the other
// languages in the head's hreflang links. Shown only when there is a language to switch to.
export function LanguageSwitch({ pathname, short = false, className = "" }: { pathname: string; short?: boolean; className?: string }) {
  const d = useDict();
  const lang = useLang();
  if (PUBLISHED.length < 2) return null;
  const path = stripLocale(pathname || "/").path;
  return (
    <div className={`relative shrink-0 ${className}`}>
      <Icon size={16} name="language" className="absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      <select
        value={lang}
        aria-label={d.site.language.label}
        onChange={(e) => {
          const to = e.target.value as Lang;
          rememberLang(to);
          // a full load on purpose: another language is another root layout (<html lang>, fonts)
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          location.assign(`${localePath(to, path)}${location.search}${location.hash}`);
        }}
        className={`${CONTROL} pl-7`}
      >
        {PUBLISHED.map((locale) => (
          <option key={locale.code} value={locale.code} lang={locale.htmlLang}>
            {short ? locale.short : locale.name}
          </option>
        ))}
      </select>
    </div>
  );
}
