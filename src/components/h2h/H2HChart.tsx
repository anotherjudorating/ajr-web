"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { careerLine, ChartSkeleton, ChartTip, TipEvents, TipPlaces, tipPlaces, useChartPointer, dotsFit, INK, nearest, PERIOD, pointerX, scale, TipBody } from "@/components/chart";
import type { HistoryRow } from "@/lib/api";
import { monthYear, shortName } from "@/lib/format";
import { COLORS } from "@/lib/h2h";
import { tournamentPath } from "@/lib/weights";
import type { Places } from "@/lib/places";

// Both ratings after every competition. From sm up the prototype's 1000×300 canvas
// scaled to the page; below sm its 360×240 phone canvas, drawn at the chart's real
// width so the text stays 11px.
type Layout = {
  width: number;
  height: number;
  gridLeft: number;
  valuesX: number;
  left: number;
  right: number;
  top: number;
  rowGap: number;
  datesY: number;
  font: number;
  line: number;
  dot: number;
  phone: boolean;
};

const DESKTOP: Layout = {
  width: 1000,
  height: 300,
  gridLeft: 60,
  valuesX: 54,
  left: 70,
  right: 840,
  top: 28,
  rowGap: 47.6,
  datesY: 290,
  font: 12,
  line: 2.5,
  dot: 4,
  phone: false,
};

function phone(width: number): Layout {
  return {
    width,
    height: 240,
    gridLeft: 36,
    valuesX: 30,
    left: 46,
    right: width - 16,
    top: 28,
    rowGap: 35.6,
    datesY: 230,
    font: 11,
    line: 2,
    dot: 3.5,
    phone: true,
  };
}

const SM = 640;
const RANGES = { "1Y": 1, "4Y": 4, All: null } as const;
type Range = keyof typeof RANGES;
const FONT = "'IBM Plex Sans', sans-serif";
const YEAR = 365.25 * 24 * 3600 * 1000;

export type ChartAthlete = {
  slot: "a" | "b";
  family_name: string | null;
  given_name: string | null;
  score: number;
  history: HistoryRow[];
  places: Places | null; // every Monday's (R2), for the tip
};


