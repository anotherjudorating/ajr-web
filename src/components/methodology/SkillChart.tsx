"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { scale, monthTicks } from "@/components/chart";
import { Figure } from "@/components/methodology/Figure";
import { MAX_RD, RD_GROWTH } from "@/components/methodology/glicko";
import { Medal, type MedalKind } from "@/components/Medal";
import data from "@/data/methodology.json";
import { formatDate, monthYear } from "@/lib/format";

// The athlete page's chart, in miniature and honest between tournaments: the skill
// (dashed) holds, the RD grows every day without a contest (RD² by 5² a day, 350 at
// most), so the rating (solid, skill − RD) drifts down until the next result moves
// both. The band between the lines is the uncertainty.

export type Stop = {
  day: string;
  skillAfter: number;
  rdAfter: number;
  skillBefore?: number; // before the first contest (a weight change steps the skill)
  rdBefore?: number;
  label: string;
  weight?: string;
  result?: string | null; // gold, silver, bronze, 5th
  aside?: string; // a word after the name, muted (the weight, a loss)
};

type Sample = { t: number; skill: number; rd: number; stop?: Stop; before?: boolean };

const DAY = 24 * 3600 * 1000;
const YEAR = 365 * DAY;
const FONT = "'IBM Plex Sans', sans-serif";
const t = (day: string) => new Date(day).getTime();
const grow = (rd: number, days: number) => Math.min(Math.sqrt(rd * rd + RD_GROWTH * RD_GROWTH * days), MAX_RD);

// The line's samples: every stop (its before and after), and a sample a month along
// every gap, with the RD grown.
function samples(stops: Stop[], until: number): Sample[] {
  const out: Sample[] = [];
  stops.forEach((s, i) => {
    const day = t(s.day);
    if (s.skillBefore !== undefined && s.rdBefore !== undefined) out.push({ t: day, skill: s.skillBefore, rd: s.rdBefore, stop: s, before: true });
    out.push({ t: day, skill: s.skillAfter, rd: s.rdAfter, stop: s });
    const next = i + 1 < stops.length ? t(stops[i + 1].day) : until;
    for (let d = day + 30 * DAY; d < next; d += 30 * DAY) out.push({ t: d, skill: s.skillAfter, rd: grow(s.rdAfter, (d - day) / DAY) });
    if (next > day) out.push({ t: next, skill: s.skillAfter, rd: grow(s.rdAfter, (next - day) / DAY) });
  });
  return out;
}

export type Reading = { stop: Stop; skill: number; rd: number; before: boolean } | { day: number; skill: number; rd: number; stop?: undefined };

