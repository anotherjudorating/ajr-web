"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/explore/tournaments", label: "Tournaments" },
  { href: "/explore/contests", label: "Contests" },
  { href: "/explore/athletes", label: "Athletes" },
  { href: "/explore/nations", label: "Nations" },
];

// "EXPLORE  Tournaments Contests Athletes Nations" with the open one marked.
export function ExploreTabs({ current }: { current: string }) {
  return (
    <nav className="flex items-center gap-4 sm:gap-2" aria-label="Explore">
      <span className="w-12 sm:w-16 shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted">Explore</span>
      <div className="flex items-center gap-4 sm:gap-2">
        {TABS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-1 py-1.5 sm:px-2 whitespace-nowrap text-[13px] sm:text-[15px] ${
              current.startsWith(href) ? "font-bold text-ink border-b-2 border-claret" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// The URL is runtime data: it streams in under a Suspense whose fallback is the tabs unmarked.
export function CurrentExploreTabs() {
  return <ExploreTabs current={usePathname()} />;
}
