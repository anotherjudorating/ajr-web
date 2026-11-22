"use client";

import { useState } from "react";

import { ContestSnap } from "@/components/methodology/ContestSnap";
import { type Player, ratingOf, update } from "@/components/methodology/glicko";
import { signed } from "@/lib/format";
import { Figure } from "@/components/methodology/Figure";
import { PARIS, parisPlay } from "@/components/methodology/facts";
import data from "@/data/methodology.json";
import type { Dict } from "@/i18n/en";
import { useI18n } from "@/i18n/client";

// PROTOTYPE of the methodology's first chapter, why the rating exists: the numbers are
// the bench's (a copy of production, rating = skill − RD) of 11 November 2026; the WRL
// points are the SOR 2025's table (docs/methodology/2026-11-06-design.md, section 2).

const STEP = "text-[13px] tabular-nums";

// The contest that should have been a final, and what it did to both; "What if Abe
// had won": the same maths with the other result.
export function ParisDraw() {
  const { d } = useI18n();
  const s = d.methodology.paris;
  const { abe: a, keldiyorova: k } = PARIS;
  return (
    <Figure title={s.title} caption={s.caption}>
      <ContestSnap
        left={{ name: a.name, country: a.country, chance: PARIS.abeChance, note: s.abeNote }}
        right={{ name: k.name, country: k.country, chance: 1 - PARIS.abeChance, note: s.keldiyorovaNote }}
        leftWon={false}
        href={`/contests/${PARIS.contest}`}
      />
    </Figure>
  );
}

