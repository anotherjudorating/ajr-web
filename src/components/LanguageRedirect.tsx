"use client";

import { useEffect } from "react";

import { rememberLang } from "@/components/LanguageSwitch";
import { useLang } from "@/i18n/client";
import { type Lang, localePath, preferredLang, PUBLISHED, readLangCookie, stripLocale } from "@/i18n/locales";

// The first visit from a browser whose language the site has: the same page in that
// language at once, and the choice remembered, so the switcher's choice later wins.
// Decided in the browser after hydration (navigator.languages, the cookie), never on
// the server: every page's HTML is one and the same for everyone at the edge, and
// search engines (which do not run this or announce no such language) stay on the page
// they asked for.

// The language to go to, or null: a published one the browser prefers, when the
// visitor has not chosen yet and the page is not in it already.
function target(lang: Lang): Lang | null {
  if (PUBLISHED.length < 2 || readLangCookie(document.cookie)) return null;
  const to = preferredLang(navigator.languages ?? [navigator.language]);
  return to && to !== lang ? to : null;
}

export function LanguageRedirect() {
  const lang = useLang();
  useEffect(() => {
    const to = target(lang);
    if (!to) return;
    rememberLang(to);
    location.replace(`${localePath(to, stripLocale(location.pathname).path)}${location.search}${location.hash}`);
  }, [lang]);
  return null;
}
