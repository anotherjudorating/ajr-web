import Link from "next/link";
import { Fragment, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Arrow } from "@/components/Icon";
import type { HistoryRow } from "@/lib/api";
import { type Places, placeOn } from "@/lib/places";
import { formatDate, monthYear, signed } from "@/lib/format";

// What the site's line charts (an athlete's rating, head-to-head, a nation's) share:
// the value scale, the dates under the plot, the nearest point to the pointer and
// the tip over it.

export const PEAK = "#990F3D"; // claret: the peak, as in the athlete's header
export const INK = "#33302E";

// The bottom grid line and the step: six round lines covering low..high, the
// smallest step that holds them (so the line fills the plot).
const STEPS = [10, 20, 25, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500];
export function scale(low: number, high: number): [number, number] {
  for (const step of STEPS) {
    const top = Math.ceil(high / step) * step;
    if (top - 5 * step <= low) return [top - 5 * step, step];
  }
  return [Math.floor(low / 1000) * 1000, 1000];
}

// First days of months every 1, 3, 6, 12 or 24 months, at most `most`, not too close
// to the end (today's date is written there).
export function monthTicks(start: number, end: number, most: number): number[] {
  const months = (end - start) / (30.44 * 24 * 3600 * 1000);
  const every = [1, 3, 6, 12, 24, 48, 96].find((n) => months / n <= most) ?? 192;
  const ticks: number[] = [];
  const date = new Date(start);
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + 1);
  while (date.getTime() < end) {
    const index = date.getUTCFullYear() * 12 + date.getUTCMonth();
    const tooClose = (end - date.getTime()) / (end - start) < 0.6 / most;
    if (index % every === (every === 6 ? 4 : 0) && !tooClose) ticks.push(date.getTime());
    date.setUTCMonth(date.getUTCMonth() + 1);
  }
  return ticks;
}

// A chart's points by its range: a week (1Y), a month (4Y) or a quarter (All),
// about fifty whatever the range.
export type Range = "1Y" | "4Y" | "All";
export type Period = "week" | "month" | "quarter";
export const PERIOD: Record<Range, Period> = { "1Y": "week", "4Y": "month", All: "quarter" };
const DAY = 24 * 3600 * 1000;

// A period's name, for the tip: "Week of 3 Nov 2025", "Nov 2025", "Q4 2025".
export function periodName(period: Period, day: number): string {
  const date = new Date(day);
  if (period === "week") return `Week of ${formatDate(new Date(day - 6 * DAY).toISOString().slice(0, 10))}`;
  if (period === "month") return monthYear(date.toISOString());
  return `Q${Math.floor(date.getUTCMonth() / 3) + 1} ${date.getUTCFullYear()}`;
}

// The ends of the periods from `from` to before `to`: Sundays, the last days of
// months or of quarters.
export function periodEnds(period: Period, from: number, to: number): number[] {
  const ends: number[] = [];
  const date = new Date(from);
  date.setUTCHours(0, 0, 0, 0);
  if (period === "week") {
    date.setUTCDate(date.getUTCDate() + ((7 - date.getUTCDay()) % 7)); // the Sunday on or after
    for (; date.getTime() < to; date.setUTCDate(date.getUTCDate() + 7)) ends.push(date.getTime());
    return ends;
  }
  const months = period === "month" ? 1 : 3;
  let month = date.getUTCFullYear() * 12 + date.getUTCMonth();
  month = Math.floor(month / months) * months; // the period's first month
  for (;;) {
    const end = Date.UTC(Math.floor((month + months) / 12), (month + months) % 12, 1) - DAY;
    if (end >= to) return ends;
    if (end >= from) ends.push(end);
    month += months;
  }
}

