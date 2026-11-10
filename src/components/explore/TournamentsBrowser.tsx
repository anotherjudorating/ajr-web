"use client";

import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";

import { CsvButton, ExploreTitle, SearchBox, Select, ToolbarRow } from "@/components/explore/Controls";
import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { HEAD_CELL, PlaceholderRows, ROW_CELL, saveCsv } from "@/components/rankings/TableParts";
import type { CompetitionRow } from "@/lib/api";
import { dateRange, shortCompetition } from "@/lib/format";

const LEVELS = [
  { value: "", label: "All levels" },
  { value: "Olympic Games", label: "Olympic Games" },
  { value: "World Championships", label: "World Championships" },
  { value: "Masters", label: "Masters" },
  { value: "Grand Slam", label: "Grand Slam" },
  { value: "Grand Prix", label: "Grand Prix" },
  { value: "continental", label: "Continental" },
];
const WORLD = ["Olympic Games", "World Championships", "Masters", "Grand Slam", "Grand Prix"];
const SORTS = [
  { value: "date-asc", label: "Sort: date ↑" },
  { value: "date-desc", label: "Sort: date ↓" },
  { value: "accuracy-desc", label: "Sort: rating accuracy ↓" },
  { value: "accuracy-asc", label: "Sort: rating accuracy ↑" },
  { value: "upsets-desc", label: "Sort: upsets ↓" },
  { value: "upsets-asc", label: "Sort: upsets ↑" },
];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// A year's tournaments, grouped by month while sorted by date.
export function TournamentsBrowser({
  rows,
  year,
  latestYear,
  loading = false,
}: {
  rows: CompetitionRow[];
  year: number;
  latestYear: number;
  loading?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("date-asc");
  const [closed, setClosed] = useState<Set<string>>(new Set());

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        (!needle || `${r.name} ${r.city ?? ""} ${r.country_name ?? ""}`.toLowerCase().includes(needle)) &&
        (!level || (level === "continental" ? !WORLD.includes(r.rank_name ?? "") : r.rank_name === level)),
    );
    const [key, direction] = sort.split("-");
    const sign = direction === "asc" ? 1 : -1;
    const value = (r: CompetitionRow) =>
      key === "date" ? r.date_from : key === "accuracy" ? (r.accuracy ?? -1) : r.upsets;
    return [...filtered].sort((a, b) => (value(a) < value(b) ? -sign : value(a) > value(b) ? sign : 0));
  }, [rows, query, level, sort]);

  const byMonth = sort.startsWith("date");
  const month = (r: CompetitionRow) => r.date_from.slice(0, 7);
  const years = Array.from({ length: Math.max(latestYear - 2008, 1) }, (_, i) => latestYear - i);
  const toggle = (key: string) =>
    setClosed((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <>
      <ExploreTitle title="Tournaments" lead="Every rated tournament and how often the favourite won." />
      <ToolbarRow>
        <SearchBox value={query} onChange={setQuery} placeholder="Search tournament or city" />
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
          <Select value={level} onChange={setLevel} options={LEVELS} />
          <Select
            value={String(year)}
            onChange={(value) => router.push(`/explore/tournaments?year=${value}`)}
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <Select value={sort} onChange={setSort} options={SORTS} />
          </div>
          <CsvButton onClick={() => downloadCsv(shown, year)} />
        </div>
      </ToolbarRow>

      {/* auto layout: the month rows span all columns, also the ones hidden on phones */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} w-[72px] sm:w-32 text-left`}>Dates</th>
            <th className={`${HEAD_CELL} text-left`}>Tournament</th>
            <th className={`${HEAD_CELL} hidden sm:table-cell text-left`}>Location</th>
            <th className={`${HEAD_CELL} hidden sm:table-cell w-40 text-right`}>Rating accuracy</th>
            {/* on a phone the name takes the room: upsets on wider screens */}
            <th className={`${HEAD_CELL} hidden sm:table-cell sm:w-24 text-right`}>Upsets</th>
            <th className="w-6 sm:w-8 h-9 py-0" />
          </tr>
        </thead>
        <tbody className="text-[13px] sm:text-[14px]">
          {loading && <PlaceholderRows columns={6} count={10} />}
          {shown.map((row, i) => {
            const opens = byMonth && (i === 0 || month(shown[i - 1]) !== month(row));
            const hidden = byMonth && closed.has(month(row));
            const count = shown.filter((r) => month(r) === month(row)).length;
            return (
              <Fragment key={row.id}>
                {opens && (
                  <tr
                    onClick={() => toggle(month(row))}
                    aria-expanded={!closed.has(month(row))}
                    className="bg-panel cursor-pointer hover:bg-panel/80 select-none"
                  >
                    <td colSpan={6} className="h-8 py-0 align-middle px-2 sm:px-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2">
                          <Icon
                            size={18}
                            name="expand_more"
                            className={`text-muted transition-transform duration-150 ${closed.has(month(row)) ? "-rotate-90" : ""}`}
                          />
                          <span className="text-[12px] font-bold uppercase tracking-wide text-ink">
                            {MONTHS[Number(row.date_from.slice(5, 7)) - 1]} {row.date_from.slice(0, 4)}
                          </span>
                        </span>
                        <span className="text-[12px] text-muted font-normal">
                          {count} {count === 1 ? "tournament" : "tournaments"}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
                {!hidden && (
                  <tr
                    onClick={() => router.push(`/tournaments/${row.id}`)}
                    className="border-b border-rule hover:bg-panel/40 cursor-pointer"
                  >
                    <td className={`${ROW_CELL} text-muted tabular-nums whitespace-nowrap`}>{dateRange(row.date_from, row.date_to)}</td>
                    <td className={`${ROW_CELL} font-semibold text-ink`}>
                      <div className="flex items-center gap-1.5 sm:block">
                        <Flag ioc={row.country} className="sm:!hidden" />
                        <span className="hover:underline line-clamp-2 sm:hidden">
                          {shortCompetition(row.name).replace(/\s\d{4}$/, "")}
                        </span>
                        <span className="hover:underline hidden sm:inline">{row.name}</span>
                      </div>
                    </td>
                    <td className={`${ROW_CELL} hidden sm:table-cell text-muted`}>
                      <span className="inline-flex items-center gap-1.5">
                        <Flag ioc={row.country} />
                        {[row.city, row.country].filter(Boolean).join(", ")}
                      </span>
                    </td>
                    <td
                      className={`${ROW_CELL} hidden sm:table-cell text-right text-ink tabular-nums`}
                      title={`Contests won by the rating favourite, of ${row.contests}`}
                    >
                      {row.accuracy === null ? "–" : `${Math.round(row.accuracy * 100)}%`}
                    </td>
                    <td className={`${ROW_CELL} hidden sm:table-cell text-right text-ink tabular-nums`}>{row.upsets}</td>
                    <td className="h-10 sm:h-11 py-0 align-middle pl-1 pr-0 sm:px-2 text-right text-muted">
                      <Icon size={18} name="chevron_right" className="align-middle" />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {!loading && shown.length === 0 && <p className="py-6 text-[14px] text-muted">No tournaments match these filters.</p>}
    </>
  );
}

function downloadCsv(rows: CompetitionRow[], year: number) {
  const header = ["From", "To", "Tournament", "Level", "City", "Country", "Contests", "Rating accuracy", "Upsets"];
  const lines = rows.map((r) => [
    r.date_from,
    r.date_to ?? "",
    r.name,
    r.rank_name ?? "",
    r.city ?? "",
    r.country ?? "",
    r.contests,
    r.accuracy === null ? "" : Math.round(r.accuracy * 100),
    r.upsets,
  ]);
  saveCsv([header, ...lines], `ajr-tournaments-${year}.csv`);
}
