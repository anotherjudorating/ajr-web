"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/Icon";
import { useDict, useLang } from "@/i18n/client";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, type Lang, localeOf, localePath, PUBLISHED, stripLocale } from "@/i18n/locales";

// Remembered for a year: the home page jumps to this language, the hint stays quiet.
export function rememberLang(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; Max-Age=${LANG_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

// The header's language menu: the "language" icon (a globe; not "translate", which
// says machine translation) and, from md, the language's code. The menu lists the
// published languages by their own names, the current one marked and not a link.
// Each item is a real link to the same page (path, query and hash) in that language,
// for the keyboard and for crawlers; a click also remembers the choice. Shown only
// when there is a language to switch to.
export function LanguageSwitch({ pathname, label = true, className = "" }: { pathname: string; label?: boolean; className?: string }) {
  const d = useDict();
  const lang = useLang();
  const box = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  if (PUBLISHED.length < 2) return null;
  const path = stripLocale(pathname || "/").path;
  // the query and the hash are the browser's: the menu only opens there
  const tail = open ? `${location.search}${location.hash}` : "";

  return (
    <div ref={box} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={d.site.language.label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
        className={`h-10 ${label ? "px-2 gap-1" : "w-10"} flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer`}
      >
        <Icon size={22} name="language" />
        {label && <span className="text-[13px] font-medium tracking-wide">{localeOf(lang).short}</span>}
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full mt-1 z-[60] min-w-[160px] py-1 bg-paper border border-ink shadow-[0_8px_24px_rgba(51,48,46,0.12)]"
        >
          {PUBLISHED.map((locale) =>
            locale.code === lang ? (
              <li key={locale.code} role="menuitem" aria-current="true" className="px-3 h-9 flex items-center text-[13px] font-medium text-ink">
                {locale.name}
              </li>
            ) : (
              <li key={locale.code} role="none">
                <a
                  role="menuitem"
                  href={`${localePath(locale.code, path)}${tail}`}
                  hrefLang={locale.htmlLang}
                  lang={locale.htmlLang}
                  onClick={() => {
                    rememberLang(locale.code);
                    setOpen(false);
                  }}
                  className="px-3 h-9 flex items-center text-[13px] text-muted hover:text-ink hover:bg-panel"
                >
                  {locale.name}
                </a>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
