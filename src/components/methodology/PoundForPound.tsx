"use client";

import { useEffect, useRef, useState } from "react";

import { Flag } from "@/components/Flag";
import Link from "@/components/Link";
import { Figure } from "@/components/methodology/Figure";
import data from "@/data/methodology.json";
import { useI18n } from "@/i18n/client";
import { shortName, signed } from "@/lib/format";
import { MEN, WOMEN } from "@/lib/weights";

// The pound-for-pound and the nations' leaderboards, as figures: every weight's top
// eight and the top eight nations on one day (src/data/methodology.json, written by
// scripts/methodology-p4p.mjs from the bench, the backend's formulas in its header).

type Gender = "men" | "women";
type Athlete = { id: number; family: string; given: string | null; ioc: string | null; rating: number; place: number; p4p?: number };
type Column = { weight: string; athletes: Athlete[] };
const P4P = data.p4p as { day: string; men: Column[]; women: Column[] };

type Cell = { id: number; family: string; given: string | null; rating: number; nationPlace: number } | null;
type Row = { place: number; ioc: string; name: string; rating: number; led: number; top8: number; cells: Cell[] };
type Table = { weights: { weight: string; last: number }[]; rows: Row[] };
const NATIONS = data.nations as { day: string; men: Table; women: Table };

const FONT = "'IBM Plex Sans', sans-serif";
const WEIGHTS = { men: MEN, women: WOMEN };

// Men or women, the site's button pair.
function GenderToggle({ value, onChange }: { value: Gender; onChange: (g: Gender) => void }) {
  const { d } = useI18n();
  return (
    <div className="flex items-center gap-2 mb-4">
      {(["men", "women"] as const).map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          aria-pressed={value === g}
          className={`h-8 px-2.5 border text-[12px] sm:text-[13px] font-semibold cursor-pointer ${value === g ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:border-ink"}`}
        >
          {d.common.gender[g]}
        </button>
      ))}
    </div>
  );
}

// A name cut to what fits a column of the chart (about 6.2px a character at 11px).
const clip = (name: string, width: number) => {
  const fits = Math.max(4, Math.floor((width - 6) / 6.2));
  return name.length > fits ? `${name.slice(0, fits - 1)}…` : name;
};

// The width of a box, for an svg drawn to fit it.
function useWidth() {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  return { box, width };
}

// A column's athletes on the common scale: each at rating − the average of the leader's
// seven rivals, so the rivals sit around zero and the leader at their gap. A candidate's
// own gap (the top three) is against the seven best others, as the backend counts it.
function offsets(column: Column) {
  const rivals = column.athletes.slice(1);
  const pack = rivals.reduce((s, a) => s + a.rating, 0) / rivals.length;
  const gapOf = (a: Athlete) => {
    const others = column.athletes.filter((o) => o.id !== a.id).slice(0, 7);
    return Math.round(a.rating - others.reduce((s, o) => s + o.rating, 0) / others.length);
  };
  return column.athletes.map((a) => ({ a, offset: a.rating - pack, gap: a.p4p ? gapOf(a) : null }));
}

type Dot = { a: Athlete; weight: string; offset: number; gap: number | null };

const ALL_OFFSETS = (["men", "women"] as const).flatMap((g) => P4P[g].flatMap((c) => offsets(c).map((o) => o.offset)));
const Y_MIN = Math.floor(Math.min(...ALL_OFFSETS) / 100) * 100;
const Y_MAX = Math.ceil(Math.max(...ALL_OFFSETS) / 100) * 100;

