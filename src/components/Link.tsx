"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

import { useLang } from "@/i18n/client";
import { localePath } from "@/i18n/locales";

// next/link with the page's language in front of the path: href="/rankings/men-73"
// opens /ru/rankings/men-73 on a Russian page and /rankings/men-73 on an English one.
// The only place next/link is imported (eslint no-restricted-imports); every link to
// a page of the site goes through here, so a path is written once, without a prefix.
export default function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const lang = useLang();
  return <NextLink href={typeof href === "string" ? localePath(lang, href) : href} {...rest} />;
}
