import Link from "next/link";

import { HashScroll } from "@/components/HashScroll";
import { SECTION } from "@/lib/anchors";

import { Flag } from "@/components/Flag";
import { type ChartAthlete, H2HChart } from "@/components/h2h/H2HChart";
import { Icon } from "@/components/Icon";
import { changeText, isUpset } from "@/components/rankings/Changes";
import { RowLink } from "@/components/RowLink";
import type { Athlete, HistoryRow } from "@/lib/api";
import type { Places } from "@/lib/places";
import { formatChance, formatDate, monthYear, roundCode, shortCompetition, shortName } from "@/lib/format";
import { COLORS, winChance } from "@/lib/h2h";
import { tournamentPath } from "@/lib/weights";

const TH = "h-9 py-0 align-middle px-2 sm:px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted";
const TD = "h-10 sm:h-11 py-0 align-middle px-2 sm:px-3";
const H2 = "font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight";
const YEAR = 365 * 24 * 3600 * 1000;

type Side = { athlete: Athlete; history: HistoryRow[]; places: Places | null };

// Two athletes side by side: their chances today, both ratings over time and every
// meeting between them.
export function Comparison({ a, b, today }: { a: Side; b: Side; today: string }) {
  const chanceA = winChance(a.athlete.rating ?? 0, a.athlete.rd ?? 0, b.athlete.rating ?? 0, b.athlete.rd ?? 0);
  const meetings = a.history.filter((contest) => contest.opponent_id === b.athlete.id);
  const winsA = meetings.filter((contest) => contest.won).length;
  const chart: ChartAthlete[] = [a, b].map((side, i) => ({
    slot: i === 0 ? "a" : "b",
    family_name: side.athlete.family_name,
    given_name: side.athlete.given_name,
    score: side.athlete.score ?? 0,
    history: side.history,
    places: side.places,
  }));

  return (
    <>
      <section className="mt-10 lg:mt-12">
        <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
          <h2 className={H2}>Current chances</h2>
          <Link
            href="/methodology"
            className="font-serif shrink-0 whitespace-nowrap text-[14px] font-semibold text-claret hover:underline"
          >
            How ratings work
          </Link>
        </div>
        <table className="w-full border-collapse text-[13px] sm:text-[14px] tabular-nums">
          <thead>
            <tr className="bg-panel border-b border-rule">
              <th className={`${TH} text-left`}>Athlete</th>
              <th className={`${TH} text-right w-12 sm:w-16`}>Rank</th>
              <th className={`${TH} text-right w-16 sm:w-20`}>Rating</th>
              <th className={`${TH} text-right w-20 hidden sm:table-cell`}>Skill</th>
              <th className={`${TH} text-right w-16 hidden sm:table-cell`}>RD</th>
              <th className={`${TH} text-right w-20 hidden sm:table-cell`}>90 days</th>
              <th className={`${TH} text-right w-24 hidden sm:table-cell`}>W–L 12m</th>
              <th className={`${TH} text-right w-16 sm:w-20`}>Chance</th>
            </tr>
          </thead>
          <tbody>
            {[
              { side: a, color: COLORS.a, chance: chanceA },
              { side: b, color: COLORS.b, chance: 1 - chanceA },
            ].map(({ side, color, chance }) => {
              const { athlete } = side;
              const change = changeText(athlete.score_change_90d);
              const year = side.history.filter((c) => new Date(today).getTime() - new Date(c.fought_on).getTime() < YEAR);
              const wins = year.filter((c) => c.won).length;
              return (
                <tr key={athlete.id} className="border-b border-rule">
                  <td className={TD}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-[3px] shrink-0" style={{ background: color }} />
                      <Flag ioc={athlete.country} />
                      <Link href={`/athletes/${athlete.id}`} className="font-semibold truncate hover:underline">
                        {shortName(athlete.family_name, athlete.given_name)}
                      </Link>
                    </div>
                  </td>
                  <td className={`${TD} text-right`}>{athlete.place ? `#${athlete.place}` : "–"}</td>
                  <td className={`${TD} text-right font-bold`}>{athlete.score}</td>
                  <td className={`${TD} text-right hidden sm:table-cell`}>{athlete.rating}</td>
                  <td className={`${TD} text-right hidden sm:table-cell`}>{athlete.rd}</td>
                  <td className={`${TD} text-right font-semibold hidden sm:table-cell ${change.color}`}>{change.text}</td>
                  <td className={`${TD} text-right hidden sm:table-cell`}>
                    {wins}–{year.length - wins}
                  </td>
                  <td className={`${TD} text-right text-muted`}>{formatChance(chance)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-[12px] text-muted">Chance from skill ratings. Rating = skill − 3 × RD.</p>
      </section>

      <H2HChart athletes={chart} today={today} />

      <section id={SECTION.meetings} className="mt-14 lg:mt-16">
        <HashScroll id={SECTION.meetings} />
        <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
          <h2 className={H2}>{meetingsTitle(a.athlete, b.athlete, winsA, meetings.length - winsA)}</h2>
        </div>
        {meetings.length === 0 ? (
          <p className="py-4 text-[14px] text-muted">They have not met in IJF events yet.</p>
        ) : (
          <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
            <thead>
              <tr className="h-0">
                <th className="w-[72px] sm:w-32 h-0 p-0">
                  <span className="sr-only">Date</span>
                </th>
                <th className="w-[96px] sm:w-auto h-0 p-0">
                  <span className="sr-only">Tournament</span>
                </th>
                <th className="w-10 sm:w-20 h-0 p-0">
                  <span className="sr-only">Round</span>
                </th>
                <th className="h-0 p-0">
                  <span className="sr-only">Winner</span>
                </th>
                <th className="w-32 h-0 p-0 hidden sm:table-cell">
                  <span className="sr-only">Winner&apos;s chance</span>
                </th>
                <th className="w-6 h-0 p-0" />
              </tr>
            </thead>
            <tbody>
              {meetings.map((contest) => {
                const winner = contest.won ? a.athlete : b.athlete;
                const chance = contest.won ? contest.win_probability : 1 - contest.win_probability;
                return (
                  <RowLink key={contest.contest_id} href={`/contests/${contest.contest_id}`} className="border-b border-rule hover:bg-panel/40">
                    <td className={`${TD} whitespace-nowrap text-muted`}>
                      <span className="sm:hidden">{monthYear(contest.fought_on)}</span>
                      <span className="hidden sm:inline">{formatDate(contest.fought_on)}</span>
                    </td>
                    <td className={`${TD} whitespace-nowrap overflow-hidden`}>
                      {/* the tournament's page of that weight, the row the contest's */}
                      <Link href={tournamentPath(contest.competition_id, contest.weight)} className="hover:underline">
                        <span className="sm:hidden">{shortCompetition(contest.competition)}</span>
                        <span className="hidden sm:inline">{contest.competition}</span>
                      </Link>
                    </td>
                    <td className={`${TD} text-muted`}>{roundCode(contest.round)}</td>
                    <td className={TD}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Flag ioc={winner.country} />
                        <span className="font-medium truncate">{shortName(winner.family_name, winner.given_name)}</span>
                      </div>
                    </td>
                    <td className={`${TD} text-right whitespace-nowrap text-muted hidden sm:table-cell`}>
                      <span className="inline-flex items-center gap-1.5">
                        {isUpset(true, chance) && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.05em] px-1 py-0.5 border leading-none text-gain border-gain">
                            Upset
                          </span>
                        )}
                        {formatChance(chance)}
                      </span>
                    </td>
                    <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                      <Link href={`/contests/${contest.contest_id}`} aria-label="The contest">
                        <Icon size={18} name="chevron_right" className="align-middle" />
                      </Link>
                    </td>
                  </RowLink>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

// "Heydarov leads 3–1", "Level at 2–2", "No meetings yet"
function meetingsTitle(a: Athlete, b: Athlete, winsA: number, winsB: number): string {
  if (winsA + winsB === 0) return "No meetings yet";
  if (winsA === winsB) return `Level at ${winsA}–${winsB}`;
  const leader = winsA > winsB ? a : b;
  const name = shortName(leader.family_name, null);
  return `${name} leads ${Math.max(winsA, winsB)}–${Math.min(winsA, winsB)}`;
}
