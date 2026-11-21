"use client";

import { useState } from "react";

import { ContestView } from "@/components/contest/ContestView";
import type { ContestDetail, HistoryRow, UpcomingContest as Upcoming } from "@/lib/api";
import { chance, type Player, update } from "@/lib/glicko";

// A contest not fought yet: the contest page for the result picked (the favourite's at
// first), both ratings worked out in the browser from the ratings on the day.
export function UpcomingContest({ contest: u, whiteHistory, blueHistory }: { contest: Upcoming; whiteHistory: HistoryRow[]; blueHistory: HistoryRow[] }) {
  const white: Player = { skill: u.white_skill, rd: u.white_rd, volatility: u.white_volatility };
  const blue: Player = { skill: u.blue_skill, rd: u.blue_rd, volatility: u.blue_volatility };
  const whiteChance = chance(white, blue, u.rd_factor);
  const [winner, setWinner] = useState(whiteChance >= 0.5 ? u.white_id : u.blue_id);
  const whiteWon = winner === u.white_id ? 1 : 0;
  const whiteAfter = update(white, blue, whiteWon, u.tau);
  const blueAfter = update(blue, white, 1 - whiteWon, u.tau);
  const score = (p: Player) => Math.round(p.skill - u.rd_factor * p.rd);
  const side = (prefix: "white" | "blue", before: Player, after: Player, p: number) => ({
    [`${prefix}_place_before`]: null,
    [`${prefix}_ippon`]: null,
    [`${prefix}_waza`]: null,
    [`${prefix}_yuko`]: null,
    [`${prefix}_shido`]: 0,
    [`${prefix}_win_probability`]: p,
    [`${prefix}_rating_before`]: Math.round(before.skill),
    [`${prefix}_rating_after`]: Math.round(after.skill),
    [`${prefix}_rd_before`]: Math.round(before.rd),
    [`${prefix}_rd_after`]: Math.round(after.rd),
    [`${prefix}_score_before`]: score(before),
    [`${prefix}_score_after`]: score(after),
  });
  const contest = {
    ...u,
    duration: null,
    golden_score: null,
    walkover: null,
    winner_id: winner,
    ...side("white", white, whiteAfter, whiteChance),
    ...side("blue", blue, blueAfter, 1 - whiteChance),
  } as unknown as ContestDetail;
  return <ContestView contest={contest} whiteHistory={whiteHistory} blueHistory={blueHistory} upcoming={{ onPick: setWinner }} />;
}
