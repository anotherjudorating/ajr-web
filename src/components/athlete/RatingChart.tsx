"use client";

import { useEffect, useRef, useState } from "react";

import type { Athlete, HistoryRow } from "@/lib/api";
import { monthYear } from "@/lib/format";

// Where things go on the canvas. From md up, the prototype's chart: a 1000×280 canvas
// scaled to the page (the plot from x 75 to 860, grid from 50, y 25 to 225). Scaled
// down to a phone its text would be 5px, so below md the canvas is the chart's real
// width in pixels, with fewer dates and a narrow column for the labels on the right.
type Layout = {
  width: number;
  height: number;
  gridLeft: number;
  valuesX: number; // right edge of the values on the left
  left: number;
  right: number;
  top: number;
  rowGap: number; // between the six grid lines
  datesY: number;
  maxDates: number;
  labels: number; // the latest point's labels start this far right of the plot
  // the peak and the latest score marked on the scale (dashed lines to it) instead
  // of labels on the right, as on the prototype's head-to-head chart for phones
  onScale: boolean;
};

const DESKTOP: Layout = {
  width: 1000,
  height: 280,
  gridLeft: 50,
  valuesX: 42,
  left: 75,
  right: 860,
  top: 25,
  rowGap: 40,
  datesY: 255,
  maxDates: 8,
  labels: 16,
  onScale: false,
};

function phone(width: number): Layout {
  const right = width - 10;
  return {
    width,
    height: 226,
    gridLeft: 38,
    valuesX: 32,
    left: 48,
    right,
    top: 14,
    rowGap: 34,
    datesY: 206,
    maxDates: Math.max(2, Math.floor((right - 48) / 80)),
    labels: 6,
    onScale: true,
  };
}

const MD = 768;
const RANGES = { "1Y": 1, "4Y": 4, All: null } as const;
type Range = keyof typeof RANGES;
const FONT = "'IBM Plex Sans', sans-serif";
const YEAR = 365.25 * 24 * 3600 * 1000;

type Point = { day: number; rating: number; score: number; edge?: boolean };

