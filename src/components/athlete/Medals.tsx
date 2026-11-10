"use client";

import { Fragment, useLayoutEffect, useState } from "react";

import { useHashTarget } from "@/components/anchors";
import { Flag } from "@/components/Flag";
import { CHEVRON_CELL, Icon, RowChevron } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { RowLink } from "@/components/RowLink";
import { HEAD_CELL, ROW_CELL } from "@/components/tournament/styles";
import type { HistoryRow } from "@/lib/api";
import { SECTION } from "@/lib/anchors";
import { formatDate, shortCompetition } from "@/lib/format";
import { LEVELS, levelOf } from "@/lib/levels";
import { tournamentPath, WEIGHTS } from "@/lib/weights";

const H2 = "font-serif text-[20px] sm:text-[24px] font-bold text-ink border-b-2 border-ink pb-2";
const KINDS: MedalKind[] = ["gold", "silver", "bronze"];
// The places without a medal, as columns: key, heading, tooltip.
const PLACES = [
  ["fifth", "5th", "Fifth place"],
  ["seventh", "7th", "Seventh place"],
  ["other", "Other", "Out earlier, or a result judobase does not give"],
] as const;
const WIDE = "hidden md:table-cell";

type Entry = {
  competition_id: number;
  competition: string;
  country: string | null; // the tournament's
  day: string; // the first contest
  weight: string | null;
  result: string | null;
};

// One entry per tournament and weight (an athlete can enter two weights of one event).
function entries(history: HistoryRow[]): (Entry & { level: string })[] {
  const byKey = new Map<string, Entry & { level: string }>();
  for (const row of history) {
    const key = `${row.competition_id}/${row.weight}`;
    const seen = byKey.get(key);
    if (seen) {
      if (row.fought_on < seen.day) seen.day = row.fought_on; // history is latest first
      continue;
    }
    const rank = row.competition_rank ?? "";
    byKey.set(key, {
      competition_id: row.competition_id,
      competition: row.competition,
      country: row.competition_country,
      day: row.fought_on,
      weight: row.weight,
      result: row.result,
      level: levelOf(rank),
    });
  }
  return [...byKey.values()].sort((a, b) => (a.day < b.day ? 1 : -1));
}

const isMedal = (result: string | null): result is MedalKind => KINDS.includes(result as MedalKind);