export function SkillChart({
  stops,
  from,
  to,
  marked,
  onRead,
  zones = [],
  notes = [],
  height = 240,
}: {
  stops: Stop[];
  from?: string;
  to?: string;
  marked?: Stop | null; // the stop whose point is marked (a chosen moment)
  onRead?: (r: Reading | null) => void; // the pointer's reading
  zones?: { from: string; to: string; label: string }[]; // shaded stretches (another weight)
  // moments marked by a thin line and a label on top; on a phone the short label, and none of those marked wideOnly
  notes?: { day: string; label: string; short?: string; wideOnly?: boolean }[];
  height?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  const [hover, setHover] = useState<Sample | null>(null);

  const end = to ? t(to) : t(stops[stops.length - 1].day) + 60 * DAY;
  const start = from ? t(from) : t(stops[0].day) - 30 * DAY;
  const all = samples(stops, end);
  const shown = all.filter((s) => s.t >= start && s.t <= end);
  const outside = all.filter((s) => s.t < start).at(-1);
  if (outside) shown.unshift({ ...outside, t: start, rd: grow(outside.rd, (start - outside.t) / DAY), stop: undefined, before: undefined });

  const W = width ?? 640;
  const phone = W < 560;
  const LEFT = phone ? 40 : 50;
  const RIGHT = W - (phone ? 10 : 20);
  const TOP = notes.length ? 40 : 16;
  const BOTTOM = height - 30;
  const values = shown.flatMap((s) => [s.skill, s.skill - s.rd]);
  const [low, step] = scale(Math.min(...values), Math.max(...values));
  const x = (day: number) => LEFT + ((day - start) / Math.max(end - start, 1)) * (RIGHT - LEFT);
  const y = (v: number) => BOTTOM - ((v - low) / (5 * step)) * (BOTTOM - TOP);
  const r = (v: number) => Math.round(v * 10) / 10;
  const skillLine = shown.map((s) => `${r(x(s.t))},${r(y(s.skill))}`).join(" ");
  const ratingLine = shown.map((s) => `${r(x(s.t))},${r(y(s.skill - s.rd))}`).join(" ");
  const band = `${skillLine} ${[...shown].reverse().map((s) => `${r(x(s.t))},${r(y(s.skill - s.rd))}`).join(" ")}`;
  const ticks = monthTicks(start, end, phone ? 4 : 8);
  // over a year without a contest: hatched, as on the site
  const idle = stops
    .map((s, i) => ({ from: t(s.day), to: i + 1 < stops.length ? t(stops[i + 1].day) : end }))
    .filter((z) => z.to - z.from > YEAR && z.to > start && z.from < end);
  const dots = stops.filter((s) => t(s.day) >= start && t(s.day) <= end);

  const read = (clientX: number | null) => {
    if (clientX === null || !box.current) return setHover(null), onRead?.(null);
    const rect = box.current.getBoundingClientRect();
    const px = clientX - rect.left;
    const day = start + ((px - LEFT) / (RIGHT - LEFT)) * (end - start);
    let best = shown[0];
    // on a tie (a stop's before and after share its day) the later one: the after point, where the dot is
    for (const s of shown) if (Math.abs(s.t - day) <= Math.abs(best.t - day)) best = s;
    setHover(best);
    onRead?.(best.stop ? { stop: best.stop, skill: best.skill, rd: best.rd, before: Boolean(best.before) } : { day: best.t, skill: best.skill, rd: best.rd });
  };
  const mark = hover ?? (marked ? all.find((s) => s.stop === marked && !s.before) ?? null : null);

  return (
    <div ref={box} className="w-full relative" style={{ height }}>
      {width !== null && (
        <svg
          viewBox={`0 0 ${W} ${height}`}
          width={W}
          height={height}
          className="block overflow-visible select-none"
          style={{ touchAction: "pan-y" }}
          onPointerMove={(e) => read(e.clientX)}
          onPointerDown={(e) => read(e.clientX)}
          onPointerLeave={() => read(null)}
          role="img"
          aria-label="Skill and rating over time"
        >
          <defs>
            <pattern id="meth-idle" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#D6CFC2" strokeWidth="2" />
            </pattern>
          </defs>
          <g stroke="#D6CFC2" strokeWidth="0.8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={LEFT - 8} x2={RIGHT} y1={r(TOP + (i * (BOTTOM - TOP)) / 5)} y2={r(TOP + (i * (BOTTOM - TOP)) / 5)} />
            ))}
          </g>
          <g fill="#66605C" fontFamily={FONT} fontSize={phone ? 11 : 12} textAnchor="end">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <text key={i} x={LEFT - 12} y={r(TOP + (i * (BOTTOM - TOP)) / 5 + 4)}>
                {low + (5 - i) * step}
              </text>
            ))}
          </g>
          {zones
            .filter((z) => t(z.to) > start && t(z.from) < end)
            .map((z) => (
              <g key={z.from}>
                <rect x={r(x(Math.max(t(z.from), start)))} width={r(x(Math.min(t(z.to), end)) - x(Math.max(t(z.from), start)))} y={TOP} height={BOTTOM - TOP} fill="#990F3D" fillOpacity="0.07" />
                <text x={r((x(Math.max(t(z.from), start)) + x(Math.min(t(z.to), end))) / 2)} y={TOP + 12} textAnchor="middle" fill="#990F3D" fontFamily={FONT} fontSize="11" fontWeight="600">
                  {z.label}
                </text>
              </g>
            ))}
          {notes.filter((n) => !(phone && n.wideOnly)).map((n, k) => {
            const nx = x(t(n.day));
            const row = phone ? 0 : k % 2; // a phone's few labels fit on one row
            if (nx < LEFT || nx > RIGHT) return null;
            const anchor = nx < LEFT + 40 ? "start" : nx > RIGHT - 40 ? "end" : "middle";
            return (
              <g key={n.day} pointerEvents="none">
                <line x1={r(nx)} x2={r(nx)} y1={row ? 28 : 14} y2={BOTTOM} stroke="#990F3D" strokeOpacity="0.45" />
                <text x={r(nx)} y={row ? 24 : 10} textAnchor={anchor} fill="#990F3D" fontFamily={FONT} fontSize={phone ? 10 : 11} fontWeight="600">
                  {phone && n.short ? n.short : n.label}
                </text>
              </g>
            );
          })}
          {idle.map((z) => (
            <g key={z.from}>
              <rect x={r(x(Math.max(z.from, start)))} width={r(x(Math.min(z.to, end)) - x(Math.max(z.from, start)))} y={TOP} height={BOTTOM - TOP} fill="url(#meth-idle)" />
              {x(Math.min(z.to, end)) - x(Math.max(z.from, start)) > 70 && (
                <text x={r((x(Math.max(z.from, start)) + x(Math.min(z.to, end))) / 2)} y={BOTTOM - 8} textAnchor="middle" fill="#66605C" fontFamily={FONT} fontSize="11">
                  Inactive
                </text>
              )}
            </g>
          ))}
          <polygon fill="#33302E" fillOpacity="0.08" points={band} />
          <polyline fill="none" points={skillLine} stroke="#66605C" strokeDasharray="4,3" strokeWidth="1.2" />
          <polyline fill="none" points={ratingLine} stroke="#33302E" strokeWidth="2.5" />
          <g fill="#33302E">
            {dots.map((s) => (
              <circle key={s.day} cx={r(x(t(s.day)))} cy={r(y(s.skillAfter - s.rdAfter))} r={phone ? 2.5 : 3.5} />
            ))}
            {dots
              .filter((s) => {
                // a change of weight only: the skill's step, before the first contest there
                const k = stops.indexOf(s);
                return k > 0 && s.weight !== undefined && stops[k - 1].weight !== s.weight && s.skillBefore !== undefined && s.rdBefore !== undefined;
              })
              .map((s) => (
                <circle key={`${s.day}-step`} cx={r(x(t(s.day)))} cy={r(y(s.skillBefore! - s.rdBefore!))} r={3} fill="#F3EEE3" stroke="#33302E" strokeWidth="1.5" />
              ))}
          </g>
          {mark && (
            <g pointerEvents="none">
              <line x1={r(x(mark.t))} x2={r(x(mark.t))} y1={TOP} y2={BOTTOM} stroke="#33302E" strokeOpacity="0.35" />
              <circle cx={r(x(mark.t))} cy={r(y(mark.skill - mark.rd))} r="5" fill="#990F3D" />
            </g>
          )}
          <g fill="#66605C" fontFamily={FONT} fontSize={phone ? 11 : 12} textAnchor="middle">
            {ticks.map((tick) => (
              <text key={tick} x={r(x(tick))} y={height - 8}>
                {monthYear(new Date(tick).toISOString())}
              </text>
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}

// The legend the athlete page's chart has, and the reading of one point.
function Legend() {
  return (
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
        Uncertainty (RD)
      </span>
    </div>
  );
}


// The three numbers of one point, as the chart's end labels on the site.
// A tournament in the readout: its name, the site's medal, and a muted word (the weight, a loss).
const MEDALS = ["gold", "silver", "bronze"];
function StopTitle({ stop }: { stop: Stop }) {
  return (
    <>
      <span className="font-semibold">{stop.label}</span>
      {stop.result && MEDALS.includes(stop.result) && <Medal kind={stop.result as MedalKind} className="inline-block align-[-3px] ml-1.5 w-3.5 h-[18px]" />}
      {stop.aside && <span className="ml-1.5 text-muted">{stop.aside}</span>}
    </>
  );
}

function Readout({ title, skill, rd, note, tall = false }: { title: ReactNode; skill: number; rd: number; note?: ReactNode; tall?: boolean }) {
  // tall: room for a note of two lines kept, so the chart does not move when one appears
  return (
    <div className={`${tall ? "min-h-[84px]" : "min-h-[44px]"} text-[13px] tabular-nums`}>
      <div className="text-ink">{title}</div>
      <div className="text-muted whitespace-nowrap">
        skill <b className="text-ink">{Math.round(skill)}</b> − RD <b className="text-ink">{Math.round(rd)}</b> = rating{" "}
        <b className="text-claret">{Math.round(skill - rd)}</b>
      </div>
      {note && <div className="text-[12px] text-muted">{note}</div>}
    </div>
  );
}

// Riner's career as the site draws one, with his moments and a zoom on the years
// when the gap between the lines changed most: after the loss to Kageura, a year
// away, Tokyo.
const NOTES = [
  { day: "2012-07-28", label: "London 2012", short: "London" },
  { day: "2016-08-06", label: "Rio 2016", short: "Rio" },
  { day: "2020-02-09", label: "Lost to Kageura", wideOnly: true },
  { day: "2021-07-30", label: "Lost to Bashaev", wideOnly: true },
  { day: "2024-08-02", label: "Paris 2024", short: "Paris" },
];
const LOSSES: Record<string, string> = { "2020-02-09": "lost to Kageura", "2021-07-30": "lost to Bashaev" };
type CareerPoint = { day: string; skill: number; rd: number; name: string; result: string | null };
const RINER: Stop[] = (data.stories.career.points as CareerPoint[]).map((p) => ({
  day: p.day,
  skillAfter: p.skill,
  rdAfter: p.rd,
  label: p.name,
  result: p.result,
  aside: LOSSES[p.day],
}));

export function RinerCareer() {
  const [reading, setReading] = useState<Reading | null>(null);
  const last = RINER[RINER.length - 1];
  const shown = reading ?? { stop: last, skill: last.skillAfter, rd: last.rdAfter, before: false };
  return (
    <Figure
      title="Teddy Riner, 2009 to 2024"
      caption="Between tournaments the RD grows, so the rating goes down."
    >
      <div className="mb-3">
        <Legend />
      </div>
      <Readout
        title={shown.stop ? <StopTitle stop={shown.stop} /> : formatDate(new Date(shown.day).toISOString())}
        skill={shown.skill}
        rd={shown.rd}
      />
      <SkillChart stops={RINER} to="2024-10-01" onRead={setReading} notes={NOTES} height={270} />
    </Figure>
  );
}

// Grigalashvili's four years: his home weight −81 kg, two trips to −90 kg a year, and
// the step the skill takes at each change: × 0.95 going up, × 1.05 coming back.
type Trip = { day: string; weight: string; name: string; rank: string; skillBefore: number; rdBefore: number; skillAfter: number; rdAfter: number; result: string | null };
const TATO = data.stories.weights as { name: string; athlete_id: number; home: string; tournaments: Trip[] };
const WEIGHT = (w: string) => `${w.replace("-", "−")} kg`;

export function WeightMoves() {
  const stops: Stop[] = TATO.tournaments.map((x) => ({ day: x.day, skillBefore: x.skillBefore, rdBefore: x.rdBefore, skillAfter: x.skillAfter, rdAfter: x.rdAfter, label: x.name, weight: x.weight, result: x.result, aside: WEIGHT(x.weight) }));
  // a stay at another weight: from its first tournament to a fortnight after its last
  const after = (day: string, days: number) => new Date(t(day) + days * DAY).toISOString().slice(0, 10);
  const zones = TATO.tournaments.reduce<{ from: string; to: string; label: string }[]>((acc, x, i) => {
    if (x.weight === TATO.home) return acc;
    const last = acc[acc.length - 1];
    const previous = TATO.tournaments[i - 1];
    if (last && previous && previous.weight === x.weight) last.to = after(x.day, 14);
    else acc.push({ from: after(x.day, -14), to: after(x.day, 14), label: WEIGHT(x.weight) });
    return acc;
  }, []);
  const [reading, setReading] = useState<Reading | null>(null);
  const latest = TATO.tournaments[TATO.tournaments.length - 1];
  const shown = reading ?? { stop: stops[stops.length - 1], skill: latest.skillAfter, rd: latest.rdAfter, before: false };
  const trip = shown.stop ? TATO.tournaments.find((x) => x.day === shown.stop!.day) : undefined;
  const previous = trip ? TATO.tournaments[TATO.tournaments.indexOf(trip) - 1] : undefined;
  const moved = trip && previous && previous.weight !== trip.weight;
  return (
    <Figure title={`${TATO.name}, 2023 to 2026`} caption="Shaded: at −90 kg. At each change of weight the skill steps once: × 0.95 going up, × 1.05 coming back down.">
      <div className="mb-3">
        <Legend />
      </div>
      <Readout
        tall
        title={shown.stop ? <StopTitle stop={shown.stop} /> : formatDate(new Date((shown as { day: number }).day).toISOString())}
        skill={shown.skill}
        rd={shown.rd}
        note={
          trip && moved
            ? `Moved ${trip.weight < previous.weight ? "down" : "up"} from ${WEIGHT(previous.weight)}: skill ${previous.skillAfter} × ${trip.weight < previous.weight ? "1.05" : "0.95"} = ${trip.skillBefore} before the first contest, ${trip.skillAfter} after.`
            : undefined
        }
      />
      <SkillChart stops={stops} from="2023-01-01" to="2026-12-31" zones={zones} onRead={setReading} />
    </Figure>
  );
}
