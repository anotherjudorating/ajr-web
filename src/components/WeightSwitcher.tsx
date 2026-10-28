import Link from "next/link";

import { MEN, WOMEN } from "@/lib/weights";

const TAB = "px-1 py-1.5 text-[13px] sm:text-[15px] sm:px-2 tabular-nums whitespace-nowrap cursor-pointer";
const ACTIVE = "font-bold text-ink border-b-2 border-claret";
const INACTIVE = "hover:text-ink transition-colors text-muted";
const LABEL = "w-12 shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted";

// MEN: P4P −60 … +100 / WOMEN: P4P −48 … +78 / TEAMS: Men Women Mixed.
// `current` is the path of the open table; `query` keeps the date when switching.
export function WeightSwitcher({ current, query = "" }: { current: string; query?: string }) {
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
        { title: "Men", p4p: "/rankings/p4p/men", weights: MEN },
        { title: "Women", p4p: "/rankings/p4p/women", weights: WOMEN },
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
        <span className={LABEL}>Teams</span>
        <div className="flex flex-row flex-nowrap items-center flex-1 min-w-0 gap-4 sm:gap-2">
          {tab("/rankings/teams/men", "Men", false)}
          {tab("/rankings/teams/women", "Women", false)}
          {tab("/rankings/teams/mixed", "Mixed", false)}
        </div>
      </div>
    </div>
  );
}
