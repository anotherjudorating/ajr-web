"use client";

import Link from "next/link";
import { useState } from "react";

import { HomeAthlete } from "@/components/home/HomeAthlete";
import { H2 } from "@/components/tournament/styles";
import type { HomeRow } from "@/lib/api";
import type { Weight } from "@/lib/weights";

// Men or women: the leader of every weight, or the top 7 of the weight picked.
export function LeaderPanel({
  title,
  weights,
  rows,
  p4p,
}: {
  title: string;
  weights: Weight[];
  rows: HomeRow[];
  p4p: { href: string; label: string };
}) {
  const [picked, setPicked] = useState("");
  const weight = weights.find((w) => w.slug === picked);
  const shown = weight
    ? rows.filter((r) => r.weight === weight.api).map((r) => ({ row: r, lead: String(r.place) }))
    : weights.flatMap((w) => {
        const leader = rows.find((r) => r.weight === w.api && r.place === 1);
        return leader ? [{ row: leader, lead: w.label }] : [];
      });

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center justify-between gap-3 border-b-2 border-ink pb-2">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className={H2}>{title}</h2>
          <select
            value={picked}
            onChange={(e) => setPicked(e.target.value)}
            className="w-28 sm:w-36 border border-rule bg-paper text-ink text-xs py-1 px-2 focus:outline-none focus:border-ink cursor-pointer"
          >
            <option value="">All weights</option>
            {weights.map((w) => (
              <option key={w.slug} value={w.slug}>
                {w.label} kg
              </option>
            ))}
          </select>
        </div>
        <Link href={p4p.href} className="font-serif shrink-0 whitespace-nowrap text-[14px] font-semibold text-claret hover:underline">
          {p4p.label}
        </Link>
      </div>
      <div>
        {shown.map(({ row, lead }) => (
          <HomeAthlete key={`${row.weight}-${row.athlete_id}`} row={row} lead={lead} nation score />
        ))}
      </div>
    </div>
  );
}
