"use client";

// next/navigation for a site with a language in its paths. The components write and
// compare the site's own paths ("/rankings/men-73"); the prefix is added on the way
// out and taken off on the way in. The only place these two hooks are imported from
// next/navigation (eslint no-restricted-imports).

import { usePathname as useFullPathname, useRouter as useNextRouter } from "next/navigation";
import { useMemo } from "react";

import { useLang, useLocalePath } from "@/i18n/client";
import { localePath, stripLocale } from "@/i18n/locales";

type Router = ReturnType<typeof useNextRouter>;

// router.push("/athletes/1") opens /ru/athletes/1 on a Russian page.
export function useRouter(): Router {
  const router = useNextRouter();
  const lang = useLang();
  return useMemo(
    () => ({
      ...router,
      push: (href, options) => router.push(localePath(lang, href), options),
      replace: (href, options) => router.replace(localePath(lang, href), options),
      prefetch: ((href, options) => router.prefetch(localePath(lang, href), options)) as Router["prefetch"],
    }),
    [router, lang],
  );
}

// The page's path without the language: "/rankings/men-73" on /ru/rankings/men-73.
export function usePathname(): string {
  return stripLocale(useFullPathname()).path;
}

// The path as the browser shows it, prefix included (the language switcher).
export { useFullPathname, useLocalePath };
