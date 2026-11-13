"use client";

import { useEffect, useRef } from "react";

import { ChartTip, monthTicks, nearest, pointerX, useChartPointer } from "@/components/chart";
import { formatDate, monthYear } from "@/lib/format";
import type { Places } from "@/lib/places";
import { type Highlight, SINCE } from "@/lib/standing";

type Layout = { width: number; height: number; gridLeft: number; valuesX: number; left: number; right: number; top: number; rowGap: number; datesY: number; maxDates: number; font: number };
type Week = { day: number; place: number | null; p4p: number | null };

const DAY = 86_400_000;
const FONT = "'IBM Plex Sans', sans-serif";
const TICKS = [1, 2, 4, 8, 16, 32, 64, 128, 256];

// The athlete's place every Monday (lib/places.ts) over the rating chart's window: in
// the picked weight (solid) and pound for pound (dashed), #1 at the top on a log scale
// (a move from #2 to #1 is as wide as one from #64 to #32), the top 8 shaded. A week
// out of the table breaks the line.
// `run`: a run picked in the header, marked over its weeks with its label (a click
// anywhere else, its × or Esc takes it off: `onClear`; the header's runs pick another). `idle`: the spells without a contest for over a year,
// hatched as on the rating chart (out of the tables: the line breaks there).
export function RankChart({
  places,
  weight,
  start,
  now,
  at,
  run = null,
  onClear,
  idle = [],
  ends = true,
}: {
  places: Places;
  weight: string;
  start: number;
  now: number;
  at: Layout;
  run?: Highlight | null;
  onClear?: () => void;
  idle?: { from: number; to: number }[];
  ends?: boolean; // the latest places after the line (a phone: in the header)
}) {
  useEffect(() => {
    if (!run || !onClear) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClear();
    const click = (e: PointerEvent) => !(e.target as HTMLElement).closest("[data-run]") && onClear();
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", click);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", click);
    };
  }, [run, onClear]);
  const box = useRef<HTMLDivElement>(null);
  const from = Date.parse(`${places.from}T00:00:00Z`);
  const weeks: Week[] = places.weeks
    .map((week, i) => ({ day: from + 7 * DAY * i, place: week && week[1] === weight ? week[0] : null, p4p: week?.[2] ?? null }))
    .filter((w) => w.day >= Math.max(start, SINCE) && w.day <= now);
  const { left: LEFT, right: RIGHT, top: TOP } = at;
  const BOTTOM = TOP + 5 * at.rowGap;
  const worst = Math.max(8, ...weeks.flatMap((w) => [w.place ?? 0, w.p4p ?? 0]));
  const top = TICKS.find((t) => t >= worst) ?? 256;
  const x = (day: number) => LEFT + ((day - start) / Math.max(now - start, 1)) * (RIGHT - LEFT);
  const y = (place: number) => TOP + (Math.log2(place) / Math.log2(top)) * (BOTTOM - TOP);
  // a step line, broken where the athlete is out of the table
  const path = (key: "place" | "p4p") =>
    weeks
      .map((w, i) => {
        const value = w[key];
        if (value === null) return "";
        const before = weeks[i - 1]?.[key];
        return `${before === null || before === undefined ? "M" : "L"}${x(w.day)},${y(before ?? value)} L${x(w.day)},${y(value)}`;
      })
      .join(" ");
  const shown = weeks.filter((w) => w.place !== null || w.p4p !== null);
  const { hovered, touched, hold, plot } = useChartPointer<Week>(box, (e) => {
    const at = pointerX(e, LEFT, RIGHT);
    return shown.length ? nearest(shown, (w) => Math.abs(x(w.day) - at)) : null;
  });
  // the dates, none too close to today's at the right edge
  // the label goes over the longest span
  const widest = run?.spans.reduce((a, b) => (Date.parse(b.to) - Date.parse(b.from) > Date.parse(a.to) - Date.parse(a.from) ? b : a), run.spans[0]);
  const ticks = monthTicks(start, now, at.maxDates).filter((tick) => x(tick) < RIGHT - 90);
  const last = shown.at(-1);
  const band = y(8.5);

  return (
    <div ref={box} className="w-full relative">
      <svg viewBox={`0 0 ${at.width} ${at.height}`} preserveAspectRatio="none" className="w-full h-auto overflow-visible block" style={{ touchAction: "pan-y" }}>
        {/* the top 8: the seeds of a World Championships or an Olympics */}
        <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={Math.max(band - TOP, 0)} fill="#33302E" fillOpacity="0.05" />
        <g stroke="#D6CFC2" strokeWidth="0.8">
          {TICKS.filter((t) => t <= top).map((t) => (
            <line key={t} x1={at.gridLeft} x2={RIGHT} y1={y(t)} y2={y(t)} />
          ))}
        </g>
        <g fill="#66605C" fontFamily={FONT} fontSize={at.font} textAnchor="end">
          {TICKS.filter((t) => t <= top).map((t) => (
            <text key={t} x={at.valuesX} y={y(t) + 4}>
              #{t}
            </text>
          ))}
        </g>
        <defs>
          <pattern id="rank-inactive" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#D6CFC2" strokeWidth="2" />
          </pattern>
        </defs>
        {idle
          .filter((zone) => zone.to > start && zone.to > zone.from)
          .map((zone) => {
            const [x1, x2] = [x(Math.max(zone.from, start)), x(zone.to)];
            return (
              <g key={zone.from} pointerEvents="none">
                <rect x={x1} y={TOP} width={Math.max(x2 - x1, 0)} height={BOTTOM - TOP} fill="url(#rank-inactive)" />
                {x2 - x1 > 70 && (
                  <text x={(x1 + x2) / 2} y={BOTTOM - 8} textAnchor="middle" fill="#66605C" fontFamily={FONT} fontSize="11">
                    Inactive
                  </text>
                )}
              </g>
            );
          })}
        {run && (
          <g pointerEvents="none" fill="#990F3D" fillOpacity="0.12">
            {run.spans.map((span) => (
              <rect
                key={span.from}
                x={x(Date.parse(span.from))}
                y={TOP}
                width={Math.max(x(Date.parse(span.to) + 7 * DAY) - x(Date.parse(span.from)), 2)}
                height={BOTTOM - TOP}
              />
            ))}
          </g>
        )}
        <path d={path("p4p")} fill="none" stroke="#66605C" strokeWidth="1.2" strokeDasharray="4,3" />
        <path d={path("place")} fill="none" stroke="#33302E" strokeWidth="2.5" />
        {hovered && (
          <g pointerEvents="none">
            <line x1={x(hovered.day)} x2={x(hovered.day)} y1={TOP} y2={BOTTOM} stroke="#33302E" strokeOpacity="0.35" />
            {hovered.place !== null && <circle cx={x(hovered.day)} cy={y(hovered.place)} r="5" fill="#33302E" />}
          </g>
        )}
        {shown.length > 0 && <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOTTOM - TOP} fill="transparent" className="cursor-pointer" {...plot} />}
        {/* the latest week's places, after the line's end */}
        {ends && last && (
          <g fontFamily={FONT} fontSize="12">
            {/* the two places close together: one line */}
            {last.place !== null && last.p4p !== null && Math.abs(y(last.place) - y(last.p4p)) < 14 ? (
              <text fill="#33302E" x={x(last.day) + 8} y={y(last.place) + 4}>
                <tspan fontWeight="700">#{last.place}</tspan>
                <tspan fill="#66605C"> P4P #{last.p4p}</tspan>
              </text>
            ) : (
              <>
                {last.place !== null && (
                  <text fill="#33302E" fontWeight="700" x={x(last.day) + 8} y={y(last.place) + 4}>
                    #{last.place}
                  </text>
                )}
                {last.p4p !== null && (
                  <text fill="#66605C" x={x(last.day) + 8} y={y(last.p4p) + 4}>
                    P4P #{last.p4p}
                  </text>
                )}
              </>
            )}
          </g>
        )}
        <g fill="#66605C" fontFamily={FONT} fontSize={at.font} textAnchor="middle">
          {ticks.map((tick) => (
            <text key={tick} x={x(tick)} y={at.datesY}>
              {monthYear(new Date(tick).toISOString())}
            </text>
          ))}
          <text x={RIGHT} y={at.datesY} textAnchor={ends ? "middle" : "end"}>
            {monthYear(new Date(now).toISOString())}
          </text>
        </g>
      </svg>
      {run && (
        // the run's label over its band, kept inside the chart
        <div
          className="absolute top-0 -translate-x-1/2 inline-flex items-center gap-1.5 pl-1.5 border border-claret bg-paper text-[11px] font-semibold text-ink whitespace-nowrap z-20"
          style={{ left: `${Math.min(Math.max((((x(Date.parse(widest!.from)) + x(Date.parse(widest!.to))) / 2) / at.width) * 100, 18), 82)}%` }}
        >
          {run.label}
          {/* one run: its months */}
          {run.spans.length === 1 && `, ${monthYear(run.spans[0].from)} – ${monthYear(run.spans[0].to)}`}
          {onClear && (
            <button type="button" onClick={onClear} aria-label="Take the mark off" title="Take the mark off (Esc)" className="px-1.5 py-0.5 text-claret hover:bg-claret/10 cursor-pointer">
              ×
            </button>
          )}
        </div>
      )}
      {hovered && (
        <ChartTip left={(x(hovered.day) / at.width) * 100} top={((hovered.place !== null ? y(hovered.place) : TOP) / at.height) * 100} hold={hold} docked={touched}>
          <div className="font-semibold text-ink">Week of {formatDate(new Date(hovered.day).toISOString().slice(0, 10))}</div>
          <div className="text-muted">
            {hovered.place !== null ? `#${hovered.place} in ${weight.replace("-", "−")} kg` : `Not in the ${weight.replace("-", "−")} kg table`}
          </div>
          {hovered.p4p !== null && <div className="text-muted">#{hovered.p4p} pound for pound</div>}
        </ChartTip>
      )}
    </div>
  );
}
