"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useHashTarget } from "@/components/anchors";
import { careerLine, ChartSkeleton, ChartTip, TipEvents, tipPlaces, useChartPointer, type Competition, type LinePoint, type Range, dotsFit, LABEL_ROOM, monthTicks, nearest, PeakLabel, PERIOD, peakShift as shiftOf, pointerX, scale, TipBody } from "@/components/chart";
import { Icon } from "@/components/Icon";
import { RankChart } from "@/components/athlete/RankChart";

import type { Athlete, HistoryRow } from "@/lib/api";
import type { LastRating } from "@/lib/inactive";
import { peakTableLink, SECTION } from "@/lib/anchors";
import { formatDate, monthYear } from "@/lib/format";
import { tournamentPath } from "@/lib/weights";
import { type Places } from "@/lib/places";
import { type Highlight, SINCE } from "@/lib/standing";

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
  font: number; // the values on the left and the dates under it (as the other charts')
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
  font: 12,
};

function phone(width: number): Layout {
  const right = width - 10; // no end labels: the header over the chart has them
  return {
    width,
    height: 226,
    gridLeft: 32,
    valuesX: 28,
    left: 42, // as the other charts' (H2HChart, NationChart)
    right,
    top: 14,
    rowGap: 34,
    datesY: 206,
    maxDates: Math.max(2, Math.floor((right - 42) / 80)),
    labels: 6,
    font: 11,
  };
}

const MD = 768;
const RANGES: Record<Range, number | null> = { "1Y": 1, "4Y": 4, All: null };
const FONT = "'IBM Plex Sans', sans-serif";
const YEAR = 365.25 * 24 * 3600 * 1000;
const DAY = 24 * 3600 * 1000;
// No contest for this long: out of the tables (hide_after_days in the rating settings).
const AWAY = 365 * DAY;

export type { Competition } from "@/components/chart";

type Point = LinePoint & { edge?: boolean };

