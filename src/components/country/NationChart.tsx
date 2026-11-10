"use client";

import { useRef, useState } from "react";

import { ChartTip, dotsFit, useChartPointer, INK, monthTicks, nearest, PEAK, PERIOD, PeakLabel, peakShift, periodName, type Range, scale, TipBody } from "@/components/chart";
import { Icon } from "@/components/Icon";
import { H2, HEAD } from "@/components/tournament/styles";
import type { CountryWeek } from "@/lib/api";
import { nationPeakLink } from "@/lib/anchors";
import { monthYear } from "@/lib/format";

const RANGES: Record<Range, number | null> = { "1Y": 1, "4Y": 4, All: null };
const DAY = 24 * 3600 * 1000;
const YEAR = 365.25 * 24 * 3600 * 1000;
const FONT = "var(--font-ibm-plex-sans), sans-serif";

// Desktop and phone drawings: the plot's box in the viewBox (six grid lines, as on
// the athlete's chart), the font size and how many dates to write under it.
const LAYOUTS = [
  { className: "hidden sm:block", width: 1000, height: 260, left: 50, right: 920, top: 28, bottom: 226, font: 11, dates: 8 },
  { className: "sm:hidden", width: 500, height: 300, left: 52, right: 420, top: 28, bottom: 266, font: 14, dates: 3 },
];

// A point: the last week of a period (a week, a month or a quarter, by the range),
// with the period's start: the last week before it (for the change, and its
// tournaments: those after that week up to this one).
type Point = { day: number; rating: number; place: number | null; before: { day: number; rating: number; place: number | null } | null; period: string };

// A click on a point marks the tournaments of its period (country/Tournaments.tsx).
export const PERIOD_EVENT = "ajr:nation-period";
export type PeriodPick = { title: string; after: number; until: number }; // days, after < day <= until

