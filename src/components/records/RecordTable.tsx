"use client";

import { useRouter } from "next/navigation";

import { Icon } from "@/components/Icon";
import { type Column, rowLink, TD, TH } from "@/components/records/columns";
import type { RecordRow } from "@/lib/api";

// A record's table: place, the record's columns, a chevron when the row leads somewhere.
export function RecordTable({
  rows,
  ranks,
  columns,
  full = false,
  children,
}: {
  rows: RecordRow[];
  ranks: number[];
  columns: Column[];
  full?: boolean; // the full list: a wider place column
  children?: React.ReactNode; // extra rows (placeholders while loading)
}) {
  const router = useRouter();
  const rankWidth = full ? "w-10 sm:w-12" : "w-8 sm:w-10";

  return (
    <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum">
      <thead>
        <tr className="bg-panel border-b border-rule">
          <th className={`${TH} text-right ${rankWidth}`}>#</th>
          {columns.map((c) => (
            <th key={c.label} title={c.title} className={`${TH} ${c.th}`}>
              {c.header ?? c.label}
            </th>
          ))}
          <th className="w-6 h-9 py-0 pl-1 pr-0" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const link = rowLink(row);
          return (
            <tr
              key={`${row.place}-${row.athlete_id}-${row.opponent_id}-${row.country}-${row.competition_id}`}
              onClick={link ? () => router.push(link) : undefined}
              className={`border-b border-rule hover:bg-panel/40 ${link ? "cursor-pointer" : ""}`}
            >
              <td className={`${TD} text-right text-muted ${rankWidth}`}>{ranks[i]}</td>
              {columns.map((c) => (
                <td key={c.label} className={`${c.tall ? "px-2 sm:px-3 py-2 align-middle" : TD} ${c.td}`}>
                  {c.cell(row)}
                </td>
              ))}
              <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                {link && <Icon size={18} name="chevron_right" className="align-middle" />}
              </td>
            </tr>
          );
        })}
        {children}
      </tbody>
    </table>
  );
}