export function H2HChart({ athletes, today }: { athletes: ChartAthlete[]; today: string }) {
  const now = new Date(today).getTime();
  const lastContest = Math.max(...athletes.map((a) => (a.history[0] ? new Date(a.history[0].fought_on).getTime() : 0)));
  const [range, setRange] = useState<Range>(now - lastContest > 3.5 * YEAR ? "All" : "4Y");
  const box = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState<number | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setBoxWidth(entry.contentRect.width));
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  const page = typeof window === "undefined" ? SM : window.innerWidth;
  const at = boxWidth !== null && page < SM ? phone(Math.round(boxWidth)) : DESKTOP;
  const BOTTOM = at.top + 5 * at.rowGap;

  const router = useRouter();
  // each line as the athlete's chart draws it: honest between competitions, a point
  // a period, today's last
  const period = PERIOD[range];
  const all = athletes.map((athlete) =>
    careerLine(athlete.history, { day: now, rating: athlete.history[0]?.rating_after ?? 0, score: athlete.score }, period),
  );

  const years = RANGES[range];
  const from = years === null ? Math.min(...all.map((points) => points[0].day)) : now - years * YEAR;
  const lines = all.map((points) => {
    const shown = points.filter((p) => p.day >= from);
    // the line comes in from the left edge, from the last point before the window
    const outside = points.filter((p) => p.day < from).at(-1);
    if (outside) shown.unshift({ ...outside, day: from, period: "", events: [] });
    return shown;
  });
  const start = Math.min(from, ...lines.map((shown) => shown[0].day));

  const values = lines.flat().map((p) => p.score);
  const [low, step] = scale(Math.min(...values), Math.max(...values));
  const x = (day: number) => at.left + ((day - start) / Math.max(now - start, 1)) * (at.right - at.left);
  const y = (value: number) => BOTTOM - ((value - low) / (5 * step)) * (BOTTOM - at.top);

  const names = athletes.map((a) => shortName(a.family_name, a.given_name));
  const surnames = athletes.map((a) => shortName(a.family_name, null));
  const labelYs = apart(
    athletes.map((a) => y(a.score) + 4),
    at.phone ? 18 : 24,
  );
  const ticks = yearTicks(start, now, at.phone ? 4 : 5);
  const date = (day: number) => {
    const text = monthYear(new Date(day).toISOString());
    return at.phone ? `${text.slice(0, 4)}${text.slice(-2)}` : text; // "Nov 22"
  };
  // the nearest period's end under the pointer (both lines have the same), with each
  // athlete's competitions in it; a click opens the one competition of a period
  const targets = lines.flatMap((shown) => shown.filter((p) => p.period && p.day >= from));
  const { hovered, touched, hold, plot } = useChartPointer<number>(
    box,
    (e) => {
      const px = pointerX(e, at.left, at.right);
      return targets.length ? nearest(targets, (p) => Math.abs(x(p.day) - px)).day : null;
    },
    (day) => {
      const events = [...new Map(lines.flat().filter((p) => p.day === day).flatMap((p) => p.events).map((c) => [c.id, c])).values()];
      if (events.length === 1) router.push(tournamentPath(events[0].id, events[0].weight));
    },
  ); // a point's day
  const under = hovered === null ? [] : lines.flatMap((shown, i) => shown.filter((p) => p.day === hovered && p.period).map((p) => ({ i, p })));
  const single = new Set(under.flatMap(({ p }) => p.events.map((c) => c.id))).size === 1;
  // athlete 1 is drawn last, on top
  const order = athletes.map((_, i) => i).reverse();

  return (
    <section className="mt-14 lg:mt-16">
      <div className="flex justify-between items-end gap-3 border-b-2 border-ink pb-2">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight">
            Rating
          </h2>
          <Legend athletes={athletes} names={names} className="hidden sm:flex items-center gap-3" />
        </div>
        <div className="flex items-center gap-4 text-[14px] shrink-0">
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
      <Legend athletes={athletes} names={names} className="sm:hidden mt-3 flex flex-wrap items-center gap-x-4 gap-y-1" />

      <div ref={box} className="relative py-2 overflow-x-clip">
        {/* until the chart knows its width: its place, striped (as RatingChart) */}
        {boxWidth === null ? (
          <ChartSkeleton className="h-[240px] sm:h-auto sm:aspect-[1000/300]" />
        ) : (
        <svg
          className="w-full h-auto block overflow-visible"
          style={{ touchAction: "pan-y" }}
          viewBox={`0 0 ${at.width} ${at.height}`}
          role="img"
          aria-label={`Rating of ${names.join(" and ")}, ${date(start)} to ${date(now)}`}
        >
          <g stroke="#D6CFC2" strokeWidth="0.8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={at.gridLeft} x2={at.right} y1={at.top + i * at.rowGap} y2={at.top + i * at.rowGap} />
            ))}
          </g>
          <g fill="#66605C" fontSize={at.font} fontFamily={FONT} textAnchor="end">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const textY = at.top + i * at.rowGap + 4;
              // on a phone today's values are written on the left: no grid value under them
              if (at.phone && labelYs.some((labelY) => Math.abs(labelY - textY) < 14)) return null;
              return (
                <text key={i} x={at.valuesX} y={textY}>
                  {low + (5 - i) * step}
                </text>
              );
            })}
          </g>
          {order.map((i) => {
            const shown = lines[i];
            const color = COLORS[athletes[i].slot];
            const last = shown[shown.length - 1];
            return (
              <g key={i}>
                <polyline
                  fill="none"
                  stroke={color}
                  strokeWidth={at.line}
                  strokeLinejoin="round"
                  points={shown.map((p) => `${round(x(p.day))},${round(y(p.score))}`).join(" ")}
                />
                {/* the competitions, as on the athlete's chart */}
                {dotsFit(shown.filter((p) => p.events.length).length, at.right - at.left) &&
                  shown
                    .filter((p) => p.events.length)
                    .map((p) => <circle key={p.day} cx={round(x(p.day))} cy={round(y(p.score))} r={at.dot - 1} fill={color} />)}
                <circle cx={round(x(last.day))} cy={round(y(last.score))} r={at.dot} fill={color} />
              </g>
            );
          })}
          {under.length > 0 && (
            <g pointerEvents="none">
              <line x1={x(hovered!)} x2={x(hovered!)} y1={at.top} y2={BOTTOM} stroke={INK} strokeOpacity="0.35" />
              {/* filled with a competition in the period, hollow without */}
              {under.map(({ i, p }) =>
                p.idle ? (
                  <circle key={i} cx={x(p.day)} cy={y(p.score)} r={at.dot} fill="#F3EEE3" stroke={COLORS[athletes[i].slot]} strokeWidth="1.5" />
                ) : (
                  <circle key={i} cx={x(p.day)} cy={y(p.score)} r={at.dot + 2} fill={COLORS[athletes[i].slot]} />
                ),
              )}
            </g>
          )}
          {targets.length > 0 && (
            <rect
              x={at.left}
              y={at.top}
              width={at.right - at.left}
              height={BOTTOM - at.top}
              fill="transparent"
              className={single ? "cursor-pointer" : undefined}
              {...plot}
            />
          )}
          <g fill="#66605C" fontSize={at.font} fontFamily={FONT} textAnchor="middle">
            {ticks.map((tick) => (
              <text key={tick} x={round(x(tick))} y={at.datesY}>
                {date(tick)}
              </text>
            ))}
            <text x={at.right} y={at.datesY}>
              {date(now)}
            </text>
          </g>
          {at.phone ? (
            <>
              <g strokeWidth="0.8" strokeDasharray="2,2">
                {order.map((i) => (
                  <line
                    key={i}
                    x1={at.gridLeft}
                    x2={at.right}
                    y1={round(y(athletes[i].score))}
                    y2={round(y(athletes[i].score))}
                    stroke={COLORS[athletes[i].slot]}
                  />
                ))}
              </g>
              <g fontSize={at.font} fontFamily={FONT} fontWeight="700" textAnchor="end">
                {athletes.map((a, i) => (
                  <text key={i} x={at.valuesX} y={round(labelYs[i])} fill={COLORS[a.slot]}>
                    {a.score}
                  </text>
                ))}
              </g>
            </>
          ) : (
            <g fontSize={at.font} fontFamily={FONT} fontWeight="700">
              {athletes.map((a, i) => (
                <text key={i} x={at.right + 14} y={round(labelYs[i])} fill={COLORS[a.slot]}>
                  {surnames[i]} {a.score}
                </text>
              ))}
            </g>
          )}
        </svg>
        )}
        {under.length > 0 && (
          <ChartTip left={(x(hovered!) / at.width) * 100} top={(Math.min(...under.map(({ p }) => y(p.score))) / at.height) * 100} hold={hold} docked={touched}>
            <TipBody
              title={under[0].p.period}
              // in the legend's order: athlete 1 first; each one's competitions under them
              lines={under.map(({ i, p }) => ({
                color: COLORS[athletes[i].slot],
                name: surnames[i],
                before: p.before,
                after: p.score,
                inactive: p.idle,
                extra: (
                  <>
                    <TipEvents events={p.events} href={(c) => tournamentPath(c.id, c.weight)} />
                    <TipPlaces places={tipPlaces(athletes[i].places, lines[i][lines[i].indexOf(p) - 1]?.day ?? null, p.day)} />
                  </>
                ),
              }))}
            />
          </ChartTip>
        )}
      </div>
    </section>
  );
}

