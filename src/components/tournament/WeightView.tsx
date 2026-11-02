import Link from "next/link";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { RowLink } from "@/components/RowLink";
import { gainOf, isMedal } from "@/components/tournament/Overview";
import { H2, HEAD, HEAD_CELL, ROW_CELL } from "@/components/tournament/styles";
import type { CompetitionContest, CompetitionResult } from "@/lib/api";
import { roundCode, shortName, signed } from "@/lib/format";

const PLACES: Record<string, string> = { gold: "1", silver: "2", bronze: "3", "5th": "5", "7th": "7" };

// One weight of a tournament: the podium, every athlete's result and the contests,
// from the final back to the first round.
export function WeightView({ results, contests }: { results: CompetitionResult[]; contests: CompetitionContest[] }) {
  const podium = results.filter(isMedal);
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

  return (
    <>
      {podium.length > 0 && (
        <div className="mt-10 lg:mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-14">
          {podium.map((r) => (
            <div key={r.athlete_id} className="flex flex-col min-w-0">
              <div className="flex items-center mb-2">
                <Medal kind={r.result as MedalKind} className="w-5 h-6" />
              </div>
              <Link
                href={`/athletes/${r.athlete_id}`}
                className="font-serif text-[16px] leading-[20px] font-semibold text-ink hover:underline truncate"
              >
                {shortName(r.family_name, r.given_name)}
              </Link>
              <div className="flex items-center gap-1.5 mt-1 text-[12px] leading-[16px] text-muted">
                <Flag ioc={r.country} />
                <span className="font-medium text-ink">{r.country}</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-[24px] leading-[28px] font-bold text-ink tabular-nums">{r.score_after}</span>
                <span className={`text-[14px] leading-[18px] font-bold tabular-nums ${gainOf(r) >= 0 ? "text-gain" : "text-drop"}`}>
                  {signed(gainOf(r))}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24 items-start">
        <section>
          <div className={HEAD}>
            <h2 className={H2}>Results</h2>
          </div>
          <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
            <thead>
              <tr className="bg-panel border-b border-rule">
                <th className={`${HEAD_CELL} text-left w-10 sm:w-12`}>#</th>
                <th className={`${HEAD_CELL} text-left`}>Athlete</th>
                <th className={`${HEAD_CELL} text-center w-12 sm:w-14`}>W–L</th>
                <th className={`${HEAD_CELL} text-right w-28 hidden sm:table-cell`}>Rating</th>
                <th className={`${HEAD_CELL} text-right w-14`}>+/−</th>
                <th className="w-6 h-9 py-0 pl-1 pr-0" />
              </tr>
            </thead>
            <tbody>
              {table.map((r) => (
                <RowLink key={r.athlete_id} href={`/athletes/${r.athlete_id}`} className="border-b border-rule hover:bg-panel/40">
                  <td className={`${ROW_CELL} text-muted`}>
                    {isMedal(r) ? <Medal kind={r.result as MedalKind} className="w-3.5 h-4" /> : (PLACES[r.result ?? ""] ?? roundCode(r.result))}
                  </td>
                  <td className={ROW_CELL}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Flag ioc={r.country} />
                      <span className="font-semibold truncate">{shortName(r.family_name, r.given_name)}</span>
                    </div>
                  </td>
                  <td className={`${ROW_CELL} text-center text-muted`}>
                    {r.wins}–{r.contests - r.wins}
                  </td>
                  <td className={`${ROW_CELL} text-right whitespace-nowrap text-muted hidden sm:table-cell`}>
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

        <section>
          <div className={HEAD}>
            <h2 className={H2}>Contests</h2>
          </div>
          <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
            <thead>
              <tr className="bg-panel border-b border-rule">
                <th className={`${HEAD_CELL} text-left w-12`}>Round</th>
                <th className={`${HEAD_CELL} text-left`}>Athletes</th>
                <th className={`${HEAD_CELL} text-right w-16 sm:w-20`}>Chance</th>
                <th className={`${HEAD_CELL} text-right w-12 sm:w-16`}>+/−</th>
                <th className="w-6 h-9 py-0 pl-1 pr-0" />
              </tr>
            </thead>
            <tbody>
              {rounds.flatMap(({ round, contests }) =>
                contests.map((c, i) => {
                  const sides = [
                    { id: c.white_id, family: c.white_family_name, given: c.white_given_name, country: c.white_country, chance: c.white_chance, change: c.white_score_after - c.white_score_before },
                    { id: c.blue_id, family: c.blue_family_name, given: c.blue_given_name, country: c.blue_country, chance: c.blue_chance, change: c.blue_score_after - c.blue_score_before },
                  ];
                  return (
                    <RowLink key={c.contest_id} href={`/contests/${c.contest_id}`} className="border-b border-rule hover:bg-panel/40">
                      <td className="px-2 sm:px-3 py-2 align-top text-muted">{i === 0 ? roundCode(round) : ""}</td>
                      <td className="px-2 sm:px-3 py-2 align-middle">
                        {sides.map((s) => (
                          <div key={s.id} className="flex items-center gap-1.5 min-w-0 h-6">
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
                      <td className="px-2 sm:px-3 py-2 align-middle text-right">
                        {sides.map((s) => (
                          <div key={s.id} className="h-6 leading-6 text-muted">
                            {c.real_fight ? `${Math.round(s.chance * 100)}%` : ""}
                          </div>
                        ))}
                      </td>
                      <td className="px-2 sm:px-3 py-2 align-middle text-right font-bold">
                        {sides.map((s) => (
                          <div key={s.id} className={`h-6 leading-6 ${s.change >= 0 ? "text-gain" : "text-drop"}`}>
                            {signed(s.change)}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 align-middle pl-1 pr-0 text-right text-muted">
                        <Icon size={18} name="chevron_right" className="align-middle" />
                      </td>
                    </RowLink>
                  );
                }),
              )}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
