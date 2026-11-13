"use client";

import Link from "next/link";
import { useState } from "react";

import { useHash, useRowMark, useRowScroll } from "@/components/anchors";
import { HashScroll } from "@/components/HashScroll";
import { medallistRow, SECTION } from "@/lib/anchors";

import { Flag } from "@/components/Flag";
import { Arrow, CHEVRON_CELL, RowChevron } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { RowLink } from "@/components/RowLink";
import { UpsetCard } from "@/components/UpsetCard";
import { NationMedals } from "@/components/tournament/NationMedals";
import { H2, HEAD, HEAD_CELL, LINK, ROW_CELL } from "@/components/tournament/styles";
import type { Competition, CompetitionContest, CompetitionResult, MedalChance } from "@/lib/api";
import { shortName, signed } from "@/lib/format";
import { liveWeights } from "@/lib/live";
import { MEN, type Weight, WEIGHTS, weightTitle, WOMEN } from "@/lib/weights";

const MEDALS: string[] = ["gold", "silver", "bronze"];
const UPSET = 0.35; // a winner's chance of 35% or less, as everywhere on the site
const EXPERIENCE = 10; // rated contests before the tournament to count in the gains

const isMedal = (r: CompetitionResult) => r.result !== null && MEDALS.includes(r.result);
const gainOf = (r: CompetitionResult) => r.score_after - r.score_before;

// A weight's lines on the overview: its medallists once it is over (none before).
type Line = { athleteId: number; kind: MedalKind; country: string | null; name: string; value: React.ReactNode };

function linesOf(weight: Weight, medallists: CompetitionResult[]): Line[] {
  const won = medallists.filter((r) => r.weight === weight.api);
  if (!won.some((r) => r.result === "gold")) return [];
  return won.map((r) => ({
    athleteId: r.athlete_id,
    kind: r.result as MedalKind,
    country: r.country,
    name: shortName(r.family_name, r.given_name),
    value: <span className={`font-semibold ${gainOf(r) >= 0 ? "text-gain" : "text-drop"}`}>{signed(gainOf(r))}</span>,
  }));
}

// The tournament page: medallists of every weight (the likeliest ones for weights
// not over yet), medals by nation, the biggest upsets and the biggest gains, as in
// the prototype.
export function Overview({
  competition: c,
  results,
  contests,
  chances = [],
}: {
  competition: Competition;
  results: CompetitionResult[];
  contests: CompetitionContest[];
  chances?: MedalChance[];
}) {
  const medallists = results.filter(isMedal);
  const live = liveWeights(results);
  const year = c.date_from.slice(0, 4);
  return (
    <>
      <Podium id={c.id} groups={{ Men: MEN, Women: WOMEN }} medallists={medallists} live={live} />
      <div className="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24 items-start">
        <NationMedals
          medallists={medallists}
          nations={[...results, ...chances].flatMap((r) => (r.country ? [{ country: r.country, weight: r.weight }] : []))}
        />
        <div className="flex flex-col gap-y-14 lg:gap-y-16">
          <Upsets
            contests={contests}
            total={c.upsets ?? 0}
            href={`/explore/contests?year=${year}&tournament=${c.id}&result=upsets&sort=chance-asc`}
          />
          <Gains results={results} href={`/explore/contests?year=${year}&tournament=${c.id}`} />
        </div>
      </div>
    </>
  );
}

const PLACE: Record<MedalKind, string> = { gold: "1", silver: "2", bronze: "3" };

