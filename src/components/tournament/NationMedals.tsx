"use client";

import Link from "next/link";
import { useState } from "react";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { HEAD_CELL, Pagination, ROW_CELL } from "@/components/rankings/TableParts";
import { RowLink } from "@/components/RowLink";
import { H2, HEAD, LINK } from "@/components/tournament/styles";
import type { CompetitionResult } from "@/lib/api";

const KINDS: MedalKind[] = ["gold", "silver", "bronze"];
const SIZES = [10, 20, 50];

// Medals by nation, golds first, a page at a time: 20 rows on wider screens and 10
// on phones until a size is picked.
export function NationMedals({ medallists }: { medallists: CompetitionResult[] }) {
  const [size, setSize] = useState<number | null>(null);
  const [page, setPage] = useState(1);

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
    <section>
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
            <th className="w-6 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {rows.map((n, i) => (
            <RowLink
              key={n.country}
              href={`/explore/athletes?country=${n.country}`}
              className={`border-b border-rule hover:bg-panel/40 ${size === null && i >= 10 ? "hidden sm:table-row" : ""}`}
            >
              <td className={ROW_CELL}>
                <div className="flex items-center gap-1.5">
                  <Flag ioc={n.country} />
                  <span className="font-medium">{n.country}</span>
                </div>
              </td>
              {KINDS.map((kind) => (
                <td key={kind} className={`${ROW_CELL} text-center`}>
                  {n[kind]}
                </td>
              ))}
              <td className={`${ROW_CELL} text-right font-semibold`}>{n.total}</td>
              <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </RowLink>
          ))}
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
