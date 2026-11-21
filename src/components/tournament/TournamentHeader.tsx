import { Flag } from "@/components/Flag";
import type { Competition } from "@/lib/api";
import { dateRange, shortCompetition } from "@/lib/format";
import { TournamentCrumbs, WeightTabs } from "@/components/tournament/TournamentNav";

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
// and Upcoming or Live) and the weights: in the tournament's layout, it stays while
// its weights change (the weight shown is read from the address: TournamentNav).
export function TournamentHeader({
  competition: c,
  state = "over",
  live = new Set(),
}: {
  competition: Competition;
  state?: TournamentState;
  live?: Set<string>;
}) {
  return (
    <>
      <TournamentCrumbs id={c.id} short={shortCompetition(c.name)} />
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
      <WeightTabs id={c.id} weights={c.weights} live={[...live]} all={state !== "over"} />
    </>
  );
}

// While a weight's or the overview's data loads, under the header that stays: the
// shapes of a podium and of a table, so that the page does not jump.
export function TournamentSkeleton() {
  const bar = "bg-rule/50 animate-pulse";
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mt-10 lg:mt-12 border-b-2 border-ink pb-2">
        <div className={`h-6 w-32 ${bar}`} />
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-x-14">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-5 h-6 ${bar}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-5 w-3/4 ${bar}`} />
              <div className={`h-3 w-1/3 ${bar}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-14 border-b-2 border-ink pb-2">
        <div className={`h-6 w-40 ${bar}`} />
      </div>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-11 border-b border-rule flex items-center gap-3 px-2">
          <div className={`h-3 w-6 ${bar}`} />
          <div className={`h-3 flex-1 max-w-[240px] ${bar}`} />
          <div className={`h-3 w-12 ml-auto ${bar}`} />
        </div>
      ))}
    </div>
  );
}