// A value between the days it is known on (straight between them); null outside.
export function between(known: { day: number; value: number }[], day: number): number | null {
  const after = known.findIndex((k) => k.day >= day);
  if (after < 0) return null;
  if (known[after].day === day) return known[after].value;
  if (after === 0) return null;
  const [a, b] = [known[after - 1], known[after]];
  return Math.round(a.value + ((b.value - a.value) * (day - a.day)) / (b.day - a.day));
}

export type Competition = {
  id: number;
  name: string;
  weight: string | null;
  day: string; // its last contest
  scoreBefore: number; // before its first contest
  scoreAfter: number; // after its last
};

// A point of an athlete's line: the end of a period (its name, the score at its
// start, the competitions in it; idle without any).
export type LinePoint = {
  day: number;
  rating: number;
  score: number;
  period: string;
  before: number | null;
  events: Competition[];
  idle: boolean;
};

// An athlete's line: a point at the end of every period (week, month, quarter by
// the range), honest between competitions (the scores drift down to what the next
// one started from, as the uncertainty grows), the period's competitions with it,
// so every point is as easy to pick as the next; the last today (`today`), or at the
// last contest for an inactive athlete (null).
export function careerLine(history: HistoryRow[], today: { day: number; rating: number; score: number } | null, period: Period): LinePoint[] {
  if (history.length === 0) return today ? [{ ...today, period: "Today", before: null, events: [], idle: true }] : [];
  // every competition's first contest (history is latest first) and its last
  const first = new Map<number, HistoryRow>();
  for (const contest of history) first.set(contest.competition_id, contest);
  const seen = new Set<number>();
  const competitions: (Competition & { at: number })[] = [];
  const known: { day: number; rating: number; score: number }[] = [];
  for (const contest of history) {
    if (seen.has(contest.competition_id)) continue;
    seen.add(contest.competition_id);
    const start = first.get(contest.competition_id)!;
    const at = new Date(contest.fought_on).getTime();
    competitions.unshift({
      at,
      id: contest.competition_id,
      name: contest.competition,
      weight: contest.weight,
      day: contest.fought_on,
      scoreBefore: start.score_before,
      scoreAfter: contest.score_after,
    });
    known.unshift({ day: at, rating: contest.rating_after, score: contest.score_after });
    // not before the debut: the starting score, far below, says nothing
    // (a moment before its first day's end: on a one-day competition the day itself
    // is the result's)
    if (start !== history.at(-1)) known.unshift({ day: new Date(start.fought_on).getTime() - 1, rating: start.rating_before, score: start.score_before });
  }
  if (today) known.push(today);
  known.sort((a, b) => a.day - b.day);
  const on = (key: "rating" | "score", day: number) => between(known.map((k) => ({ day: k.day, value: k[key] })), day) ?? known[0][key];
  const firstDay = known[0].day;
  const lastDay = known.at(-1)!.day;
  // the periods' ends, and the line's own end (today, or the last contest)
  const days = [...periodEnds(period, firstDay, lastDay), lastDay];
  return days.map((day, i) => {
    const after = i ? days[i - 1] : firstDay - 1;
    const events: Competition[] = competitions.filter((c) => c.at > after && c.at <= day);
    return {
      day,
      rating: on("rating", day),
      score: on("score", day),
      period: today && day === lastDay ? "Today" : periodName(period, day),
      before: i ? on("score", days[i - 1]) : null,
      events,
      idle: events.length === 0,
    };
  });
}

// The competitions of a point, for a tip: each a link to its page of that weight,
// with what it changed.
export function TipEvents({ events, href }: { events: Competition[]; href: (c: Competition) => string }) {
  return (
    <>
      {events.map((c) => (
        <div key={c.id} className="mt-0.5 flex items-center justify-between gap-3">
          <Link href={href(c)} className="text-ink underline decoration-rule underline-offset-2 hover:decoration-ink truncate max-w-[220px]">
            {c.name.replace(/\s+Individuals?$/i, "")}
          </Link>
          <span className={`font-semibold tabular-nums ${c.scoreAfter >= c.scoreBefore ? "text-gain" : "text-drop"}`}>{signed(c.scoreAfter - c.scoreBefore)}</span>
        </div>
      ))}
    </>
  );
}

