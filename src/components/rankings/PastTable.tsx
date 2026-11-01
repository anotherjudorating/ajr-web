"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { HEAD_CELL, ROW_CELL } from "@/components/rankings/TableParts";
import type { LeaderboardRow } from "@/lib/api";
import { fullName, shortName } from "@/lib/format";

// A weight's table on a past day: places, names, nations, ratings and ages then.
// The changes, trend, IJF place and latest tournament are only built for today.
export function PastTable({ rows, year }: { rows: LeaderboardRow[]; year: number }) {
  const router = useRouter();
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <thead>
        <tr className="bg-panel border-b border-rule">
          <th className={`${HEAD_CELL} w-9 sm:w-12 text-right`}>#</th>
          <th className={`${HEAD_CELL} text-left`}>Athlete</th>
          <th className={`${HEAD_CELL} hidden sm:table-cell sm:w-28 text-left`}>NAT</th>
          <th className={`${HEAD_CELL} w-14 sm:w-20 text-right`}>Rating</th>
          <th className={`${HEAD_CELL} w-12 sm:w-16 text-right`}>Age</th>
          <th className="w-6 sm:w-8 h-9 py-0" />
        </tr>
      </thead>
      <tbody className="text-ink text-[14px] leading-[20px]">
        {rows.map((row) => (
          <tr
            key={row.athlete_id}
            onClick={() => router.push(`/athletes/${row.athlete_id}`)}
            className="border-b border-rule hover:bg-panel/60 cursor-pointer"
          >
            <td className={`${ROW_CELL} text-right tabular-nums font-medium`}>{row.place}</td>
            <td className={`${ROW_CELL} font-medium truncate`}>
              <Flag ioc={row.country} className="sm:!hidden mr-1.5" />
              <Link href={`/athletes/${row.athlete_id}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                <span className="sm:hidden">{shortName(row.family_name, row.given_name)}</span>
                <span className="hidden sm:inline">{fullName(row.family_name, row.given_name)}</span>
              </Link>
            </td>
            <td className={`${ROW_CELL} hidden sm:table-cell text-[12px] whitespace-nowrap`}>
              <span className="inline-flex items-center gap-1.5">
                <Flag ioc={row.country} />
                {row.country}
              </span>
            </td>
            <td className={`${ROW_CELL} text-right tabular-nums font-bold`}>{row.score}</td>
            <td className={`${ROW_CELL} text-right tabular-nums text-muted`}>
              {row.birth_year ? year - row.birth_year : "–"}
            </td>
            <td className={`${ROW_CELL} pl-1 text-right text-muted`}>
              <Icon size={18} name="chevron_right" className="align-middle" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
