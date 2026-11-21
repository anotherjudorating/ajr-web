"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

import { useHash, useRowMark, useRowScroll } from "@/components/anchors";

import { Flag } from "@/components/Flag";
import { Arrow, CHEVRON_CELL, Icon, RowChevron } from "@/components/Icon";
import { Bracket, hasBracket } from "@/components/tournament/Bracket";
import { Medal, type MedalKind } from "@/components/Medal";
import { isUpset } from "@/components/rankings/Changes";
import { CsvButton, SearchBox, Select, ToolbarRow } from "@/components/explore/Controls";
import { Pagination, saveCsv, SHORT_SIZES } from "@/components/rankings/TableParts";
import { RowLink } from "@/components/RowLink";
import { H2, HEAD, HEAD_CELL, LINK, ROW_CELL } from "@/components/tournament/styles";
import type { CompetitionContest, CompetitionResult, MedalChance, Slot } from "@/lib/api";
import { formatChance, ordinal, roundCode, roundTitle, shortName, signed } from "@/lib/format";
import { athleteRow } from "@/lib/anchors";

const MEDALS: string[] = ["gold", "silver", "bronze"];
// the stages' group rows' titles (several contests each)
const roundsTitle = (round: string) => {
  const titles: Record<string, string> = { BR: "Bronze medal", "1/2": "Semi-finals", "1/4": "Quarter-finals" };
  const title = roundTitle(round);
  return titles[roundCode(round)] ?? (title.endsWith(" final") ? `${title}s` : title);
};
const CELL = "px-2 sm:px-3 py-2 align-middle";

const gainOf = (r: CompetitionResult) => r.score_after - r.score_before;
const shortRound = (round: string | null) => (roundCode(round) === "F" ? "Final" : roundCode(round));

// One side of a contest: the athlete and what the contest gave them (a walkover: nothing).
function sideOf(c: CompetitionContest, white: boolean) {
  const change = (before: number | null, after: number | null) => (before === null || after === null ? null : after - before);
  return white
    ? { id: c.white_id, family: c.white_family_name, given: c.white_given_name, country: c.white_country, chance: c.white_chance, change: change(c.white_score_before, c.white_score_after) }
    : { id: c.blue_id, family: c.blue_family_name, given: c.blue_given_name, country: c.blue_country, chance: c.blue_chance, change: change(c.blue_score_before, c.blue_score_after) };
}

// A contest to come in the list: both athletes known (their chances of winning it), or
// the likeliest two (their chances of being in it).
type Pending = { key: string; places: Slot[]; likely: boolean };
type Row = CompetitionContest | Pending;
const isPending = (row: Row): row is Pending => "places" in row;

// The contests by round from the bracket's places (a weight under way or to come),
// the final first: as fought, or to come.
const LIST_ORDER = ["F", "BR", "1/2", "REP", "1/4", "1/8", "1/16", "1/32", "1/64"];
function roundsFromPlaces(places: Slot[], contests: CompetitionContest[]): { round: string; contests: Row[] }[] {
  const byNumber = new Map<number, Slot[]>();
  for (const p of places) byNumber.set(p.fight_no, [...(byNumber.get(p.fight_no) ?? []), p]);
  const fought = new Map(contests.map((c) => [c.contest_id, c]));
  // a pair as the bracket has it: the one from the contest above first
  const before = (id: number, n: number) => Math.max(-1, ...places.filter((p) => p.athlete_id === id && p.fight_no < n).map((p) => p.fight_no));
  const inOrder = (rows: Slot[], n: number) => [...rows].sort((a, b) => before(a.athlete_id, n) - before(b.athlete_id, n));
  return LIST_ORDER.map((round) => ({
    round,
    contests: [...byNumber.entries()]
      .filter(([, rows]) => rows[0].round === round)
      .sort(([a], [b]) => a - b)
      .flatMap(([n, rows]): Row[] => {
        const done = rows.find((r) => r.contest_id !== null && fought.has(r.contest_id));
        if (done) return [fought.get(done.contest_id!)!];
        const sure = rows.filter((r) => r.here >= 0.999);
        if (sure.length === 2) return [{ key: `n${n}`, places: inOrder(sure, n), likely: false }];
        if (sure.length === 1 && rows.length === 1) return []; // a bye
        return [{ key: `n${n}`, places: inOrder(rows.slice(0, 2), n), likely: true }];
      }),
  })).filter((r) => r.contests.length > 0);
}

