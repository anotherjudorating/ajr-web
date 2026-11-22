"use client";

import Link from "@/components/Link";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useState } from "react";

import { Arrow } from "@/components/Icon";
import { pct } from "@/components/methodology/ContestSnap";
import { chanceSteps, type Player, ratingOf, SCALE, updateSteps } from "@/components/methodology/glicko";
import { signed } from "@/lib/format";

// The rating calculator: two athletes as the site keeps them (skill, RD), the chance
// before the contest, who won, and the calculation written out with these numbers:
// the chance and the new ratings. From a contest's page ("How ratings
// work") it opens with that contest's athletes as they were before it.

type Side = { name: string; skill: number; rd: number; volatility: number };
type Preset = { label: string; a: Side; b: Side; won: "a" | "b" | null; where?: ReactNode };

const V = 0.06;
const DEFAULT: Preset = {
  label: "Default",
  a: { name: "White", skill: 2100, rd: 70, volatility: V },
  b: { name: "Blue", skill: 1900, rd: 150, volatility: V },
  won: null,
};

// "?a=skill,rd,volatility&b=…&an=…&bn=…&won=a|b&contest=id": a contest's two athletes
// as they were before it (the contest page's link); without won and contest, two
// athletes as they are today (Head-to-head's link), the winner left to pick.
function fromQuery(query: URLSearchParams): Preset | null {
  const player = (key: string): Player | null => {
    const parts = (query.get(key) ?? "").split(",").map(Number);
    return parts.length === 3 && parts.every(Number.isFinite) ? { skill: parts[0], rd: parts[1], volatility: parts[2] } : null;
  };
  const a = player("a");
  const b = player("b");
  const given = query.get("won");
  const won = given === "a" || given === "b" ? given : null; // none: a meeting still to come (Head-to-head)
  if (!a || !b) return null;
  const contest = query.get("contest");
  const an = query.get("an") ?? "White";
  const bn = query.get("bn") ?? "Blue";
  return {
    label: "This contest",
    a: { ...a, name: an },
    b: { ...b, name: bn },
    won,
    where: contest ? (
      <>
        <Link href={`/contests/${contest}`} className="underline decoration-rule underline-offset-2 hover:decoration-ink">
          {an} v {bn}
        </Link>
        , as both were before it
      </>
    ) : (
      `${an} v ${bn}, as both ${won ? "were before it" : "are today"}`
    ),
  };
}

export function Calculator() {
  const query = useSearchParams();
  return <Calc key={query.toString()} given={fromQuery(query)} />;
}

const r1 = (v: number) => Math.round(v * 10) / 10; // the same on the server and the browser
const i = (v: number) => String(Math.round(v)).replace("-", "−");
const n = (v: number, digits = 2) => v.toFixed(digits).replace("-", "−");
// A slider in the site's style: a hairline track, a square ink handle, claret when held.
const RANGE = [
  "flex-1 min-w-0 h-4 appearance-none bg-transparent cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-ink focus-visible:outline-offset-2",
  "[&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:bg-rule",
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-ink",
  "hover:[&::-webkit-slider-thumb]:bg-claret active:[&::-webkit-slider-thumb]:bg-claret focus-visible:[&::-webkit-slider-thumb]:bg-claret",
  "[&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-rule",
  "[&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-ink",
  "hover:[&::-moz-range-thumb]:bg-claret active:[&::-moz-range-thumb]:bg-claret",
].join(" ");
const inner = (text: string) => (text.startsWith("−") ? `(${text})` : text);