// The nation's leaders rating average, one point a week, month or quarter (about
// fifty over any range), then today's; its all-time peak week marked (claret) and,
// when it is before the window, a way to it. On a desktop the nearest point under the
// pointer: its period, the rating and place at its start and end.
export function NationChart({ ioc, history, today, rating }: { ioc: string; history: CountryWeek[]; today: string; rating: number }) {
  const [range, setRange] = useState<Range>("4Y");
  const box = useRef<HTMLElement>(null);
  const now = new Date(today).getTime();
  const weeks = [
    ...history.map((w) => ({ day: new Date(w.day).getTime(), rating: w.rating, place: w.place as number | null })),
  ].filter((w) => w.day < now);
  weeks.push({ day: now, rating, place: weeks.at(-1)?.place ?? null });
  const best = weeks.reduce((top, w) => (w.rating > top.rating ? w : top));

  const years = RANGES[range];
  const from = years === null ? weeks[0].day : Math.max(weeks[0].day, now - years * YEAR);
  const period = PERIOD[range];
  const name = (day: number) => periodName(period, day);
  // the last week of every period, and the all-time peak's week as a point of its own
  const points: Point[] = [];
  weeks.forEach((w, i) => {
    const next = weeks[i + 1];
    const end = !next || name(next.day) !== name(w.day);
    if (!end && w !== best) return;
    const previous = points.at(-1);
    const prior = previous ?? (i > 0 ? weeks[i - 1] : null);
    points.push({
      ...w,
      period: w === best && !end ? periodName("week", w.day) : w.day === now ? "Today" : name(w.day),
      before: prior ? { day: prior.day, rating: prior.rating, place: prior.place } : null,
    });
  });
  const peakPoint = points.find((p) => p.day === best.day);
  const shown = points.filter((p) => p.day >= from);
  // the line comes in from the left edge, from the last point before the window
  const outside = points.filter((p) => p.day < from).at(-1);
  if (outside) shown.unshift({ ...outside, day: from });
  const start = shown[0].day;
  const peak = shown.find((p) => p === peakPoint);
  const last = shown[shown.length - 1];
  const targets = outside ? shown.slice(1) : shown;
  // its tournaments marked below (country/Tournaments.tsx)
  const showTournaments = (p: Point) => {
    const pick: PeriodPick = { title: p.period, after: p.before?.day ?? p.day - 7 * DAY, until: p.day };
    window.dispatchEvent(new CustomEvent(PERIOD_EVENT, { detail: pick }));
  };
  // the same on both drawings: the day under the pointer from its share of the plot
  const { hovered, touched, hold, plot, close } = useChartPointer<Point>(
    box,
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const day = start + ((e.clientX - rect.left) / rect.width) * (now - start);
      return nearest(targets, (p) => Math.abs(p.day - day));
    },
    showTournaments,
  );

  const values = shown.map((p) => p.rating);
  const [low, step] = scale(Math.min(...values), Math.max(...values));
  const label = `Leaders rating average, ${monthYear(new Date(start).toISOString())} to ${monthYear(today)}: ${shown[0].rating} to ${rating}`;

  return (
    <section ref={box} className="mt-14 lg:mt-16">
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
        const x = (day: number) => l.left + ((day - start) / Math.max(now - start, 1)) * (l.right - l.left);
        const y = (value: number) => l.bottom - ((value - low) / (5 * step)) * (l.bottom - l.top);
        const ticks = monthTicks(start, now, l.dates);
        const text = { fill: "currentColor", fontFamily: FONT, fontSize: l.font };
        return (
          <div key={l.width} className={`relative py-2 overflow-x-clip ${l.className}`}>
            <svg className="w-full h-auto overflow-visible block" style={{ touchAction: "pan-y" }} viewBox={`0 0 ${l.width} ${l.height}`} role="img" aria-label={label}>
              <g stroke="#D6CFC2" strokeWidth="0.8">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line key={i} x1={l.left} x2={l.right} y1={y(low + i * step)} y2={y(low + i * step)} />
                ))}
              </g>
              <g className="text-muted" {...text} textAnchor="end">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <text key={i} x={l.left - 8} y={y(low + i * step) + l.font * 0.35}>
                    {low + i * step}
                  </text>
                ))}
              </g>
              <polyline fill="none" points={shown.map((p) => `${x(p.day)},${y(p.rating)}`).join(" ")} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
              {/* under the marks and the Peak label (a link): they let the pointer through */}
              {(
                <rect
                  x={l.left}
                  y={l.top}
                  width={l.right - l.left}
                  height={l.bottom - l.top}
                  fill="transparent"
                  className="cursor-pointer"
                  {...plot}
                />
              )}
              {dotsFit(targets.length, l.right - l.left) && (
                <g fill={INK} pointerEvents="none">
                  {targets
                    .filter((p) => p !== peak && p !== last)
                    .map((p) => (
                      <circle key={p.day} cx={x(p.day)} cy={y(p.rating)} r="3" />
                    ))}
                </g>
              )}
              {hovered && (
                <g pointerEvents="none">
                  <line x1={x(hovered.day)} x2={x(hovered.day)} y1={l.top} y2={l.bottom} stroke={INK} strokeOpacity="0.35" />
                  <circle cx={x(hovered.day)} cy={y(hovered.rating)} r="5" fill={hovered === peak ? PEAK : INK} />
                </g>
              )}
              {peak && <circle cx={x(peak.day)} cy={y(peak.rating)} fill={PEAK} r="4" pointerEvents="none" />}
              {last !== peak && <circle cx={x(last.day)} cy={y(last.rating)} fill={INK} r="4" pointerEvents="none" />}
              {/* not over today's point: its label says it */}
              {peak && peak !== last && (
                <PeakLabel
                  x={x(peak.day)}
                  y={y(peak.rating)}
                  score={peak.rating}
                  shift={peakShift(x(peak.day), l.left, l.right)}
                  href={nationPeakLink(ioc, new Date(peak.day).toISOString().slice(0, 10), today)}
                  title="The nations' table of that week"
                  font={FONT}
                />
              )}
              <text x={x(last.day) + 12} y={y(last.rating) + l.font * 0.3} className="text-ink" {...text} fontWeight="700">
                {rating}
              </text>
              <g className="text-muted" {...text} textAnchor="middle">
                {ticks.map((tick) => (
                  <text key={tick} x={x(tick)} y={l.height - 10}>
                    {monthYear(new Date(tick).toISOString())}
                  </text>
                ))}
                <text x={l.right} y={l.height - 10}>
                  {monthYear(today)}
                </text>
              </g>
            </svg>
            {!peak && range !== "All" && (
              <button
                type="button"
                onClick={() => setRange("All")}
                className="absolute top-3 inline-flex items-center h-4 pr-1.5 border border-claret bg-[#F3EEE3] hover:bg-[#EBD5D6] active:bg-[#E0BFC2] transition-colors text-[11px] leading-none font-semibold text-ink cursor-pointer"
                style={{ left: `${(l.left / l.width) * 100}%` }}
                title={`Peak in ${monthYear(new Date(best.day).toISOString())}: show the whole history`}
              >
                <Icon size={14} name="chevron_left" className="text-claret" />
                Peak {best.rating}
              </button>
            )}
            {hovered && (
              <ChartTip left={(x(hovered.day) / l.width) * 100} top={(y(hovered.rating) / l.height) * 100} hold={hold} docked={touched}>
                <TipBody
                  action={
                    touched
                      ? {
                          label: "Show tournaments",
                          onClick: () => {
                            showTournaments(hovered);
                            close();
                          },
                        }
                      : undefined
                  }
                  title={hovered.period}
                  lines={[{ before: hovered.before?.rating ?? null, after: hovered.rating }]}
                  places={[{ label: "Rank", before: hovered.before?.place ?? null, after: hovered.place }]}
                />
              </ChartTip>
            )}
          </div>
        );
      })}
    </section>
  );
}