const WALKOVER = <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-muted">Walkover</span>;

// One weight of a tournament, as in the prototype (weight.html): the podium, every
// athlete's place with their contests a click away, and the contests by round.
export function WeightView({
  results,
  contests,
  chances = [],
  bracket = [],
}: {
  results: CompetitionResult[];
  contests: CompetitionContest[];
  chances?: MedalChance[]; // of this weight, the likeliest medallists first
  bracket?: Slot[]; // the bracket's places with their chances (a weight under way or to come)
}) {
  const rounds: { round: string; contests: CompetitionContest[] }[] = [];
  for (const c of contests) {
    const round = c.round ?? "Contests";
    if (rounds.at(-1)?.round !== round) rounds.push({ round, contests: [] });
    rounds.at(-1)!.contests.push(c);
  }
  // judobase numbers the bronze contests with the final: the final first
  rounds.sort((a, b) => Number(roundCode(b.round) === "F") - Number(roundCode(a.round) === "F"));

  // places, then the round lost in, the later first; the score breaks ties
  const order = ["gold", "silver", "bronze", "5th", "7th", ...rounds.map((r) => r.round)];
  const rank = (r: CompetitionResult) => (r.result && order.includes(r.result) ? order.indexOf(r.result) : order.length);
  const table = [...results].sort((a, b) => rank(a) - rank(b) || b.score_after - a.score_after);
  // a shared place: one more than those ranked above (1, 2, 3, 3, 5, 5, 7, 7, 9…)
  const places = table.map((r) => 1 + table.filter((o) => rank(o) < rank(r)).length);
  const podium = table.filter((r) => r.result && MEDALS.includes(r.result));

  return (
    <>
      {podium.length > 0 && (
        <section className="mt-10 lg:mt-12">
          <div className={HEAD}>
            <h2 className={H2}>Podium</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-x-14">
            {podium.map((r) => (
              <div key={r.athlete_id} className="flex items-start gap-3 min-w-0">
                <Medal kind={r.result as MedalKind} className="w-5 h-6" />
                <div className="min-w-0">
                  <Link
                    href={`/athletes/${r.athlete_id}`}
                    className="font-serif block text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px] font-semibold text-ink hover:underline truncate"
                  >
                    {shortName(r.family_name, r.given_name)}
                  </Link>
                  <div className="mt-1 flex items-center gap-1.5 text-[12px] leading-[16px] text-ink">
                    <Flag ioc={r.country} />
                    <span className="font-medium">{r.country}</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-2 text-[13px] leading-[18px] tabular-nums" title="Rating before → after the tournament">
                    <span className="text-muted">
                      {r.score_before}
                      <Arrow />
                      {r.score_after}
                    </span>
                    <span className={`font-bold ${gainOf(r) >= 0 ? "text-gain" : "text-drop"}`}>{signed(gainOf(r))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {podium.length === 0 && chances.length > 0 && <LikelyPodium rows={chances} />}

      {/* the places, once the weight is over (under way, its chances say more) */}
      {(table.length > 0 || chances.length > 0) && <Results rows={table} places={places} contests={contests} chances={podium.length ? [] : chances} bracket={bracket} />}

      {(rounds.length > 0 || bracket.length > 0) && (
        <Contests rounds={bracket.length ? roundsFromPlaces(bracket, contests) : rounds} contests={contests} places={bracket} />
      )}
    </>
  );
}

// Before the weight is over: the likeliest podium, in grey (gold: the likeliest
// champion; the others: the likeliest medallists after them).
function LikelyPodium({ rows }: { rows: MedalChance[] }) {
  const gold = [...rows].sort((a, b) => b.gold - a.gold)[0];
  const others = rows.filter((r) => r.athlete_id !== gold.athlete_id).sort((a, b) => b.medal - a.medal).slice(0, 3);
  const kinds: MedalKind[] = ["gold", "silver", "bronze", "bronze"];
  return (
    <section className="mt-10 lg:mt-12">
      <div className={HEAD}>
        <h2 className={H2}>Podium prediction</h2>
        <Link href="/methodology" className={LINK}>
          How it works
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-x-14">
        {[gold, ...others].map((r, i) => (
          <div key={r.athlete_id} className="flex items-start gap-3 min-w-0">
            <Medal kind={kinds[i]} predicted className="w-5 h-6" />
            <div className="min-w-0">
              <Link href={`/athletes/${r.athlete_id}`} className="font-serif block text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px] font-semibold text-muted hover:text-ink hover:underline truncate">
                {shortName(r.family_name, r.given_name)}
              </Link>
              <div className="mt-1 flex items-center gap-1.5 text-[12px] leading-[16px] text-muted">
                <Flag ioc={r.country} />
                <span className="font-medium">{r.country}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Every athlete, a page at a time; a row opens the athlete's contests below it.
// #athlete-<id> (a medallist on the tournament's overview): that row opened on its
// page, marked and scrolled to, as a ranking's row.
// The athletes of a weight, one table before, during and after it: those out with their
// place, those still in (a weight under way or to come) in grey, by rating.
type AthleteRow = { athlete_id: number; family_name: string | null; given_name: string | null; country: string | null; result?: CompetitionResult; chance?: MedalChance; place: number | null };

function Results({
  rows: results,
  places,
  contests,
  chances,
  bracket = [],
}: {
  rows: CompetitionResult[];
  places: number[];
  contests: CompetitionContest[];
  chances: MedalChance[];
  bracket?: Slot[];
}) {
  const placeOf = new Map(results.map((r, i) => [r.athlete_id, places[i]]));
  // under way, the place of an athlete out: by the round they lost their last contest in
  const OUT: Record<string, number> = { BR: 5, REP: 7, "1/8": 9, "1/16": 17, "1/32": 33, "1/64": 65 };
  // (a contest the draw has decided but the contests not yet: its loss from the bracket)
  const placeOut = (id: number) => {
    const lost = contests.filter((c) => c.winner_id !== null && c.winner_id !== id && (c.white_id === id || c.blue_id === id));
    if (lost.length) return OUT[roundCode(lost[0].round)] ?? null;
    const drawn = bracket.filter((p) => p.athlete_id === id && p.here === 1 && p.wins === 0).sort((a, b) => a.fight_no - b.fight_no);
    return drawn.length ? (OUT[drawn[0].round] ?? null) : null;
  };
  const resultOf = new Map(results.map((r) => [r.athlete_id, r]));
  const live = chances.length > 0;
  const still = chances.filter((c) => c.medal > 0 || !resultOf.has(c.athlete_id) || c.quarter);
  const stillIds = new Set(still.map((c) => c.athlete_id));
  const all: AthleteRow[] = live
    ? [
        ...[...still]
          .sort((a, b) => (resultOf.get(b.athlete_id)?.score_after ?? b.rating ?? 0) - (resultOf.get(a.athlete_id)?.score_after ?? a.rating ?? 0))
          .map((c) => ({ ...c, chance: c, result: resultOf.get(c.athlete_id), place: null })),
        ...results
          .filter((r) => !stillIds.has(r.athlete_id))
          .map((r) => ({ ...r, result: r, place: placeOut(r.athlete_id) }))
          .sort((a, b) => (a.place ?? 999) - (b.place ?? 999)),
      ]
    : results.map((r) => ({ ...r, result: r, place: placeOf.get(r.athlete_id) ?? null }));
  // the toolbar: a name, a nation (under way, beside it: all, the ones still in, the
  // ones placed: out, or with a medal), the order
  const [query, setQuery] = useState("");
  const [nation, setNation] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("place");
  const ratingOf = (r: AthleteRow) => r.result?.score_after ?? r.chance?.rating ?? -Infinity;
  const changeOf = (r: AthleteRow) => (r.result ? gainOf(r.result) : -Infinity);
  const needle = query.trim().toLowerCase();
  const rows = all
    .filter(
      (r) =>
        (!needle || shortName(r.family_name, r.given_name).toLowerCase().includes(needle) || (r.family_name ?? "").toLowerCase().includes(needle)) &&
        (!nation || r.country === nation) &&
        (!status || (status === "in") === stillIds.has(r.athlete_id)),
    )
    .sort((a, b) =>
      sort === "rating" ? ratingOf(b) - ratingOf(a) : sort === "change" ? changeOf(b) - changeOf(a) : sort === "name" ? (a.family_name ?? "").localeCompare(b.family_name ?? "") : 0,
    );
  const nations = [...new Set(all.map((r) => r.country).filter((c): c is string => !!c))].sort();
  const reset = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setPage(1);
  };
  const [open, setOpen] = useState<number | null>(null);
  const [size, setSize] = useState(SHORT_SIZES[0]);
  const [page, setPage] = useState(1);
  const first = (page - 1) * size;
  const hash = useHash();
  const marked = hash.startsWith("athlete-") ? Number(hash.slice("athlete-".length)) || null : null;
  const [placedFor, setPlacedFor] = useState("");
  const markedAt = marked === null ? -1 : rows.findIndex((r) => r.athlete_id === marked);
  if (markedAt >= 0 && placedFor !== hash) {
    setPlacedFor(hash);
    setOpen(marked);
    setPage(Math.floor(markedAt / size) + 1);
  }
  const lit = useRowMark(marked !== null, hash);
  useRowScroll(hash, placedFor === hash);

  return (
    <section className="mt-14 lg:mt-16">
      {/* the toolbar's rule under the title, as the athlete's contests */}
      <h2 className={`${H2} text-ink`}>Athletes</h2>
      <ToolbarRow inPage>
        <SearchBox value={query} onChange={reset(setQuery)} placeholder="Search athlete" />
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
          <Select value={nation} onChange={reset(setNation)} options={[{ value: "", label: "All nations" }, ...nations.map((n) => ({ value: n, label: n }))]} />
          {live && (
            <Select
              value={status}
              onChange={reset(setStatus)}
              options={[
                { value: "", label: "All athletes" },
                { value: "in", label: "Still in" },
                { value: "out", label: "Placed" },
              ]}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <Select
              value={sort}
              onChange={reset(setSort)}
              options={[
                { value: "place", label: "Sort: place" },
                { value: "rating", label: "Sort: rating ↓" },
                { value: "change", label: "Sort: +/− ↓" },
                { value: "name", label: "Sort: name" },
              ]}
            />
          </div>
          <CsvButton onClick={() => downloadAthletes(rows)} />
        </div>
      </ToolbarRow>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-right w-12 sm:w-16`}>Place</th>
            <th className={`${HEAD_CELL} text-left`}>Athlete</th>
            <th className={`${HEAD_CELL} text-left w-24 hidden sm:table-cell`}>Nat</th>
            <th className={`${HEAD_CELL} text-right w-16 hidden sm:table-cell`}>W–L</th>
            <th className={`${HEAD_CELL} text-right w-20 hidden sm:table-cell`}>Before</th>
            <th className={`${HEAD_CELL} text-right w-16 sm:w-20`}>Rating</th>
            <th className={`${HEAD_CELL} text-right w-12 sm:w-16`}>+/−</th>
            <th className="w-10 sm:w-12 h-9 py-0" />
          </tr>
        </thead>
        <tbody>
          {rows.slice(first, first + size).map((r) => {
            const expanded = open === r.athlete_id;
            const res = r.result;
            const gain = res ? gainOf(res) : 0;
            const grey = live && r.chance !== undefined && stillIds.has(r.athlete_id);
            const own = contests
              .filter((c) => c.white_id === r.athlete_id || c.blue_id === r.athlete_id)
              .reverse(); // the first round first
            const panel = (
              <div className="bg-panel border-t border-rule border-l-[3px] border-l-claret p-3 sm:p-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="font-serif text-[16px] leading-[20px] font-semibold text-ink">Contests</h3>
                  {own.length > 0 && <span className={`text-[14px] font-bold tabular-nums ${gain >= 0 ? "text-gain" : "text-drop"}`}>{signed(gain)}</span>}
                </div>
                {own.length === 0 && <p className="text-[13px] text-muted">No contests yet.</p>}
                <div className="flex flex-col text-[13px] w-full sm:max-w-[560px]">
                  {own.map((c) => {
                    const self = sideOf(c, c.white_id === r.athlete_id);
                    const opponent = sideOf(c, c.white_id !== r.athlete_id);
                    const won = c.winner_id === r.athlete_id;
                    return (
                      <Link
                        key={c.contest_id}
                        href={`/contests/${c.contest_id}`}
                        className="group border-b border-rule/60 last:border-b-0 py-1.5 flex items-center justify-between gap-1.5 hover:bg-paper/50"
                      >
                        <span className="w-10 shrink-0 text-muted">{shortRound(c.round)}</span>
                        <span className="inline-flex items-center gap-1.5 min-w-0 flex-1">
                          <Flag ioc={opponent.country} />
                          <span className="truncate font-medium text-ink">{shortName(opponent.family, opponent.given)}</span>
                        </span>
                        <span className="w-24 shrink-0 text-right tabular-nums text-ink">
                          {c.real_fight && self.chance !== null ? formatChance(self.chance, 0) : WALKOVER}
                        </span>
                        <span className={`w-6 shrink-0 text-center font-bold ${won ? "text-gain" : "text-drop"}`}>{won ? "W" : "L"}</span>
                        <span className={`w-10 shrink-0 text-right font-bold tabular-nums ${(self.change ?? 0) >= 0 ? "text-gain" : "text-drop"}`}>
                          {self.change === null ? "" : signed(self.change)}
                        </span>
                        <RowChevron className="text-muted shrink-0 mr-[3px] sm:mr-[7px]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
            return (
              <Fragment key={r.athlete_id}>
                <tr
                  id={athleteRow(r.athlete_id)}
                  onClick={() => setOpen(expanded ? null : r.athlete_id)}
                  aria-expanded={expanded}
                  className={`border-b border-rule hover:bg-panel/40 cursor-pointer ${grey ? "text-muted" : ""} ${r.athlete_id === marked ? lit.row : ""}`}
                >
                  <td className={`${ROW_CELL} text-right font-medium`}>{r.place ? ordinal(r.place) : "—"}</td>
                  <td className={ROW_CELL}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="sm:hidden flex">
                        <Flag ioc={r.country} />
                      </span>
                      <Link href={`/athletes/${r.athlete_id}`} onClick={(e) => e.stopPropagation()} className="font-medium truncate hover:underline">
                        {shortName(r.family_name, r.given_name)}
                      </Link>
                    </div>
                  </td>
                  <td className={`${ROW_CELL} hidden sm:table-cell`}>
                    <div className="flex items-center gap-1.5">
                      <Flag ioc={r.country} />
                      <span className="text-[13px]">{r.country}</span>
                    </div>
                  </td>
                  <td className={`${ROW_CELL} text-right hidden sm:table-cell`}>
                    {res ? `${res.wins}–${res.contests - res.wins}` : "0–0"}
                  </td>
                  <td className={`${ROW_CELL} text-right text-muted hidden sm:table-cell`}>{res?.score_before ?? (r.chance?.rating != null ? Math.round(r.chance.rating) : "—")}</td>
                  <td className={`${ROW_CELL} text-right ${grey ? "" : "font-bold"}`}>{res?.score_after ?? (r.chance?.rating != null ? Math.round(r.chance.rating) : "—")}</td>
                  <td className={`${ROW_CELL} text-right font-semibold ${res ? (gain >= 0 ? "text-gain" : "text-drop") : ""}`}>{res ? signed(gain) : ""}</td>
                  <td className="w-10 sm:w-12 h-10 sm:h-11 py-0 align-middle text-center text-muted hover:bg-panel hover:text-ink" title="Show contests">
                    <Icon size={18} name="expand_more" className={`align-middle transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </td>
                </tr>
                {expanded && (
                  <tr>
                    <td colSpan={5} className="p-0 sm:hidden">
                      {panel}
                    </td>
                    <td colSpan={8} className="p-0 hidden sm:table-cell">
                      {panel}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <Pagination
        total={rows.length}
        first={first}
        count={Math.min(size, rows.length - first)}
        noun="athletes"
        pageSize={size}
        sizes={SHORT_SIZES}
        onPageSize={(value) => {
          setSize(value);
          setPage(1);
        }}
        page={page}
        pages={Math.max(1, Math.ceil(rows.length / size))}
        onPage={setPage}
      />
    </section>
  );
}

function downloadAthletes(rows: AthleteRow[]) {
  const header = ["Place", "Athlete", "Nation", "Won", "Lost", "Rating before", "Rating", "+/-"];
  const lines = rows.map((r) => [
    r.place ? ordinal(r.place) : "",
    shortName(r.family_name, r.given_name),
    r.country ?? "",
    r.result?.wins ?? 0,
    r.result ? r.result.contests - r.result.wins : 0,
    r.result?.score_before ?? (r.chance?.rating != null ? Math.round(r.chance.rating) : ""),
    r.result?.score_after ?? (r.chance?.rating != null ? Math.round(r.chance.rating) : ""),
    r.result ? gainOf(r.result) : "",
  ]);
  saveCsv([header, ...lines], "ajr-weight-athletes.csv");
}

// The contests from the final back, 20 a page, under rows for their rounds; a
// round's row folds its contests away.
function Contests({ rounds, contests, places }: { rounds: { round: string; contests: Row[] }[]; contests: CompetitionContest[]; places: Slot[] }) {
  const [view, setView] = useState<"list" | "bracket">(places.length || hasBracket(contests) ? "bracket" : "list");
  const [folded, setFolded] = useState<Set<string>>(new Set());
  const [size, setSize] = useState(SHORT_SIZES[0]);
  const [page, setPage] = useState(1);
  const total = rounds.reduce((sum, r) => sum + r.contests.length, 0);
  const first = (page - 1) * size;

  // the rounds with contests on this page, and those contests
  const starts = rounds.map((_, i) => rounds.slice(0, i).reduce((sum, r) => sum + r.contests.length, 0));
  const shown = rounds
    .map((r, i) => ({
      ...r,
      contests: r.contests.slice(Math.max(0, first - starts[i]), Math.max(0, first + size - starts[i])),
    }))
    .filter((r) => r.contests.length > 0);

  const toggle = (round: string) =>
    setFolded((current) => {
      const next = new Set(current);
      if (!next.delete(round)) next.add(round);
      return next;
    });

  return (
    <section className="mt-14 lg:mt-16">
      <div className="flex flex-row items-center justify-between gap-3 border-b-2 border-ink pb-2">
        <h2 className={H2}>Contests</h2>
        <div className="flex items-center gap-4">
          <div className="inline-flex" role="group" aria-label="Show the contests as">
            {(
              [
                ["bracket", "Bracket"],
                ["list", "List"],
              ] as const
            ).map(([v, label], i) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`h-7 px-2.5 text-[12px] font-semibold border cursor-pointer ${i ? "-ml-px" : ""} ${view === v ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:border-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {view === "bracket" && <Bracket contests={contests} places={places} />}
      <div hidden={view === "bracket"}>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        {/* as Explore's contests */}
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Athletes</th>
            <th className={`${HEAD_CELL} w-20 hidden sm:table-cell`} />
            <th className={`${HEAD_CELL} w-14 sm:w-16 text-right`}>Chance</th>
            <th className={`${HEAD_CELL} w-8 sm:w-10 text-center`}>W/L</th>
            <th className={`${HEAD_CELL} w-12 sm:w-16 text-right`}>+/−</th>
            <th className="w-8 sm:w-10 h-9 py-0" />
          </tr>
        </thead>
        <tbody>
          {shown.map(({ round, contests }) => {
            const open = !folded.has(round);
            const title = (
              <span className="inline-flex items-center gap-2">
                <Icon size={18} name="expand_more" className={`text-muted transition-transform duration-150 ${open ? "" : "-rotate-90"}`} />
                <span className="text-[12px] font-bold uppercase text-ink">{roundsTitle(round)}</span>
              </span>
            );
            return (
              <Fragment key={round}>
                <tr
                  onClick={() => toggle(round)}
                  aria-expanded={open}
                  className="h-8 bg-panel border-b border-rule cursor-pointer select-none hover:bg-panel/80"
                >
                  <td colSpan={5} className="sm:hidden px-2 h-8 py-0 align-middle">
                    {title}
                  </td>
                  <td colSpan={6} className="hidden sm:table-cell px-3 h-8 py-0 align-middle">
                    {title}
                  </td>
                </tr>
                {open && contests.map((c) => (isPending(c) ? <PendingRow key={c.key} row={c} /> : <ContestRow key={c.contest_id} contest={c} />))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <Pagination
        total={total}
        first={first}
        count={Math.min(size, total - first)}
        noun="contests"
        pageSize={size}
        sizes={SHORT_SIZES}
        onPageSize={(value) => {
          setSize(value);
          setPage(1);
        }}
        page={page}
        pages={Math.max(1, Math.ceil(total / size))}
        onPage={setPage}
      />
      </div>
    </section>
  );
}

// A contest to come: grey, its chances (of winning it, or of being in it).
function PendingRow({ row }: { row: Pending }) {
  const id = row.places.find((p) => p.contest_id !== null)?.contest_id;
  const cells = [
    <td key="names" className={CELL}>
      {row.places.map((p) => (
        <div key={p.athlete_id} className="h-6 flex items-center gap-1.5 min-w-0">
          <span className="hidden sm:inline-block w-[6px] h-4 shrink-0" />
          <span className={row.likely ? "opacity-60" : ""}>
            <Flag ioc={p.country} />
          </span>
          <span className="truncate">{shortName(p.family_name, p.given_name)}</span>
        </div>
      ))}
    </td>,
    <td key="upset" className={`${CELL} hidden sm:table-cell`} />,
    <td key="chances" className={`${CELL} whitespace-nowrap`}>
      {row.places.map((p) => (
        <div key={p.athlete_id} className="h-6 flex items-center justify-end text-muted">
          {formatChance(p.wins, 0)}
        </div>
      ))}
    </td>,
    // not fought: no result, no change yet
    <td key="result" className={CELL}>
      {row.places.map((p) => (
        <div key={p.athlete_id} className="h-6 flex items-center justify-center text-muted">—</div>
      ))}
    </td>,
    <td key="change" className={CELL}>
      {row.places.map((p) => (
        <div key={p.athlete_id} className="h-6 flex items-center justify-end text-muted">—</div>
      ))}
    </td>,
    <td key="open" className={CHEVRON_CELL}>
      {!row.likely && id ? <RowChevron /> : null}
    </td>,
  ];
  // both athletes known: the contest's page, what each result would do
  return !row.likely && id ? (
    <RowLink href={`/contests/${id}`} className="border-b border-rule hover:bg-panel/40">
      {cells}
    </RowLink>
  ) : (
    <tr className={`border-b border-rule ${row.likely ? "text-muted" : ""}`} title="Not decided yet: the likeliest of each side, and their chances against each other">
      {cells}
    </tr>
  );
}

function ContestRow({ contest: c }: { contest: CompetitionContest }) {
  const sides = [
    { ...sideOf(c, true), judogi: "bg-paper" },
    { ...sideOf(c, false), judogi: "bg-oxford" },
  ];
  const upset = c.real_fight && sides.some((s) => s.id === c.winner_id && s.chance !== null && isUpset(true, s.chance));
  return (
    <RowLink href={`/contests/${c.contest_id}`} className="border-b border-rule hover:bg-panel/40">
      <td className={CELL}>
        {sides.map((s) => (
          <div key={s.id} className="h-6 flex items-center gap-1.5 min-w-0">
            <span className={`hidden sm:inline-block w-[6px] h-4 shrink-0 border border-ink ${s.judogi}`} />
            <Flag ioc={s.country} />
            <Link
              href={`/athletes/${s.id}`}
              className={`truncate hover:underline ${s.id === c.winner_id ? "font-semibold text-ink" : "text-muted"}`}
            >
              {shortName(s.family, s.given)}
            </Link>
          </div>
        ))}
      </td>
      <td className={`${CELL} hidden sm:table-cell text-right`}>
        {upset && (
          <span className="text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-gain text-gain">Upset</span>
        )}
      </td>
      <td className={`${CELL} whitespace-nowrap`}>
        {sides.map((s, i) => {
          const won = s.id === c.winner_id;
          // phones: an upset's chances in colour; wider screens: grey, with the chip
          const color = upset ? (won ? "text-gain font-semibold" : "text-drop font-semibold") : "text-ink sm:text-muted";
          return (
            <div key={s.id} className="h-6 flex items-center justify-end">
              {c.real_fight && s.chance !== null ? <span className={color}>{formatChance(s.chance, 0)}</span> : i === 0 && WALKOVER}
            </div>
          );
        })}
      </td>
      <td className={CELL}>
        {sides.map((s) => (
          // a walkover: the one who did not fight WO
          <div
            key={s.id}
            className={`h-6 flex items-center justify-center font-bold ${s.id === c.winner_id ? "text-gain" : c.real_fight ? "text-drop" : "text-[10px] text-muted"}`}
          >
            {s.id === c.winner_id ? "W" : c.real_fight ? "L" : "WO"}
          </div>
        ))}
      </td>
      <td className={CELL}>
        {sides.map((s) => (
          <div
            key={s.id}
            className={`h-6 flex items-center justify-end ${s.change === null ? "text-muted" : `${s.id === c.winner_id ? "font-bold" : "font-semibold"} ${s.change >= 0 ? "text-gain" : "text-drop"}`}`}
          >
            {s.change === null ? "—" : signed(s.change)}
          </div>
        ))}
      </td>
      <td className={`${CHEVRON_CELL}`}>
        <RowChevron />
      </td>
    </RowLink>
  );
}
