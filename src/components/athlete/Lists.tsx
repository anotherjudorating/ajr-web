import Link from "next/link";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import type { HistoryRow } from "@/lib/api";
import { shortCompetition, shortName } from "@/lib/format";

const H2 = "font-serif text-[20px] sm:text-[24px] font-bold text-ink border-b-2 border-ink pb-2";
const ROW = "h-10 sm:h-11 border-b border-rule hover:bg-panel/40";
const CELL = "h-10 sm:h-11 py-0 align-middle";

// Best wins (the least likely ones) and toughest losses (the most likely wins lost).
export function Standouts({ contests }: { contests: HistoryRow[] }) {
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
      <ContestList title="Best wins" contests={bestWins} />
      <ContestList title="Toughest losses" contests={toughestLosses} />
    </section>
  );
}

function ContestList({ title, contests }: { title: string; contests: HistoryRow[] }) {
  return (
    <div>
      <h2 className={H2}>{title}</h2>
      <table className="w-full border-collapse text-[13px] sm:text-[14px]">
        <tbody>
          {contests.map((c) => (
            <tr key={c.contest_id} className={ROW}>
              <td className={`pr-2 ${CELL}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <Flag ioc={c.opponent_country} />
                  <Link href={`/athletes/${c.opponent_id}`} className="font-medium text-ink truncate hover:underline">
                    {shortName(c.opponent_family_name, c.opponent_given_name)}
                  </Link>
                </div>
              </td>
              <td className={`px-2 text-muted hidden sm:table-cell ${CELL}`}>{shortCompetition(c.competition)}</td>
              <td className={`px-2 text-right text-muted ${CELL}`}>{Math.round(c.win_probability * 100)}%</td>
              <td
                className={`px-2 text-right font-semibold text-ink tabular-nums ${CELL}`}
                title="Opponent's rating before the contest"
              >
                {c.opponent_score}
              </td>
              <td className={`pl-2 text-right text-muted w-6 ${CELL}`}>
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </tr>
          ))}
          {contests.length === 0 && (
            <tr className="h-10">
              <td className="text-[13px] text-muted">None yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// The five opponents met most often, with the athlete's wins and losses against them.
export function FrequentOpponents({ contests }: { contests: HistoryRow[] }) {
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
    <div>
      <h2 className={H2}>Frequent opponents</h2>
      <div>
        {frequent.map(({ contest: c, wins, losses }) => (
          <div
            key={c.opponent_id}
            className={`${ROW} flex items-center justify-between px-2 sm:px-3 text-[13px] sm:text-[14px] py-0`}
          >
            <div className="inline-flex items-center gap-2 min-w-0">
              <Flag ioc={c.opponent_country} />
              <Link href={`/athletes/${c.opponent_id}`} className="font-medium text-ink truncate hover:underline">
                {shortName(c.opponent_family_name, c.opponent_given_name)}
              </Link>
            </div>
            <div className="inline-flex items-center gap-3 shrink-0">
              <span
                className={`font-bold tabular-nums ${wins > losses ? "text-gain" : wins < losses ? "text-drop" : "text-ink"}`}
              >
                {wins}–{losses}
              </span>
              <Icon size={18} name="chevron_right" className="text-muted" />
            </div>
          </div>
        ))}
        {frequent.length === 0 && <p className="h-10 flex items-center text-[13px] text-muted">No repeat opponents yet.</p>}
      </div>
    </div>
  );
}

// Medal chances need the draws of coming tournaments, which the backend does not have yet.
export function NextTournaments() {
  return (
    <div>
      <h2 className={H2}>Next tournaments</h2>
      <table className="w-full border-collapse text-[13px] sm:text-[14px]">
        <thead>
          <tr className="h-9 bg-panel border-b border-rule text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted">
            <th className="w-[72px] sm:w-24 px-2 sm:px-3 text-left align-middle h-9 py-0">Dates</th>
            <th className="px-2 sm:px-3 text-left align-middle h-9 py-0">Tournament</th>
            <th className="w-12 sm:w-16 px-2 sm:px-3 text-right align-middle h-9 py-0">Gold</th>
            <th className="w-14 sm:w-16 px-2 sm:px-3 text-right align-middle h-9 py-0">Medal</th>
            <th className="w-6 sm:w-8 px-0 text-right align-middle h-9 py-0" />
          </tr>
        </thead>
      </table>
      <p className="mt-4 text-[12px] text-muted">Coming tournaments and medal chances will appear here.</p>
    </div>
  );
}