// The rating (skill, dashed) and the score (rating minus uncertainty, solid) after
// every competition, and today's.
export function RatingChart({
  athlete,
  history,
  today,
}: {
  athlete: Athlete;
  history: HistoryRow[];
  today: string;
}) {
  const now = new Date(today).getTime();
  // an athlete idle for years: the whole history rather than an empty window
  const lastContest = history.length ? new Date(history[0].fought_on).getTime() : now;
  const [range, setRange] = useState<Range>(now - lastContest > 3.5 * YEAR ? "All" : "4Y");
  const box = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState<number | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setBoxWidth(entry.contentRect.width));
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  const page = typeof window === "undefined" ? MD : window.innerWidth;
  const at = boxWidth !== null && page < MD ? phone(Math.round(boxWidth)) : DESKTOP;
  const { left: LEFT, right: RIGHT, top: TOP } = at;
  const BOTTOM = TOP + 5 * at.rowGap;

  // the last contest of every competition (history is latest first)
  const seen = new Set<number>();
  const points: Point[] = [];
  for (const contest of history) {
    if (seen.has(contest.competition_id)) continue;
    seen.add(contest.competition_id);
    points.unshift({
      day: new Date(contest.fought_on).getTime(),
      rating: contest.rating_after,
      score: contest.score_after,
    });
  }
  points.push({ day: now, rating: athlete.rating ?? 0, score: athlete.score ?? 0 });

  const years = RANGES[range];
  const from = years === null ? points[0].day : now - years * YEAR;
  const shown = points.filter((p) => p.day >= from);
  // the line comes in from the left edge, from the last point before the window
  const before = points.filter((p) => p.day < from).at(-1);
  if (before) shown.unshift({ ...before, day: from, edge: true });
  const start = Math.min(from, shown[0].day);

  const values = shown.flatMap((p) => [p.rating, p.score]);
  const [low, step] = scale(Math.min(...values), Math.max(...values));
  const x = (day: number) => LEFT + ((day - start) / Math.max(now - start, 1)) * (RIGHT - LEFT);
  const y = (value: number) => BOTTOM - ((value - low) / (5 * step)) * (BOTTOM - TOP);
  const line = (key: "rating" | "score") => shown.map((p) => `${x(p.day)},${y(p[key])}`).join(" ");

  const last = shown[shown.length - 1];
  const real = shown.filter((p) => !p.edge);
  const peak = real.reduce((best, p) => (p.score > best.score ? p : best), real[0]);
  // today's date is written at the right end: no other date too close to it
  const ticks = monthTicks(start, now, at.maxDates).filter(
    (tick) => RIGHT - x(tick) >= (at.onScale ? 85 : 55),
  );

  // marks on the scale: the latest score and the peak, pushed apart when too close
  const marks = [{ point: last, color: "#33302E", at: y(last.score) }];
  if (peak !== last) marks.push({ point: peak, color: "#66605C", at: y(peak.score) });
  if (marks.length === 2 && Math.abs(marks[0].at - marks[1].at) < 14) {
    const middle = (marks[0].at + marks[1].at) / 2;
    const [lower, upper] = marks[0].at > marks[1].at ? [marks[0], marks[1]] : [marks[1], marks[0]];
    lower.at = middle + 7;
    upper.at = middle - 7;
  }
  const crowded = (row: number) => at.onScale && marks.some((mark) => Math.abs(mark.at - row) < 12);

  return (
    <section className="mb-0 mt-14 lg:mt-16">
      <div className="flex justify-between items-end mb-3 border-b-2 border-ink pb-2">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-serif font-bold text-[20px] sm:text-[24px] text-ink">Rating</h2>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="4" aria-hidden>
                <line x1="0" y1="2" x2="16" y2="2" stroke="#66605C" strokeWidth="1.2" strokeDasharray="4,3" />
              </svg>
              Skill
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="4" aria-hidden>
                <line x1="0" y1="2" x2="16" y2="2" stroke="#33302E" strokeWidth="2.5" />
              </svg>
              Rating
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-2.5 bg-ink/[0.08] border border-rule inline-block" />
              Uncertainty
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm shrink-0">
          {(Object.keys(RANGES) as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={
                r === range
                  ? "font-bold text-claret border-b-2 border-claret pb-0.5"
                  : "text-muted hover:text-ink cursor-pointer"
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div ref={box} className="w-full relative py-2">
        <svg
          viewBox={`0 0 ${at.width} ${at.height}`}
          preserveAspectRatio="none"
          className="w-full h-auto overflow-visible block"
        >
          <g stroke="#D6CFC2" strokeWidth="0.8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={at.gridLeft} x2={RIGHT} y1={TOP + i * at.rowGap} y2={TOP + i * at.rowGap} />
            ))}
          </g>
          <g fill="#66605C" fontFamily={FONT} fontSize="12" textAnchor="end">
            {[0, 1, 2, 3, 4, 5].map(
              (i) =>
                !crowded(TOP + i * at.rowGap) && (
                  <text key={i} x={at.valuesX} y={TOP + i * at.rowGap + 4}>
                    {low + (5 - i) * step}
                  </text>
                ),
            )}
          </g>
          <polygon
            fill="#33302E"
            fillOpacity="0.08"
            points={`${line("rating")} ${[...shown].reverse().map((p) => `${x(p.day)},${y(p.score)}`).join(" ")}`}
          />
          <polyline fill="none" points={line("rating")} stroke="#66605C" strokeDasharray="4,3" strokeWidth="1.2" />
          <polyline fill="none" points={line("score")} stroke="#33302E" strokeWidth="2.5" />
          {real.length <= 40 && (
            <g fill="#33302E">
              {real.slice(0, -1).map((p) => (
                <circle key={p.day} cx={x(p.day)} cy={y(p.score)} r="4" />
              ))}
            </g>
          )}
          <circle cx={x(last.day)} cy={y(last.score)} fill="#990F3D" r="4" />
          {at.onScale && (
            <>
              <g strokeWidth="0.8" strokeDasharray="2,2">
                {marks.map(({ point, color }) => (
                  <line
                    key={point.day}
                    x1={at.gridLeft}
                    x2={x(point.day)}
                    y1={y(point.score)}
                    y2={y(point.score)}
                    stroke={color}
                  />
                ))}
              </g>
              <g fontFamily={FONT} fontSize="12" fontWeight="700" textAnchor="end">
                {marks.map(({ point, color, at: row }) => (
                  <text key={point.day} x={at.valuesX} y={row + 4} fill={color}>
                    {Math.round(point.score)}
                  </text>
                ))}
              </g>
            </>
          )}
          {!at.onScale && peak !== last && (
            <g transform={`translate(${x(peak.day)}, ${y(peak.score)})`}>
              <rect fill="#F3EEE3" height="16" stroke="#D6CFC2" strokeWidth="0.8" width="68" x="-34" y="-24" />
              <text fill="#33302E" fontFamily={FONT} fontSize="11" fontWeight="600" textAnchor="middle" x="0" y="-12">
                Peak {Math.round(peak.score)}
              </text>
            </g>
          )}
          <g fontFamily={FONT} fontSize="12" display={at.onScale ? "none" : undefined}>
            <text fill="#66605C" x={RIGHT + at.labels} y={y(last.rating) + 4}>
              Skill {last.rating}
            </text>
            <line
              stroke="#D6CFC2"
              strokeWidth="0.8"
              x1={RIGHT + at.labels + 12}
              x2={RIGHT + at.labels + 12}
              y1={y(last.rating) + 11}
              y2={y(last.score) - 11}
            />
            <text fill="#66605C" x={RIGHT + at.labels + 20} y={(y(last.rating) + y(last.score)) / 2 + 4}>
              −{last.rating - last.score}
            </text>
            <text fill="#33302E" fontWeight="700" x={RIGHT + at.labels + 12} y={y(last.score) + 4}>
              Rating {last.score}
            </text>
          </g>
          <g fill="#66605C" fontFamily={FONT} fontSize="12" textAnchor="middle">
            {ticks.map((tick) => (
              <text key={tick} x={x(tick)} y={at.datesY}>
                {monthYear(new Date(tick).toISOString())}
              </text>
            ))}
            {/* on a phone the plot reaches the edge: today's date ends there */}
            <text x={RIGHT} y={at.datesY} textAnchor={at.onScale ? "end" : undefined}>
              {monthYear(new Date(now).toISOString())}
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}

// The bottom grid line and the step: six round lines covering low..high.
function scale(low: number, high: number): [number, number] {
  for (const step of [25, 50, 100, 200, 250, 500]) {
    const top = Math.ceil(high / step) * step;
    if (top - 5 * step <= low) return [top - 5 * step, step];
  }
  return [Math.floor(low / 1000) * 1000, 1000];
}

// First days of months every 1, 3, 6, 12 or 24 months (and longer), at most `most`.
function monthTicks(start: number, end: number, most: number): number[] {
  const months = (end - start) / (30.44 * 24 * 3600 * 1000);
  const every = [1, 3, 6, 12, 24, 48, 96].find((n) => months / n <= most) ?? 192;
  const ticks: number[] = [];
  const date = new Date(start);
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + 1);
  while (date.getTime() < end) {
    const index = date.getUTCFullYear() * 12 + date.getUTCMonth();
    if (index % every === (every === 6 ? 4 : 0)) ticks.push(date.getTime());
    date.setUTCMonth(date.getUTCMonth() + 1);
  }
  return ticks;
}
