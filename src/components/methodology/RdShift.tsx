"use client";

import { useState } from "react";

import { Figure } from "@/components/methodology/Figure";
import data from "@/data/methodology.json";

const METRICS = data.rdShift.metrics;
const DEBUT = data.stories.debut;

const W = 320;
const H = 130;
const L = 36;
const R = W - 10;
const T = 12;
const B = H - 24;
const LL = METRICS.map((m) => m.logLoss);
const LOW = Math.min(...LL);
const HIGH = Math.max(...LL);
const round = (v: number) => Math.round(v * 10) / 10; // the same on the server and the browser
const cx = (n: number) => round(L + (n / 5) * (R - L));
const cy = (v: number) => round(B - ((v - LOW) / (HIGH - LOW)) * (B - T));

// Why skill − 1 RD: slide n in "rating = skill − n × RD" and watch two athletes
// change places and the chances' accuracy change. At n = 0 a debutant's one big win
// ranks him above a proven regular; at n = 3 (our tables until November 2026) the
// regulars are favoured too hard; n = 1 predicts best.
export function RdShift() {
  const [n, setN] = useState(1);
  const m = METRICS.find((x) => x.n === n) ?? METRICS[2];
  const people = [
    { name: DEBUT.name, note: `debut: beat ${DEBUT.beat} (skill ${DEBUT.beatSkill})`, skill: DEBUT.skill, rd: DEBUT.rd },
    { name: DEBUT.regular.name, note: "dozens of contests", skill: DEBUT.regular.skill, rd: DEBUT.regular.rd },
  ].map((p) => ({ ...p, rating: Math.round(p.skill - n * p.rd) }));
  const order = [...people].sort((a, b) => b.rating - a.rating);
  return (
    <Figure
      title="Rating = skill − n × RD"
      caption="A debutant and a regular of May 2026 at each n, and how well each n predicted the test contests."
    >
      <div className="flex items-center gap-2" role="group" aria-label="n">
        <span className="mr-1 text-[13px] font-semibold text-muted">n =</span>
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setN(v)}
            aria-pressed={n === v}
            className={`h-8 w-10 border text-[14px] font-semibold cursor-pointer tabular-nums ${n === v ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:border-ink"}`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-6 items-start">
        <ol className="space-y-2 tabular-nums">
          {order.map((p, k) => (
            <li key={p.name} className="border border-rule bg-paper p-3 flex items-center gap-3 transition-transform">
              <span className="font-serif text-[22px] font-bold text-muted w-5">{k + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-[12px] text-muted">{p.note}</div>
                <div className="mt-1 text-[12px] text-muted">
                  {p.skill} − {n} × {p.rd}
                </div>
              </div>
              <div className="font-serif text-[24px] font-bold text-claret">{p.rating}</div>
            </li>
          ))}
        </ol>
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Log loss ${m.logLoss} at n = ${n}`}>
            <polyline points={METRICS.map((x) => `${cx(x.n)},${cy(x.logLoss)}`).join(" ")} fill="none" stroke="#33302E" strokeWidth="2" />
            <circle cx={cx(n)} cy={cy(m.logLoss)} r="5" fill="#990f3d" />
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <text key={v} x={cx(v)} y={H - 6} textAnchor="middle" fontSize="11" fill="#66605C">
                {v}
              </text>
            ))}
            <text x={L - 4} y={T + 8} textAnchor="end" fontSize="10" fill="#66605C">worse</text>
            <text x={L - 4} y={B} textAnchor="end" fontSize="10" fill="#66605C">better</text>
          </svg>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-center tabular-nums">
            {[
              ["Accuracy", `${(m.accuracy * 100).toFixed(1)}%`],
              ["Log loss", m.logLoss.toFixed(3)],
            ].map(([label, value]) => (
              <div key={label} className="border border-rule bg-paper py-2">
                <dt className="text-[10px] uppercase tracking-wider font-semibold text-muted">{label}</dt>
                <dd className="font-serif text-[20px] font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Figure>
  );
}