// A chart's place while it cannot be drawn yet (its width unknown): grid lines and
// pulsing stripes, as a loading table's rows. `className` gives it the chart's size.
export function ChartSkeleton({ className }: { className: string }) {
  return (
    <div className={`w-full flex flex-col justify-between py-3 ${className}`} aria-hidden>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-2.5 w-8 bg-rule/60 animate-pulse" />
          <div className="flex-1 border-t border-rule" />
        </div>
      ))}
    </div>
  );
}

// Dots on the points only when they stand apart (8px of the drawing between two on
// average); the line alone otherwise. The pointer finds the points either way.
export const dotsFit = (count: number, width: number) => count <= 1 || width / (count - 1) >= 8;

export function nearest<T>(items: T[], distance: (item: T) => number): T {
  return items.reduce((best, item) => (distance(item) < distance(best) ? item : best));
}

// The plot's x in the viewBox under the pointer, for an element that spans
// left..right of it.
export function pointerX(e: React.MouseEvent<Element>, left: number, right: number): number {
  const box = e.currentTarget.getBoundingClientRect();
  return left + ((e.clientX - box.left) / box.width) * (right - left);
}

// The box over the hovered point, its bottom 12px above it.
// With `hold` (useTipHover's), the pointer can move onto it: it stays, its link
// clickable.
// `docked` (a touch's): at the chart's top, not over the point, where the finger is.
// Centred over the point, but moved to stay inside the chart (a tip past the edge
// would widen the page).
export function ChartTip({ left, top, hold, docked = false, children }: { left: number; top: number; hold?: TipHold; docked?: boolean; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [dx, setDx] = useState(0);
  useLayoutEffect(() => {
    const tip = box.current;
    const chart = tip?.offsetParent as HTMLElement | null;
    if (!tip || !chart) return;
    const width = tip.offsetWidth;
    const center = (left / 100) * chart.clientWidth;
    const from = Math.min(Math.max(center - width / 2, 0), Math.max(chart.clientWidth - width, 0));
    setDx(from - (center - width / 2));
  }, [left, children]);
  return (
    <div
      ref={box}
      className={`absolute z-30 bg-paper border border-rule px-2.5 py-1.5 text-[12px] leading-tight whitespace-nowrap shadow-sm ${hold ? "" : "pointer-events-none"}`}
      style={
        docked
          ? { left: `${left}%`, top: 0, transform: `translateX(calc(-50% + ${dx}px))` }
          : { left: `${left}%`, top: `calc(${top}% - 12px)`, transform: `translate(calc(-50% + ${dx}px), -100%)` }
      }
      {...hold}
    >
      {children}
    </div>
  );
}

// The hovered point, kept a moment after the pointer leaves the plot, so that it can
// reach the tip (which holds it while the pointer is on it).
type TipHold = { onMouseEnter: () => void; onMouseLeave: () => void };
export function useTipHover<T>(): { hovered: T | null; hover: (value: T) => void; leave: () => void; hold: TipHold } {
  const [hovered, setHovered] = useState<T | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const keep = () => window.clearTimeout(timer.current);
  const leave = () => {
    keep();
    timer.current = window.setTimeout(() => setHovered(null), 250);
  };
  const hover = (value: T) => {
    keep();
    setHovered(value);
  };
  return { hovered, hover, leave, hold: { onMouseEnter: keep, onMouseLeave: leave } };
}

// A chart's plot answering a mouse and a finger alike (Pointer Events). A mouse
// hovers (the tip follows, a click acts on the point); a finger taps a point or slides
// along the plot (the tip stays when it lifts, at the chart's top, the point's action
// in the tip), and a tap outside the chart closes it. Up-and-down stays the page's
// scroll (touch-action: pan-y). Nothing shows until then.
// `area`: the chart's box (a tap outside it closes the tip).
export function useChartPointer<T>(
  area: React.RefObject<HTMLElement | null>,
  pick: (e: React.PointerEvent<Element>) => T | null,
  act?: (value: T) => void,
) {
  const { hovered, hover, leave, hold } = useTipHover<T>();
  const [touched, setTouched] = useState(false);
  const start = useRef<{ x: number; y: number; sliding: boolean } | null>(null);
  const lastType = useRef("mouse");
  const close = () => {
    setTouched(false);
    leave();
  };
  useEffect(() => {
    if (!touched) return;
    const outside = (e: PointerEvent) => {
      if (!area.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  });
  const show = (e: React.PointerEvent<Element>) => {
    const value = pick(e);
    if (value !== null) hover(value);
  };
  const plot = {
    style: { touchAction: "pan-y" },
    onPointerDown: (e: React.PointerEvent<Element>) => {
      lastType.current = e.pointerType;
      if (e.pointerType !== "mouse") start.current = { x: e.clientX, y: e.clientY, sliding: false };
    },
    onPointerMove: (e: React.PointerEvent<Element>) => {
      if (e.pointerType === "mouse") return show(e);
      const from = start.current;
      if (!from) return;
      // a slide along the plot (not the page's scroll): the tip follows the finger
      if (!from.sliding && Math.abs(e.clientX - from.x) > 8 && Math.abs(e.clientX - from.x) > Math.abs(e.clientY - from.y)) {
        from.sliding = true;
        setTouched(true);
      }
      if (from.sliding) show(e);
    },
    onPointerUp: (e: React.PointerEvent<Element>) => {
      const from = start.current;
      start.current = null;
      if (e.pointerType === "mouse" || !from || from.sliding) return;
      if (Math.hypot(e.clientX - from.x, e.clientY - from.y) < 10) {
        setTouched(true);
        show(e);
      }
    },
    onPointerCancel: () => {
      start.current = null;
    },
    onPointerLeave: (e: React.PointerEvent<Element>) => {
      if (e.pointerType === "mouse") leave();
    },
    onClick: () => {
      if (lastType.current === "mouse" && hovered !== null) act?.(hovered);
    },
  };
  return { hovered, touched, hold, plot, close };
}

// A competition in a tip: its name and day.
export function TipHeading({ name, day }: { name: string; day: string }) {
  return (
    <>
      <div className="font-semibold text-ink">{name}</div>
      <div className="text-muted mt-0.5">{formatDate(day)}</div>
    </>
  );
}

// The rating before → after, and the change.
export function TipChange({ before, after, muted = false }: { before: number; after: number; muted?: boolean }) {
  const change = after - before;
  return (
    <span className="tabular-nums">
      <span className="text-ink">
        {before}
        <Arrow />
        {after}
      </span>{" "}
      <span className={`font-bold ${muted || change === 0 ? "text-muted" : change > 0 ? "text-gain" : "text-drop"}`}>
        {signed(change)}
      </span>
    </span>
  );
}

// What every chart's tip says: what (a competition, a period), when, then a line a
// side (the rating at its start › at its end; an athlete not at the competition
// drifting, in grey) and the places (Rank, P4P) at its start › at its end.
export type TipLine = { color?: string; name?: string; before: number | null; after: number; inactive?: boolean; extra?: ReactNode };
export type TipPlace = { label: string; before: number | null; after: number | null };
// `action`: what a click on the point does with a mouse, as a button for a finger.
export function TipBody({ title, href, day, lines, places = [], action, children }: {
  title: string;
  href?: string;
  day?: string;
  lines: TipLine[];
  places?: TipPlace[];
  action?: { label: string; onClick: () => void };
  children?: ReactNode; // after the lines: the period's competitions
}) {
  return (
    <>
      {href ? (
        <Link href={href} className="block font-semibold text-ink underline decoration-rule underline-offset-2 hover:decoration-ink">
          {title}
        </Link>
      ) : (
        <div className="font-semibold text-ink">{title}</div>
      )}
      {day && <div className="text-muted mt-0.5">{day}</div>}
      {lines.map((line, i) => (
        <Fragment key={i}>
        {/* the next athlete apart from the one before and their competitions */}
        <div className={`${i > 0 && line.color ? "mt-2.5 sm:mt-2" : "mt-1"} flex items-center gap-1.5`}>
          {line.color && <span className="w-3 h-[3px] shrink-0" style={{ background: line.color }} />}
          {line.name && <span className="text-muted">{line.name}</span>}
          {line.before === null ? (
            <span className="font-bold text-ink tabular-nums">{line.after}</span>
          ) : (
            <TipChange before={line.before} after={line.after} muted={line.inactive} />
          )}
          {line.inactive && <span className="text-muted">inactive</span>}
        </div>
        {line.extra && <div className={line.color ? "pl-[18px]" : ""}>{line.extra}</div>}
        </Fragment>
      ))}
      {children}
      <TipPlaces places={places} />
      {action && (
        <button type="button" onClick={action.onClick} className="mt-1.5 text-[12px] font-semibold text-claret cursor-pointer">
          {action.label}
        </button>
      )}
    </>
  );
}

// The places rows of a tip (Rank, P4P: at the start › at the end).
export function TipPlaces({ places }: { places: TipPlace[] }) {
  return (
    <>
      {places
        .filter((place) => place.after !== null)
        .map((place) => (
          <div key={place.label} className="mt-0.5 flex items-center gap-1.5 text-muted tabular-nums">
            <span className="w-8">{place.label}</span>
            {place.before !== null && place.before !== place.after && (
              <span>
                #{place.before}
                <Arrow />
              </span>
            )}
            <span className="text-ink">#{place.after}</span>
          </div>
        ))}
    </>
  );
}

// A point's places for its tip: in the weight's table and pound for pound, at the
// period's start (the point before) › at its end. None without the places file.
export function tipPlaces(places: Places | null, from: number | null, to: number): TipPlace[] {
  const end = placeOn(places, to);
  if (!end) return [];
  const start = from === null ? null : placeOn(places, from);
  return [
    { label: "Rank", before: start?.place ?? null, after: end.place },
    { label: "P4P", before: start?.p4p ?? null, after: end.p4p },
  ];
}

// The peak's label over its point: "Peak 2369" in a claret frame, moved by `shift`
// to stay inside the plot. A link when `href` is given.
export function PeakLabel({ x, y, score, shift = 0, href, title, font }: {
  x: number;
  y: number;
  score: number;
  shift?: number;
  href?: string | null;
  title?: string;
  font: string;
}) {
  const label = (
    <g transform={`translate(${x}, ${y})`}>
      {title && <title>{title}</title>}
      <rect
        className={href ? "fill-[#F3EEE3] group-hover:fill-[#EBD5D6] group-active:fill-[#E0BFC2] transition-colors" : "fill-[#F3EEE3]"}
        height="16"
        stroke={href ? PEAK : "#D6CFC2"}
        strokeWidth="0.8"
        width="68"
        x={-34 + shift}
        y="-24"
      />
      <text fill={INK} fontFamily={font} fontSize="11" fontWeight="600" textAnchor="middle" x={shift} y="-12">
        Peak {score}
      </text>
    </g>
  );
  return href ? (
    // a Next link (inside the svg it is an svg <a>): the table opens without a reload
    <Link href={href} className="group cursor-pointer">
      {label}
    </Link>
  ) : (
    label
  );
}

// How far the 68-wide peak label moves left so that it ends before `right` and
// starts after `left`.
export function peakShift(center: number, left: number, right: number): number {
  const shift = Math.min(0, right - (center + 34));
  return Math.max(shift, left - (center - 34));
}