function Legend({ athletes, names, className }: { athletes: ChartAthlete[]; names: string[]; className: string }) {
  return (
    <div className={`${className} text-[12px] text-muted`}>
      {athletes.map((a, i) => (
        <span key={a.slot} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-4 h-[2.5px]" style={{ background: COLORS[a.slot] }} />
          {names[i]}
        </span>
      ))}
    </div>
  );
}


const round = (value: number) => Math.round(value * 10) / 10;

// Labels at least `gap` apart, moved apart around their middle.
function apart(ys: number[], gap: number): number[] {
  if (ys.length < 2 || Math.abs(ys[0] - ys[1]) >= gap) return ys;
  const middle = (ys[0] + ys[1]) / 2;
  const up = ys[0] <= ys[1] ? 0 : 1;
  const result = [...ys];
  result[up] = middle - gap / 2;
  result[1 - up] = middle + gap / 2;
  return result;
}

// The window's first month, then every 3, 6, 12, 24… months, at most `most` dates,
// none too close to today's (written at the end).
function yearTicks(start: number, end: number, most: number): number[] {
  const months = (end - start) / (30.44 * 24 * 3600 * 1000);
  const every = [3, 6, 12, 24, 48, 96].find((n) => months / n <= most - 1) ?? 192;
  const ticks: number[] = [];
  const first = new Date(start);
  for (let k = 0; ; k++) {
    const date = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + k * every, first.getUTCDate()));
    if ((end - date.getTime()) / (end - start) < 0.6 / most) break;
    ticks.push(date.getTime());
  }
  return ticks;
}
