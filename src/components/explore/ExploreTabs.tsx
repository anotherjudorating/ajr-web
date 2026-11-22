"use client";

import Link from "@/components/Link";
import { useDict } from "@/i18n/client";
import { usePathname } from "@/i18n/navigation";

// The lists, with the key of each one's name in the dictionary (d.explore.tabs).
const TABS = [
  { href: "/explore/tournaments", key: "tournaments" },
  { href: "/explore/athletes", key: "athletes" },
  { href: "/explore/contests", key: "contests" },
  { href: "/explore/nations", key: "nations" },
] as const;

// "EXPLORE  Tournaments Contests Athletes Nations" with the open one marked.
export function ExploreTabs({ current }: { current: string }) {
  const d = useDict();
  return (
    <nav className="flex items-center gap-4 sm:gap-2" aria-label={d.explore.tabs.label}>
      <span className="hidden sm:block w-14 shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted">{d.explore.tabs.label}</span>
      <div className="flex items-center gap-4 sm:gap-2">
        {TABS.map(({ href, key }) => (
          <Link
            key={href}
            href={href}
            className={`px-1 py-1.5 sm:px-2 whitespace-nowrap text-[13px] sm:text-[15px] ${
              current.startsWith(href) ? "font-bold text-ink border-b-2 border-claret" : "text-muted hover:text-ink"
            }`}
          >
            {d.explore.tabs[key]}
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
