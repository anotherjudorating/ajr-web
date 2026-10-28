"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/Icon";

export const SECTIONS = [
  { label: "Rankings", href: "/rankings" },
  { label: "Explore", href: "/explore" },
  { label: "Head-to-head", href: "/head-to-head" },
  { label: "Records", href: "/records" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Desktop: the name, the sections and a search box. Below md: the name and a
// search button on the first row, the sections on a fixed second row.
export function Header() {
  const pathname = usePathname();
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
              Another Judo Rating
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
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              aria-label="Search"
              className="hidden md:flex lg:hidden w-10 h-10 -mr-2 items-center justify-center text-muted"
            >
              <Icon size={22} name="search" />
            </button>
            <div className="relative w-60 hidden lg:block">
              <Icon size={18}
                name="search"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                type="text"
                autoComplete="off"
                placeholder="Athletes, tournaments, nations"
                className="w-full h-8 pl-8 pr-2.5 bg-paper border border-rule text-ink placeholder:text-muted text-[12px] font-normal rounded-none focus:outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex md:hidden h-12 px-4 items-center justify-between w-full">
          {mobileSearch ? (
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Icon size={18}
                  name="search"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  autoFocus
                  type="text"
                  autoComplete="off"
                  placeholder="Athletes, tournaments, nations"
                  className="w-full h-8 pl-8 pr-2.5 bg-paper border border-ink rounded-none text-[12px] text-ink placeholder:text-muted focus:outline-none"
                />
              </div>
              <button
                type="button"
                aria-label="Close search"
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
                Another Judo Rating
              </Link>
              <button
                type="button"
                aria-label="Search athletes or tournaments"
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
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
