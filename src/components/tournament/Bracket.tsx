import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import { Flag } from "@/components/Flag";
import type { CompetitionContest, Slot as Place } from "@/lib/api";
import { isUpset } from "@/components/rankings/Changes";
import { formatChance, roundCode, shortName, signed } from "@/lib/format";

// The main rounds, the first to the final, and their columns' titles.
const MAIN = ["1/64", "1/32", "1/16", "1/8", "1/4", "1/2", "F"];
// as everywhere on the site: the fractions of the final
const TITLES: Record<string, string> = { "1/64": "1/64", "1/32": "1/32", "1/16": "1/16", "1/8": "1/8", "1/4": "1/4", "1/2": "1/2", F: "Final" };

type Slot =
  | { kind: "contest"; contest: CompetitionContest }
  | { kind: "bye"; id: number; name: string; country: string | null }
  | { kind: "next"; places: Place[] } // both athletes known, not fought: their chances
  | { kind: "likely"; places: Place[] } // not known yet: the likeliest athletes
  | { kind: "open" };

// The bracket from its places (ajr/rating/chances.py): every contest by its number,
// the rounds still to come with who is likely in them.
function fromPlaces(places: Place[], contests: CompetitionContest[]): { cols: { code: string; slots: Slot[] }[]; side: (code: string) => Slot[] } {
  const byNumber = new Map<number, Place[]>();
  for (const p of places) byNumber.set(p.fight_no, [...(byNumber.get(p.fight_no) ?? []), p]);
  const contest = new Map(contests.map((c) => [c.contest_id, c]));
  // the first round: the contests of the earliest stage
  const earliest = MAIN.find((code) => places.some((p) => p.round === code));
  const firstRoundLast = Math.max(...places.filter((p) => p.round === earliest).map((p) => p.fight_no));
  // a contest's two athletes as the bracket has them: the one from the contest above on
  // top (as a contest fought: white, the upper one), not the likelier
  const before = (id: number, number: number) => Math.max(-1, ...places.filter((p) => p.athlete_id === id && p.fight_no < number).map((p) => p.fight_no));
  const inOrder = (rows: Place[], number: number) => [...rows].sort((a, b) => before(a.athlete_id, number) - before(b.athlete_id, number));
  const slotOf = (rows: Place[] | undefined, number: number): Slot => {
    if (!rows?.length) return { kind: "open" };
    const fought = rows.find((r) => r.contest_id !== null && contest.has(r.contest_id));
    if (fought) return { kind: "contest", contest: contest.get(fought.contest_id!)! };
    const sure = rows.filter((r) => r.here >= 0.999);
    if (sure.length === 1 && rows.length === 1 && number <= firstRoundLast)
      return { kind: "bye", id: sure[0].athlete_id, name: shortName(sure[0].family_name, sure[0].given_name), country: sure[0].country };
    if (sure.length === 2) return { kind: "next", places: inOrder(sure, number) };
    return { kind: "likely", places: inOrder(rows.slice(0, 2), number) };
  };
  const numbers = [...byNumber.keys()].sort((a, b) => a - b);
  const roundOf = (n: number) => byNumber.get(n)![0].round;
  const cols = MAIN.filter((code) => numbers.some((n) => roundOf(n) === code)).map((code) => ({
    code,
    slots: numbers.filter((n) => roundOf(n) === code).map((n) => slotOf(byNumber.get(n), n)),
  }));
  const side = (code: string) => numbers.filter((n) => roundOf(n) === code).map((n) => slotOf(byNumber.get(n), n));
  return { cols, side };
}

const sides = (c: CompetitionContest) => [
  { id: c.white_id, name: shortName(c.white_family_name, c.white_given_name), country: c.white_country, chance: c.white_chance },
  { id: c.blue_id, name: shortName(c.blue_family_name, c.blue_given_name), country: c.blue_country, chance: c.blue_chance },
];

// The bracket's columns, each a list of slots in the bracket's order: from the
// latest round played back, by who met whom (an athlete without a contest in a round
// came through a bye), and on to the final with the slots still to be fought.
// A weight fought as a bracket (not a pool of a few athletes, round robin).
export const hasBracket = (contests: CompetitionContest[]) => contests.some((c) => MAIN.includes(roundCode(c.round)));