// Results by the tournament's level, over the whole career (every weight): the medals
// and how many tournaments were entered (Total, with or without a medal); a level
// opens to its tournaments with the result. Levels never entered are left out.
//
// #results opens the page here (lib/anchors.ts).
export function Medals({ history }: { history: HistoryRow[] }) {
  const { ref, scrollNow } = useHashTarget(SECTION.results);
  const [open, setOpen] = useState<string | null>(null);
  useLayoutEffect(scrollNow, [scrollNow]);
  const all = entries(history);
  const levels = LEVELS.map((level) => {
    const list = all.filter((e) => e.level === level.title);
    const count = (m: MedalKind) => list.filter((e) => e.result === m).length;
    const gold = count("gold"), silver = count("silver"), bronze = count("bronze");
    const fifth = list.filter((e) => e.result === "5th").length;
    const seventh = list.filter((e) => e.result === "7th").length;
    const other = list.length - gold - silver - bronze - fifth - seventh;
    return { title: level.title, list, gold, silver, bronze, fifth, seventh, other };
  }).filter((level) => level.list.length > 0);
  if (levels.length === 0) return null;

  return (
    <section id={SECTION.results} ref={ref} className="mt-14 md:mt-16">
      <h2 className={H2}>Results</h2>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Level</th>
            {KINDS.map((kind) => (
              <th key={kind} className={`${HEAD_CELL} text-center w-11 sm:w-14`} title={kind}>
                <span className="inline-flex justify-center w-full">
                  <Medal kind={kind} />
                </span>
              </th>
            ))}
            {/* places without a medal: on wider screens only */}
            {PLACES.map(([key, label, title]) => (
              <th key={key} className={`${HEAD_CELL} ${WIDE} text-center w-14`} title={title}>
                {label}
              </th>
            ))}
            <th className={`${HEAD_CELL} text-right w-14 sm:w-16`} title="Tournaments entered">
              Total
            </th>
            <th className="w-8 sm:w-10 h-9 py-0" />
          </tr>
        </thead>
        <tbody>
          {levels.map((level) => {
            const isOpen = open === level.title;
            return (
              <Fragment key={level.title}>
                <tr
                  className="border-b border-rule cursor-pointer hover:bg-panel/40"
                  onClick={() => setOpen(isOpen ? null : level.title)}
                  aria-expanded={isOpen}
                >
                  <td className={`${ROW_CELL} font-medium`}>
                    {/* the two continental levels break after "Continental" on a phone */}
                    {level.title.startsWith("Continental ") ? (
                      <>
                        Continental <br className="sm:hidden" />
                        {level.title.slice("Continental ".length)}
                      </>
                    ) : (
                      level.title
                    )}
                  </td>
                  {KINDS.map((kind) => (
                    <td key={kind} className={`${ROW_CELL} text-center`}>
                      {level[kind]}
                    </td>
                  ))}
                  {PLACES.map(([key]) => (
                    <td key={key} className={`${ROW_CELL} ${WIDE} text-center`}>
                      {level[key]}
                    </td>
                  ))}
                  <td className={`${ROW_CELL} text-right font-semibold`}>{level.list.length}</td>
                  <td className={`${CHEVRON_CELL} h-10 sm:h-11`}>
                    <Icon size={18} name={isOpen ? "expand_less" : "expand_more"} className="align-middle" />
                  </td>
                </tr>
                {/* its tournaments, as the tournaments' lists: the row opens the
                    tournament at the weight; its day, the weight, the flag, the name
                    (shortened on a phone); the medal or the place at the right */}
                {isOpen &&
                  level.list.map((e) => (
                    <RowLink
                      key={`${e.competition_id}/${e.weight}`}
                      href={tournamentPath(e.competition_id, e.weight)}
                      className="group bg-panel/50 border-b border-rule text-[12px] sm:text-[13px] hover:bg-panel"
                    >
                      <td colSpan={4} className="h-9 pl-4 sm:pl-6 pr-2 py-1.5">
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="hidden sm:inline text-muted tabular-nums w-[88px] shrink-0">{formatDate(e.day)}</span>
                          <span className="text-muted tabular-nums w-9 sm:w-10 shrink-0">{e.weight ? weightLabel(e.weight) : ""}</span>
                          {e.country && <Flag ioc={e.country} />}
                          <span className="text-ink truncate group-hover:underline sm:hidden">{shortCompetition(e.competition)}</span>
                          <span className="text-ink truncate group-hover:underline hidden sm:inline">{e.competition.replace(/\s+Individuals?$/i, "")}</span>
                        </span>
                      </td>
                      {/* the result under Total (and the places, when they are shown) */}
                      <td className="md:hidden px-2 sm:px-3 text-right whitespace-nowrap">
                        <Result result={e.result} />
                      </td>
                      <td colSpan={1 + PLACES.length} className={`${WIDE} px-2 sm:px-3 text-right whitespace-nowrap`}>
                        <Result result={e.result} />
                      </td>
                      <td className={CHEVRON_CELL}>
                        <RowChevron />
                      </td>
                    </RowLink>
                  ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

// A medal as in the columns over it; another place as the tables write it.
function Result({ result }: { result: string | null }) {
  if (isMedal(result)) return <Medal kind={result} className="inline-block align-middle w-3.5 h-4" />;
  return <span className="text-muted">{result ?? "–"}</span>;
}

// −73 with the minus sign, as everywhere on the site
const weightLabel = (api: string) => WEIGHTS.find((w) => w.api === api)?.label ?? api;