function Calc({ given }: { given: Preset | null }) {
  const start = given ?? DEFAULT;
  const [a, setA] = useState<Side>(start.a);
  const [b, setB] = useState<Side>(start.b);
  const [won, setWon] = useState<"a" | "b" | null>(start.won);
  const [mathsFor, setMathsFor] = useState<"a" | "b">("a");
  const pa: Player = a;
  const pb: Player = b;
  const c = chanceSteps(pa, pb);
  const ua = won ? updateSteps(pa, pb, won === "a" ? 1 : 0) : null;
  const ub = won ? updateSteps(pb, pa, won === "b" ? 1 : 0) : null;

  return (
    <figure id="calc" className="my-6 border border-rule bg-panel/40 scroll-mt-32 lg:scroll-mt-24">
      <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-rule flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Rating calculator</span>
      </div>
      <div className="p-4 sm:p-5">
        {start.where && <p className="mb-4 text-[13px] text-muted">{start.where}</p>}

        {/* the two athletes and the chance between them */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <Athlete side={a} onChange={setA} align="left" />
          <Athlete side={b} onChange={setB} align="right" />
        </div>
        <div className="mt-4">
          <div className="flex items-end justify-between">
            <div className="font-serif text-[30px] sm:text-[36px] leading-none font-bold tabular-nums text-ink">{pct(c.chance)}</div>
            <div className="text-[12px] text-muted self-center">chance before the contest</div>
            <div className="font-serif text-[30px] sm:text-[36px] leading-none font-bold tabular-nums text-ink">{pct(1 - c.chance)}</div>
          </div>
          <div className="mt-2 h-3 w-full flex border border-ink overflow-hidden" aria-hidden>
            <div className={`h-full ${won === "a" ? "bg-gain" : won === "b" ? "bg-ink/25" : "bg-ink/70"}`} style={{ width: `${r1(c.chance * 100)}%` }} />
            <div className={`h-full flex-1 ${won === "b" ? "bg-gain" : won === "a" ? "bg-ink/25" : ""}`} />
          </div>
        </div>

        {/* who won */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5">
          {(["a", "b"] as const).map((side) => (
            <button
              key={side}
              type="button"
              onClick={() => setWon(side)}
              aria-pressed={won === side}
              className={`h-10 border text-[14px] font-semibold cursor-pointer transition-colors ${won === side ? "border-gain bg-gain text-paper" : "border-rule bg-paper text-ink hover:border-gain hover:text-gain"}`}
            >
              {(side === "a" ? a : b).name} won
            </button>
          ))}
        </div>

        {/* what it did: both ratings, before and after */}
        {won && (
          <div className="mt-5 border-t border-rule pt-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-5 tabular-nums">
              {(["a", "b"] as const).map((side) => {
                const me = side === "a" ? pa : pb;
                const after = side === "a" ? ua! : ub!;
                const change = Math.round(ratingOf(after.after)) - Math.round(ratingOf(me));
                return (
                  <div key={side} className={side === "b" ? "text-right" : ""}>
                    <div className="text-[12px] text-muted">{(side === "a" ? a : b).name}</div>
                    <div className={`font-serif text-[34px] sm:text-[42px] leading-10 font-bold ${change > 0 ? "text-gain" : change < 0 ? "text-drop" : "text-muted"}`}>
                      {change === 0 ? "±0" : signed(change)}
                    </div>
                    <div className="mt-1 text-[13px] text-muted">
                      {i(ratingOf(me))}
                      <Arrow />
                      <b className="text-ink">{i(ratingOf(after.after))}</b>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* the calculation, step by step */}
        <details className="mt-6 border-t border-rule pt-3 group">
          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center gap-3 font-serif text-[18px] font-bold text-ink hover:text-claret">
            The calculation, step by step, with these numbers
            <span className="ml-auto font-sans text-muted group-open:rotate-90 transition-transform" aria-hidden>
              ›
            </span>
          </summary>
        <div className="mt-4 space-y-5">
          <Step number={1} title="The chance before the contest">
            <p className="text-[14px]">
              Both ratings, the gap between them, softened by how uncertain both are.
            </p>
            <Line label="Ratings" formula={`${a.name} ${i(pa.skill)} − ${i(pa.rd)} = ${i(ratingOf(pa))}, ${b.name} ${i(pb.skill)} − ${i(pb.rd)} = ${i(ratingOf(pb))}`} value={`gap ${i(c.gap)}`} />
            <Line label="Both RDs" formula={`√(${i(pa.rd)}² + ${i(pb.rd)}²) = ${i(Math.hypot(pa.rd, pb.rd))}, which shrinks the gap by a factor g = ${n(c.g, 2)}`} value={`g ${n(c.g, 2)}`} />
            <Line label="Chance" formula={`1 / (1 + e^(−${n(c.g, 2)} × ${inner(i(c.gap))} / ${n(SCALE, 1)})) = ${pct(c.chance)}`} value={`${a.name} ${pct(c.chance)}`} big />
          </Step>

          {ua && ub && won ? (
            <>
              <Step number={2} title="The new ratings">
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  <After who={a.name} before={pa} after={ua.after} won={won === "a"} />
                  <After who={b.name} before={pb} after={ub.after} won={won === "b"} />
                </div>
              </Step>
              <details className="text-[13px] tabular-nums group/maths">
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center gap-2 font-semibold text-claret hover:underline">
                  Every step of the Glicko-2 maths
                  <span className="text-muted group-open/maths:rotate-90 transition-transform" aria-hidden>
                    ›
                  </span>
                </summary>
                <div className="mt-3 flex gap-2" role="group" aria-label="Whose maths">
                  {(["a", "b"] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => setMathsFor(side)}
                      aria-pressed={mathsFor === side}
                      className={`h-8 px-3 flex items-center gap-2 border text-[13px] font-semibold cursor-pointer ${mathsFor === side ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:border-ink"}`}
                    >
                      <span className={`w-[6px] h-4 shrink-0 border border-ink ${side === "a" ? "bg-paper" : "bg-oxford"}`} aria-hidden />
                      {(side === "a" ? a : b).name}
                    </button>
                  ))}
                </div>
                {mathsFor === "a" ? (
                  <Maths rival={b.name} me={pa} u={ua} score={won === "a" ? 1 : 0} />
                ) : (
                  <Maths rival={a.name} me={pb} u={ub} score={won === "b" ? 1 : 0} />
                )}
              </details>
            </>
          ) : (
            <p className="text-[14px] text-muted">Pick who won to see the new ratings.</p>
          )}
        </div>
        </details>
      </div>
    </figure>
  );
}

// An athlete's card: the name, the skill and the RD (editable), the rating they make.
function Athlete({ side, onChange, align }: { side: Side; onChange: (s: Side) => void; align: "left" | "right" }) {
  // the judogi as the site marks it: white on the left, blue on the right
  const judogi = align === "left" ? "bg-paper" : "bg-oxford";
  const right = align === "right";
  const field = (label: string, key: "skill" | "rd", min: number, max: number) => (
    <label className={`flex items-center gap-2 text-[12px] ${right ? "flex-row-reverse" : ""}`}>
      <span className="text-muted w-8">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={Math.round(side[key])}
        onChange={(e) => onChange({ ...side, [key]: Math.min(max, Math.max(min, Number(e.target.value) || min)) })}
        aria-label={`${side.name}: ${label}`}
        className={`w-[72px] h-8 px-2 border border-rule bg-paper tabular-nums font-semibold ${right ? "text-right" : ""}`}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={key === "rd" ? 5 : 10}
        value={Math.round(side[key])}
        onChange={(e) => onChange({ ...side, [key]: Number(e.target.value) })}
        className={RANGE}
        aria-label={`${side.name}: ${label}, slider`}
      />
    </label>
  );
  return (
    <div className={`border border-rule bg-paper p-3 min-w-0 ${right ? "text-right" : ""}`}>
      <div className={`flex items-center gap-2 ${right ? "flex-row-reverse" : ""}`}>
        <span className={`w-[6px] h-4 shrink-0 border border-ink ${judogi}`} aria-hidden />
        <input
          type="text"
          value={side.name}
          onChange={(e) => onChange({ ...side, name: e.target.value.slice(0, 24) || "?" })}
          className={`min-w-0 flex-1 h-8 px-1 -mx-1 border-b border-transparent hover:border-rule focus:border-ink bg-transparent font-semibold text-[15px] text-ink ${right ? "text-right" : ""}`}
          aria-label="Name"
        />
      </div>
      <div className="mt-2 space-y-1.5">
        {field("Skill", "skill", 1000, 3000)}
        {field("RD", "rd", 30, 350)}
      </div>
      <div className="mt-3 text-[12px] text-muted">
        Rating = skill − RD
      </div>
      <div className="font-serif text-[28px] leading-8 font-bold tabular-nums text-claret">{Math.round(ratingOf(side))}</div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-rule pt-3">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-serif text-[22px] font-bold text-claret tabular-nums">{number}</span>
        <h4 className="font-serif text-[18px] font-bold text-ink">{title}</h4>
      </div>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

// A line of the calculation: what it is, the formula with the numbers in, the result.
function Line({ label, formula, value, big = false }: { label: string; formula: string; value: string; big?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 items-baseline py-1 border-b border-rule/60 text-[13px]">
      <div className="min-w-0">
        <span className="text-muted">{label}</span> <span className="font-mono text-[12px] break-words tabular-nums">{formula}</span>
      </div>
      <div className={`text-right tabular-nums text-ink ${big ? "font-serif text-[18px] font-bold" : "font-semibold"}`}>{value}</div>
    </div>
  );
}

function After({ who, before, after, won }: { who: string; before: Player; after: Player; won: boolean }) {
  const d = (x: number, y: number) => {
    const v = Math.round(y) - Math.round(x);
    return <span className={`font-semibold ${v > 0 ? "text-gain" : v < 0 ? "text-drop" : "text-muted"}`}>{v === 0 ? "±0" : signed(v)}</span>;
  };
  const row = (label: string, x: number, y: number, bold = false) => (
    <div className="grid grid-cols-[48px_1fr_auto] gap-x-2 items-baseline py-1 border-b border-rule/60">
      <span className="text-muted">{label}</span>
      <span className={bold ? "font-bold" : ""}>
        {i(x)}
        <Arrow />
        {i(y)}
      </span>
      {d(x, y)}
    </div>
  );
  return (
    <div className="tabular-nums text-[13px]">
      <div className="font-semibold mt-1 flex items-center gap-2">
        {who}
        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border ${won ? "border-gain text-gain" : "border-rule text-muted"}`}>{won ? "Won" : "Lost"}</span>
      </div>
      {row("Skill", before.skill, after.skill)}
      {row("RD", before.rd, after.rd)}
      {row("Rating", ratingOf(before), ratingOf(after), true)}
    </div>
  );
}

// The paper's steps with these numbers, on Glicko-2's scale.
function Maths({ rival, me, u, score }: { rival: string; me: Player; u: ReturnType<typeof updateSteps>; score: number }) {
  return (
    <div className="mt-2">
      <Line label="Scale" formula={`μ = (${i(me.skill)} − 1500) / ${n(SCALE)},  φ = ${i(me.rd)} / ${n(SCALE)}`} value={`${n(u.mu, 3)}, ${n(u.phi, 3)}`} />
      <Line label={`${rival}`} formula={`μⱼ = ${n(u.muJ, 3)},  g(φⱼ) = 1 / √(1 + 3 × ${n(u.phiJ, 3)}² / π²)`} value={n(u.gJ, 3)} />
      <Line label="Expected" formula={`E = 1 / (1 + e^(−${n(u.gJ, 3)} × (${n(u.mu, 3)} − ${inner(n(u.muJ, 3))})))`} value={n(u.expected, 3)} />
      <Line label="Variance" formula={`v = 1 / (${n(u.gJ, 3)}² × ${n(u.expected, 3)} × ${n(1 - u.expected, 3)})`} value={n(u.v, 3)} />
      <Line label="Delta" formula={`Δ = ${n(u.v, 3)} × ${n(u.gJ, 3)} × (${score} − ${n(u.expected, 3)})`} value={n(u.delta, 3)} />
      <Line label="Volatility" formula="σ′: solved from Δ, v and τ = 0.5 (the paper's step 5)" value={n(u.sigma, 5)} />
      <Line label="RD, pre" formula={`φ* = √(${n(u.phi, 3)}² + ${n(u.sigma, 4)}²)`} value={n(u.phiStar, 3)} />
      <Line label="New RD" formula={`φ′ = 1 / √(1/${n(u.phiStar, 3)}² + 1/${n(u.v, 3)})`} value={n(u.newPhi, 3)} />
      <Line label="New skill" formula={`μ′ = ${n(u.mu, 3)} + ${n(u.newPhi, 3)}² × ${n(u.gJ, 3)} × (${score} − ${n(u.expected, 3)})`} value={n(u.newMu, 3)} />
      <Line label="Back" formula={`skill = 1500 + ${n(SCALE)} × ${n(u.newMu, 3)}, RD = ${n(SCALE)} × ${n(u.newPhi, 3)}`} value={`${i(u.after.skill)}, ${i(u.after.rd)}`} />
      <p className="mt-2 text-muted">
        Glicko-2:{" "}
        <a href="https://en.wikipedia.org/wiki/Glicko_rating_system" target="_blank" rel="noopener noreferrer" className="underline decoration-rule underline-offset-2 hover:decoration-ink">
          Wikipedia
        </a>
        ,{" "}
        <a href="http://www.glicko.net/glicko/glicko2.pdf" target="_blank" rel="noopener noreferrer" className="underline decoration-rule underline-offset-2 hover:decoration-ink">
          Mark Glickman&apos;s paper
        </a>
        .
      </p>
    </div>
  );
}

// What the next result would do, worked out by the same maths from the athlete's own