// Men or women. Wide screens: every weight a row of its four medallists, as a weight's
// page heads. Phones: a line each medallist, the weight (and Live) spanning its lines.
// A weight not over: dashes (its chances are on its page).
function Podium({
  id,
  groups,
  medallists,
  live,
}: {
  id: number;
  groups: Record<"Men" | "Women", Weight[]>;
  medallists: CompetitionResult[];
  live: Set<string>;
}) {
  // a medallist picked in the medals by nation (#medallist-…): their gender shown, marked
  const hash = useHash();
  const [picked, setPicked] = useState<{ gender: "Men" | "Women"; hash: string }>({ gender: "Men", hash: "" });
  const hashed = (["Men", "Women"] as const).find((g) =>
    groups[g].some((w) => linesOf(w, medallists).some((l) => medallistRow(w.slug, l.athleteId) === hash)),
  );
  // #men, #women (the sections' old anchors): that gender
  const named = hash === SECTION.men ? "Men" : hash === SECTION.women ? "Women" : undefined;
  if ((hashed ?? named) && picked.hash !== hash) setPicked({ gender: (hashed ?? named)!, hash });
  const gender = picked.gender;
  const setGender = (g: "Men" | "Women") => setPicked({ gender: g, hash });
  const lit = useRowMark(Boolean(hashed), hash);
  useRowScroll(hash, Boolean(hashed) && picked.hash === hash);
  const rows = groups[gender].map((w) => ({ weight: w, lines: linesOf(w, medallists) }));
  const weightCell = (weight: Weight, span: number) => (
    <td rowSpan={span} className="relative h-10 py-2.5 px-2 sm:px-3 w-14 sm:w-16 whitespace-nowrap text-muted align-top border-b border-rule">
      {/* the weight's cell opens the weight's page (the rows: the athlete's row there) */}
      <Link href={`/tournaments/${id}/${weight.slug}`} className="absolute inset-0" aria-label={`${weight.label} kg`} />
      <span className="block">{weight.label}</span>
      {live.has(weight.api) && (
        <span className="flex items-center gap-1 text-[11px] leading-[14px] font-semibold text-claret">
          <span className="w-1.5 h-1.5 rounded-full bg-claret" />
          Live
        </span>
      )}
    </td>
  );
  return (
    <section id={named ? hash : undefined} className="mt-12">
      {named && <HashScroll id={hash} />}
      <div className={HEAD}>
        <h2 className={H2}>Podium</h2>
        <div className="flex items-center gap-3 text-[13px] sm:text-[14px]" role="group" aria-label="Men or women">
          {(["Men", "Women"] as const).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={gender === g}
              onClick={() => setGender(g)}
              className={`px-1 pb-0.5 border-b-2 cursor-pointer ${gender === g ? "font-bold text-ink border-claret" : "text-muted hover:text-ink border-transparent"}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="hidden lg:block">
        {rows.map(({ weight, lines }) => {
          const label = (
            <>
              <span className="block font-serif text-[18px] font-semibold text-ink">{weight.label}</span>
              {live.has(weight.api) && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-claret">
                  <span className="w-1.5 h-1.5 rounded-full bg-claret" />
                  Live
                </span>
              )}
            </>
          );
          const grid = "grid grid-cols-[96px_repeat(4,minmax(0,1fr))] gap-x-8 items-start py-4 border-b border-rule";
          // not over: the whole row opens the weight's page
          if (lines.length === 0)
            return (
              <Link key={weight.slug} href={`/tournaments/${id}/${weight.slug}`} className={`${grid} hover:bg-panel/40`}>
                <span className="pl-3">{label}</span>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="pt-0.5 font-serif text-[16px] text-muted">
                    —
                  </span>
                ))}
              </Link>
            );
          return (
            <div key={weight.slug} className={grid}>
              <Link href={`/tournaments/${id}/${weight.slug}`} className="pl-3 hover:underline">
                {label}
              </Link>
              {lines.map((line) => (
                <div
                  key={line.athleteId}
                  data-row={medallistRow(weight.slug, line.athleteId)}
                  className={`flex items-start gap-2.5 min-w-0 -m-1 p-1 ${medallistRow(weight.slug, line.athleteId) === hash ? lit.row : ""}`}
                >
                  <Medal kind={line.kind} className="w-4 h-5 mt-0.5" />
                  <div className="min-w-0">
                    <Link
                      href={`/tournaments/${id}/${weight.slug}#athlete-${line.athleteId}`}
                      className="block font-serif text-[16px] leading-[20px] font-semibold text-ink truncate hover:underline"
                    >
                      {line.name}
                    </Link>
                    <div className="mt-1 flex items-center gap-1.5 text-[12px] leading-[16px] text-muted">
                      <Flag ioc={line.country} />
                      <span>{line.country}</span>
                      {line.value && <span className="ml-1 tabular-nums">{line.value}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <table className="lg:hidden w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <tbody>
          {rows.map(({ weight, lines }) =>
            lines.length === 0 ? (
              // not over: the whole line opens the weight's page
              <RowLink key={weight.slug} href={`/tournaments/${id}/${weight.slug}`} label={`${weight.label} kg`} className="border-b border-rule">
                {weightCell(weight, 1)}
                <td colSpan={2} className="h-10 px-2 sm:px-3 text-muted">
                  —
                </td>
                <td className={CHEVRON_CELL}>
                  <RowChevron />
                </td>
              </RowLink>
            ) : (
              lines.map((line, i) => (
                // the weight's page at the athlete's row in its results, opened
                <RowLink
                  key={`${weight.slug}-${line.athleteId}`}
                  id={medallistRow(weight.slug, line.athleteId)}
                  href={`/tournaments/${id}/${weight.slug}#athlete-${line.athleteId}`}
                  className={`${i === lines.length - 1 ? "border-b border-rule" : "border-b border-rule/50"} ${hash === medallistRow(weight.slug, line.athleteId) ? lit.row : ""}`}
                >
                  {i === 0 && weightCell(weight, lines.length)}
                  <td className="h-9 py-0 px-2 sm:px-3 align-middle">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* the place: a medal is too small on a phone */}
                      <span className="w-4 shrink-0 font-semibold text-ink">{PLACE[line.kind]}</span>
                      <Flag ioc={line.country} />
                      {/* the name: the athlete's page */}
                      <Link href={`/athletes/${line.athleteId}`} className="truncate hover:underline">
                        {line.name}
                      </Link>
                    </div>
                  </td>
                  <td className="h-9 py-0 px-2 sm:px-3 align-middle text-right whitespace-nowrap w-16">{line.value}</td>
                  <td className={CHEVRON_CELL}>
                    <RowChevron />
                  </td>
                </RowLink>
              ))
            ),
          )}
        </tbody>
      </table>
    </section>
  );
}

// The five least likely wins: the winner and their chance on the left, the bar of it.
function Upsets({ contests, total, href }: { contests: CompetitionContest[]; total: number; href: string }) {
  const upsets = contests
    .filter((c) => c.real_fight) // rated: a chance and scores on both sides
    .map((c) => {
      const white = c.winner_id === c.white_id;
      const side = (won: boolean) =>
        won === white
          ? { id: c.white_id, family: c.white_family_name, country: c.white_country, chance: c.white_chance ?? 0, score: c.white_score_before ?? 0 }
          : { id: c.blue_id, family: c.blue_family_name, country: c.blue_country, chance: c.blue_chance ?? 0, score: c.blue_score_before ?? 0 };
      return { contest: c, winner: side(true), loser: side(false) };
    })
    .filter((u) => u.winner.chance <= UPSET)
    .sort((a, b) => a.winner.chance - b.winner.chance)
    .slice(0, 5);
  if (upsets.length === 0) return null;
  return (
    <section id={SECTION.upsets}>
      <HashScroll id={SECTION.upsets} />
      <div className={HEAD}>
        <h2 className={H2}>Biggest upsets</h2>
        <Link href={href} className={LINK}>
          All {total} upsets
        </Link>
      </div>
      <div className="flex flex-col text-[14px]">
        {upsets.map(({ contest, winner, loser }) => {
          const weight = WEIGHTS.find((w) => w.api === contest.weight);
          return (
            <UpsetCard
              key={contest.contest_id}
              href={`/contests/${contest.contest_id}`}
              winner={winner}
              loser={loser}
              where={weight ? weightTitle(weight) : contest.weight}
              round={contest.round}
            />
          );
        })}
      </div>
    </section>
  );
}

// The five athletes whose score rose the most over the tournament, among those with
// EXPERIENCE contests before it: the score of an athlete the rating knows little
// about starts low and leaps.
function Gains({ results, href }: { results: CompetitionResult[]; href: string }) {
  const rows = results
    .filter((r) => r.contests_before >= EXPERIENCE)
    .sort((a, b) => gainOf(b) - gainOf(a))
    .slice(0, 5);
  if (rows.length === 0) return null;
  return (
    <section id={SECTION.gains}>
      <HashScroll id={SECTION.gains} />
      <div className={HEAD}>
        <h2 className={H2}>Biggest gains</h2>
        <Link href={href} className={LINK}>
          All rating changes
        </Link>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Athlete</th>
            <th className={`${HEAD_CELL} text-right w-28`}>Rating</th>
            <th className={`${HEAD_CELL} text-right w-14`}>+/−</th>
            <th className="w-8 sm:w-10 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <RowLink key={`${r.athlete_id}-${r.weight}`} href={`/athletes/${r.athlete_id}`} className="border-b border-rule hover:bg-panel/40">
              <td className={ROW_CELL}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Flag ioc={r.country} />
                  <span className="font-semibold truncate">{shortName(r.family_name, r.given_name)}</span>
                </div>
              </td>
              <td className={`${ROW_CELL} text-right whitespace-nowrap text-muted`}>
                {r.score_before}
                <Arrow />
                {r.score_after}
              </td>
              <td className={`${ROW_CELL} text-right font-semibold ${gainOf(r) >= 0 ? "text-gain" : "text-drop"}`}>
                {signed(gainOf(r))}
              </td>
              <td className={`${CHEVRON_CELL}`}>
                <RowChevron />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
    </section>
  );
}
