"use client";

import { useState } from "react";

import { Icon } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { Pagination } from "@/components/rankings/TableParts";
import { RowLink } from "@/components/RowLink";
import { H2, HEAD, HEAD_CELL, ROW_CELL } from "@/components/tournament/styles";
import type { CountryTournament } from "@/lib/api";
import { formatDate, shortCompetition } from "@/lib/format";

const KINDS: MedalKind[] = ["gold", "silver", "bronze"];
const SIZES = [10, 20, 50];

// Every tournament the nation's athletes fought at, newest first, with their medals,
// a page at a time (as medals by nation). The full name where there is room, the
// short one (World Ch., GS) on a phone.
export function Tournaments({ rows }: { rows: CountryTournament[] }) {
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  if (rows.length === 0) return null;
  const shown = rows.slice((page - 1) * size, page * size);
  return (
    <section>
      <div className={HEAD}>
        <h2 className={H2}>Tournaments</h2>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Tournament</th>
            <th className={`${HEAD_CELL} text-left w-28 hidden sm:table-cell`}>Date</th>
            {KINDS.map((kind) => (
              <th key={kind} className={`${HEAD_CELL} text-center w-11 sm:w-14`} title={kind}>
                <span className="inline-flex justify-center w-full">
                  <Medal kind={kind} />
                </span>
              </th>
            ))}
            <th className="w-6 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {shown.map((t) => (
            <RowLink key={t.id} href={`/tournaments/${t.id}`} className="border-b border-rule hover:bg-panel/40">
              <td className={ROW_CELL}>
                <span className="font-medium truncate block sm:hidden">{shortCompetition(t.name)}</span>
                <span className="font-medium truncate hidden sm:block">{t.name.replace(/\s+Individuals?$/i, "")}</span>
              </td>
              <td className={`${ROW_CELL} text-muted whitespace-nowrap hidden sm:table-cell`}>{formatDate(t.date_from)}</td>
              {KINDS.map((kind) => (
                <td key={kind} className={`${ROW_CELL} text-center`}>
                  {t[kind]}
                </td>
              ))}
              <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
      {rows.length > SIZES[0] && (
        <Pagination
          total={rows.length}
          first={(page - 1) * size}
          count={shown.length}
          noun="tournaments"
          pageSize={size}
          sizes={SIZES}
          onPageSize={(value) => {
            setSize(value);
            setPage(1);
          }}
          page={page}
          pages={Math.ceil(rows.length / size)}
          onPage={setPage}
        />
      )}
    </section>
  );
}