function columns(contests: CompetitionContest[]): { code: string; slots: Slot[] }[] {
  const byRound = new Map<string, CompetitionContest[]>();
  for (const c of contests) {
    const code = roundCode(c.round);
    if (MAIN.includes(code)) byRound.set(code, [...(byRound.get(code) ?? []), c]);
  }
  const played = MAIN.filter((code) => byRound.has(code));
  if (!played.length) return [];
  const last = played.at(-1)!;
  const cols: { code: string; slots: Slot[] }[] = [{ code: last, slots: byRound.get(last)!.map((contest) => ({ kind: "contest", contest })) }];
  // back from the latest round: each slot's two athletes, and how each got there
  for (let i = MAIN.indexOf(last) - 1; i >= MAIN.indexOf(played[0]); i--) {
    const earlier = byRound.get(MAIN[i]) ?? [];
    const slots: Slot[] = [];
    for (const s of cols[0].slots) {
      if (s.kind !== "contest") {
        slots.push({ kind: "open" }, { kind: "open" });
        continue;
      }
      for (const side of sides(s.contest)) {
        const before = earlier.find((c) => c.white_id === side.id || c.blue_id === side.id);
        slots.push(before ? { kind: "contest", contest: before } : { kind: "bye", ...side });
      }
    }
    cols.unshift({ code: MAIN[i], slots });
  }
  // on to the final: the slots still to be fought, half as many each round
  let size = 2 ** Math.ceil(Math.log2(Math.max(cols.at(-1)!.slots.length, 1)));
  for (let i = MAIN.indexOf(last) + 1; i < MAIN.length; i++) {
    size = Math.max(1, size / 2);
    cols.push({ code: MAIN[i], slots: Array.from({ length: size }, () => ({ kind: "open" }) as Slot) });
  }
  return cols;
}

const pct = (p: number) => (p < 0.01 ? "<1%" : p > 0.99 ? ">99%" : `${Math.round(p * 100)}%`);

function Box({ slot }: { slot: Slot }) {
  if (slot.kind === "next") {
    const id = slot.places.find((p) => p.contest_id !== null)?.contest_id;
    return (
      <Link href={id ? `/contests/${id}` : "#"} className="block h-[58px] sm:h-[50px] border border-ink/40 bg-paper text-[13px] sm:text-[12px] hover:border-ink" title="Not fought yet: our chances; what each result would do">
        {slot.places.map((p) => (
          <div key={p.athlete_id} className="h-7 sm:h-6 px-2 flex items-center gap-1.5 text-ink">
            <Flag ioc={p.country} />
            <span className="truncate">{shortName(p.family_name, p.given_name)}</span>
            <span className="ml-auto w-10 pr-1 text-right tabular-nums text-muted">{pct(p.wins)}</span>
            <span className="w-4 text-center text-muted">—</span>
            <span className="w-9 text-right text-muted">—</span>
          </div>
        ))}
      </Link>
    );
  }
  if (slot.kind === "likely")
    return (
      <div className="h-[58px] sm:h-[50px] border border-dashed border-rule text-[13px] sm:text-[12px] text-muted overflow-hidden" title="Not decided yet: the likeliest of each side, and their chances against each other">
        {slot.places.slice(0, 2).map((p) => (
          <div key={p.athlete_id} className="h-7 sm:h-6 px-2 flex items-center gap-1.5">
            <span className="opacity-60">
              <Flag ioc={p.country} />
            </span>
            <span className="truncate">{shortName(p.family_name, p.given_name)}</span>
            <span className="ml-auto w-10 pr-1 text-right tabular-nums">{pct(p.wins)}</span>
            <span className="w-4 text-center">—</span>
            <span className="w-9 text-right">—</span>
          </div>
        ))}
      </div>
    );
  if (slot.kind === "open") return <div className="h-[58px] sm:h-[50px] border border-dashed border-rule bg-paper/40" aria-label="To be fought" />;
  if (slot.kind === "bye")
    return (
      <div className="h-[58px] sm:h-[50px] border border-rule bg-paper text-[13px] sm:text-[12px]">
        <div className="h-7 sm:h-6 px-2 flex items-center gap-1.5 font-semibold">
          <Flag ioc={slot.country} />
          <span className="truncate">{slot.name}</span>
        </div>
        <div className="h-7 sm:h-6 px-2 flex items-center text-muted" title="Bye">—</div>
      </div>
    );
  const c = slot.contest;
  const winner = sides(c).find((s) => s.id === c.winner_id);
  const upset = c.real_fight && winner?.chance != null && isUpset(true, winner.chance);
  return (
    // an upset: the chances in colour, as the contests' list shows them on a phone
    <Link href={`/contests/${c.contest_id}`} className="block h-[58px] sm:h-[50px] border border-rule bg-paper text-[13px] sm:text-[12px] hover:border-ink">
      {sides(c).map((s, i) => {
        const won = s.id === c.winner_id;
        const before = i === 0 ? c.white_score_before : c.blue_score_before;
        const after = i === 0 ? c.white_score_after : c.blue_score_after;
        const change = before === null || after === null ? null : after - before;
        return (
          <div key={s.id} className={`h-7 sm:h-6 px-2 flex items-center gap-1.5 tabular-nums ${won ? "font-semibold text-ink" : "text-muted"}`}>
            <Flag ioc={s.country} />
            <span className="truncate flex-1">{s.name}</span>
            {c.real_fight && s.chance !== null && <span className={`w-10 pr-1 text-right ${upset ? (won ? "text-gain" : "text-drop font-semibold") : ""}`} title={upset ? "An upset" : undefined}>{formatChance(s.chance, 0)}</span>}
            {/* a walkover: the one who did not fight WO, no rating change */}
            {c.real_fight || won ? (
              <span className={`w-4 text-center font-bold ${won ? "text-gain" : "text-drop"}`}>{won ? "W" : "L"}</span>
            ) : (
              <span className="w-4 text-center text-[10px] font-bold text-muted" title="Walkover: did not fight">
                WO
              </span>
            )}
            <span className={`w-9 text-right font-semibold ${change === null ? "text-muted font-normal" : change >= 0 ? "text-gain" : "text-drop"}`}>
              {change === null ? "—" : signed(change)}
            </span>
          </div>
        );
      })}
    </Link>
  );
}

