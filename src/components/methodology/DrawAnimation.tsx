"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Flag } from "@/components/Flag";
import { Figure } from "@/components/methodology/Figure";
import { useI18n } from "@/i18n/client";

// Paris 2024, women −52 kg: the draw, played out in the site's bracket style. The
// entrants in a list by the seeding's order (left) go into the first round's contests
// (right): the eight seeds first, one to the head and one to the middle of each pool, so
// that they cannot meet before 1/4, then the rest into their places (six byes, "—", give
// the seeds' first round). "IJF points" is the real draw (judobase, contests of
// competition 2653: Abe drawn into the top seed's pool, 1/8 against her); "our rating"
// is the same draw seeded by the rating on the eve (ourDraw). The lines show where Abe
// and Keldiyorova meet.

type Entrant = { id: number; name: string; country: string; rating: number };

// name: as the site's brackets write it (lib/format shortName)
const E = (
  id: number,
  name: string,
  country: string,
  rating: number,
): Entrant => ({ id, name, country, rating });
const ENTRANTS = [
  E(17378, "Keldiyorova D.", "UZB", 2195),
  E(35696, "Abe U.", "JPN", 2648),
  E(49228, "Deguchi K.", "CAN", 1538),
  E(22532, "Ballhaus M.", "GER", 2000),
  E(33905, "Martinez P.", "MEX", 1512),
  E(76190, "Bishrelt K.", "UAE", 1922),
  E(49430, "Zhu Y.", "CHN", 1865),
  E(7539, "Buchard A.", "FRA", 2360),
  E(13042, "Iraoui S.", "MAR", 1747),
  E(28908, "Asvesta S.", "CYP", 1667),
  E(17275, "Giles C.", "GBR", 2145),
  E(23949, "Pimenta L.", "BRA", 1918),
  E(21831, "Silva D.", "CPV", 1422),
  E(7829, "Krasniqi D.", "KOS", 2277),
  E(71392, "Maharani M.", "INA", 1372),
  E(11264, "Ferreira J.", "MOZ", 1252),
  E(20206, "Primo G.", "ISR", 1997),
  E(65967, "Jung Y.", "KOR", 1802),
  E(70253, "Fiora S.", "ARG", 1506),
  E(52575, "Ndiaye B.", "SUI", 1854),
  E(3469, "Giuffrida O.", "ITA", 2198),
  E(20760, "Mammadaliyeva G.", "AZE", 1602),
  E(1503, "Delgado A.", "USA", 1707),
  E(7837, "Pupp R.", "HUN", 2007),
  E(50041, "Toro Soler A.", "ESP", 2029),
  E(16819, "Lkhagvasuren S.", "MGL", 1917),
];
const ABE = 35696;
const KELDIYOROVA = 17378;

// The 32 places, pool by pool (A: 0–7, B: 8–15, C: 16–23, D: 24–31), in the order of the
// first-round contests; null: a bye. The real draw.
const PARIS: (number | null)[] = [
  17378,
  null,
  35696,
  49228,
  22532,
  33905,
  76190,
  49430,
  7539,
  null,
  13042,
  28908,
  17275,
  null,
  23949,
  21831,
  7829,
  null,
  71392,
  11264,
  20206,
  65967,
  70253,
  52575,
  3469,
  null,
  20760,
  1503,
  7837,
  null,
  50041,
  16819,
];
const IJF_SEEDS = [17378, 7829, 3469, 7539, 17275, 7837, 20206, 22532]; // the IJF's 1 to 8

// The same draw seeded by our rating, without a new lot: our seed n takes the place the
// IJF gave its seed n; the unseeded on both lists stay where the lot put them; the IJF
// seeds out of our eight take the places of those who came into it, the higher rated
// the higher one's place.
function ourDraw(): (number | null)[] {
  const rating = (id: number) => ENTRANTS.find((e) => e.id === id)!.rating;
  const ours = [...ENTRANTS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)
    .map((e) => e.id);
  const places = [...PARIS];
  const seedPlace = IJF_SEEDS.map((id) => PARIS.indexOf(id));
  const vacated = ours
    .filter((id) => !IJF_SEEDS.includes(id))
    .sort((a, b) => rating(b) - rating(a))
    .map((id) => PARIS.indexOf(id));
  const dropped = IJF_SEEDS.filter((id) => !ours.includes(id)).sort(
    (a, b) => rating(b) - rating(a),
  );
  ours.forEach((id, n) => (places[seedPlace[n]] = id));
  dropped.forEach((id, k) => (places[vacated[k]] = id));
  return places;
}
const OURS = ourDraw();