// On a phone the seven columns turn into rows, as plain as it gets and not interactive:
// each weight's rivals around the zero line, the leader at their gap, the leader's
// flag, name and gap at the right.
const ROW_H = 34;
function Rows({ dots, width, labels }: { dots: Dot[][]; width: number; labels: string[] }) {
  const LABEL = 40; // the weight
  const NAME = 116; // the leader's name and gap
  const x0 = LABEL + 4;
  const x1 = width - NAME - 6;
  const x = (v: number) => x0 + ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (x1 - x0);
  const r = (v: number) => Math.round(v * 10) / 10;
  const H = ROW_H * dots.length;
  return (
    <>
      <svg viewBox={`0 0 ${width} ${H}`} width={width} height={H} className="block" aria-hidden>
        <line x1={r(x(0))} x2={r(x(0))} y1={0} y2={H} stroke="#66605C" strokeWidth="1" strokeDasharray="4,3" />
        {dots.map((row, i) => {
          const lead = row[0];
          const cy = ROW_H * i + ROW_H / 2;
          return (
            <g key={lead.weight}>
              {lead.a.p4p === 1 && <rect x={0} y={ROW_H * i} width={width} height={ROW_H} fill="#990F3D" fillOpacity="0.06" />}
              <text x={2} y={cy + 4} fontFamily={FONT} fontSize="12" fontWeight="600" fill="#33302E">
                {labels[i]}
              </text>
              <line x1={r(x(0))} x2={r(x(lead.offset))} y1={cy} y2={cy} stroke="#990F3D" strokeWidth="2.5" strokeOpacity="0.3" />
              {row.slice(1).map((o) => (
                <circle key={o.a.id} cx={r(x(o.offset))} cy={cy} r="2.5" fill="#66605C" fillOpacity="0.6" />
              ))}
              <circle cx={r(x(lead.offset))} cy={cy} r="4.5" fill="#990F3D" />
            </g>
          );
        })}
      </svg>
      {dots.map((row, i) => {
        const lead = row[0];
        return (
          <div
            key={lead.weight}
            className="absolute flex items-center justify-end gap-1 text-[11px] leading-none"
            style={{ right: 0, width: NAME, top: ROW_H * i, height: ROW_H }}
          >
            <Flag ioc={lead.a.ioc} />
            <span className="truncate font-semibold text-ink">{shortName(lead.a.family, lead.a.given)}</span>
            <span className="font-bold tabular-nums text-claret">{signed(lead.gap ?? Math.round(lead.offset))}</span>
          </div>
        );
      })}
    </>
  );
}

// The caption, its date a link to that day's pound-for-pound leaderboard.
function Caption({ template, day, href }: { template: string; day: string; href: string }) {
  const [before, after = ""] = template.split("{day}");
  return (
    <>
      {before}
      <Link href={href} className="underline decoration-rule underline-offset-2 hover:decoration-ink">
        {day}
      </Link>
      {after}
    </>
  );
}

