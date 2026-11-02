"use client";

import { useState } from "react";

import { H2, HEAD } from "@/components/tournament/styles";
import type { CountryWeek } from "@/lib/api";
import { monthYear } from "@/lib/format";

const RANGES = { "1Y": 1, "4Y": 4, All: null } as const;
type Range = keyof typeof RANGES;
const POINTS = 9; // as in the prototype: 8 dots and today's
const STEPS = [5, 10, 25, 50, 100, 200, 500];

// Desktop and phone drawings: the plot's box in the viewBox, the font size and how
// many dates to write under it.
const LAYOUTS = [
  { className: "hidden sm:block", width: 1000, height: 260, left: 50, right: 940, top: 20, bottom: 226, font: 11, dates: POINTS },
  { className: "sm:hidden", width: 500, height: 300, left: 52, right: 444, top: 20, bottom: 266, font: 14, dates: 3 },
];

type Point = { day: string; rating: number };

// Nine points over the range, evenly in time: the latest week on or before each
// day, and today's rating last.
function sample(history: CountryWeek[], today: string, rating: number, years: number | null): Point[] {
  if (history.length === 0) return [{ day: today, rating }];
  const end = new Date(today).getTime();
  const earliest = new Date(history[0].day).getTime();
  const start = years === null ? earliest : Math.max(earliest, end - years * 365.25 * 86400e3);
  const points: Point[] = [];
  for (let i = 0; i < POINTS - 1; i++) {
    const at = start + ((end - start) * i) / (POINTS - 1);
    const week = history.findLast((w) => new Date(w.day).getTime() <= at);
    if (week) points.push({ day: new Date(at).toISOString().slice(0, 10), rating: week.rating });
  }
  return [...points, { day: today, rating }];
}

// Four steps of a round size that hold every point.
function scale(points: Point[]): number[] {
  const low = Math.min(...points.map((p) => p.rating));
  const high = Math.max(...points.map((p) => p.rating));
  const step = STEPS.find((s) => Math.ceil(high / s) * s - Math.floor(low / s) * s <= 4 * s) ?? 1000;
  const from = Math.floor(low / step) * step;
  return [0, 1, 2, 3, 4].map((i) => from + i * step);
}

// The nation's mixed rating over time, as on the country page of the prototype.
export function NationChart({ history, today, rating }: { history: CountryWeek[]; today: string; rating: number }) {
  const [range, setRange] = useState<Range>("4Y");
  const points = sample(history, today, rating, RANGES[range]);
  const ticks = scale(points);
  const first = points[0];
  const label = `Leaders rating average, ${monthYear(first.day)} to ${monthYear(today)}: ${first.rating} to ${rating}`;

  return (
    <section className="mt-14 lg:mt-16">
      <div className={HEAD}>
        <h2 className={H2}>Leaders rating avg</h2>
        <div className="flex items-center gap-4 text-[14px] shrink-0">
          {(Object.keys(RANGES) as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={r === range ? "font-bold text-claret border-b-2 border-claret pb-0.5" : "text-muted hover:text-ink cursor-pointer"}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      {LAYOUTS.map((l) => {
        const x = (i: number) => (points.length === 1 ? l.right : l.left + ((l.right - l.left) * i) / (points.length - 1));
        const y = (value: number) => l.bottom - ((value - ticks[0]) / (ticks[4] - ticks[0])) * (l.bottom - l.top);
        const labelled = points
          .map((p, i) => ({ p, i }))
          .filter(({ i }) => l.dates === POINTS || i % Math.ceil((points.length - 1) / (l.dates - 1)) === 0 || i === points.length - 1);
        const text = { fill: "currentColor", fontFamily: "var(--font-ibm-plex-sans), sans-serif", fontSize: l.font };
        return (
          <div key={l.width} className={`py-2 ${l.className}`}>
            <svg className="w-full h-auto overflow-visible block" viewBox={`0 0 ${l.width} ${l.height}`} role="img" aria-label={label}>
              <g stroke="#D6CFC2" strokeWidth="0.8">
                {ticks.map((t) => (
                  <line key={t} x1={l.left} x2={l.right} y1={y(t)} y2={y(t)} />
                ))}
              </g>
              <g className="text-muted" {...text} textAnchor="end">
                {ticks.map((t) => (
                  <text key={t} x={l.left - 8} y={y(t) + l.font * 0.35}>
                    {t}
                  </text>
                ))}
              </g>
              <polyline fill="none" points={points.map((p, i) => `${x(i)},${y(p.rating)}`).join(" ")} stroke="#33302E" strokeWidth="2.5" />
              <g fill="#33302E">
                {points.slice(0, -1).map((p, i) => (
                  <circle key={p.day} cx={x(i)} cy={y(p.rating)} r="4" />
                ))}
              </g>
              <circle cx={x(points.length - 1)} cy={y(rating)} fill="#990F3D" r="4" />
              <text x={x(points.length - 1) + 12} y={y(rating) + l.font * 0.3} className="text-ink" {...text} fontWeight="700">
                {rating}
              </text>
              <g className="text-muted" {...text} textAnchor="middle">
                {labelled.map(({ p, i }) => (
                  <text key={p.day} x={x(i)} y={l.height - 10}>
                    {monthYear(p.day)}
                  </text>
                ))}
              </g>
            </svg>
          </div>
        );
      })}
    </section>
  );
}
