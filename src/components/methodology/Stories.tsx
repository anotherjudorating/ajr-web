"use client";

// The stories kept from the prototype's second wave: the listing rule on one athlete,
// and the quiz (the data: ajr-backend benchmark/methodology_extras.py). The fog, the
// drawn comeback, the bracket, the #1 duel and the weight ladder are gone: the chart
// (SkillChart.tsx) shows time away and the weight moves; the rest is in the backlog.

import { useState } from "react";

import { Flag } from "@/components/Flag";
import { ContestSnap } from "@/components/methodology/ContestSnap";
import { Figure } from "@/components/methodology/Figure";
import data from "@/data/methodology.json";
import { formatDate } from "@/lib/format";

type Contest = {
  id: number;
  tournament: string;
  day: string;
  weight: string;
  round: string | null;
  blue: string;
  white: string;
  blueCountry: string | null;
  whiteCountry: string | null;
  ours: number;
  ijf: number;
  blueWon: boolean;
};
const S = data.stories as unknown as {
  quiz: Contest[];
  listing: { name: string; tournaments: { day: string; tournament: string; weight: string; rank: string }[] };
};
const event = (name: string) => name.replace(/^.* presents /, "").replace(/^OTP (Group|Bank) /, "");

// The listing rule on one athlete: the strip of where he fought.
export function ListingRule() {
  const t = S.listing.tournaments;
  return (
    <Figure title="Grigalashvili's leaderboard" caption="With fewer than three tournaments in any weight, the weight of his latest championships decides: −81 kg.">
      <ol className="relative border-l-2 border-rule ml-2 text-[13px]">
        {t.map((x) => {
          const major = /Championships|Olympic/.test(x.rank);
          return (
            <li key={x.day + x.tournament} className="ml-4 py-1.5">
              <span className={`absolute -left-[7px] mt-1 w-3 h-3 rounded-full ${major ? "bg-claret" : "bg-paper border-2 border-muted"}`} />
              <span className="text-muted tabular-nums w-24 inline-block">{formatDate(x.day)}</span>
              <b className="w-16 inline-block">{x.weight.replace("-", "−")} kg</b>
              {event(x.tournament)} {major && <span className="text-claret text-[11px] font-semibold uppercase">championships</span>}
            </li>
          );
        })}
      </ol>
    </Figure>
  );
}

// Beat the model: ten contests, you pick, then our chance and the IJF's.
export function BeatTheModel() {
  const [picks, setPicks] = useState<Record<number, boolean>>({});
  const done = S.quiz.filter((c) => c.id in picks);
  const score = (who: "you" | "ours" | "ijf") =>
    done.filter((c) => (who === "you" ? picks[c.id] : who === "ours" ? c.ours > 0.5 : c.ijf > 0.5) === c.blueWon).length;
  return (
    <div className="p-4 sm:p-5">
      <p className="mb-3 text-[14px]">Ten contests between Olympic and world medallists since July 2025. Tap who you think won, then the AJR and IJF chances, and the result.</p>
      <ol className="space-y-2">
        {S.quiz.map((c) => {
          const picked = c.id in picks;
          const right = picks[c.id] === c.blueWon;
          return (
            <li key={c.id} className="border border-rule bg-paper p-3 text-[13px]">
              <div className="text-muted text-[12px]">
                {event(c.tournament)}, {c.weight.replace("-", "−")} kg
              </div>
              {picked ? (
                <>
                  <div className={`mt-1 text-[12px] font-semibold uppercase tracking-wider ${right ? "text-gain" : "text-claret"}`}>{right ? "You were right" : "You were wrong"}</div>
                  <div className="mt-1">
                    <ContestSnap compact left={{ name: c.blue, country: c.blueCountry, chance: c.ours }} right={{ name: c.white, country: c.whiteCountry, chance: 1 - c.ours }} leftWon={c.blueWon} />
                  </div>
                  <div className="text-[12px] text-muted tabular-nums">
                    IJF: {Math.round(c.ijf * 100)}% : {Math.round((1 - c.ijf) * 100)}%
                  </div>
                </>
              ) : (
                <div className="mt-2 flex gap-2">
                  {([true, false] as const).map((blue) => (
                    <button key={String(blue)} type="button" onClick={() => setPicks({ ...picks, [c.id]: blue })} className="flex-1 min-w-0 h-10 px-2 border border-rule hover:border-ink cursor-pointer text-left font-semibold flex items-center gap-1.5">
                      <Flag ioc={blue ? c.blueCountry : c.whiteCountry} />
                      <span className="truncate">{blue ? c.blue : c.white}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-3 border border-ink bg-paper px-3 py-2 text-[14px] tabular-nums flex gap-5">
        <span>
          You <b>{score("you")}</b>
        </span>
        <span className="text-claret">
          AJR <b>{score("ours")}</b>
        </span>
        <span className="text-muted">
          IJF <b>{score("ijf")}</b>
        </span>
        <span className="ml-auto text-muted">
          {done.length} of {S.quiz.length}
        </span>
      </div>
    </div>
  );
}
