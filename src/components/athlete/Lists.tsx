"use client";

import Link from "@/components/Link";

import { Flag } from "@/components/Flag";
import { CHEVRON_CELL, RowChevron } from "@/components/Icon";
import { HashScroll } from "@/components/HashScroll";
import { RowLink } from "@/components/RowLink";
import { anchor, SECTION } from "@/lib/anchors";
import type { AthleteChance, HistoryRow } from "@/lib/api";
import { useI18n } from "@/i18n/client";
import { shortCompetition, shortName } from "@/lib/format";
import { tournamentPath, WEIGHTS } from "@/lib/weights";

const H2 = "font-serif text-[20px] sm:text-[24px] font-bold text-ink border-b-2 border-ink pb-2";
const H2_PLAIN = "font-serif text-[20px] sm:text-[24px] font-bold text-ink";
const ALL = "font-serif shrink-0 whitespace-nowrap text-[14px] font-semibold text-claret hover:underline cursor-pointer";
const ROW = "h-10 sm:h-11 border-b border-rule hover:bg-panel/40";
const CELL = "h-10 sm:h-11 py-0 align-middle";

// Best wins (the least likely ones) and toughest losses (the most likely wins lost).
export function Standouts({ contests, onAll }: { contests: HistoryRow[]; onAll: (kind: "wins" | "losses") => void }) {
  const { d } = useI18n();
  const bestWins = contests
    .filter((c) => c.won)
    .sort((a, b) => a.win_probability - b.win_probability)
    .slice(0, 5);
  const toughestLosses = contests
    .filter((c) => !c.won)
    .sort((a, b) => b.win_probability - a.win_probability)
    .slice(0, 5);
  return (
    <section className="mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-24 gap-y-14">
      <ContestList id={SECTION.bestWins} title={d.athlete.lists.bestWins} contests={bestWins} onAll={() => onAll("wins")} />
      <ContestList id={SECTION.toughestLosses} title={d.athlete.lists.toughestLosses} contests={toughestLosses} onAll={() => onAll("losses")} />
    </section>
  );
}

