import Link from "next/link";

import { HashScroll } from "@/components/HashScroll";
import { SECTION } from "@/lib/anchors";

import { Flag } from "@/components/Flag";
import { Arrow, Icon } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { RowLink } from "@/components/RowLink";
import { UpsetCard } from "@/components/UpsetCard";
import { NationMedals } from "@/components/tournament/NationMedals";
import { H2, HEAD, HEAD_CELL, LINK, ROW_CELL } from "@/components/tournament/styles";
import type { Competition, CompetitionContest, CompetitionResult, MedalChance } from "@/lib/api";
import { formatChance, shortName, signed } from "@/lib/format";
import { MEN, type Weight, WEIGHTS, weightTitle, WOMEN } from "@/lib/weights";

const MEDALS: string[] = ["gold", "silver", "bronze"];
const UPSET = 0.35; // a winner's chance of 35% or less, as everywhere on the site
const EXPERIENCE = 10; // rated contests before the tournament to count in the gains

const isMedal = (r: CompetitionResult) => r.result !== null && MEDALS.includes(r.result);
const gainOf = (r: CompetitionResult) => r.score_after - r.score_before;

// A weight's four lines on the overview: its medallists once it is over, until then
// the four likeliest medallists of the draw.
type Line = { athleteId: number; kind: MedalKind; predicted: boolean; country: string | null; name: string; value: React.ReactNode };
const PLACES: MedalKind[] = ["gold", "silver", "bronze", "bronze"];

// Weights fought at least once but not over: under way.
export function liveWeights(results: CompetitionResult[]): Set<string> {
  const over = new Set(results.filter((r) => r.result === "gold").map((r) => r.weight));
  return new Set(results.map((r) => r.weight).filter((w) => !over.has(w)));
}

function linesOf(weight: Weight, medallists: CompetitionResult[], chances: MedalChance[]): Line[] {
  const won = medallists.filter((r) => r.weight === weight.api);
  if (won.some((r) => r.result === "gold")) {
    return won.map((r) => ({
      athleteId: r.athlete_id,
      kind: r.result as MedalKind,
      predicted: false,
      country: r.country,
      name: shortName(r.family_name, r.given_name),
      value: <span className={`font-semibold ${gainOf(r) >= 0 ? "text-gain" : "text-drop"}`}>{signed(gainOf(r))}</span>,
    }));
  }
  return chances
    .filter((c) => c.weight === weight.api)
    .slice(0, 4)
    .map((c, i) => ({
      athleteId: c.athlete_id,
      kind: PLACES[i],
      predicted: true,
      country: c.country,
      name: shortName(c.family_name, c.given_name),
      value: <span className="font-semibold">{formatChance(c.medal)}</span>,
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
      <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24">
        {[
          { title: "Men", weights: MEN },
          { title: "Women", weights: WOMEN },
        ].map(({ title, weights }) => (
          <Medallists
            key={title}
            id={c.id}
            title={title}
            groups={weights.map((w) => ({ weight: w, live: live.has(w.api), lines: linesOf(w, medallists, chances) }))}
          />
        ))}
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

// Four lines a weight: the weight (and Live) and the chevron span them.
function Medallists({
  id,
  title,
  groups,
}: {
  id: number;
  title: string;
  groups: { weight: Weight; live: boolean; lines: Line[] }[];
}) {
  const shown = groups.filter((g) => g.lines.length > 0);
  if (shown.length === 0) return null;
  const anchorId = title === "Men" ? SECTION.men : title === "Women" ? SECTION.women : undefined;
  return (
    <section id={anchorId}>
      {anchorId && <HashScroll id={anchorId} />}
      <div className={HEAD}>
        <h2 className={H2}>{title}</h2>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <tbody>
          {shown.map(({ weight, live, lines }) =>
            lines.map((line, i) => (
              <RowLink
                key={`${weight.slug}-${line.athleteId}`}
                href={`/tournaments/${id}/${weight.slug}`}
                className={i === lines.length - 1 ? "border-b border-rule" : "border-b border-rule/50"}
              >
                {i === 0 && (
                  <td
                    rowSpan={lines.length}
                    className="h-10 py-2.5 px-2 sm:px-3 w-14 sm:w-16 whitespace-nowrap text-muted align-top border-b border-rule"
                  >
                    <span className="block">{weight.label}</span>
                    {live && (
                      <span className="flex items-center gap-1 text-[11px] leading-[14px] font-semibold text-claret">
                        <span className="w-1.5 h-1.5 rounded-full bg-claret" />
                        Live
                      </span>
                    )}
                  </td>
                )}
                <td className="h-9 py-0 px-2 sm:px-3 align-middle">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Medal kind={line.kind} predicted={line.predicted} className="w-3.5 h-4" />
                    <Flag ioc={line.country} />
                    <span className="truncate">{line.name}</span>
                  </div>
                </td>
                <td className="h-9 py-0 px-2 sm:px-3 align-middle text-right whitespace-nowrap w-16">{line.value}</td>
                {i === 0 && (
                  <td rowSpan={lines.length} className="w-6 py-0 align-middle pl-1 pr-0 text-right text-muted border-b border-rule">
                    <Icon size={18} name="chevron_right" className="align-middle" />
                  </td>
                )}
              </RowLink>
            )),
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
                {r.score_before}
                <Arrow />
                {r.score_after}
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