// What the contest did to both, and what the other result would have done: the real
// formula, both ways.
export function ParisWhatIf() {
  const { d, t } = useI18n();
  const s = d.methodology.whatIf;
  const labels = d.methodology.labels;
  const { abe: a, keldiyorova: k } = PARIS;
  const [abeWon, setAbeWon] = useState(false);
  const ua = update(a, k, abeWon ? 1 : 0);
  const uk = update(k, a, abeWon ? 0 : 1);
  const table = (name: string, before: Player, after: Player) => (
    <table className={`w-full ${STEP} border-collapse`}>
      <thead>
        <tr className="border-b border-ink text-left">
          <th className="py-1 pr-3 font-semibold">{name}</th>
          <th className="py-1 px-2 text-right font-normal text-muted">{s.before}</th>
          <th className="py-1 px-2 text-right font-normal text-muted">{s.after}</th>
          <th className="py-1 pl-2 text-right font-normal text-muted" />
        </tr>
      </thead>
      <tbody>
        {([["skill", before.skill, after.skill], ["rd", before.rd, after.rd], ["rating", ratingOf(before), ratingOf(after)]] as const).map(([key, x, y]) => {
          const diff = Math.round(y) - Math.round(x);
          return (
            <tr key={key} className="border-b border-rule">
              <td className="py-1.5 pr-3 text-muted">{labels[key]}</td>
              <td className="py-1.5 px-2 text-right">{Math.round(x)}</td>
              <td className={`py-1.5 px-2 text-right ${key === "rating" ? "font-bold" : "font-semibold"}`}>{Math.round(y)}</td>
              <td className={`py-1.5 pl-2 text-right font-semibold ${diff > 0 ? "text-gain" : diff < 0 ? "text-drop" : "text-muted"}`}>{diff === 0 ? "±0" : signed(diff)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  return (
    <div className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        <span className="text-muted">{s.result}</span>
        {[false, true].map((w) => (
          <button key={String(w)} type="button" onClick={() => setAbeWon(w)} aria-pressed={abeWon === w} className={`h-9 px-3 border font-semibold cursor-pointer ${abeWon === w ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:border-ink"}`}>
            {w ? s.abeWon : s.keldiyorovaWon}
          </button>
        ))}
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        {table(a.name, a, ua)}
        {table(k.name, k, uk)}
      </div>
      <p className={`mt-3 ${STEP} text-muted`}>
        {abeWon ? s.expected : t(s.surprise, { rd: Math.round(a.rd) })}{" "}
        <a href={parisPlay()} className="font-semibold text-claret hover:underline">
          {s.everyStep}
        </a>
      </p>
    </div>
  );
}

// Who the number 1 was, and whether they won: every weight of every tournament the
// IJF's weekly lists cover (from 17 March 2025 to 16 November 2026, judobase's archive),
// with eight entrants or more and at least four of them on the list. The IJF's number 1:
// the most points on the latest list before the event, among the entrants; ours: the
// highest rating on the eve. Counted on 17 November 2026 (ajr-backend benchmark data and
// production, read-only); the mixed team events and the multi-sport games (the
// Commonwealth, the Mediterranean and others) left out. `key`: the row's name in the
// dictionary (methodology.numberOne.rows).
type NumberOneRow = { key: keyof Dict["methodology"]["numberOne"]["rows"]; weights: number; ijf: number; ours: number };
const NUMBER_ONE: NumberOneRow[] = [
  { key: "worlds", weights: 28, ijf: 6, ours: 15 },
  { key: "grandSlams", weights: 210, ijf: 58, ours: 77 },
  { key: "grandPrix", weights: 111, ijf: 29, ours: 39 },
  { key: "continentals", weights: 166, ijf: 68, ours: 81 },
  { key: "opens", weights: 428, ijf: 136, ours: 166 },
  { key: "europeanCups", weights: 148, ijf: 44, ours: 43 },
];
const TOTAL = NUMBER_ONE.reduce((t, r) => ({ weights: t.weights + r.weights, ijf: t.ijf + r.ijf, ours: t.ours + r.ours }), { weights: 0, ijf: 0, ours: 0 });

export function NumberOneTable() {
  const { d } = useI18n();
  const s = d.methodology.numberOne;
  const pct = (n: number, of: number) => `${Math.round((n / of) * 100)}%`;
  const cell = "py-1.5 px-2 text-right tabular-nums";
  return (
    <Figure
      title={s.title}
      caption={s.caption}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] sm:text-[14px] border-collapse">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th className="py-2 pr-2 font-semibold">{s.tournaments}</th>
              <th className="py-2 px-2 font-semibold text-right">{s.ijf}</th>
              <th className="py-2 pl-2 font-semibold text-right text-claret">{s.ajr}</th>
            </tr>
          </thead>
          <tbody>
            {NUMBER_ONE.map((r) => (
              <tr key={r.key} className="border-b border-rule">
                <td className="py-1.5 pr-2">{s.rows[r.key]}</td>
                <td className={`${cell} ${r.ijf > r.ours ? "font-semibold" : ""}`}>
                  {r.ijf} <span className="text-muted text-[12px]">{pct(r.ijf, r.weights)}</span>
                </td>
                <td className={`${cell} pr-0 text-claret ${r.ours > r.ijf ? "font-semibold" : ""}`}>
                  {r.ours} <span className="text-[12px] opacity-70">{pct(r.ours, r.weights)}</span>
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-ink font-semibold">
              <td className="py-2 pr-2">{s.all}</td>
              <td className={cell}>
                {TOTAL.ijf} <span className="text-muted text-[12px] font-normal">{pct(TOTAL.ijf, TOTAL.weights)}</span>
              </td>
              <td className={`${cell} pr-0 text-claret`}>
                {TOTAL.ours} <span className="text-[12px] font-normal opacity-70">{pct(TOTAL.ours, TOTAL.weights)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Figure>
  );
}

// One tournament, contest by contest: the AJR chance, the rating's change, and the total
// against the IJF's points (two units, two scales: never one bar for both).
type Bout = { round: string; opponent: string; country: string; chance: number; change: number; won: boolean };
function Day({ name, country, event, bouts, points }: { name: string; country: string; event: string; bouts: Bout[]; points: number }) {
  const { d, f, t } = useI18n();
  const s = d.methodology.day;
  const total = bouts.reduce((t, b) => t + b.change, 0);
  return (
    <div>
      <div className="font-semibold">{event}</div>
      <div className="mt-2 divide-y divide-rule border-y border-rule bg-paper px-3">
        {bouts.map((b) => (
          <ContestSnap
            key={b.round}
            compact
            left={{ name, country, chance: b.chance }}
            right={{ name: b.opponent, country: b.country, chance: 1 - b.chance }}
            leftWon={b.won}
            where={t(s.where, { round: b.round === "Final" ? d.common.rounds.F : b.round, change: `${b.change > 0 ? "+" : b.change < 0 ? "−" : "±"}${Math.abs(b.change)}` })}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 tabular-nums">
        <div className="border border-claret bg-paper px-3 py-2">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">{s.ajrPoints}</div>
          <div className="font-serif text-[26px] font-bold text-claret">{total > 0 ? "+" : "−"}{Math.abs(total)}</div>
        </div>
        <div className="border border-ink bg-paper px-3 py-2">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">{s.ijfPoints}</div>
          <div className="font-serif text-[26px] font-bold text-ink">+{f.number(points)}</div>
        </div>
      </div>
    </div>
  );
}

// Yangiboyev's first two Grand Slams: the same round both times, the same 160 IJF points
// (the weekly lists of 2026, weeks 13 and 19), and two very different opponents.
export function PointsOrStrength() {
  const { d } = useI18n();
  const s = d.methodology.pointsOrStrength;
  return (
    <Figure title={s.title} caption={s.caption}>
      <div className="space-y-8">
        <Day
          name="Yangiboyev B."
          country="UZB"
          event={s.tbilisi}
          points={160}
          bouts={[
            { round: "1/16", opponent: "Turluev A.", country: "RUS", chance: 0.04, change: 565, won: true },
            { round: "1/8", opponent: "Svidrak M.", country: "UKR", chance: 0.326, change: -103, won: false },
          ]}
        />
        <Day
          name="Yangiboyev B."
          country="UZB"
          event={s.dushanbe}
          points={160}
          bouts={[
            { round: "1/16", opponent: "Parchiev A.", country: "RUS", chance: 0.827, change: 59, won: true },
            { round: "1/8", opponent: "Musoev S.", country: "TJK", chance: 0.226, change: -28, won: false },
          ]}
        />
      </div>
    </Figure>
  );
}

// How sure a chance is, from the test: how often favourites of each band won.
export function ReadingChances() {
  const { d, t } = useI18n();
  const s = d.methodology.readingChances;
  const bands: [number, number, string][] = [
    [0.5, 0.6, s.coin],
    [0.6, 0.75, s.oftenBeaten],
    [0.75, 0.9, s.clear],
    [0.9, 1, s.heavy],
  ];
  const won = (from: number, to: number) => {
    const bins = data.calibration.ours.filter((b) => b.from >= from - 1e-9 && b.to <= to + 1e-9);
    const n = bins.reduce((t, b) => t + b.n, 0);
    return Math.round((bins.reduce((t, b) => t + b.won, 0) / n) * 100);
  };
  return (
    <div className="my-5 border border-rule bg-paper">
      <div className="px-3 py-2 border-b border-rule text-[11px] font-semibold uppercase tracking-wider text-muted">{s.title}</div>
      <ul className="divide-y divide-rule px-3 text-[14px] tabular-nums">
        {bands.map(([from, to, words]) => (
          <li key={from} className="py-2 grid grid-cols-[80px_1fr_auto] gap-3 items-baseline">
            <b>
              {t(s.band, { from: Math.round(from * 100), to: Math.round(to * 100) })}
            </b>
            <span className="text-muted">{words}</span>
            <span>{t(s.wonInHundred, { n: won(from, to) })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Two golds of IJF events: an expected one that pays the most points, an unexpected one
// that pays a tenth (the weekly lists: Buchard's gold in week 19 of 2025, Turluev's
// +100 in week 8 of 2026).
export function TwoGolds() {
  const { d } = useI18n();
  const s = d.methodology.twoGolds;
  return (
    <Figure title={s.title} caption={s.caption}>
      <div className="space-y-8">
        <Day
          name="Buchard A."
          country="FRA"
          event={s.buchard}
          points={1000}
          bouts={[
            { round: "1/8", opponent: "Tursunboeva F.", country: "UZB", chance: 0.995, change: 0, won: true },
            { round: "1/4", opponent: "Nugaeva L.", country: "RUS", chance: 0.989, change: 1, won: true },
            { round: "1/2", opponent: "Jiang X.", country: "CHN", chance: 0.951, change: 6, won: true },
            { round: "Final", opponent: "Akhmatova M.", country: "UZB", chance: 0.961, change: 5, won: true },
          ]}
        />
        <Day
          name="Turluev A."
          country="RUS"
          event={s.turluev}
          points={100}
          bouts={[
            { round: "1/16", opponent: "Koc M.", country: "TUR", chance: 0.079, change: 506, won: true },
            { round: "1/8", opponent: "Tsurkan I.", country: "SLO", chance: 0.448, change: 172, won: true },
            { round: "1/4", opponent: "Ba M.", country: "ESP", chance: 0.651, change: 75, won: true },
            { round: "1/2", opponent: "Rodriguez D.", country: "USA", chance: 0.606, change: 71, won: true },
            { round: "Final", opponent: "Bonferroni A.", country: "SUI", chance: 0.616, change: 61, won: true },
          ]}
        />
      </div>
    </Figure>
  );
}

// Which leaderboard an athlete stands on, by example: the rule of ajr/rating/ranking.py
// (listed_weights), three tournaments in a weight in the last 365 days first. Each
// tournament is a dot in its weight's row, the championships a ring. `board`: the weight
// listed, both, or none; `why`: the reason's name in the dictionary (methodology.tableRule.why).
type Case = { at81: number; at90: number; worlds?: "-81" | "-90"; board: "-81" | "-90" | "both" | "none"; why: keyof Dict["methodology"]["tableRule"]["why"] };
const TABLE_RULE: Case[] = [
  { at81: 5, at90: 0, board: "-81", why: "three81" },
  { at81: 4, at90: 3, board: "both", why: "threeBoth" },
  { at81: 4, at90: 2, worlds: "-90", board: "-81", why: "three81Only" },
  { at81: 2, at90: 1, worlds: "-90", board: "-90", why: "championships" },
  { at81: 2, at90: 1, board: "-81", why: "most" },
  { at81: 0, at90: 0, board: "none", why: "none" },
];

function Dots({ n, ring }: { n: number; ring: boolean }) {
  const { d, t } = useI18n();
  return (
    <span className="flex items-center gap-1" aria-label={t(ring ? d.methodology.tableRule.dotsWorlds : d.methodology.tableRule.dots, { n })}>
      {Array.from({ length: n }, (_, k) =>
        ring && k === n - 1 ? (
          <span key={k} className="w-2.5 h-2.5 rounded-full border-2 border-claret" />
        ) : (
          <span key={k} className="w-2.5 h-2.5 rounded-full bg-ink/70" />
        ),
      )}
      {n === 0 && <span className="text-muted">–</span>}
    </span>
  );
}

export function TableRule() {
  const { d, t } = useI18n();
  const s = d.methodology.tableRule;
  const kg = (weight: string) => t(d.methodology.weightKg, { weight: weight.replace("-", "−") });
  const board = (c: Case) => (c.board === "both" ? s.bothWeights : c.board === "none" ? s.none : kg(c.board));
  return (
    <Figure title={s.title} caption={s.caption}>
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-ink/70" aria-hidden />{s.aTournament}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-claret" aria-hidden />
          {s.theWorlds}
        </span>
      </div>
      <ol className="divide-y divide-rule border-y border-rule">
        {TABLE_RULE.map((c, k) => (
          <li key={k} className="py-3 grid grid-cols-[124px_1fr] gap-x-4 items-center">
            <div className="grid grid-cols-[44px_1fr] gap-x-2 gap-y-1 items-center text-[12px] text-muted tabular-nums">
              <span>{kg("-81")}</span>
              <Dots n={c.at81} ring={c.worlds === "-81"} />
              <span>{kg("-90")}</span>
              <Dots n={c.at90} ring={c.worlds === "-90"} />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-claret text-[14px]">{board(c)}</div>
              <div className="text-[13px] text-muted leading-snug">{s.why[c.why]}</div>
            </div>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
