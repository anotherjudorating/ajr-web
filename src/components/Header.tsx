"use client";

import Link from "@/components/Link";
import { usePathname } from "@/i18n/navigation";
import { useState } from "react";

import { Icon } from "@/components/Icon";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { SiteSearch } from "@/components/SiteSearch";
import { useDict } from "@/i18n/client";
import type { Dict } from "@/i18n/en";

const SECTIONS: { label: keyof Dict["site"]["header"]; href: string; also?: string[] }[] = [
  { label: "rankings", href: "/rankings" },
  { label: "explore", href: "/explore", also: ["/tournaments", "/contests", "/countries"] },
  { label: "headToHead", href: "/head-to-head" },
  { label: "records", href: "/records" },
];

// A section's own pages and the pages its lists open (a tournament, a contest).
function isActive(pathname: string, href: string): boolean {
  const section = SECTIONS.find((s) => s.href === href);
  return [href, ...(section?.also ?? [])].some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

// The header with the current section marked. The path is runtime data: on pages
// whose URL is not known ahead (an athlete's), it streams in under a Suspense whose
// fallback is the same header with no section marked.
export function CurrentHeader() {
  return <Header pathname={usePathname()} />;
}

// Desktop: the name, the sections and a search box. Below md: the name and a
// search button on the first row, the sections on a fixed second row.
export function Header({ pathname }: { pathname: string }) {
  const d = useDict();
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-paper border-b border-rule max-md:border-b-0">
        <div className="hidden md:flex h-16 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 items-center justify-between">
          <div className="flex items-center h-full">
            <Link
              href="/"
              className="font-serif text-[22px] leading-[28px] font-bold tracking-tight whitespace-nowrap text-ink"
            >
              {d.site.name}
            </Link>
            <nav className="flex items-center gap-6 lg:gap-8 h-full ml-8 lg:ml-12">
              {SECTIONS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  className={`h-full inline-flex items-center text-[15px] font-normal border-b-2 transition-colors ${
                    isActive(pathname, href)
                      ? "text-claret border-claret"
                      : "text-muted hover:text-ink border-transparent"
                  }`}
                >
                  {d.site.header[label]}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitch pathname={pathname} />
            <Link
              href="/explore/athletes"
              aria-label={d.site.header.search}
              className="hidden md:flex lg:hidden w-10 h-10 -mr-2 items-center justify-center text-muted hover:text-ink"
            >
              <Icon size={22} name="search" />
            </Link>
            <div className="hidden lg:block">
              <SiteSearch />
            </div>
          </div>
        </div>

        <div className="flex md:hidden h-12 px-4 items-center justify-between w-full">
          {mobileSearch ? (
            <div className="flex items-center gap-2 w-full">
              <SiteSearch wide autoFocus />
              <button
                type="button"
                aria-label={d.site.header.closeSearch}
                onClick={() => setMobileSearch(false)}
                className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
              >
                <Icon size={20} name="close" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link
                href="/"
                className="font-serif text-[20px] leading-[28px] font-bold tracking-tight text-ink whitespace-nowrap"
              >
                {d.site.name}
              </Link>
              {/* ml-auto: with the switcher hidden the row is as before (two ends) */}
              <LanguageSwitch pathname={pathname} chevron={false} className="ml-auto" />
              <button
                type="button"
                aria-label={d.site.header.searchAthletes}
                onClick={() => setMobileSearch(true)}
                className="w-10 h-10 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
              >
                <Icon size={22} name="search" />
              </button>
            </div>
          )}
        </div>
      </header>

      <nav className="md:hidden fixed top-12 left-0 right-0 z-40 h-9 px-4 sm:px-6 border-b border-rule bg-paper flex items-stretch gap-6">
        {SECTIONS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={`text-[13px] inline-flex items-start pt-[5px] border-b-2 -mb-px whitespace-nowrap transition-colors ${
              isActive(pathname, href)
                ? "text-claret border-claret"
                : "text-muted hover:text-ink border-transparent"
            }`}
          >
            {d.site.header[label]}
          </Link>
        ))}
      </nav>
    </>
  );
}
