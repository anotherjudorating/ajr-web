"use client";

import Link from "@/components/Link";
import { useDict } from "@/i18n/client";
import { MEN, WOMEN } from "@/lib/weights";

const TAB = "px-1 py-1.5 text-[13px] sm:text-[15px] sm:px-2 tabular-nums whitespace-nowrap cursor-pointer";
const ACTIVE = "font-bold text-ink border-b-2 border-claret";
const INACTIVE = "hover:text-ink transition-colors text-muted";
const LABEL = "min-w-12 shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted";

// MEN: P4P −60 … +100 / WOMEN: P4P −48 … +78 / TEAMS: Mixed Men Women.
// `current` is the path of the open table; `query` keeps its day ("/2024-06-01")
// when switching.
export function WeightSwitcher({ current, query = "" }: { current: string; query?: string }) {
  const d = useDict();
  const tab = (href: string, label: string, numeric = true) => (
    <Link
      key={href}
      href={`${href}${query}`}
      className={`${numeric ? TAB : TAB.replace(" tabular-nums", "")} ${href === current ? ACTIVE : INACTIVE}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mb-7 flex flex-col gap-2">
      {[
        { title: d.rankings.switcher.men, p4p: "/rankings/p4p/men", weights: MEN },
        { title: d.rankings.switcher.women, p4p: "/rankings/p4p/women", weights: WOMEN },
      ].map(({ title, p4p, weights }, index) => (
        <div
          key={title}
          className={`flex flex-row flex-nowrap items-center w-full ${index ? "mt-2 sm:mt-2.5" : ""}`}
        >
          <span className={LABEL}>{title}</span>
          <div className="flex flex-row flex-nowrap items-center justify-between flex-1 min-w-0 sm:justify-start sm:gap-2">
            {tab(p4p, "P4P")}
            {weights.map((w) => tab(`/rankings/${w.slug}`, w.label))}
          </div>
        </div>
      ))}
      <div className="flex flex-row flex-nowrap items-center w-full mt-2 sm:mt-2.5">
        <span className={LABEL}>{d.rankings.switcher.teams}</span>
        <div className="flex flex-row flex-nowrap items-center flex-1 min-w-0 gap-4 sm:gap-2">
          {tab("/rankings/teams/mixed", d.common.gender.mixed, false)}
          {tab("/rankings/teams/men", d.common.gender.men, false)}
          {tab("/rankings/teams/women", d.common.gender.women, false)}
        </div>
      </div>
    </div>
  );
}