type Mode = "ijf" | "ours";
// list: the names in the list; seeds: the eight fly in, one by one; rest: then the
// others; path: the two ways light up; done: the dot and the round
type Phase = "list" | "seeds" | "rest" | "path" | "done";
const EASE = "cubic-bezier(.22,.61,.36,1)";
const FLY = 900; // a name's flight, ms
const SEED_STEP = 200; // between two seeds
const REST_STEP = 60; // between two of the others
const DRAW = 1300; // the ways lighting up

const ROW = 24; // a name's row, in the list and in a contest's box (the site's bracket: h-6)
const BOX_GAP = 8; // between two first-round contests
const POOL_GAP = 16; // between two pools
const TOP = 30; // the columns' titles
const ROUNDS = ["1/16", "1/8", "1/4", "1/2", "F"]; // the codes; "F" is written out (common.rounds.F)
const RATING_ORDER = [...ENTRANTS]
  .sort((a, b) => b.rating - a.rating)
  .map((e) => e.id);
// The IJF's order is known for its eight seeds only (Abe was 10th on points): the rest
// are listed by name.
const IJF_ORDER = [
  ...IJF_SEEDS,
  ...ENTRANTS.filter((e) => !IJF_SEEDS.includes(e.id))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((e) => e.id),
];
const byId = new Map(ENTRANTS.map((e) => [e.id, e]));

// a place's top: two places to a contest's box, a gap between boxes, a wider one between pools
const slotY = (place: number) =>
  TOP +
  Math.floor(place / 2) * (2 * ROW + BOX_GAP) +
  (place % 2) * ROW +
  Math.floor(place / 8) * POOL_GAP;
const listY = (index: number) => TOP + index * ROW + (index >= 8 ? ROW : 0); // a row between the seeds and the rest
const LINE = "rgba(102, 96, 92, 0.6)"; // the site's bracket lines: border-muted/60

