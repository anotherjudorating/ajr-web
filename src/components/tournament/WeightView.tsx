"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { isUpset } from "@/components/rankings/Changes";
import { Pagination } from "@/components/rankings/TableParts";
import { RowLink } from "@/components/RowLink";
import { H2, HEAD, HEAD_CELL, LINK, ROW_CELL } from "@/components/tournament/styles";
import type { Competition, CompetitionContest, CompetitionResult } from "@/lib/api";
import { roundCode, shortName, signed } from "@/lib/format";
import type { Weight } from "@/lib/weights";

const MEDALS: string[] = ["gold", "silver", "bronze"];
// judobase's round names -> the group rows' titles
const ROUND_TITLES: Record<string, string> = {
  Bronze: "Bronze medal",
  "Semi-Final": "Semi-finals",
  "Semi Final": "Semi-finals",
  "Quarter-Final": "Quarter-finals",
  "Quarter Final": "Quarter-finals",
};
const CELL = "px-2 sm:px-3 py-2 align-middle";

const gainOf = (r: CompetitionResult) => r.score_after - r.score_before;
const shortRound = (round: string | null) => (round === "Final" ? "Final" : roundCode(round));

// One side of a contest: the athlete and what the contest gave them.
function sideOf(c: CompetitionContest, white: boolean) {
  return white
    ? { id: c.white_id, family: c.white_family_name, given: c.white_given_name, country: c.white_country, chance: c.white_chance, change: c.white_score_after - c.white_score_before }
    : { id: c.blue_id, family: c.blue_family_name, given: c.blue_given_name, country: c.blue_country, chance: c.blue_chance, change: c.blue_score_after - c.blue_score_before };
}

// One weight of a tournament, as in the prototype (weight.html): the podium, every
// athlete's place with their contests a click away, and the contests by round.
export function WeightView({
  competition,
  weight,
  results,
  contests,
}: {
  competition: Competition;
  weight: Weight;
  results: CompetitionResult[];
  contests: CompetitionContest[];
}) {
  const rounds: { round: string; contests: CompetitionContest[] }[] = [];
  for (const c of contests) {
    const round = c.round ?? "Contests";
    if (rounds.at(-1)?.round !== round) rounds.push({ round, contests: [] });
    rounds.at(-1)!.contests.push(c);
  }
  // judobase numbers the bronze contests with the final: the final first
  rounds.sort((a, b) => Number(b.round === "Final") - Number(a.round === "Final"));

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
                      {r.score_before} → {r.score_after}
                    </span>
                    <span className={`font-bold ${gainOf(r) >= 0 ? "text-gain" : "text-drop"}`}>{signed(gainOf(r))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Results rows={table} places={places} contests={contests} />

      <Contests
        rounds={rounds}
        href={`/explore/contests?year=${competition.date_from.slice(0, 4)}&tournament=${competition.id}&weight=${weight.slug}`}
      />
    </>
  );
}

