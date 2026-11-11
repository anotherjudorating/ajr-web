import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Flag } from "@/components/Flag";
import { Arrow, CHEVRON_CELL, RowChevron } from "@/components/Icon";
import { isUpset } from "@/components/rankings/Changes";
import { RowLink } from "@/components/RowLink";
import type { ContestDetail, HistoryRow } from "@/lib/api";
import { formatChance, formatDate, monthYear, roundCode, roundTitle, shortCompetition, shortName, signed } from "@/lib/format";
import { WEIGHTS, weightTitle } from "@/lib/weights";

const H2 = "font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight";
const HEAD = "flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2";
const LINK = "font-serif shrink-0 whitespace-nowrap text-[14px] font-semibold text-claret hover:underline";
const ROW = "border-b border-rule hover:bg-panel/40";
const CELL = "px-2 h-10 sm:h-11 py-0 align-middle";

type Side = "white" | "blue";
const SIDES: Side[] = ["white", "blue"]; // white is called first

// One athlete of the contest, with the fields of their side.
function athleteOf(c: ContestDetail, side: Side) {
  return {
    id: c[`${side}_id`]!,
    name: shortName(c[`${side}_family_name`], c[`${side}_given_name`]),
    family: c[`${side}_family_name`],
    country: c[`${side}_country`],
    place: c[`${side}_place_before`],
    scores: [c[`${side}_ippon`], c[`${side}_waza`], c[`${side}_yuko`]],
    shido: c[`${side}_shido`] ?? 0,
    chance: c[`${side}_win_probability`],
    rating: [c[`${side}_rating_before`], c[`${side}_rating_after`]],
    rd: [c[`${side}_rd_before`], c[`${side}_rd_after`]],
    score: [c[`${side}_score_before`], c[`${side}_score_after`]],
  };
}

// The judogi colour: white, or blue.
function Judogi({ side, className }: { side: Side; className: string }) {
  return <span className={`shrink-0 border border-ink ${side === "white" ? "bg-paper" : "bg-oxford"} ${className}`} />;
}

