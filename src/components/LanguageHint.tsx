"use client";

import { useState, useSyncExternalStore } from "react";

import { rememberLang } from "@/components/LanguageSwitch";
import { useLang } from "@/i18n/client";
import { type Lang, localeOf, localePath, preferredLang, PUBLISHED, readLangCookie, stripLocale } from "@/i18n/locales";

// The first visit from a browser whose language the site has: one line under the
// header, in that language, with the same page there and a way to say no. Decided in
// the browser after hydration (navigator.languages, the cookie), never on the server:
// every page's HTML is one and the same for everyone at the edge, and search engines
// never see it. A choice either way is kept in the cookie; the switcher sets it too.

// The language to offer, or null: a published one the browser prefers, when the
// visitor has not chosen yet and the page is not in it already.
function suggestion(lang: Lang): Lang | null {
  if (PUBLISHED.length < 2 || readLangCookie(document.cookie)) return null;
  const to = preferredLang(navigator.languages ?? [navigator.language]);
  return to && to !== lang ? to : null;
}

// nothing to subscribe to: the answer does not change while the page is open
const subscribe = () => () => {};

export function LanguageHint() {
  const lang = useLang();
  // the browser's answer, read once the page is in it (null in the server's HTML)
  const to = useSyncExternalStore(subscribe, () => suggestion(lang), () => null);
  const [dismissed, setDismissed] = useState(false);

  if (!to || dismissed) return null;
  const locale = localeOf(to);
  const href = `${localePath(to, stripLocale(location.pathname).path)}${location.search}${location.hash}`;
  return (
    <div
      lang={locale.htmlLang}
      className="sticky top-[84px] md:top-16 z-30 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 h-10 flex items-center gap-4 bg-panel border-b border-rule text-[13px] text-ink"
    >
      <span className="truncate">{locale.hint.text}</span>
      <a
        href={href}
        hrefLang={locale.htmlLang}
        onClick={() => rememberLang(to)}
        className="font-serif font-semibold text-claret hover:underline whitespace-nowrap"
      >
        {locale.hint.open}
      </a>
      <button
        type="button"
        onClick={() => {
          rememberLang(lang);
          setDismissed(true);
        }}
        className="text-muted hover:text-ink whitespace-nowrap cursor-pointer"
      >
        {locale.hint.dismiss}
      </button>
    </div>
  );
}
