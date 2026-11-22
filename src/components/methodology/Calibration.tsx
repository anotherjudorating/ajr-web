"use client";

import Link from "@/components/Link";
import { useState } from "react";

import { ContestSnap } from "@/components/methodology/ContestSnap";
import { Figure } from "@/components/methodology/Figure";
import data from "@/data/methodology.json";

type Bin = { from: number; to: number; n: number; won: number };
const MODELS = { ours: "AJR", ijf: "IJF" } as const;
type Model = keyof typeof MODELS;
const CAL = data.calibration as Record<Model, Bin[]>;
const pct = (v: number) => `${Math.round(v * 100)}%`;
const event = (name: string) => name.replace(/^.* presents /, "").replace(/^OTP (Group|Bank) /, "");

// Does 70% mean 70%? Ten bands of the favourite's chance; for each, the promise (the
// band's middle, hollow) and what happened (the share the favourite won, filled).
// Honest chances put every filled bar at its hollow mark. Tap a band for its numbers.
export function Calibration() {
  const [model, setModel] = useState<Model>("ours");
  const [bin, setBin] = useState(4); // 70 to 75%
  const bins = CAL[model];
  const b = bins[bin].n ? bins[bin] : bins.find((x) => x.n)!;
  const share = b.won / b.n;
  return (
    <Figure
      title="Does 70% mean 70%?"
      caption={
        <>
          {data.benchmark.test.toLocaleString("en-US")} contests, July 2025 to November 2026, the favourite&apos;s chance in bands of 5%. The IJF rating gives points, not chances, its chance here comes from the points gap (
          <a
            href="#test-notes"
            onClick={() => {
              const notes = document.getElementById("test-notes");
              if (notes instanceof HTMLDetailsElement) notes.open = true;
            }}
            className="text-claret underline decoration-rule underline-offset-2 hover:decoration-claret"
          >
            the formula
          </a>
          ).
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        {(Object.keys(MODELS) as Model[]).map((m) => (
          <button key={m} type="button" onClick={() => setModel(m)} aria-pressed={model === m} className={`h-9 px-3 border font-semibold cursor-pointer ${model === m ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:border-ink"}`}>
            {MODELS[m]}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted">
        <span className="flex items-center gap-2">
          <span className="w-5 border-t-2 border-dashed border-ink" aria-hidden />
          the chance promised
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-ink/60" aria-hidden />
          how often the favourite won
        </span>
      </div>
      <div className="mt-4 relative pl-8">
        <div className="absolute left-0 top-0 h-40 w-7 text-[10px] text-muted tabular-nums" aria-hidden>
          {[1, 0.75, 0.5].map((v) => (
            <span key={v} className="absolute right-1 -translate-y-1/2" style={{ top: `${Math.round(((1 - v) / 0.6) * 100)}%` }}>
              {pct(v)}
            </span>
          ))}
        </div>
      <div className="grid grid-cols-10 gap-1 sm:gap-1.5 items-end h-40 border-l border-rule" role="img" aria-label="Promised chance against how often the favourite won, by band">
        {bins.map((x, k) => {
          const mid = (x.from + x.to) / 2;
          const won = x.n ? x.won / x.n : 0;
          const h = (v: number) => `${Math.round(((v - 0.4) / 0.6) * 100)}%`;
          const active = k === bin;
          return (
            <button key={k} type="button" onClick={() => setBin(k)} disabled={!x.n} className="relative h-full flex items-end justify-center cursor-pointer disabled:cursor-default group" aria-label={`${pct(x.from)} to ${pct(x.to)}`}>
              {x.n === 0 && (
                <span className="absolute bottom-1 text-[10px] text-muted [writing-mode:vertical-rl] rotate-180" title="No contest in the test had this chance">
                  never given
                </span>
              )}
              {x.n > 0 && (
                <>
                  <span className={`absolute bottom-0 w-[70%] ${active ? "bg-claret" : "bg-ink/60 group-hover:bg-ink"}`} style={{ height: h(won) }} />
                  <span className="absolute w-[70%] border-t-2 border-dashed border-ink" style={{ bottom: h(mid) }} />
                </>
              )}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-10 gap-1 text-[10px] sm:text-[11px] text-muted text-center tabular-nums">
        {bins.map((x, k) => (
          <span key={k} className={k === bin ? "text-claret font-semibold" : ""}>
            {Math.round(x.from * 100)}
          </span>
        ))}
      </div>
      </div>
      <p className="mt-3 text-[14px] tabular-nums">
        Promised {pct(b.from)} to {pct(b.to)}: the favourite won <b>{Math.round(share * 100)} in 100</b> ({b.won.toLocaleString("en-US")} of{" "}
        {b.n.toLocaleString("en-US")} contests).
        {model === "ijf" && b.from >= 0.75 && " A big points gap promises more than it delivers."}
        {model === "ijf" && b.from < 0.6 && " A small points gap means more than it says: the IJF rating is flat."}
      </p>

    </Figure>
  );
}

// A 95% favourite should still lose one contest in twenty, and does: the biggest of
// those upsets, as contests, each a link.
type Contest = { id: number; tournament: string; weight: string; blue: string; white: string; blueCountry: string | null; whiteCountry: string | null; ours: number; blueWon: boolean };
export function Upsets() {
  const upsets = data.stories.upsets as Contest[];
  return (
    <Figure title="Favourites of 95% or more who lost" caption="The winner first, with the chance AJR gave them.">
      <div className="divide-y divide-rule border-y border-rule bg-paper px-3">
        {upsets.slice(0, 6).map((c) => (
          <Link key={c.id} href={`/contests/${c.id}`} className="block hover:bg-panel/40">
            <ContestSnap
              compact
              left={{ name: c.blueWon ? c.blue : c.white, country: c.blueWon ? c.blueCountry : c.whiteCountry, chance: c.blueWon ? c.ours : 1 - c.ours }}
              right={{ name: c.blueWon ? c.white : c.blue, country: c.blueWon ? c.whiteCountry : c.blueCountry, chance: c.blueWon ? 1 - c.ours : c.ours }}
              leftWon
              where={`${event(c.tournament)}, ${c.weight.replace("-", "−")} kg`}
            />
          </Link>
        ))}
      </div>
    </Figure>
  );
}