export function DrawAnimation() {
  const { d, t } = useI18n();
  const s = d.methodology.draw;
  const roundName = (code: string) => (code === "F" ? d.common.rounds.F : code);
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [mode, setMode] = useState<Mode>("ijf");
  const [phase, setPhase] = useState<Phase>("done");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false); // played once (in view, or by a button): not again by the scroll

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const run = (next: Mode) => {
    started.current = true;
    timers.current.forEach(clearTimeout);
    setMode(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    setPhase("list");
    const seedsAt = 700;
    const restAt = seedsAt + 7 * SEED_STEP + FLY + 300;
    const pathAt = restAt + 17 * REST_STEP + FLY + 300;
    timers.current = [
      setTimeout(() => setPhase("seeds"), seedsAt),
      setTimeout(() => setPhase("rest"), restAt),
      setTimeout(() => setPhase("path"), pathAt),
      setTimeout(() => setPhase("done"), pathAt + DRAW),
    ];
  };

  // played once, when it comes into view
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          run("ijf");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const phone = width < 560;
  const draw = mode === "ijf" ? PARIS : OURS;
  const listed = mode === "ijf" ? IJF_ORDER : RATING_ORDER;
  const seeds = listed.slice(0, 8);
  const placeOf = new Map(
    draw.flatMap((id, place) => (id === null ? [] : [[id, place] as const])),
  );
  const [pa, pk] = [placeOf.get(ABE)!, placeOf.get(KELDIYOROVA)!];

  // a phone shows the half of the bracket the two are in (they meet by 1/2 either way):
  // 16 places, two pools, the rounds up to 1/2, the list folded under it
  const first = phone ? Math.floor(pa / 16) * 16 : 0; // the first place shown
  const count = phone ? 16 : 32;
  const shown = (place: number) => place >= first && place < first + count;
  const top = (place: number) => slotY(place - first);
  const lastLevel = phone ? 4 : 5; // the deepest round drawn: 1/2 on a phone, the final
  const listW = phone ? 0 : width * 0.3;
  const poolX = phone ? 0 : width * 0.34; // the pools' letters
  const boxX = poolX + 18;
  const boxW = phone ? Math.min(165, width * 0.5) : width * 0.31;
  const treeX = boxX + boxW;
  const treeW = phone ? width - treeX - 12 : width - treeX - 40;
  const height = top(first + count - 1) + ROW;

  // the bracket's levels: 0 the places, 1 the first round's contests (1/16) and up to 5 (the final)
  // a contest's height in the bracket: a first-round box's middle, then midway between the two below
  const cy = (lv: number, i: number): number =>
    lv === 1
      ? top(2 * i) + ROW
      : (cy(lv - 1, 2 * i) + cy(lv - 1, 2 * i + 1)) / 2;
  const joint = (lv: number) => nodeX(lv) - 8; // where a contest's two lines meet
  const nodeX = (lv: number) => treeX + (treeW * (lv - 1)) / (lastLevel - 1);
  let level = 1;
  while (Math.floor(pa / 2 ** level) !== Math.floor(pk / 2 ** level)) level++;
  const meetRound = roundName(ROUNDS[level - 1]);
  const settled = phase === "done";
  const lit = phase === "path" || phase === "done"; // the ways drawn
  const placed = phase === "rest" || lit; // everyone in the bracket
  const unseeded = listed.filter((id) => !seeds.includes(id));
  const isMoved = (id: number) =>
    placed || (phase === "seeds" && seeds.includes(id));
  // when a name leaves the list: the seeds one by one, then the others
  const delayOf = (id: number) =>
    phase === "seeds" && seeds.includes(id)
      ? seeds.indexOf(id) * SEED_STEP
      : phase === "rest" && !seeds.includes(id)
        ? unseeded.indexOf(id) * REST_STEP
        : 0;
  const title = "text-[11px] font-semibold uppercase tracking-wider text-muted";

  return (
    <Figure
      title={s.title}
      caption={phone ? s.captionPhone : s.caption}
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-[12px] text-muted mr-1">{s.seededBy}</span>
        {(["ijf", "ours"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => run(m)}
            className={`h-8 px-2.5 border text-[12px] sm:text-[13px] font-semibold cursor-pointer ${mode === m ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink hover:border-ink"}`}
          >
            {m === "ijf" ? s.ijfRating : s.ajrRating}
          </button>
        ))}
        <button
          type="button"
          onClick={() => run(mode)}
          className="ml-auto text-[13px] font-semibold text-claret hover:underline cursor-pointer"
        >
          {s.replay}
        </button>
        {/* where they meet, once the ways are drawn */}
        <p
          className="basis-full text-[15px] text-claret font-semibold"
          style={{
            opacity: settled ? 1 : 0,
            transition: `opacity 500ms ${EASE}`,
          }}
        >
          {t(s.meet, { round: meetRound })}
        </p>
      </div>
      <div
        ref={box}
        className="relative w-full text-[13px] sm:text-[12px]"
        style={{ height }}
      >
        {/* the list, by the seeding's order: it stays, faint, under the names that leave it */}
        {!phone && (
        <>
        <div
          className={`absolute ${title} border-b border-rule`}
          style={{ left: 0, top: 0, width: listW, height: TOP - 8 }}
        >
          {mode === "ijf" ? s.byIjf : s.byAjr}
        </div>
        {listed.map((id, i) => {
          const e = byId.get(id)!;
          // the list: its number and rating stay, the row greys as its name leaves it
          const gone = isMoved(id);
          const fade = gone ? `${FLY / 2}ms ${EASE} ${delayOf(id)}ms` : "0ms";
          return (
            <div
              key={id}
              className={`absolute flex items-center gap-1.5 px-2 ${gone ? "text-muted/50" : "text-ink"}`}
              style={{
                left: 0,
                top: listY(i),
                width: listW,
                height: ROW,
                transition: `color ${fade}`,
              }}
            >
              <span className="w-4 shrink-0 text-right tabular-nums">
                {i < 8 || mode === "ours" ? i + 1 : ""}
              </span>
              <span
                style={{
                  opacity: gone ? 0.4 : 1,
                  transition: `opacity ${fade}`,
                }}
              >
                <Flag ioc={e.country} />
              </span>
              <span className="truncate">{e.name}</span>
              <span className="ml-auto tabular-nums">
                {mode === "ours" ? e.rating : ""}
              </span>
            </div>
          );
        })}
        <div
          className={`absolute ${title} normal-case tracking-normal italic font-normal`}
          style={{ left: 8, top: listY(8) - ROW + 6, width: listW }}
        >
          {s.notSeeded}
        </div>
        </>
        )}

        {/* the bracket: the rounds' titles, the pools' letters, the first round's boxes */}
        <div
          className="absolute flex border-b border-rule"
          style={{
            left: boxX,
            top: 0,
            width: width - boxX,
            height: TOP - 8,
          }}
        >
          <div className={title} style={{ width: boxW }}>
            {roundName(ROUNDS[0])}
          </div>
          {ROUNDS.slice(1, lastLevel).map((r, i) => (
              <div
                key={r}
                className={`${title} absolute`}
                // a phone's narrow columns: each title ends where its round's lines meet
                style={phone ? { left: joint(i + 2) - boxX - 4, transform: "translateX(-100%)" } : { left: nodeX(i + 2) - boxX + 6 }}
              >
                {roundName(r)}
              </div>
            ))}
        </div>
        {/* the pools: a band behind each, every other one shaded, as in the site's brackets */}
        {[0, 1, 2, 3].filter((pool) => shown(pool * 8)).map((pool) => {
          // two pools meet midway between the last box of one and the first of the next
          const edge = (p: number) =>
            p * 8 === first
              ? top(p * 8) - 4
              : p * 8 === first + count
                ? top(p * 8 - 1) + ROW + 4
                : (top(p * 8 - 1) + ROW + top(p * 8)) / 2;
          const bandTop = edge(pool);
          const bottom = edge(pool + 1);
          // to the corner where the pool's line enters 1/2
          const right = joint(4);
          return (
            <div
              key={`band-${pool}`}
              aria-hidden
              className={`absolute ${pool % 2 ? "" : "bg-panel/50"} ${pool ? "border-t border-rule" : ""}`}
              style={{
                left: poolX - 4,
                top: bandTop,
                width: right - poolX + 4,
                height: bottom - bandTop,
              }}
            />
          );
        })}
        {[0, 1, 2, 3].filter((pool) => shown(pool * 8)).map((pool) => (
          <div
            key={pool}
            className="absolute flex items-center justify-center text-[11px] font-bold text-muted"
            style={{
              left: poolX,
              top: top(pool * 8),
              width: 14,
              height: top(pool * 8 + 7) + ROW - top(pool * 8),
            }}
          >
            {"ABCD"[pool]}
          </div>
        ))}
        {Array.from({ length: count / 2 }, (_, k) => first / 2 + k).map((fight) => (
          <div
            key={fight}
            className="absolute border border-rule bg-paper"
            style={{
              left: boxX,
              top: top(2 * fight),
              width: boxW,
              height: 2 * ROW,
            }}
          >
            {[0, 1].map((side) =>
              draw[2 * fight + side] === null ? (
                <div
                  key={side}
                  className="absolute pl-[26px] flex items-center text-muted"
                  style={{ top: side * ROW, height: ROW }}
                  title={s.bye}
                >
                  —
                </div>
              ) : null,
            )}
          </div>
        ))}
        {(
          <svg
            className="absolute pointer-events-none"
            style={{ left: 0, top: 0 }}
            width={width}
            height={height}
          >
            <g stroke={LINE} strokeWidth="1" fill="none">
              {[2, 3, 4, 5].filter((lv) => lv <= lastLevel).flatMap((lv) =>
                Array.from({ length: count / 2 ** lv }, (_, k) => first / 2 ** lv + k).map((i) => {
                  const [a, b] = [cy(lv - 1, 2 * i), cy(lv - 1, 2 * i + 1)];
                  const x0 = lv === 2 ? treeX : nodeX(lv - 1);
                  return (
                    <path
                      key={`${lv}-${i}`}
                      d={`M${x0},${a} H${joint(lv)} V${b} H${x0} M${joint(lv)},${cy(lv, i)} H${nodeX(lv)}`}
                    />
                  );
                }),
              )}
            </g>
            {
              <g>
                {/* each one's way from her first contest to where they meet, drawn in */}
                <g
                  stroke="#990F3D"
                  strokeWidth="2"
                  fill="none"
                  style={{ opacity: placed ? 1 : 0 }}
                >
                  {[pa, pk].map((place) => (
                    <path
                      key={`${mode}-${place}`}
                      pathLength={1}
                      strokeDasharray="1"
                      style={{
                        strokeDashoffset: lit ? 0 : 1,
                        transition: lit
                          ? `stroke-dashoffset ${DRAW}ms ${EASE}`
                          : "none",
                      }}
                      d={Array.from({ length: level - 1 }, (_, k) => {
                        const lv = k + 2;
                        const from = cy(
                          lv - 1,
                          Math.floor(place / 2 ** (lv - 1)),
                        );
                        const x0 = lv === 2 ? treeX : nodeX(lv - 1);
                        const to = lv === level ? joint(lv) : nodeX(lv);
                        return `M${x0},${from} H${joint(lv)} V${cy(lv, Math.floor(place / 2 ** lv))} H${to}`;
                      }).join(" ")}
                    />
                  ))}
                </g>
                <circle
                  cx={joint(level)}
                  cy={cy(level, Math.floor(pa / 2 ** level))}
                  r="5"
                  fill="#990F3D"
                  style={{
                    opacity: settled ? 1 : 0,
                    transition: settled ? `opacity 500ms ${EASE}` : "none",
                  }}
                />
              </g>
            }
          </svg>
        )}

        {/* the names, from the list into the contests */}
        {listed.map((id, i) => {
          const e = byId.get(id)!;
          const seed = seeds.indexOf(id);
          const moved = isMoved(id);
          const place = placeOf.get(id)!;
          if (!shown(place)) return null;
          const inBox = {
            x: boxX + 1,
            y: top(place) + (place % 2 ? 0 : 1),
          }; // inside the box, its lines showing
          // a phone has no list beside: the names appear in their boxes instead of flying
          const pos = moved || phone ? inBox : { x: 0, y: listY(i) };
          const focus = id === ABE || id === KELDIYOROVA;
          const delay = delayOf(id);
          return (
            <div
              key={id}
              className={`absolute flex items-center gap-1.5 px-2 whitespace-nowrap overflow-hidden ${focus ? "text-claret z-10" : "text-ink"}`}
              style={{
                left: 0,
                top: 0,
                width: moved || phone ? boxW - 2 : listW,
                height: ROW - 1,
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                opacity: phone && !moved ? 0 : 1,
                transition:
                  phase === "list"
                    ? "none"
                    : phone
                      ? `opacity ${FLY / 2}ms ${EASE} ${delay}ms`
                      : `transform ${FLY}ms ${EASE} ${delay}ms, width ${FLY}ms ${EASE} ${delay}ms`,
              }}
            >
              {/* only the name flies, with its seed for the eight */}
              <span className="w-4 shrink-0 text-right tabular-nums">
                {seed >= 0 ? seed + 1 : ""}
              </span>
              <Flag ioc={e.country} />
              <span className="truncate">{e.name}</span>
            </div>
          );
        })}
      </div>
      {phone && (
        <details className="mt-4 group/list text-[13px]">
          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center gap-2 font-semibold text-claret">
            {mode === "ijf" ? s.orderIjf : s.orderAjr}
            <span className="text-muted group-open/list:rotate-90 transition-transform" aria-hidden>
              ›
            </span>
          </summary>
          <ol className="mt-2">
            {listed.map((id, i) => {
              const e = byId.get(id)!;
              return (
                <li key={id} className={`flex items-center gap-1.5 h-6 ${id === ABE || id === KELDIYOROVA ? "text-claret" : ""}`}>
                  <span className="w-5 shrink-0 text-right tabular-nums text-muted">{i < 8 || mode === "ours" ? i + 1 : ""}</span>
                  <Flag ioc={e.country} />
                  <span className="truncate">{e.name}</span>
                  <span className="ml-auto tabular-nums text-muted">{mode === "ours" ? e.rating : ""}</span>
                </li>
              );
            })}
          </ol>
          {mode === "ijf" && <p className="mt-1 text-[12px] text-muted">{s.seedsNote}</p>}
        </details>
      )}
    </Figure>
  );
}