// Seven columns, one scale: every weight's leader over the pack of their rivals, and the
// column that stands highest is the pound-for-pound number 1.
export function PoundForPound() {
  const { d, f, t } = useI18n();
  const s = d.methodology.p4pChart;
  const [gender, setGender] = useState<Gender>("men");
  const columns = P4P[gender];
  const dots: Dot[][] = columns.map((c) => offsets(c).map((o) => ({ ...o, weight: c.weight })));
  const first = dots.flat().find((x) => x.a.p4p === 1) ?? dots[0][0];
  const [picked, setPicked] = useState<Dot | null>(null);
  const shown = picked && dots.flat().some((x) => x.a.id === picked.a.id && x.weight === picked.weight) ? picked : first;
  const { box, width } = useWidth();

  const W = width ?? 640;
  const phone = W < 560;
  const H = phone ? ROW_H * 7 : 320; // a phone: the weights as rows
  const LEFT = phone ? 36 : 46;
  const RIGHT = W - 6;
  const TOP = 36;
  const BOTTOM = H - 40;
  const colW = (RIGHT - LEFT) / 7;
  const cx = (i: number) => LEFT + colW * (i + 0.5);
  const y = (v: number) => TOP + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
  const r = (v: number) => Math.round(v * 10) / 10;
  const ticks: number[] = [];
  for (let v = Y_MIN; v <= Y_MAX; v += 100) ticks.push(v);
  const leaders = dots.map((col) => col[0]);
  const top = leaders.findIndex((x) => x.a.p4p === 1);

  return (
    <Figure title={s.title} caption={<Caption template={s.caption} day={f.formatDate(P4P.day)} href={`/rankings/p4p/${gender}/${P4P.day}`} />}>
      <GenderToggle value={gender} onChange={setGender} />
      <div ref={box} className="w-full relative" style={{ height: H }} onPointerLeave={() => setPicked(null)}>
        {width !== null && phone && <Rows dots={dots} width={W} labels={WEIGHTS[gender].map((w) => w.label)} />}
        {width !== null && !phone && (
          <>
            <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={s.chartLabel} className="block">
              {/* the column of the number 1 */}
              {top >= 0 && <rect x={r(LEFT + colW * top)} width={r(colW)} y={TOP - 30} height={BOTTOM - TOP + 30} fill="#990F3D" fillOpacity="0.06" />}
              <g stroke="#D6CFC2" strokeWidth="0.8">
                {ticks.map((v) => v !== 0 && <line key={v} x1={LEFT - 6} x2={RIGHT} y1={r(y(v))} y2={r(y(v))} />)}
              </g>
              <line x1={LEFT - 6} x2={RIGHT} y1={r(y(0))} y2={r(y(0))} stroke="#66605C" strokeWidth="1.2" strokeDasharray="4,3" />
              <g fill="#66605C" fontFamily={FONT} fontSize={phone ? 10 : 11} textAnchor="end">
                {ticks.map((v) => (
                  <text key={v} x={LEFT - 9} y={r(y(v) + 3.5)}>
                    {signed(v)}
                  </text>
                ))}
              </g>
              {dots.map((col, i) => {
                const lead = col[0];
                const x = cx(i);
                return (
                  <g key={col[0].weight}>
                    <line x1={r(x)} x2={r(x)} y1={r(y(0))} y2={r(y(lead.offset))} stroke="#990F3D" strokeWidth="3" strokeOpacity="0.3" />
                    {col.slice(1).map((o) => (
                      <circle
                        key={o.a.id}
                        cx={r(x)}
                        cy={r(y(o.offset))}
                        r={shown.a.id === o.a.id && shown.weight === o.weight ? (phone ? 4 : 4.5) : phone ? 2.5 : 3}
                        fill="#66605C"
                        fillOpacity={shown.a.id === o.a.id && shown.weight === o.weight ? 1 : 0.7}
                      />
                    ))}
                    <circle cx={r(x)} cy={r(y(lead.offset))} r={phone ? 4.5 : 5.5} fill="#990F3D" stroke={shown === lead ? "#33302E" : "none"} strokeWidth="1.5" />
                    {/* the hit areas, bigger than the dots */}
                    {col.map((o) => (
                      <circle
                        key={`hit-${o.a.id}`}
                        cx={r(x)}
                        cy={r(y(o.offset))}
                        r={phone ? 9 : 10}
                        fill="transparent"
                        className="cursor-pointer"
                        onPointerEnter={() => setPicked(o)}
                        onClick={() => setPicked(o)}
                      />
                    ))}
                  </g>
                );
              })}
              <g fontFamily={FONT} textAnchor="middle">
                <text x={LEFT - 9} y={BOTTOM + 31} textAnchor="end" fill="#66605C" fontSize={phone ? 10 : 11}>
                  {s.p4pRow}
                </text>
                {columns.map((c, i) => (
                  <g key={c.weight}>
                    <text x={r(cx(i))} y={BOTTOM + 16} fill="#33302E" fontSize={phone ? 11 : 12} fontWeight="600">
                      {WEIGHTS[gender][i].label}
                    </text>
                    <text x={r(cx(i))} y={BOTTOM + 31} fill={leaders[i].a.p4p === 1 ? "#990F3D" : "#66605C"} fontSize={phone ? 10 : 11} fontWeight={leaders[i].a.p4p === 1 ? 700 : 400}>
                      {leaders[i].a.p4p}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
            {/* the leaders' labels over their dots: the flag, the name (not on a phone), the gap */}
            {leaders.map((lead, i) => (
              <div
                key={lead.weight}
                aria-hidden
                className="absolute pointer-events-none text-center leading-[13px]"
                style={{ left: cx(i) - colW / 2, width: colW, top: y(lead.offset) - 34 }}
              >
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-ink whitespace-nowrap overflow-hidden">
                  <Flag ioc={lead.a.ioc} />
                  {!phone && <span className="truncate">{clip(shortName(lead.a.family, lead.a.given), colW - 22)}</span>}
                </div>
                <div className="text-[11px] font-bold tabular-nums text-claret">{signed(lead.gap ?? Math.round(lead.offset))}</div>
              </div>
            ))}
          </>
        )}
      </div>
      {!phone && (
      <>
      <div className="mt-3 min-h-[44px] text-[13px] tabular-nums">
        <div className="flex items-center gap-1.5 text-ink">
          <Flag ioc={shown.a.ioc} />
          <span>
            <b>{shortName(shown.a.family, shown.a.given)}</b>
            {t(s.readout, { weight: WEIGHTS[gender].find((w) => w.api === shown.weight)?.label ?? shown.weight, place: f.ordinal(shown.a.place) })}
          </span>
        </div>
        <div className="text-muted">
          {t(s.rating, { rating: shown.a.rating })}
          {shown.gap !== null && `, ${t(s.gap, { gap: signed(shown.gap) })}`}
          {shown.a.p4p && (
            <>
              , <span className={shown.a.p4p === 1 ? "font-semibold text-claret" : "text-ink"}>{t(s.p4p, { n: shown.a.p4p })}</span>
            </>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-claret inline-block" />
          {s.legend.leader}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-muted inline-block" />
          {s.legend.rivals}
        </span>
      </div>
      </>
      )}
    </Figure>
  );
}

// The shade of a cell by its rating, over the range of every nation's cells shown.
const RATINGS = (["men", "women"] as const).flatMap((g) => NATIONS[g].rows.flatMap((row) => row.cells.flatMap((c) => (c ? [c.rating] : []))));
const LO = Math.min(...RATINGS);
const HI = Math.max(...RATINGS);
// squared: most cells sit in the upper middle, a straight scale left them all one pink
const shade = (rating: number) => ((rating - LO) / Math.max(HI - LO, 1)) ** 2;
const HATCH = "repeating-linear-gradient(135deg, #D6CFC2 0 2px, transparent 2px 6px)";

type Pick = { row: number; col: number };

// The top eight nations as rows, the seven weights as cells shaded by the nation's best
// athlete there, the empty weights hatched (counted as the weight's last place), the
// average at the right.
export function Nations() {
  const { d, f, t } = useI18n();
  const s = d.methodology.nationsGrid;
  const [gender, setGender] = useState<Gender>("men");
  const table = NATIONS[gender];
  const [picked, setPicked] = useState<Pick | null>(null);
  // by default the number 1's best weight
  const best = table.rows[0].cells.reduce((b, c, j, all) => (c && (!all[b] || c.rating > all[b]!.rating) ? j : b), 0);
  const shown = picked ?? { row: 0, col: best };
  const row = table.rows[shown.row];
  const cell = row.cells[shown.col];
  const weight = WEIGHTS[gender][shown.col].label;
  const nation = f.country(row.ioc, row.name);
  const head = "py-1.5 text-[11px] sm:text-[12px] font-normal text-muted";

  return (
    <Figure title={s.title} caption={<Caption template={s.caption} day={f.formatDate(NATIONS.day)} href={`/rankings/teams/${gender}/${NATIONS.day}`} />}>
      <GenderToggle value={gender} onChange={setGender} />
      <table className="w-full table-fixed border-collapse" aria-label={s.gridLabel} onPointerLeave={() => setPicked(null)}>
        <thead>
          <tr className="border-b border-ink">
            <th className={`${head} w-[40px] sm:w-[84px] text-left`} />
            {WEIGHTS[gender].map((w) => (
              <th key={w.api} className={`${head} text-center tabular-nums text-[10px] sm:text-[12px] tracking-tight sm:tracking-normal`}>
                {w.label}
              </th>
            ))}
            <th className={`${head} w-11 sm:w-16 text-right`}>{d.methodology.labels.rating}</th>
            <th className={`${head} hidden sm:table-cell w-12 text-right`}>{s.led}</th>
            <th className={`${head} hidden sm:table-cell w-12 text-right`}>{s.top8}</th>
          </tr>
        </thead>
        <tbody>
          {table.rows.map((n, i) => (
            <tr key={n.ioc} className="border-b border-rule">
              <td className="py-1 pr-1 text-[12px] sm:text-[13px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 text-right tabular-nums text-muted">{n.place}</span>
                  <Flag ioc={n.ioc} />
                  <span className="hidden sm:inline font-semibold">{n.ioc}</span>
                </span>
              </td>
              {n.cells.map((c, j) => {
                const on = shown.row === i && shown.col === j;
                const dark = c ? shade(c.rating) > 0.5 : false;
                return (
                  <td key={j} className="p-[1.5px] sm:p-px">
                    <button
                      type="button"
                      onPointerEnter={() => setPicked({ row: i, col: j })}
                      onClick={() => setPicked({ row: i, col: j })}
                      aria-label={
                        c
                          ? t(s.cell, { nation, weight: WEIGHTS[gender][j].label, name: shortName(c.family, c.given), rating: c.rating, place: f.ordinal(c.nationPlace) })
                          : t(s.empty, { nation, weight: WEIGHTS[gender][j].label, rating: table.weights[j].last })
                      }
                      className={`block w-full h-7 sm:h-8 px-1 text-[11px] leading-none truncate pointer-events-none sm:pointer-events-auto sm:cursor-pointer ${dark ? "text-paper" : "text-ink"} ${on ? "sm:outline sm:outline-2 sm:outline-ink sm:-outline-offset-2" : ""}`}
                      style={c ? { background: `rgba(153, 15, 61, ${(0.06 + 0.9 * shade(c.rating)).toFixed(2)})` } : { background: HATCH }}
                    >
                      <span className="tabular-nums text-[10px] sm:text-[11px] tracking-tight sm:tracking-normal">{c ? c.rating : ""}</span>
                    </button>
                  </td>
                );
              })}
              <td className="py-1 text-right text-[13px] font-bold tabular-nums">{n.rating}</td>
              <td className="hidden sm:table-cell py-1 text-right text-[13px] tabular-nums text-muted">{n.led}</td>
              <td className="hidden sm:table-cell py-1 text-right text-[13px] tabular-nums text-muted">{n.top8}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* what a tapped cell holds: on wider screens only (a phone's grid is not interactive) */}
      <div className="hidden sm:block mt-3 min-h-[44px] text-[13px] tabular-nums">
        <div className="flex items-center gap-1.5 text-ink">
          <Flag ioc={row.ioc} />
          <b>{nation}</b>
          <span className="text-muted">{t(d.methodology.weightKg, { weight })}</span>
        </div>
        <div className="text-muted">
          {cell ? (
            <>
              <span className="text-ink font-semibold">{shortName(cell.family, cell.given)}</span>
              {t(s.cellReadout, { rating: cell.rating, place: f.ordinal(cell.nationPlace) })}
            </>
          ) : (
            t(s.emptyReadout, { rating: table.weights[shown.col].last })
          )}
        </div>
      </div>
    </Figure>
  );
}
