"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

import { goToRow, useHash, useRowMark, useRowScroll } from "@/components/anchors";

import { Flag } from "@/components/Flag";
import { CHEVRON_CELL, Icon, RowChevron } from "@/components/Icon";
import { HashScroll } from "@/components/HashScroll";
import { Medal, type MedalKind } from "@/components/Medal";
import { HEAD_CELL, Pagination, ROW_CELL } from "@/components/rankings/TableParts";
import { H2, HEAD, LINK } from "@/components/tournament/styles";
import type { CompetitionResult } from "@/lib/api";
import { medallistRow, nationRow, SECTION } from "@/lib/anchors";
import { shortName } from "@/lib/format";
import { WEIGHTS } from "@/lib/weights";

const KINDS: MedalKind[] = ["gold", "silver", "bronze"];
const weightIndex = (api: string) => WEIGHTS.findIndex((w) => w.api === api);
const SIZES = [10, 20, 50];

// Medals by nation, golds first, a page at a time: 20 rows on wider screens and 10
// on phones until a size is picked. A nation opens to its medallists (a click on one
// glides up to them in the weights' results, the name opens the athlete's page); its
// flag and code open the nation's page.
// #nation-<IOC> (a tournament on the nation's page): that nation opened and marked.
export function NationMedals({ medallists }: { medallists: CompetitionResult[] }) {
  const [size, setSize] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);

  const counts = new Map<string, Record<MedalKind, number>>();
  for (const r of medallists) {
    if (!r.country) continue;
    const nation = counts.get(r.country) ?? { gold: 0, silver: 0, bronze: 0 };
    nation[r.result as MedalKind] += 1;
    counts.set(r.country, nation);
  }
  const nations = [...counts]
    .map(([country, medals]) => ({ country, ...medals, total: medals.gold + medals.silver + medals.bronze }))
    .sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze || a.country.localeCompare(b.country));
  const hash = useHash();
  const marked = hash.startsWith("nation-") ? hash.slice("nation-".length) : null;
  const [placedFor, setPlacedFor] = useState("");
  const markedAt = marked === null ? -1 : nations.findIndex((n) => n.country === marked);
  if (markedAt >= 0 && placedFor !== hash) {
    setPlacedFor(hash);
    setOpen(marked);
    setSize(markedAt >= 10 ? 20 : size);
    setPage(Math.floor(markedAt / (size ?? 20)) + 1);
  }
  const lit = useRowMark(marked !== null, hash);
  useRowScroll(hash, placedFor === hash && marked !== null);
  if (nations.length === 0) return null;

  const shown = size ?? 20;
  const rows = nations.slice((page - 1) * shown, page * shown);
  const pick = (value: number) => {
    setSize(value);
    setPage(1);
  };
  const pagination = (pageSize: number) => (
    <Pagination
      total={nations.length}
      first={(page - 1) * pageSize}
      count={Math.min(pageSize, nations.length - (page - 1) * pageSize)}
      noun="nations"
      pageSize={pageSize}
      sizes={SIZES}
      onPageSize={pick}
      page={page}
      pages={Math.ceil(nations.length / pageSize)}
      onPage={(value) => {
        setSize(pageSize);
        setPage(value);
      }}
    />
  );

  return (
    <section id={SECTION.nations}>
      <HashScroll id={SECTION.nations} />
      <div className={HEAD}>
        <h2 className={H2}>Medals by nation</h2>
        <Link href="/rankings/teams/mixed" className={LINK}>
          Nations ranking
        </Link>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Nation</th>
            {KINDS.map((kind) => (
              <th key={kind} className={`${HEAD_CELL} text-center w-11 sm:w-14`} title={kind}>
                <span className="inline-flex justify-center w-full">
                  <Medal kind={kind} />
                </span>
              </th>
            ))}
            <th className={`${HEAD_CELL} text-right w-14 sm:w-16`}>Total</th>
            <th className="w-8 sm:w-10 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {rows.map((n, i) => {
            const isOpen = open === n.country;
            const own = medallists
              .filter((r) => r.country === n.country && KINDS.includes(r.result as MedalKind))
              .sort((a, b) => KINDS.indexOf(a.result as MedalKind) - KINDS.indexOf(b.result as MedalKind) || weightIndex(a.weight) - weightIndex(b.weight));
            return (
              <Fragment key={n.country}>
                <tr
                  id={nationRow(n.country)}
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest("a")) setOpen(isOpen ? null : n.country);
                  }}
                  aria-expanded={isOpen}
                  className={`border-b border-rule hover:bg-panel/40 cursor-pointer ${size === null && i >= 10 ? "hidden sm:table-row" : ""} ${n.country === marked ? lit.row : ""}`}
                >
                  <td className={ROW_CELL}>
                    {/* the flag and code: the nation's page */}
                    <Link href={`/countries/${n.country.toLowerCase()}`} className="inline-flex items-center gap-1.5 hover:underline">
                      <Flag ioc={n.country} />
                      <span className="font-medium">{n.country}</span>
                    </Link>
                  </td>
                  {KINDS.map((kind) => (
                    <td key={kind} className={`${ROW_CELL} text-center`}>
                      {n[kind]}
                    </td>
                  ))}
                  <td className={`${ROW_CELL} text-right font-semibold`}>{n.total}</td>
                  <td className={`${CHEVRON_CELL} h-10 sm:h-11`}>
                    <Icon size={18} name={isOpen ? "expand_less" : "expand_more"} className="align-middle" />
                  </td>
                </tr>
                {isOpen &&
                  own.map((r) => {
                    const weight = WEIGHTS.find((w) => w.api === r.weight);
                    return (
                      <tr
                        key={`${r.weight}-${r.athlete_id}`}
                        // up to the medallist in the weights' results
                        onClick={(e) => {
                          if (weight && !(e.target as HTMLElement).closest("a")) goToRow(medallistRow(weight.slug, r.athlete_id));
                        }}
                        className="group bg-panel/50 border-b border-rule text-[12px] sm:text-[13px] cursor-pointer hover:bg-panel"
                      >
                        <td colSpan={KINDS.length + 2} className="pl-4 sm:pl-6 pr-2 py-1.5">
                          <span className="flex items-center gap-2 min-w-0">
                            <Medal kind={r.result as MedalKind} className="w-3.5 h-4 shrink-0" />
                            <span className="text-muted tabular-nums w-12 shrink-0">{weight?.label ?? r.weight}</span>
                            <Link href={`/athletes/${r.athlete_id}`} className="text-ink truncate hover:underline">
                              {shortName(r.family_name, r.given_name)}
                            </Link>
                          </span>
                        </td>
                        <td className={`${CHEVRON_CELL} h-9`}>
                          <RowChevron />
                        </td>
                      </tr>
                    );
                  })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {/* a short table (a tournament under way) needs no pages */}
      {nations.length > 10 &&
        (size === null ? (
          <>
            <div className="hidden sm:block">{pagination(20)}</div>
            <div className="sm:hidden">{pagination(10)}</div>
          </>
        ) : (
          pagination(size)
        ))}
    </section>
  );
}
