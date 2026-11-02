import Link from "next/link";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { RowLink } from "@/components/RowLink";
import { NationMedals } from "@/components/tournament/NationMedals";
import { H2, HEAD, HEAD_CELL, LINK, ROW_CELL } from "@/components/tournament/styles";
import type { Competition, CompetitionContest, CompetitionResult } from "@/lib/api";
import { roundCode, shortName, signed } from "@/lib/format";
import { MEN, type Weight, WEIGHTS, weightTitle, WOMEN } from "@/lib/weights";

const MEDALS: string[] = ["gold", "silver", "bronze"];
const UPSET = 0.35; // a winner's chance of 35% or less, as everywhere on the site
const EXPERIENCE = 10; // rated contests before the tournament to count in the gains

export const isMedal = (r: CompetitionResult) => r.result !== null && MEDALS.includes(r.result);
export const gainOf = (r: CompetitionResult) => r.score_after - r.score_before;

// The tournament page: medallists of every weight, medals by nation, the biggest
// upsets and the biggest gains, as in the prototype.
export function Overview({
  competition: c,
  results,
  contests,
}: {
  competition: Competition;
  results: CompetitionResult[];
  contests: CompetitionContest[];
}) {
  const medallists = results.filter(isMedal);
  const year = c.date_from.slice(0, 4);
  return (
    <>
      <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24">
        <Medallists id={c.id} title="Men" weights={MEN} medallists={medallists} />
        <Medallists id={c.id} title="Women" weights={WOMEN} medallists={medallists} />
      </div>
      <div className="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24 items-start">
        <NationMedals medallists={medallists} />
        <div className="flex flex-col gap-y-14 lg:gap-y-16">
          <Upsets
            contests={contests}
            total={c.upsets}
            href={`/explore/contests?year=${year}&tournament=${c.id}&result=upsets&sort=chance-asc`}
          />
          <Gains results={results} href={`/explore/contests?year=${year}&tournament=${c.id}`} />
        </div>
      </div>
    </>
  );
}

// The four medallists of every weight: the weight and the chevron span their rows.
function Medallists({
  id,
  title,
  weights,
  medallists,
}: {
  id: number;
  title: string;
  weights: Weight[];
  medallists: CompetitionResult[];
}) {
  const groups = weights
    .map((w) => ({ weight: w, rows: medallists.filter((r) => r.weight === w.api) }))
    .filter((g) => g.rows.length > 0);
  if (groups.length === 0) return null;
  return (
    <section>
      <div className={HEAD}>
        <h2 className={H2}>{title}</h2>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <tbody>
          {groups.map(({ weight, rows }) =>
            rows.map((r, i) => {
              const last = i === rows.length - 1;
              return (
                <RowLink
                  key={`${weight.slug}-${r.athlete_id}`}
                  href={`/tournaments/${id}/${weight.slug}`}
                  className={last ? "border-b border-rule" : "border-b border-rule/50"}
                >
                  {i === 0 && (
                    <td
                      rowSpan={rows.length}
                      className="h-10 py-2.5 px-2 sm:px-3 w-14 sm:w-16 whitespace-nowrap text-muted align-top border-b border-rule"
                    >
                      {weight.label}
                    </td>
                  )}
                  <td className="h-9 py-0 px-2 sm:px-3 align-middle">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Medal kind={r.result as MedalKind} className="w-3.5 h-4" />
                      <Flag ioc={r.country} />
                      <span className="truncate">{shortName(r.family_name, r.given_name)}</span>
                    </div>
                  </td>
                  <td className="h-9 py-0 px-2 sm:px-3 align-middle text-right whitespace-nowrap w-16">
                    <span className={`font-semibold ${gainOf(r) >= 0 ? "text-gain" : "text-drop"}`}>{signed(gainOf(r))}</span>
                  </td>
                  {i === 0 && (
                    <td
                      rowSpan={rows.length}
                      className="w-6 py-0 align-middle pl-1 pr-0 text-right text-muted border-b border-rule"
                    >
                      <Icon size={18} name="chevron_right" className="align-middle" />
                    </td>
                  )}
                </RowLink>
              );
            }),
          )}
        </tbody>
      </table>
    </section>
  );
}

// The five least likely wins: the winner and their chance on the left, the bar of it.
function Upsets({ contests, total, href }: { contests: CompetitionContest[]; total: number; href: string }) {
  const upsets = contests
    .map((c) => {
      const white = c.winner_id === c.white_id;
      const side = (won: boolean) =>
        won === white
          ? { id: c.white_id, family: c.white_family_name, country: c.white_country, chance: c.white_chance, score: c.white_score_before }
          : { id: c.blue_id, family: c.blue_family_name, country: c.blue_country, chance: c.blue_chance, score: c.blue_score_before };
      return { contest: c, winner: side(true), loser: side(false) };
    })
    .filter((u) => u.contest.real_fight && u.winner.chance <= UPSET)
    .sort((a, b) => a.winner.chance - b.winner.chance)
    .slice(0, 5);
  if (upsets.length === 0) return null;
  const name = (family: string | null) => shortName(family, null);
  return (
    <section>
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
            <Link
              key={contest.contest_id}
              href={`/contests/${contest.contest_id}`}
              className="block hover:bg-panel/40 py-3 border-b border-rule transition-colors group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Flag ioc={winner.country} />
                  <span className="font-semibold text-ink truncate">{name(winner.family)}</span>
                  <span className="text-gain font-semibold tabular-nums ml-2">{Math.round(winner.chance * 100)}%</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-muted tabular-nums mr-2">{Math.round(loser.chance * 100)}%</span>
                  <span className="text-muted truncate">{name(loser.family)}</span>
                  <Flag ioc={loser.country} />
                  <Icon
                    size={18}
                    name="chevron_right"
                    className="text-muted ml-1 group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              </div>
              <div className="mt-1.5">
                <div className="h-1.5 w-full flex border border-ink overflow-hidden bg-transparent">
                  <div className="bg-gain h-full" style={{ width: `${Math.round(winner.chance * 100)}%` }} />
                </div>
              </div>
              <div className="mt-1.5 text-[12px] text-muted flex items-center justify-between gap-3">
                <span>
                  {weight ? weightTitle(weight) : contest.weight}
                  <span className="inline-block w-px h-3 bg-rule mx-2 align-middle" />
                  {contest.round === "Final" ? "Final" : roundCode(contest.round)}
                </span>
                <span className="tabular-nums">Rating gap {Math.abs(loser.score - winner.score)} points</span>
              </div>
            </Link>
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
    <section>
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
            <th className="w-6 h-9 py-0 pl-1 pr-0" />
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
                {r.score_before} → {r.score_after}
              </td>
              <td className={`${ROW_CELL} text-right font-semibold ${gainOf(r) >= 0 ? "text-gain" : "text-drop"}`}>
                {signed(gainOf(r))}
              </td>
              <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
    </section>
  );
}