function ContestList({ id, title, contests, onAll }: { id: string; title: string; contests: HistoryRow[]; onAll: () => void }) {
  const { d, f } = useI18n();
  return (
    <div id={id}>
      <HashScroll id={id} />
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
        <h2 className={H2_PLAIN}>{title}</h2>
        {/* the contests list below, with these filters (the address stays) */}
        {contests.length > 0 && (
          <button type="button" onClick={onAll} className={ALL}>
            {d.athlete.lists.all}
          </button>
        )}
      </div>
      <table className="w-full border-collapse text-[13px] sm:text-[14px]">
        <tbody>
          {contests.map((c) => (
            <RowLink key={c.contest_id} href={`/contests/${c.contest_id}`} className={ROW}>
              <td className={`pr-2 ${CELL}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <Flag ioc={c.opponent_country} />
                  <Link href={`/athletes/${c.opponent_id}`} className="font-medium text-ink truncate hover:underline">
                    {shortName(c.opponent_family_name, c.opponent_given_name)}
                  </Link>
                </div>
              </td>
              <td className={`px-2 text-muted hidden sm:table-cell ${CELL}`}>{shortCompetition(c.competition)}</td>
              <td className={`px-2 text-right text-muted ${CELL}`}>{f.formatChance(c.win_probability)}</td>
              <td
                className={`px-2 text-right font-semibold text-ink tabular-nums ${CELL}`}
                title={d.athlete.lists.opponentRating}
              >
                {c.opponent_score}
              </td>
              <td className={`${CHEVRON_CELL}`}>
                <Link href={`/contests/${c.contest_id}`} aria-label={d.athlete.contests.theContest}>
                  <RowChevron />
                </Link>
              </td>
            </RowLink>
          ))}
          {contests.length === 0 && (
            <tr className="h-10">
              <td className="text-[13px] text-muted">{d.athlete.lists.noneYet}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// The five opponents met most often, with the athlete's wins and losses against them.
export function FrequentOpponents({ athleteId, contests }: { athleteId: number; contests: HistoryRow[] }) {
  const { d } = useI18n();
  const byOpponent = new Map<number, { contest: HistoryRow; wins: number; losses: number }>();
  for (const c of contests) {
    const entry = byOpponent.get(c.opponent_id) ?? { contest: c, wins: 0, losses: 0 };
    if (c.won) entry.wins++;
    else entry.losses++;
    byOpponent.set(c.opponent_id, entry);
  }
  const frequent = [...byOpponent.values()]
    .filter((e) => e.wins + e.losses > 1)
    .sort((a, b) => b.wins + b.losses - (a.wins + a.losses))
    .slice(0, 5);

  return (
    <div id={SECTION.opponents}>
      <HashScroll id={SECTION.opponents} />
      <h2 className={H2}>{d.athlete.lists.frequentOpponents}</h2>
      {/* a row opens the pair's head-to-head at their meetings; the name, the opponent */}
      <table className="w-full border-collapse text-[13px] sm:text-[14px]">
        <tbody>
          {frequent.map(({ contest: c, wins, losses }) => (
            <RowLink
              key={c.opponent_id}
              href={anchor(`/head-to-head?a=${athleteId}&b=${c.opponent_id}`, SECTION.meetings)}
              label={d.site.header.headToHead}
              className={ROW}
            >
              <td className={`px-2 sm:px-3 ${CELL}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <Flag ioc={c.opponent_country} />
                  <Link href={`/athletes/${c.opponent_id}`} className="font-medium text-ink truncate hover:underline">
                    {shortName(c.opponent_family_name, c.opponent_given_name)}
                  </Link>
                </div>
              </td>
              <td
                className={`px-2 text-right font-bold tabular-nums ${CELL} ${wins > losses ? "text-gain" : wins < losses ? "text-drop" : "text-ink"}`}
              >
                {wins}–{losses}
              </td>
              <td className={`${CHEVRON_CELL}`}>
                <RowChevron />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
      {frequent.length === 0 && <p className="py-6 text-[14px] text-muted">{d.athlete.lists.noRepeat}</p>}
    </div>
  );
}

// The tournaments with a published draw the athlete is in and whose outcome is still
// open: coming, or under way and still in; their chances of gold and of a medal. Out,
// or the medal decided: gone (the history has it). Nothing open: no section.
export function NextTournaments({ athleteId, chances, today }: { athleteId: number; chances: AthleteChance[]; today: string }) {
  const { d, f } = useI18n();
  if (chances.length === 0) return null;
  return (
    <div>
      <h2 className={H2}>{d.athlete.lists.liveAndUpcoming}</h2>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="h-9 bg-panel border-b border-rule text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted">
            <th className="w-[84px] sm:w-24 px-2 sm:px-3 text-left align-middle h-9 py-0">{d.athlete.lists.dates}</th>
            <th className="px-2 sm:px-3 text-left align-middle h-9 py-0">{d.athlete.lists.tournament}</th>
            <th className="hidden sm:table-cell w-16 px-3 text-right align-middle h-9 py-0">{d.athlete.lists.gold}</th>
            <th className="w-14 sm:w-16 px-2 sm:px-3 text-right align-middle h-9 py-0">{d.athlete.lists.medal}</th>
            <th className="w-8 sm:w-10 px-0 text-right align-middle h-9 py-0" />
          </tr>
        </thead>
        <tbody>
          {chances.map((c) => {
            const live = c.date_from <= today;
            const weight = WEIGHTS.find((w) => w.api === c.weight);
            return (
              // the weight's page at the athlete's row
              <RowLink
                key={`${c.competition_id}-${c.weight}`}
                href={`${tournamentPath(c.competition_id, c.weight)}#athlete-${athleteId}`}
                className="border-b border-rule"
              >
                <td className="h-10 px-2 sm:px-3 text-muted whitespace-nowrap">{f.dateRange(c.date_from, c.date_to)}</td>
                <td className="h-10 px-2 sm:px-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Flag ioc={c.country} />
                    <span className="truncate font-semibold text-ink">{shortCompetition(c.competition).replace(/\s\d{4}$/, "")}</span>
                    {weight && <span className="shrink-0 text-muted">{weight.label}</span>}
                    {live && (
                      <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-claret">
                        <span className="w-1.5 h-1.5 rounded-full bg-claret" />
                        {d.athlete.lists.live}
                      </span>
                    )}
                  </div>
                </td>
                {/* a phone: the medal only */}
                <td className="hidden sm:table-cell h-10 px-3 text-right text-ink">{f.formatChance(c.gold, 0)}</td>
                <td className="h-10 px-2 sm:px-3 text-right text-ink">{f.formatChance(c.medal, 0)}</td>
                <td className={CHEVRON_CELL}>
                  <RowChevron />
                </td>
              </RowLink>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