// The contests as a bracket: the main rounds left to right, each slot level with the
// two it comes from and joined to them by lines; the repechage and the bronze medal
// contests under them. A weight under way: the rounds to come as empty slots.
// a slot of the first round, its gap included, and a round's width: on a phone bigger
// boxes and more room between them (the --row and --col of the bracket's box)
const ROW = "var(--row)";
const POOLS = ["A", "B", "C", "D"];
export function Bracket({ contests, places = [] }: { contests: CompetitionContest[]; places?: Place[] }) {
  const built = places.length ? fromPlaces(places, contests) : null;
  const cols = built ? built.cols : columns(contests);
  const side = (code: string): Slot[] =>
    built ? built.side(code) : contests.filter((c) => roundCode(c.round) === code).map((contest) => ({ kind: "contest", contest }));
  // the first round on a power of two (under way, its byes are not known yet: its
  // slots in order, and no lines from it into the next round)
  const rows = 2 ** Math.ceil(Math.log2(Math.max(cols[0]?.slots.length ?? 1, 1)));
  const exact = rows === cols[0]?.slots.length;
  // the IJF's pools A to D: the quarters of the bracket, up to the quarter-finals
  const quarter = cols.findIndex((col) => col.code === "1/4");
  // (under way, the first round's places are not known: no pools)
  const pools = exact && quarter >= 0 && rows >= 4 ? POOLS : [];
  const template = `14px repeat(${cols.length}, minmax(var(--col), 1fr))`;
  const width = `calc(14px + ${cols.length} * (var(--col) + 16px))`;
  // the rounds' row stays on top of the page; on a narrow screen the bracket scrolls
  // sideways in its box, and the row follows it
  const head = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  // wider than its box: a hand over it, to drag it
  const [wide, setWide] = useState(false);
  const measure = useCallback(() => {
    const el = body.current;
    if (el) setWide(el.scrollWidth > el.clientWidth + 1);
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);
  // a mouse drags the bracket sideways; a drag is not a click on the box under it
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const moved = useRef(false);
  // the repechage and the bronze medal contests in the first two rounds' columns, where
  // the bracket opens: each repechage's winner goes on to the bronze level with it
  const repColumn = 0;
  const brColumn = Math.min(repColumn + 1, cols.length - 1);
  const rep = side("REP");
  const br = side("BR");
  const medalRows = Math.max(rep.length, br.length, 2);
  const open: Slot = { kind: "open" };
  return (
    <div className="mt-4 [--row:76px] [--col:256px] sm:[--row:58px] sm:[--col:232px]">
      <div className="pb-2">
        <div className="sticky top-[84px] md:top-16 z-20 bg-paper border-b border-rule">
          <div ref={head} className="overflow-hidden">
            <div className="grid gap-x-4 h-8 items-center" style={{ gridTemplateColumns: template, minWidth: width }}>
              <span />
              {cols.map((col) => (
                <div key={col.code} className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {TITLES[col.code]}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          ref={body}
          className="overflow-x-auto"
          onScroll={(e) => {
            if (head.current) head.current.scrollLeft = e.currentTarget.scrollLeft;
          }}
          // a mouse's press selects no text: it may be a drag
          onMouseDown={(e) => {
            if (e.button === 0) e.preventDefault();
          }}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
            moved.current = false;
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            const dx = e.clientX - d.x;
            if (!d.moved && Math.abs(dx) < 5) return;
            if (!d.moved) {
              d.moved = moved.current = true;
              window.getSelection()?.removeAllRanges();
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.style.cursor = "grabbing";
            }
            e.currentTarget.scrollLeft = d.left - dx;
          }}
          onPointerUp={(e) => {
            drag.current = null;
            e.currentTarget.style.cursor = wide ? "grab" : "";
          }}
          onPointerCancel={(e) => {
            drag.current = null;
            e.currentTarget.style.cursor = wide ? "grab" : "";
          }}
          onClickCapture={(e) => {
            if (moved.current) {
              e.preventDefault();
              e.stopPropagation();
              moved.current = false;
            }
          }}
          onDragStart={(e) => e.preventDefault()}
          style={{ cursor: wide ? "grab" : undefined }}
        >
        <div className="grid gap-x-4 mt-2" style={{ gridTemplateColumns: template, gridTemplateRows: `repeat(${rows}, ${ROW})`, minWidth: width }}>
          {pools.map((pool, p) => (
            <Fragment key={pool}>
              {/* the pool: a band behind its rounds, its letter at the left */}
              <div
                aria-hidden
                className={`-mr-2 ${p % 2 ? "" : "bg-panel/50"} ${p ? "border-t border-rule" : ""}`}
                style={{ gridColumn: `1 / ${quarter + 3}`, gridRow: `${(p * rows) / 4 + 1} / span ${rows / 4}` }}
              />
              <div
                className="flex items-center justify-center text-[11px] font-bold text-muted"
                style={{ gridColumn: 1, gridRow: `${(p * rows) / 4 + 1} / span ${rows / 4}` }}
                title={`Pool ${pool}`}
              >
                {pool}
              </div>
            </Fragment>
          ))}
          {cols.map((col, c) =>
            col.slots.map((slot, i) => {
              const span = rows / col.slots.length;
              const joined = c > 0 && (c > 1 || exact);
              return (
                <div key={`${c}-${i}`} className="relative z-10 flex items-center" style={{ gridColumn: c + 2, gridRow: `${i * span + 1} / span ${span}` }}>
                  {joined && (
                    <>
                      {/* from the two slots before: their stubs and the line joining them */}
                      <span aria-hidden className="absolute -left-4 w-2 border-y border-r border-muted/60" style={{ top: "25%", bottom: "25%" }} />
                      <span aria-hidden className="absolute -left-2 w-2 top-1/2 border-t border-muted/60" />
                    </>
                  )}
                  <div className="w-full">
                    <Box slot={slot} />
                  </div>
                </div>
              );
            }),
          )}
        </div>
        {/* the repechage and the bronze medal contests, scrolling with the bracket */}
        <div
          className="grid gap-x-4 mt-6 pt-2 border-t border-rule"
          style={{ gridTemplateColumns: template, gridTemplateRows: `24px repeat(${medalRows}, ${ROW})`, minWidth: width }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted self-center" style={{ gridColumn: repColumn + 2, gridRow: 1 }}>
            Repechage
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted self-center" style={{ gridColumn: brColumn + 2, gridRow: 1 }}>
            Bronze
          </div>
          {Array.from({ length: medalRows }, (_, i) => (
            <Fragment key={i}>
              <div className="flex items-center" style={{ gridColumn: repColumn + 2, gridRow: i + 2 }}>
                <div className="w-full">
                  <Box slot={rep[i] ?? open} />
                </div>
              </div>
              <div className="relative flex items-center" style={{ gridColumn: brColumn + 2, gridRow: i + 2 }}>
                {/* from the repechage: its winner fights for the bronze */}
                {brColumn > repColumn && <span aria-hidden className="absolute -left-4 w-4 top-1/2 border-t border-muted/60" />}
                <div className="w-full">
                  <Box slot={br[i] ?? open} />
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

