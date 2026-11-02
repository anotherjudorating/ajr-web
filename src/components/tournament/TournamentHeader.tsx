import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Flag } from "@/components/Flag";
import type { Competition } from "@/lib/api";
import { dateRange, shortCompetition } from "@/lib/format";
import { MEN, WOMEN, type Weight, weightTitle } from "@/lib/weights";

const TAB = "px-1 py-1.5 sm:px-2 whitespace-nowrap";
const ACTIVE = `${TAB} font-bold text-ink border-b-2 border-claret`;
const IDLE = `${TAB} tabular-nums text-muted hover:text-ink`;
const LIVE = `${TAB} tabular-nums text-claret font-semibold`;
const DIVIDER = <span className="inline-block w-px h-3 bg-rule mx-3 align-middle" />;

// "Baku World Senior Championships 2026 Individuals" -> without "Individuals"
export function tournamentName(name: string): string {
  return name.replace(/\s+Individuals?$/i, "");
}

export type TournamentState = "upcoming" | "live" | "over";

// Before its first day, during its days, after them.
export function stateOf(c: Competition, today: string): TournamentState {
  if (today < c.date_from) return "upcoming";
  return today <= (c.date_to ?? c.date_from) ? "live" : "over";
}

// The way back to Explore, the name, the place (and while it is not over, the days
// and Upcoming or Live) and the weights: All (the overview), then every weight of
// the draw, men and women on their own rows; the weights under way in claret.
export function TournamentHeader({
  competition: c,
  weight,
  state = "over",
  live = new Set(),
}: {
  competition: Competition;
  weight?: Weight;
  state?: TournamentState;
  live?: Set<string>;
}) {
  const rows = [
    { label: "Men", weights: MEN },
    { label: "Women", weights: WOMEN },
  ]
    .map((row) => ({ ...row, weights: row.weights.filter((w) => c.weights.includes(w.api)) }))
    .filter((row) => row.weights.length > 0);
  const short = shortCompetition(c.name);

  return (
    <>
      <Breadcrumbs
        className="pt-[33.25px] sm:pt-[41.25px] md:pt-[42.75px]"
        trail={[
          { href: "/explore/tournaments", label: "Tournaments" },
          ...(weight ? [{ href: `/tournaments/${c.id}`, label: short }] : []),
        ]}
        current={weight ? weightTitle(weight) : short}
      />
      <h1 className="font-serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">
        {tournamentName(c.name)}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-y-1 text-[14px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Flag ioc={c.country} />
          <span className="text-ink">{[c.city, c.country].filter(Boolean).join(", ")}</span>
        </span>
        {state !== "over" && (
          <>
            {DIVIDER}
            <span>
              {dateRange(c.date_from, c.date_to)} {c.date_from.slice(0, 4)}
            </span>
            {DIVIDER}
            {state === "live" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-claret text-claret">
                <span className="w-1.5 h-1.5 rounded-full bg-claret" />
                Live
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-muted text-muted">
                Upcoming
              </span>
            )}
          </>
        )}
      </div>
      <nav className="mt-6 flex flex-col gap-1 sm:max-w-[560px]" aria-label="Weight categories">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center">
            <span className="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted">{row.label}</span>
            <div className="flex flex-1 items-center justify-between sm:justify-start sm:gap-2 text-[13px] sm:text-[15px]">
              <Link href={`/tournaments/${c.id}`} className={weight ? IDLE : ACTIVE}>
                All
              </Link>
              {row.weights.map((w) => (
                <Link
                  key={w.slug}
                  href={`/tournaments/${c.id}/${w.slug}`}
                  title={live.has(w.api) ? "Live" : undefined}
                  className={w === weight ? ACTIVE : live.has(w.api) ? LIVE : IDLE}
                >
                  {w.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}
