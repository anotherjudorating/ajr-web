"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MEN, WOMEN, weightBySlug, weightTitle } from "@/lib/weights";

const TAB = "px-1 py-1.5 sm:px-2 whitespace-nowrap";
const ACTIVE = `${TAB} font-bold text-ink border-b-2 border-claret`;
const IDLE = `${TAB} tabular-nums text-muted hover:text-ink`;
const LIVE = `${TAB} tabular-nums text-claret font-semibold`;
const LATER = `${TAB} tabular-nums text-muted/50 hover:text-ink`;

// The tournament's layout stays while its weights change: the weight shown comes
// from the address, not from the page.
function useWeight() {
  const segment = useSelectedLayoutSegment();
  return segment ? weightBySlug(segment) : undefined;
}

// The way back: Tournaments › the tournament › the weight.
export function TournamentCrumbs({ id, short }: { id: number; short: string }) {
  const weight = useWeight();
  return (
    <Breadcrumbs
      className="pt-[33.25px] sm:pt-[41.25px] md:pt-[42.75px]"
      trail={[{ href: "/explore/tournaments", label: "Tournaments" }, ...(weight ? [{ href: `/tournaments/${id}`, label: short }] : [])]}
      current={weight ? weightTitle(weight) : short}
    />
  );
}

// All (the overview), then every weight of the draw, men and women on their own
// rows; the weights under way in claret. Before a tournament is over, all 14: those
// not fought yet faint.
export function WeightTabs({ id, weights, live, all }: { id: number; weights: string[]; live: string[]; all: boolean }) {
  const weight = useWeight();
  const rows = [
    { label: "Men", weights: MEN },
    { label: "Women", weights: WOMEN },
  ]
    .map((row) => ({ ...row, weights: all ? row.weights : row.weights.filter((w) => weights.includes(w.api)) }))
    .filter((row) => row.weights.length > 0);
  return (
    <nav className="mt-6 flex flex-col gap-1 sm:max-w-[560px]" aria-label="Weight categories">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center">
          <span className="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted">{row.label}</span>
          <div className="flex flex-1 items-center justify-between sm:justify-start sm:gap-2 text-[13px] sm:text-[15px]">
            <Link href={`/tournaments/${id}`} className={weight ? IDLE : ACTIVE}>
              All
            </Link>
            {row.weights.map((w) => (
              <Link
                key={w.slug}
                href={`/tournaments/${id}/${w.slug}`}
                title={live.includes(w.api) ? "Live" : weights.includes(w.api) ? undefined : "Not started"}
                className={w.slug === weight?.slug ? ACTIVE : live.includes(w.api) ? LIVE : weights.includes(w.api) ? IDLE : LATER}
              >
                {w.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
