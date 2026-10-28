"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { changeText, ijfDifference } from "@/components/rankings/Changes";
import type { HistoryRow, LeaderboardRow } from "@/lib/api";
import { fetchAthleteHistory } from "@/lib/browser-api";
import { roundCode, shortDate, shortName, signed } from "@/lib/format";

const DAY = 24 * 60 * 60 * 1000;

// The expanded row: IJF place, the change over 90 days and the contests behind it,
// grouped by tournament. The contests are loaded when the row is first opened.
export function AthletePanel({ row, asOf }: { row: LeaderboardRow; asOf: string }) {
  const [history, setHistory] = useState<HistoryRow[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchAthleteHistory(row.athlete_id).then(setHistory, () => setFailed(true));
  }, [row.athlete_id]);

  const change = changeText(row.score_change_90d);
  const end = new Date(asOf).getTime();
  const recent = (history ?? []).filter((contest) => {
    const day = new Date(contest.fought_on).getTime();
    return day <= end && day > end - 90 * DAY;
  });

  // Tournaments latest first; contests inside in the order they were fought.
  const groups: { id: number; name: string; date: string; contests: HistoryRow[] }[] = [];
  for (const contest of recent) {
    let group = groups.find((g) => g.id === contest.competition_id);
    if (!group) {
      group = { id: contest.competition_id, name: contest.competition, date: contest.fought_on, contests: [] };
      groups.push(group);
    }
    group.contests.unshift(contest);
    if (contest.fought_on < group.date) group.date = contest.fought_on;
  }

  return (
    <div className="bg-panel border-t border-rule border-l-[3px] border-l-claret p-3 sm:p-4 my-0 w-full overflow-hidden">
      {row.wrl_place !== null && (
        <div className="flex items-center gap-1.5 text-[13px] mb-3">
          <span className="text-muted">IJF World Ranking</span>
          <span className="font-semibold text-ink">#{row.wrl_place}</span>
          <span className="text-[12px] text-muted">{ijfDifference(row.place, row.wrl_place)}</span>
        </div>
      )}
      <div className="flex items-baseline gap-2 mb-2">
        <h2 className="font-serif text-[16px] leading-[20px] text-ink font-semibold">Last 90 days</h2>
        <span className={`text-[14px] font-bold tabular-nums ${change.color}`}>{change.text}</span>
      </div>

      {failed && <p className="text-[13px] text-muted">Could not load the contests.</p>}
      {history === null && !failed && <p className="text-[13px] text-muted">Loading…</p>}
      {history !== null && groups.length === 0 && (
        <p className="text-[13px] text-muted">No contests in the last 90 days.</p>
      )}

      {groups.map((group) => (
        <div key={group.id}>
          <div className="flex justify-between items-baseline mt-3 pb-1 border-b border-rule sm:max-w-[560px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{group.name}</span>
            <span className="text-[12px] text-muted">{shortDate(group.date)}</span>
          </div>
          <div className="flex flex-col text-[13px] w-full sm:max-w-[560px]">
            {group.contests.map((contest) => {
              const chance = Math.round(contest.win_probability * 100);
              const delta = contest.rating_after - contest.rating_before;
              const result = contest.won ? "text-gain" : "text-drop";
              // Only upsets stand out: a win of a clear underdog, a loss of a clear favourite.
              const upset = contest.won ? chance <= 35 : chance >= 65;
              const upsetColor = contest.won ? "text-gain border-gain" : "text-drop border-drop";
              return (
                <div
                  key={contest.contest_id}
                  className="border-b border-rule/60 last:border-b-0 py-1.5 flex items-center justify-between gap-1.5"
                >
                  <span className="w-10 text-muted shrink-0">{roundCode(contest.round)}</span>
                  <div className="inline-flex items-center gap-1.5 min-w-0 flex-1 truncate">
                    <Flag ioc={contest.opponent_country} />
                    <Link
                      href={`/athletes/${contest.opponent_id}`}
                      className="truncate font-medium text-ink hover:underline"
                    >
                      {shortName(contest.opponent_family_name, contest.opponent_given_name)}
                    </Link>
                  </div>
                  <span
                    className={`w-24 shrink-0 inline-flex items-center justify-end gap-3 tabular-nums ${upset ? `${upsetColor} font-semibold` : "text-ink"}`}
                  >
                    {upset && (
                      <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-[0.05em] px-1 py-0.5 border leading-none">
                        Upset
                      </span>
                    )}
                    {chance}%
                  </span>
                  <span className={`w-6 text-center font-bold shrink-0 ${result}`}>{contest.won ? "W" : "L"}</span>
                  <span className={`w-10 text-right font-bold shrink-0 tabular-nums ${result}`}>{signed(delta)}</span>
                  <Icon size={18} name="chevron_right" className="text-muted shrink-0 -mr-1" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