// Every athlete, a page at a time; a row opens the athlete's contests below it.
function Results({ rows, places, contests }: { rows: CompetitionResult[]; places: number[]; contests: CompetitionContest[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);
  const first = (page - 1) * size;

  return (
    <section className="mt-14 lg:mt-16">
      <div className={HEAD}>
        <h2 className={H2}>Results</h2>
      </div>
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
          {rows.slice(first, first + size).map((r, i) => {
            const expanded = open === r.athlete_id;
            const gain = gainOf(r);
            const own = contests
              .filter((c) => c.white_id === r.athlete_id || c.blue_id === r.athlete_id)
              .reverse(); // the first round first
            const panel = (
              <div className="bg-panel border-t border-rule border-l-[3px] border-l-claret p-3 sm:p-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="font-serif text-[16px] leading-[20px] font-semibold text-ink">Contests</h3>
                  <span className={`text-[14px] font-bold tabular-nums ${gain >= 0 ? "text-gain" : "text-drop"}`}>{signed(gain)}</span>
                </div>
                <div className="flex flex-col text-[13px] w-full sm:max-w-[560px]">
                  {own.map((c) => {
                    const self = sideOf(c, c.white_id === r.athlete_id);
                    const opponent = sideOf(c, c.white_id !== r.athlete_id);
                    const won = c.winner_id === r.athlete_id;
                    return (
                      <Link
                        key={c.contest_id}
                        href={`/contests/${c.contest_id}`}
                        className="border-b border-rule/60 last:border-b-0 py-1.5 flex items-center justify-between gap-1.5 hover:bg-paper/50"
                      >
                        <span className="w-10 shrink-0 text-muted">{shortRound(c.round)}</span>
                        <span className="inline-flex items-center gap-1.5 min-w-0 flex-1">
                          <Flag ioc={opponent.country} />
                          <span className="truncate font-medium text-ink">{shortName(opponent.family, opponent.given)}</span>
                        </span>
                        <span className="w-24 shrink-0 text-right tabular-nums text-ink">
                          {c.real_fight ? `${Math.round(self.chance * 100)}%` : ""}
                        </span>
                        <span className={`w-6 shrink-0 text-center font-bold ${won ? "text-gain" : "text-drop"}`}>{won ? "W" : "L"}</span>
                        <span className={`w-10 shrink-0 text-right font-bold tabular-nums ${self.change >= 0 ? "text-gain" : "text-drop"}`}>
                          {signed(self.change)}
                        </span>
                        <Icon size={18} name="chevron_right" className="text-muted shrink-0 -mr-1" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
            return (
              <Fragment key={r.athlete_id}>
                <tr
                  onClick={() => setOpen(expanded ? null : r.athlete_id)}
                  aria-expanded={expanded}
                  className="border-b border-rule hover:bg-panel/40 cursor-pointer"
                >
                  <td className={`${ROW_CELL} text-right font-medium`}>{places[first + i]}</td>
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
                    {r.wins}–{r.contests - r.wins}
                  </td>
                  <td className={`${ROW_CELL} text-right text-muted hidden sm:table-cell`}>{r.score_before}</td>
                  <td className={`${ROW_CELL} text-right font-bold`}>{r.score_after}</td>
                  <td className={`${ROW_CELL} text-right font-semibold ${gain >= 0 ? "text-gain" : "text-drop"}`}>{signed(gain)}</td>
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

// The contests from the final back, 20 a page, under rows for their rounds; a
// round's row folds its contests away.
function Contests({ rounds, href }: { rounds: { round: string; contests: CompetitionContest[] }[]; href: string }) {
  const [folded, setFolded] = useState<Set<string>>(new Set());
  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);
  const total = rounds.reduce((sum, r) => sum + r.contests.length, 0);
  const first = (page - 1) * size;

  // the rounds with contests on this page, and those contests
  const starts = rounds.map((_, i) => rounds.slice(0, i).reduce((sum, r) => sum + r.contests.length, 0));
  const shown = rounds
    .map((r, i) => ({
      ...r,
      all: r.contests.length,
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
        <Link href={href} className={LINK}>
          All contests
        </Link>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        {/* no visible header (the round rows say enough); it keeps the column widths */}
        <thead aria-hidden="true">
          <tr>
            <th className="p-0 h-0" />
            <th className="p-0 h-0 w-20 hidden sm:table-cell" />
            <th className="p-0 h-0 w-14 sm:w-16" />
            <th className="p-0 h-0 w-8 sm:w-10" />
            <th className="p-0 h-0 w-12 sm:w-16" />
            <th className="w-6 p-0 h-0" />
          </tr>
        </thead>
        <tbody>
          {shown.map(({ round, all, contests }) => {
            const open = !folded.has(round);
            const title = (
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Icon size={18} name="expand_more" className={`text-muted transition-transform duration-150 ${open ? "" : "-rotate-90"}`} />
                  <span className="text-[12px] font-bold uppercase text-ink">{ROUND_TITLES[round] ?? round}</span>
                </span>
                <span className="text-[12px] text-muted">
                  {all} {all === 1 ? "contest" : "contests"}
                </span>
              </div>
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
                {open && contests.map((c) => <ContestRow key={c.contest_id} contest={c} />)}
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
        onPageSize={(value) => {
          setSize(value);
          setPage(1);
        }}
        page={page}
        pages={Math.max(1, Math.ceil(total / size))}
        onPage={setPage}
      />
    </section>
  );
}

function ContestRow({ contest: c }: { contest: CompetitionContest }) {
  const sides = [
    { ...sideOf(c, true), judogi: "bg-paper" },
    { ...sideOf(c, false), judogi: "bg-oxford" },
  ];
  const upset = c.real_fight && sides.some((s) => s.id === c.winner_id && isUpset(true, s.chance));
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
        {sides.map((s) => {
          const won = s.id === c.winner_id;
          // phones: an upset's chances in colour; wider screens: grey, with the chip
          const color = upset ? (won ? "text-gain font-semibold" : "text-drop font-semibold") : "text-ink sm:text-muted";
          return (
            <div key={s.id} className="h-6 flex items-center justify-end">
              <span className={color}>{c.real_fight ? `${Math.round(s.chance * 100)}%` : ""}</span>
            </div>
          );
        })}
      </td>
      <td className={CELL}>
        {sides.map((s) => (
          <div key={s.id} className={`h-6 flex items-center justify-center font-bold ${s.id === c.winner_id ? "text-gain" : "text-drop"}`}>
            {s.id === c.winner_id ? "W" : "L"}
          </div>
        ))}
      </td>
      <td className={CELL}>
        {sides.map((s) => (
          <div
            key={s.id}
            className={`h-6 flex items-center justify-end ${s.id === c.winner_id ? "font-bold" : "font-semibold"} ${s.change >= 0 ? "text-gain" : "text-drop"}`}
          >
            {signed(s.change)}
          </div>
        ))}
      </td>
      <td className="w-6 py-2 align-middle pl-1 pr-0 text-right text-muted">
        <Icon size={18} name="chevron_right" className="align-middle" />
      </td>
    </RowLink>
  );
}