// The contest page, as in the prototype: the result, how it moved both ratings,
// each athlete's way to it at this tournament and their earlier meetings.
export function ContestView({
  contest: c,
  whiteHistory,
  blueHistory,
}: {
  contest: ContestDetail;
  whiteHistory: HistoryRow[];
  blueHistory: HistoryRow[];
}) {
  const weight = WEIGHTS.find((w) => w.api === c.weight);
  const weightName = weight ? weightTitle(weight) : (c.weight ?? "");
  const rated = c.white_win_probability !== null;
  const histories = { white: whiteHistory, blue: blueHistory };

  // each athlete's earlier contests at this tournament (histories come latest first)
  const road = (side: Side) => {
    const history = histories[side];
    const at = history.findIndex((row) => row.contest_id === c.contest_id);
    return history.slice(at + 1).filter((row) => row.competition_id === c.competition_id);
  };
  const roads = { white: road("white"), blue: road("blue") };
  const meetings = whiteHistory.filter((row) => row.opponent_id === c.blue_id && row.contest_id !== c.contest_id);

  return (
    <>
      <Breadcrumbs
        className="pt-[33.25px] sm:pt-[41.25px] md:pt-[42.75px] mb-4"
        trail={[
          { href: "/explore/tournaments", label: "Tournaments" },
          { href: `/tournaments/${c.competition_id}`, label: shortCompetition(c.competition) },
          { href: weight && `/tournaments/${c.competition_id}/${weight.slug}`, label: weightName },
        ]}
        current={c.round ? roundTitle(c.round) : "Contest"}
      />
      <h1 className="sr-only">
        {athleteOf(c, "white").name} vs {athleteOf(c, "blue").name} — {roundTitle(c.round)}, {weightName}, {c.competition}
      </h1>

      <Result contest={c} />
      {rated && <RatingChange contest={c} />}

      {(roads.white.length > 0 || roads.blue.length > 0) && (
        <section className="mt-14 lg:mt-16">
          <div className={HEAD}>
            <h2 className={H2}>Road to the {c.round ? roundTitle(c.round).replace(/^[A-Z]/, (l) => l.toLowerCase()) : "contest"}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-24 mt-4">
            {SIDES.map((side) => {
              const athlete = athleteOf(c, side);
              return (
                <div key={side}>
                  <div className="flex items-center gap-2 mb-1 text-[14px] font-semibold">
                    <Judogi side={side} className="w-[6px] h-5" />
                    <Flag ioc={athlete.country} />
                    <Link href={`/athletes/${athlete.id}`} className="hover:underline">
                      {athlete.name}
                    </Link>
                  </div>
                  <table className="w-full border-collapse text-[13px] sm:text-[14px] tabular-nums">
                    <tbody>
                      {roads[side].map((row) => (
                        <RoadRow key={row.contest_id} row={row} />
                      ))}
                      {roads[side].length === 0 && (
                        <tr>
                          <td className={`${CELL} text-muted`}>First contest of the tournament.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {meetings.length > 0 && (
        <section className="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-24">
          <div>
            <div className={HEAD}>
              <h2 className={H2}>{meetingsTitle(c, meetings)}</h2>
              <Link
                href={`/head-to-head?${new URLSearchParams({
                  ...(weight && { w: weight.slug }),
                  a: String(c.white_id),
                  b: String(c.blue_id),
                })}`}
                className={LINK}
              >
                Head-to-head
              </Link>
            </div>
            <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
              <tbody>
                {meetings.map((row) => {
                  const winner = athleteOf(c, row.won ? "white" : "blue");
                  return (
                    <RowLink key={row.contest_id} href={`/contests/${row.contest_id}`} className={ROW}>
                      <td className={`w-[76px] sm:w-28 ${CELL} whitespace-nowrap text-muted`}>
                        <span className="sm:hidden">{monthYear(row.fought_on)}</span>
                        <span className="hidden sm:inline">{formatDate(row.fought_on)}</span>
                      </td>
                      <td className={`${CELL} truncate`}>
                        <span className="sm:hidden">{shortCompetition(row.competition)}</span>
                        <span className="hidden sm:inline">{row.competition}</span>
                      </td>
                      <td className={`w-10 sm:w-14 ${CELL} text-muted`}>{roundCode(row.round)}</td>
                      <td className={CELL}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Flag ioc={winner.country} />
                          <span className="font-medium truncate">{winner.name}</span>
                        </div>
                      </td>
                      <td className={`${CHEVRON_CELL}`}>
                        <Link href={`/contests/${row.contest_id}`} aria-label="The contest">
                          <RowChevron />
                        </Link>
                      </td>
                    </RowLink>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

function Result({ contest: c }: { contest: ContestDetail }) {
  return (
    <section>
      <div className={HEAD}>
        <h2 className={H2}>Contest result</h2>
      </div>
      <div className="flex items-center justify-between border-b border-rule py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted">
        <div className="flex-1 min-w-0 pl-1 sm:pl-3">Athlete</div>
        <div className="flex items-center shrink-0">
          <div className="w-8 sm:w-14 text-center">I</div>
          <div className="w-8 sm:w-14 text-center">W</div>
          <div className="w-8 sm:w-14 text-center">Y</div>
          <div className="w-14 sm:w-24 text-center">Shido</div>
          <div className="w-12 sm:w-24 text-right pr-1">Result</div>
        </div>
      </div>
      {SIDES.map((side, i) => {
        const athlete = athleteOf(c, side);
        return (
          <div key={side} className={`h-12 flex items-center justify-between ${i === 1 ? "border-b border-rule" : ""}`}>
            <div className="flex items-center flex-1 min-w-0 gap-2 pl-1 sm:pl-3">
              <Judogi side={side} className="w-[6px] h-7" />
              <Flag ioc={athlete.country} />
              <Link href={`/athletes/${athlete.id}`} className="text-[14px] font-semibold truncate hover:underline">
                {athlete.name}
              </Link>
              <span className="hidden sm:inline text-[12px] text-muted">
                {athlete.country}
                {athlete.place && (
                  <>
                    {" "}
                    <span className="text-rule">|</span> #{athlete.place}
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center shrink-0 text-[16px] font-semibold tabular-nums">
              {athlete.scores.map((score, j) => (
                <div key={j} className="w-8 sm:w-14 text-center">
                  {score ?? 0}
                </div>
              ))}
              <div className="w-14 sm:w-24 flex justify-center gap-1">
                {[0, 1, 2].map((j) => (
                  <span
                    key={j}
                    className={`w-2 h-3 sm:w-[10px] sm:h-[14px] ${j < athlete.shido ? "bg-[#E8B90A]" : "border border-rule"}`}
                  />
                ))}
              </div>
              <div className="w-12 sm:w-24 text-right pr-1">
                {c.winner_id === athlete.id && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-gain text-gain">
                    Win
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div className="h-10 sm:h-12 flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted pl-1 sm:pl-3">{formatDate(c.day)}</span>
        {c.walkover ? (
          <span className="inline-flex items-center gap-2 pr-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted">Walkover</span>
            <span className="text-[12px] font-medium text-muted">not rated</span>
          </span>
        ) : c.duration && (
          <span className="inline-flex items-center gap-2 pr-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted">Time</span>
            <span className="text-[16px] font-semibold tabular-nums">
              {clock(c.duration)}
              {c.golden_score && <span className="ml-1.5 text-[11px] font-bold text-muted">GS</span>}
            </span>
          </span>
        )}
      </div>
    </section>
  );
}

function RatingChange({ contest: c }: { contest: ContestDetail }) {
  const rows = SIDES.map((side) => ({ side, athlete: athleteOf(c, side) }));
  const TH = "px-3 h-9 py-0 align-middle text-[11px] font-bold uppercase tracking-wider text-muted";
  const TD = "px-3 h-10 sm:h-11 py-0 align-middle whitespace-nowrap";
  const LABEL = "pl-1 h-10 py-0 align-middle text-[10px] font-bold uppercase tracking-wider text-muted";
  const MOBILE = "px-2 sm:px-3 h-10 py-0 align-middle text-right whitespace-nowrap";
  return (
    <section className="mt-14 lg:mt-16">
      <div className={HEAD}>
        <h2 className={H2}>Rating change</h2>
        <Link href="/methodology" className={LINK}>
          How ratings work
        </Link>
      </div>
      <table className="hidden sm:table w-full border-collapse text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${TH} text-left`}>Athlete</th>
            <th className={`${TH} text-right w-24`}>Chance</th>
            <th className={`${TH} text-right w-56`}>Skill</th>
            <th className={`${TH} text-right w-32`}>RD</th>
            <th className={`${TH} text-right w-56`}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ side, athlete }, i) => (
            <tr key={side} className={i === 0 ? "border-b border-rule" : ""}>
              <td className={`${TD} text-left`}>
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Judogi side={side} className="w-[6px] h-5" />
                  <Flag ioc={athlete.country} />
                  {athlete.name}
                </span>
              </td>
              <td className={`${TD} text-right text-muted`}>{percent(athlete.chance)}</td>
              <td className={`${TD} text-right`}>
                <Sum pair={athlete.rating} weight="font-semibold" />
              </td>
              <td className={`${TD} text-right`}>
                {athlete.rd[0]}
                <Arrow />
                {athlete.rd[1]}
              </td>
              <td className={`${TD} text-right`}>
                <Sum pair={athlete.score} weight="font-bold" bold />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="sm:hidden w-full border-collapse text-[13px] tabular-nums">
        <thead>
          <tr className="border-b border-rule">
            <th className="w-16 h-9 py-0 align-middle" />
            {rows.map(({ side, athlete }) => (
              <th key={side} className="px-2 h-9 py-0 align-middle text-right font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <Judogi side={side} className="w-[6px] h-4" />
                  <Flag ioc={athlete.country} />
                  {athlete.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-rule">
            <td className={LABEL}>Chance</td>
            {rows.map(({ side, athlete }) => (
              <td key={side} className={`${MOBILE} text-muted`}>
                {percent(athlete.chance)}
              </td>
            ))}
          </tr>
          <tr className="border-b border-rule">
            <td className={LABEL}>Skill</td>
            {rows.map(({ side, athlete }) => (
              <td key={side} className={MOBILE}>
                <Sum pair={athlete.rating} weight="font-semibold" />
              </td>
            ))}
          </tr>
          <tr className="border-b border-rule">
            <td className={LABEL}>RD</td>
            {rows.map(({ side, athlete }) => (
              <td key={side} className={MOBILE}>
                {athlete.rd[0]}
                <Arrow />
                {athlete.rd[1]}
              </td>
            ))}
          </tr>
          <tr>
            <td className={LABEL}>Rating</td>
            {rows.map(({ side, athlete }) => (
              <td key={side} className={MOBILE}>
                <Sum pair={athlete.score} weight="font-bold" bold />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-[12px] text-muted">Rating = skill − RD. Lower RD, higher rating.</p>
    </section>
  );
}

// "2373 − 13 = 2360", the change coloured.
function Sum({ pair: [before, after], weight, bold = false }: { pair: (number | null)[]; weight: string; bold?: boolean }) {
  if (before === null || after === null) return <>–</>;
  const change = after - before;
  return (
    <>
      {before}{" "}
      <span className={`${weight} ${change >= 0 ? "text-gain" : "text-drop"}`}>
        {change >= 0 ? "+" : "−"} {Math.abs(change)}
      </span>{" "}
      <span className="text-muted">=</span> <span className={bold ? "font-bold" : ""}>{after}</span>
    </>
  );
}

// An earlier contest of the athlete at the tournament.
function RoadRow({ row }: { row: HistoryRow }) {
  const chance = formatChance(row.win_probability);
  const gain = row.score_after - row.score_before;
  return (
    <RowLink href={`/contests/${row.contest_id}`} className={ROW}>
      <td className={`w-10 ${CELL} font-semibold text-muted`}>{roundCode(row.round)}</td>
      <td className={CELL}>
        <div className="flex items-center gap-1.5 min-w-0">
          <Flag ioc={row.opponent_country} />
          <Link href={`/athletes/${row.opponent_id}`} className="truncate hover:underline">
            {shortName(row.opponent_family_name, row.opponent_given_name)}
          </Link>
        </div>
      </td>
      <td className={`w-24 ${CELL} text-right whitespace-nowrap text-muted`}>
        <span className="inline-flex items-center gap-1.5">
          {isUpset(row.won, row.win_probability) && (
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border ${row.won ? "border-gain text-gain" : "border-drop text-drop"}`}
            >
              Upset
            </span>
          )}
          {chance}
        </span>
      </td>
      <td className={`w-12 ${CELL} text-right font-bold ${row.won ? "text-gain" : "text-drop"}`}>{signed(gain)}</td>
      <td className={`${CHEVRON_CELL}`}>
        <Link href={`/contests/${row.contest_id}`} aria-label="The contest">
          <RowChevron />
        </Link>
      </td>
    </RowLink>
  );
}

// "Heydarov leads 2–1" of the earlier meetings (rows of the white athlete's history).
function meetingsTitle(c: ContestDetail, meetings: HistoryRow[]): string {
  const white = meetings.filter((row) => row.won).length;
  const blue = meetings.length - white;
  if (white === blue) return `Level at ${white}–${blue}`;
  const leader = white > blue ? c.white_family_name : c.blue_family_name;
  return `${shortName(leader, null)} leads ${Math.max(white, blue)}–${Math.min(white, blue)}`;
}

// "00:02:41" -> "2:41"
function clock(duration: string): string {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return `${hours * 60 + minutes}:${String(seconds).padStart(2, "0")}`;
}

function percent(value: number | null): string {
  return value === null ? "–" : formatChance(value);
}
