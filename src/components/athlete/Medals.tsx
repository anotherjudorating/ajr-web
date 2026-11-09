"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

import { Icon } from "@/components/Icon";
import { Medal, MEDAL_BADGE, type MedalKind } from "@/components/Medal";
import { HEAD_CELL, ROW_CELL } from "@/components/tournament/styles";
import type { HistoryRow } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { WEIGHTS } from "@/lib/weights";

const H2 = "font-serif text-[20px] sm:text-[24px] font-bold text-ink border-b-2 border-ink pb-2";
const KINDS: MedalKind[] = ["gold", "silver", "bronze"];

// The levels, most important first, and which judobase levels (rank_name) each holds.
const LEVELS: { title: string; holds: (rank: string) => boolean }[] = [
  { title: "Olympic Games", holds: (r) => r === "Olympic Games" },
  { title: "World Championships", holds: (r) => r.startsWith("World Championships") },
  { title: "Continental Championships", holds: (r) => r.endsWith("Championships") },
  { title: "Masters", holds: (r) => r === "Masters" },
  { title: "Grand Slam", holds: (r) => r === "Grand Slam" },
  { title: "Grand Prix", holds: (r) => r === "Grand Prix" },
  { title: "Continental Opens & Cups", holds: (r) => r.endsWith("Open") || r.endsWith("Cup") },
  { title: "Other", holds: () => true },
];

type Entry = {
  competition_id: number;
  competition: string;
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
      day: row.fought_on,
      weight: row.weight,
      result: row.result,
      level: LEVELS.find((l) => l.holds(rank))!.title,
    });
  }
  return [...byKey.values()].sort((a, b) => (a.day < b.day ? 1 : -1));
}

const isMedal = (result: string | null): result is MedalKind => KINDS.includes(result as MedalKind);

// Medals by the tournament's level, over the whole career (every weight); a level
// opens to its tournaments with the result. Levels never entered are left out.
export function Medals({ history }: { history: HistoryRow[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const all = entries(history);
  const levels = LEVELS.map((level) => {
    const list = all.filter((e) => e.level === level.title);
    const count = (m: MedalKind) => list.filter((e) => e.result === m).length;
    return { title: level.title, list, gold: count("gold"), silver: count("silver"), bronze: count("bronze") };
  }).filter((level) => level.list.length > 0);
  if (levels.length === 0) return null;
  const total = (l: { gold: number; silver: number; bronze: number }) => l.gold + l.silver + l.bronze;

  return (
    <section className="mt-14 md:mt-16">
      <h2 className={H2}>Medals</h2>
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
            <th className={`${HEAD_CELL} text-right w-14 sm:w-16`}>Total</th>
            <th className="w-6 h-9 py-0 pl-1 pr-0" />
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
                  <td className={`${ROW_CELL} text-right font-semibold`}>{total(level)}</td>
                  <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                    <Icon size={18} name={isOpen ? "expand_less" : "expand_more"} className="align-middle" />
                  </td>
                </tr>
                {isOpen &&
                  level.list.map((e) => (
                    <tr key={`${e.competition_id}/${e.weight}`} className="h-9 bg-panel/50 border-b border-rule text-[12px] sm:text-[13px]">
                      <td colSpan={4} className="pl-4 sm:pl-6 pr-2 py-1.5">
                        <span className="text-muted tabular-nums mr-2 sm:mr-3">{formatDate(e.day)}</span>
                        <Link href={tournamentLink(e)} className="text-ink hover:underline">
                          {e.competition}
                        </Link>
                        {e.weight && <span className="text-muted ml-2 whitespace-nowrap">{weightLabel(e.weight)}</span>}
                      </td>
                      <td colSpan={2} className="px-2 sm:px-3 text-right whitespace-nowrap">
                        <Result result={e.result} />
                      </td>
                    </tr>
                  ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function Result({ result }: { result: string | null }) {
  if (isMedal(result)) {
    return (
      <span className={`px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border ${MEDAL_BADGE[result]}`}>
        {result}
      </span>
    );
  }
  return <span className="text-muted">{result ?? "—"}</span>;
}

// −73 with the minus sign, as everywhere on the site
const weightLabel = (api: string) => WEIGHTS.find((w) => w.api === api)?.label ?? api;

function tournamentLink(e: Entry): string {
  const weight = WEIGHTS.find((w) => w.api === e.weight);
  return weight ? `/tournaments/${e.competition_id}/${weight.slug}` : `/tournaments/${e.competition_id}`;
}