// The rating (skill, dashed) and the score (rating minus uncertainty, solid) after
// every competition, and today's. Marked: the peak (claret, as in the header) and
// today (ink); on a desktop also every competition, which shows itself on hover and
// on a click picks its contests in the table below.
export function RatingChart({
  athlete,
  history,
  places,
  weight = null,
  run = null,
  onRun,
  today,
  inactive,
  onPeriod,
}: {
  athlete: Athlete;
  history: HistoryRow[];
  places: Places | null;
  weight?: string | null; // the picked weight: its places for the Rank view
  run?: Highlight | null; // a run picked in the header: the Rank view, the whole career, it marked
  onRun?: (run: Highlight | null) => void; // its mark taken off
  today: string;
  inactive: LastRating | null; // over a year without a contest: the line ends at the last one
  onPeriod: (competitions: Competition[]) => void; // a point's: its contests marked in the table
}) {

  const now = new Date(today).getTime();
  const lastContest = history.length ? new Date(history[0].fought_on).getTime() : now;
  // the last year; idle over a year: four (the last results in it); idle over two: the
  // whole career (a comeback makes the last contest recent again)
  const idleFor = now - lastContest;
  const [range, setRange] = useState<Range>(idleFor > 2 * YEAR ? "All" : idleFor > YEAR ? "4Y" : "1Y");
  // the rating, or the place every week in the picked weight and pound for pound
  const [view, setView] = useState<"rating" | "rank">("rating");
  const ranked = places !== null && weight !== null && places.weeks.some((week) => week?.[1] === weight);
  const rank = view === "rank" && ranked;
  // a run picked: the Rank view over the whole career, the chart scrolled to
  const [runSeen, setRunSeen] = useState<Highlight | null>(null);
  if (run !== runSeen) {
    setRunSeen(run);
    if (run) {
      setView("rank");
      setRange("All");
    }
  }
  useEffect(() => {
    if (run) document.getElementById(SECTION.rating)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [run]);
  // #rating (a rating record's link): the whole career, the peak pulsing until the
  // reader's first move, the chart scrolled into place
  const { qualifier, ref: anchorRef, scrollNow } = useHashTarget(SECTION.rating);
  const [hashSeen, setHashSeen] = useState<string | null>(null);
  if (qualifier !== hashSeen) {
    setHashSeen(qualifier);
    if (qualifier !== null) setRange("All");
  }
  useLayoutEffect(scrollNow, [scrollNow, range]);
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    if (qualifier === null || !pulse) return;
    const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    const stop = () => setPulse(false);
    for (const e of events) window.addEventListener(e, stop, { passive: true, once: true });
    return () => {
      for (const e of events) window.removeEventListener(e, stop);
    };
  }, [qualifier, pulse]);
  const box = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState<number | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setBoxWidth(entry.contentRect.width));
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  const page = typeof window === "undefined" ? MD : window.innerWidth;
  const base = boxWidth !== null && page < MD ? phone(Math.round(boxWidth)) : DESKTOP;
  const desktop = base === DESKTOP;
  // the column on the right is for the labels of today's point; an inactive athlete's
  // line ends earlier, the labels go with it, and the plot takes the whole width
  const at = inactive ? { ...base, right: base.width - (desktop ? 20 : 8) } : base;
  const { left: LEFT, right: RIGHT, top: TOP } = at;
  const BOTTOM = TOP + 5 * at.rowGap;

  const period = PERIOD[range];
  // the athlete's peak (as in the header) is a point of the line too: the end of a
  // day, which can fall inside a competition of several days
  const peakRow = athlete.peak_on ? history.find((contest) => contest.fought_on === athlete.peak_on) : undefined;
  const split = peakRow
    ? { day: new Date(peakRow.fought_on).getTime(), rating: peakRow.rating_after, score: peakRow.score_after, period: `Peak, ${formatDate(peakRow.fought_on)}` }
    : undefined;
  const points: Point[] = careerLine(history, inactive ? null : { day: now, rating: athlete.rating ?? 0, score: athlete.score ?? 0 }, period, split);
  const years = RANGES[range];
  // All: from SINCE (as the records), unless the whole career was before it
  const from = years === null ? (points.at(-1)!.day >= SINCE ? Math.max(points[0].day, SINCE) : points[0].day) : now - years * YEAR;
  const shown = points.filter((p) => p.day >= from);
  // the line comes in from the left edge, from the last point before the window
  const outside = points.filter((p) => p.day < from).at(-1);
  if (outside) shown.unshift({ ...outside, day: from, edge: true });
  const start = Math.min(from, shown[0].day);

  const values = shown.flatMap((p) => [p.rating, p.score]);
  const [low, step] = scale(Math.min(...values), Math.max(...values));
  const x = (day: number) => LEFT + ((day - start) / Math.max(now - start, 1)) * (RIGHT - LEFT);
  const y = (value: number) => BOTTOM - ((value - low) / (5 * step)) * (BOTTOM - TOP);
  const line = (key: "rating" | "score") => shown.map((p) => `${x(p.day)},${y(p[key])}`).join(" ");

  const last = shown[shown.length - 1];
  const real = shown.filter((p) => !p.edge);
  // the all-time peak of the header, when it is in the window
  const peak = athlete.peak_on ? real.find((p) => p.day === new Date(athlete.peak_on!).getTime()) : undefined;
  const peakLink = peakTableLink(athlete, today);
  // its label, over it (not over today's point, whose labels say it, unless the line
  // ends there: a career ended on it); the peak's tip goes above the label
  const labelled = peak !== undefined && (peak !== shown[shown.length - 1] || inactive !== null);
  const targets = real;
  const { hovered, touched, hold, plot, close } = useChartPointer<Point>(
    box,
    (e) => {
      const at = pointerX(e, LEFT, RIGHT);
      return targets.length ? nearest(targets, (p) => Math.abs(x(p.day) - at)) : null;
    },
    (p) => p.events.length > 0 && onPeriod(p.events),
  );
  // the hovered point is the peak (by its day: the points are made anew every render)
  const onPeak = peak !== undefined && hovered?.day === peak.day;
  // the tip's bottom: over the point, and over the Peak label when the point is the peak
  // or near it (the tip would cover the label, and the label is a link)
  const nearPeak = labelled && peak !== undefined && hovered !== null && Math.abs(x(hovered.day) - x(peak.day)) < (desktop ? 140 : 90);
  const tipY = hovered ? (nearPeak ? Math.min(y(hovered.score), y(peak!.score)) - LABEL_ROOM : y(hovered.score)) : 0;
  // a dot on a period with a competition
  const dotted = real.filter((p) => p.events.length > 0);
  // the dates under the plot, none too close to today's at its right edge
  const ticks = monthTicks(start, now, at.maxDates).filter((tick) => x(tick) < RIGHT - 90);
  // the end labels (Skill, −RD, Rating) next to the line's last point: at today's edge,
  // or, for an inactive athlete whose line ends earlier, right after that point (over
  // the inactive zone, on a paper halo)
  const labelX = inactive ? Math.min(x(last.day) + 12, at.width - (desktop ? 130 : 88)) : RIGHT + at.labels;
  // the Peak label (68 wide, centred over the peak) moved left so that it stops before
  // the end labels (Skill, uncertainty, Rating) and the plot's edge, right of its start
  const peakShift = peak ? shiftOf(x(peak.day), LEFT, (desktop ? Math.min(RIGHT, labelX) : RIGHT) - 6) : 0;

  // Inactive: no contest for over a year (out of the tables), between competitions or
  // since the last one. The rating holds, its uncertainty grows, so the score drifts
  // down: the zone says why.
  const days = points.flatMap((p) => p.events.map((c) => new Date(c.day).getTime()));
  const zones = [...days, now]
    .flatMap((day, i, all) => (i && day - all[i - 1] > AWAY ? [{ from: all[i - 1], to: day }] : []))
    .filter((zone) => zone.to > start)
    .map((zone) => ({ ...zone, x1: x(Math.max(zone.from, start)), x2: x(zone.to) }));

  return (
    <section id={SECTION.rating} ref={anchorRef} className="mb-0 mt-14 lg:mt-16">
      <div className="flex justify-between items-end mb-3 border-b-2 border-ink pb-2">
        <div className="min-w-0">
          <h2 className="font-serif font-bold text-[20px] sm:text-[24px] text-ink">{rank ? "Rank" : "Rating"}</h2>
        </div>
        <div className="flex items-center gap-4 text-sm shrink-0">
          {ranked && (
            <div className="flex items-center gap-3 pr-4 border-r border-rule" role="group" aria-label="Rating or rank">
              {(
                [
                  ["rating", "Rating"],
                  ["rank", "Rank"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={view === v ? "font-bold text-claret border-b-2 border-claret pb-0.5" : "text-muted hover:text-ink cursor-pointer"}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
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

      <div ref={box} className="w-full relative py-2 overflow-x-clip">
        {/* until the chart knows its width (after the page's script): its place,
            striped as a loading table, rather than a squeezed drawing */}
        {boxWidth === null ? (
          <ChartSkeleton className="h-[226px] md:h-auto md:aspect-[1000/280]" />
        ) : rank ? (
          // the column on the right for the latest places, an inactive athlete's too
          <RankChart
            places={places!}
            weight={weight!}
            start={start}
            now={now}
            // a desktop: a narrower column for the places than for the rating's labels
            at={desktop ? { ...base, right: base.width - 110 } : base}
            ends={desktop}
            run={run}
            onClear={() => onRun?.(null)}
            // out of the tables a year after the last contest: the rank's idle spells start then
            idle={zones.map((zone) => ({ from: zone.from + AWAY, to: zone.to }))}
          />
        ) : (
        <svg
          viewBox={`0 0 ${at.width} ${at.height}`}
          preserveAspectRatio="none"
          className="w-full h-auto overflow-visible block"
          // a finger sliding along the chart moves its line, not the page
          style={{ touchAction: "pan-y" }}
        >
          <g stroke="#D6CFC2" strokeWidth="0.8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={at.gridLeft} x2={RIGHT} y1={TOP + i * at.rowGap} y2={TOP + i * at.rowGap} />
            ))}
          </g>
          <g fill="#66605C" fontFamily={FONT} fontSize={at.font} textAnchor="end">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <text key={i} x={at.valuesX} y={TOP + i * at.rowGap + 4}>
                {low + (5 - i) * step}
              </text>
            ))}
          </g>
          <defs>
            <pattern id="inactive" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#D6CFC2" strokeWidth="2" />
            </pattern>
          </defs>
          {zones.map((zone) => (
            <g key={zone.from}>
              <rect x={zone.x1} y={TOP} width={Math.max(zone.x2 - zone.x1, 0)} height={BOTTOM - TOP} fill="url(#inactive)">
                <title>
                  No contest for over a year: out of the tables until the next one. The rating holds; its uncertainty
                  grows, so the score drifts down.
                </title>
              </rect>
              {zone.x2 - zone.x1 > 70 && (
                <text x={(zone.x1 + zone.x2) / 2} y={BOTTOM - 8} textAnchor="middle" fill="#66605C" fontFamily={FONT} fontSize="11">
                  Inactive
                </text>
              )}
            </g>
          ))}
          <polygon
            fill="#33302E"
            fillOpacity="0.08"
            points={`${line("rating")} ${[...shown].reverse().map((p) => `${x(p.day)},${y(p.score)}`).join(" ")}`}
          />
          <polyline fill="none" points={line("rating")} stroke="#66605C" strokeDasharray="4,3" strokeWidth="1.2" />
          <polyline fill="none" points={line("score")} stroke="#33302E" strokeWidth="2.5" />
          {/* the hovered competition's day, top to bottom */}
          {hovered && (
            <g pointerEvents="none">
              <line x1={x(hovered.day)} x2={x(hovered.day)} y1={TOP} y2={BOTTOM} stroke="#33302E" strokeOpacity="0.35" />
              {hovered.events.length === 0 && !onPeak && <circle cx={x(hovered.day)} cy={y(hovered.score)} r="5" fill="#33302E" />}
            </g>
          )}
          {/* the whole plot answers the pointer, a mouse or a finger: the nearest point by
              its day (the marks drawn over it let the pointer through) */}
          {targets.length > 0 && (
            <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOTTOM - TOP} fill="transparent" className="cursor-pointer" {...plot} />
          )}
          {dotsFit(dotted.length, RIGHT - LEFT) && (
            <g fill="#33302E" pointerEvents="none">
              {dotted
                .filter((p) => p !== peak)
                .map((p) => (
                  <circle key={p.day} cx={x(p.day)} cy={y(p.score)} r={p.day === hovered?.day ? 6 : 4} />
                ))}
            </g>
          )}
          {peak && qualifier !== null && (
            // fades at the reader's first move, as a table's marked row
            <g style={{ opacity: pulse ? 1 : 0, transition: "opacity 1.5s" }} pointerEvents="none">
              <circle cx={x(peak.day)} cy={y(peak.score)} fill="none" stroke="#990F3D" strokeWidth="1.5">
                <animate attributeName="r" values="5;14" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
          {peak && <circle cx={x(peak.day)} cy={y(peak.score)} fill="#990F3D" r={onPeak ? 6 : 4} pointerEvents="none" />}
          {last !== peak && <circle cx={x(last.day)} cy={y(last.score)} fill="#33302E" r="4" pointerEvents="none" />}
          {/* not over today's point (its labels say it), but over an inactive
              athlete's last contest when it was the peak (a career ended on it) */}
          {labelled && peak && (
            // the label opens the table of that week, at the athlete's row
            <PeakLabel
              x={x(peak.day)}
              y={y(peak.score)}
              score={athlete.peak_score ?? peak.score}
              shift={peakShift}
              href={peakLink}
              title={peakLink ? "The table of that week" : undefined}
              font={FONT}
            />
          )}
          {/* the end labels: a phone has them in the header over the chart */}
          {desktop && (
            <g fontFamily={FONT} fontSize="12" stroke="#F3EEE3" strokeWidth={inactive ? 4 : 0} paintOrder="stroke" strokeLinejoin="round">
              <text fill="#66605C" x={labelX} y={y(last.rating) + 4}>
                Skill {last.rating}
              </text>
              <line
                stroke="#D6CFC2"
                strokeWidth="0.8"
                x1={labelX + 4}
                x2={labelX + 4}
                y1={y(last.rating) + 11}
                y2={y(last.score) - 11}
              />
              <text fill="#66605C" x={labelX + 12} y={(y(last.rating) + y(last.score)) / 2 + 4}>
                −{last.rating - last.score}{desktop ? " uncertainty" : ""}
              </text>
              <text fill="#33302E" fontWeight="700" x={labelX} y={y(last.score) + 4}>
                Rating {last.score}
              </text>
            </g>
          )}
          <g fill="#66605C" fontFamily={FONT} fontSize={at.font} textAnchor="middle">
            {ticks.map((tick) => (
              <text key={tick} x={x(tick)} y={at.datesY}>
                {monthYear(new Date(tick).toISOString())}
              </text>
            ))}
            {/* at the plot's right edge: when it is the canvas's (inactive), ends there */}
            <text x={RIGHT} y={at.datesY} textAnchor={inactive || !desktop ? "end" : "middle"}>
              {monthYear(new Date(now).toISOString())}
            </text>
          </g>
        </svg>
        )}
        {/* the career's peak, when it is before the window: a way to it */}
        {/* (a peak before SINCE: not on the chart, no way to it) */}
        {!rank && boxWidth !== null && !peak && athlete.peak_on && athlete.peak_score !== null && range !== "All" && Date.parse(athlete.peak_on) >= SINCE && (
          <button
            type="button"
            onClick={() => setRange("All")}
            className="absolute top-3 inline-flex items-center h-4 pr-1.5 border border-claret bg-[#F3EEE3] hover:bg-[#EBD5D6] active:bg-[#E0BFC2] transition-colors text-[11px] leading-none font-semibold text-ink cursor-pointer"
            style={{ left: `${(LEFT / at.width) * 100}%`, fontFamily: FONT }}
            title={`Peak in ${monthYear(athlete.peak_on)}: show the whole career`}
          >
            <Icon size={14} name="chevron_left" className="text-claret" />
            Peak {athlete.peak_score}
          </button>
        )}
        {!rank && hovered && (
          <ChartTip left={(x(hovered.day) / at.width) * 100} top={(tipY / at.height) * 100} hold={hold} docked={touched}>
            <TipBody
              title={hovered.period}
              lines={[{ before: hovered.before, after: hovered.score, inactive: hovered.idle && !onPeak }]}
              places={tipPlaces(places, real[real.findIndex((p) => p.day === hovered.day) - 1]?.day ?? null, hovered.day)}
              action={
                touched && hovered.events.length > 0
                  ? {
                      label: "Show contests",
                      onClick: () => {
                        onPeriod(hovered.events);
                        close();
                      },
                    }
                  : undefined
              }
            >
              <TipEvents events={hovered.events} href={(c) => tournamentPath(c.id, c.weight)} />
            </TipBody>
          </ChartTip>
        )}
      </div>
      {/* the legend under the chart: the title and the switches alone over it; marked
          weeks' label in its place while they are on (the same height: nothing moves) */}
      <div className="mt-1 min-h-5 flex items-center">
        {rank && run ? (
          <div className="inline-flex items-center gap-1.5 pl-1.5 border border-claret bg-paper text-[11px] leading-4 font-semibold text-ink">
            {run.label}
            {/* one run: its months */}
            {run.spans.length === 1 &&
              (monthYear(run.spans[0].from) === monthYear(run.spans[0].to)
                ? `, ${monthYear(run.spans[0].from)}`
                : `, ${monthYear(run.spans[0].from)} – ${monthYear(run.spans[0].to)}`)}
            {onRun && (
              <button type="button" onClick={() => onRun(null)} aria-label="Take the mark off" title="Take the mark off (Esc)" className="px-1.5 text-claret hover:bg-claret/10 cursor-pointer">
                ×
              </button>
            )}
          </div>
        ) : rank ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="4" aria-hidden>
                <line x1="0" y1="2" x2="16" y2="2" stroke="#33302E" strokeWidth="2.5" />
              </svg>
              {weight!.replace("-", "−")} kg
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="4" aria-hidden>
                <line x1="0" y1="2" x2="16" y2="2" stroke="#66605C" strokeWidth="1.2" strokeDasharray="4,3" />
              </svg>
              P4P
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-2.5 bg-ink/[0.05] border border-rule inline-block" />
              Top 8
            </span>
            <span className="inline-flex items-center gap-1.5" title="No contest for over a year: out of the tables">
              <svg width="12" height="10" aria-hidden className="border border-rule">
                <rect width="12" height="10" fill="url(#inactive-legend)" />
                <defs>
                  <pattern id="inactive-legend" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="4" stroke="#D6CFC2" strokeWidth="1.5" />
                  </pattern>
                </defs>
              </svg>
              Inactive
            </span>
          </div>
        ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
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
          <span className="inline-flex items-center gap-1.5" title="No contest for over a year: out of the tables">
            <svg width="12" height="10" aria-hidden className="border border-rule">
              <rect width="12" height="10" fill="url(#inactive-legend)" />
              <defs>
                <pattern id="inactive-legend" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="4" stroke="#D6CFC2" strokeWidth="1.5" />
                </pattern>
              </defs>
            </svg>
            Inactive
          </span>
        </div>
        )}
      </div>
    </section>
  );
}
