"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CsvButton, ExploreTitle, SearchBox, Select, ToolbarRow } from "@/components/explore/Controls";
import { useFilters } from "@/components/explore/useFilters";
import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { HEAD_CELL, Pagination, PlaceholderRows, ROW_CELL, saveCsv } from "@/components/rankings/TableParts";
import { RowLink } from "@/components/RowLink";
import type { AthleteListRow } from "@/lib/api";
import { shortCompetition, shortName } from "@/lib/format";
import { WEIGHTS, weightTitle } from "@/lib/weights";

const SORTS = [
  { value: "name-asc", label: "Sort: name ↑" },
  { value: "name-desc", label: "Sort: name ↓" },
  { value: "age-asc", label: "Sort: age ↑" },
  { value: "age-desc", label: "Sort: age ↓" },
  { value: "rating-desc", label: "Sort: rating ↓" },
];
const PATH = "/explore/athletes";

// Every rated athlete, active or not, a page at a time (filters in the URL).
export function AthletesBrowser({
  rows,
  filters,
  countries,
  year,
  loading = false,
}: {
  rows: AthleteListRow[];
  filters: Record<string, string>;
  countries: { code: string; name: string }[];
  year: number; // for the ages
  loading?: boolean;
}) {
  const set = useFilters(PATH, filters);
  const [query, setQuery] = useState(filters.q ?? "");
  useEffect(() => {
    if (query === (filters.q ?? "")) return;
    const timer = setTimeout(() => set({ q: query }), 300);
    return () => clearTimeout(timer);
  }, [query, filters.q, set]);

  const size = Number(filters.size) || 50;
  const page = Number(filters.page) || 1;
  const total = rows[0]?.total ?? 0;

  return (
    <>
      <ExploreTitle title="Athletes" lead="Every athlete with a rating, active or not." />
      <ToolbarRow>
        <SearchBox value={query} onChange={setQuery} placeholder="Search athlete" />
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
          <Select
            value={filters.country ?? ""}
            onChange={(value) => set({ country: value })}
            options={[{ value: "", label: "All countries" }, ...countries.map((c) => ({ value: c.code, label: c.name }))]}
            className="md:max-w-[180px]"
          />
          <Select
            value={filters.weight ?? ""}
            onChange={(value) => set({ weight: value })}
            options={[
              { value: "", label: "All weights" },
              { value: "men", label: "Men, all weights" },
              { value: "women", label: "Women, all weights" },
              ...WEIGHTS.map((w) => ({ value: w.slug, label: weightTitle(w) })),
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <Select value={filters.sort ?? "name-asc"} onChange={(value) => set({ sort: value })} options={SORTS} />
          </div>
          <CsvButton onClick={() => downloadCsv(rows, year)} />
        </div>
      </ToolbarRow>

      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Athlete</th>
            <th className={`${HEAD_CELL} hidden sm:table-cell w-24 text-left`}>Nat</th>
            <th className={`${HEAD_CELL} w-16 sm:w-20 text-left`}>Weight</th>
            <th className={`${HEAD_CELL} w-12 sm:w-16 text-right`}>Age</th>
            <th className={`${HEAD_CELL} hidden md:table-cell w-64 text-left`}>Last contest</th>
            <th className="w-6 sm:w-8 h-9 py-0" />
          </tr>
        </thead>
        <tbody className="text-[13px] sm:text-[14px]">
          {loading && <PlaceholderRows columns={6} count={12} />}
          {rows.map((row) => (
            <RowLink key={row.id} href={`/athletes/${row.id}`} className="border-b border-rule hover:bg-panel/40">
              <td className={ROW_CELL}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Flag ioc={row.country} className="sm:!hidden" />
                  <Link href={`/athletes/${row.id}`} className="font-medium text-ink truncate hover:underline">
                    {shortName(row.family_name, row.given_name)}
                  </Link>
                </div>
              </td>
              <td className={`${ROW_CELL} hidden sm:table-cell text-[13px]`}>
                <span className="inline-flex items-center gap-1.5">
                  <Flag ioc={row.country} />
                  {row.country}
                </span>
              </td>
              <td className={`${ROW_CELL} text-muted`}>{row.weight?.replace("-", "−") ?? "–"}</td>
              <td className={`${ROW_CELL} text-right tabular-nums`}>{row.birth_year ? year - row.birth_year : "–"}</td>
              <td className={`${ROW_CELL} hidden md:table-cell text-muted truncate`}>
                {row.last_competition ? shortCompetition(row.last_competition) : "–"}
              </td>
              <td className="h-10 sm:h-11 py-0 align-middle pl-1 pr-0 sm:px-2 text-right text-muted">
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
      {!loading && rows.length === 0 && <p className="py-6 text-[14px] text-muted">No athletes match these filters.</p>}
      <Pagination
        loading={loading}
        total={total}
        first={(page - 1) * size}
        count={rows.length}
        noun="athletes"
        pageSize={size}
        onPageSize={(value) => set({ size: String(value) })}
        page={page}
        pages={Math.max(1, Math.ceil(total / size))}
        onPage={(value) => set({ page: String(value) })}
      />
    </>
  );
}

function downloadCsv(rows: AthleteListRow[], year: number) {
  const header = ["Athlete", "Country", "Weight", "Age", "Place", "Rating", "Contests", "Last contest", "Last tournament"];
  const lines = rows.map((r) => [
    `${r.family_name ?? ""} ${r.given_name ?? ""}`.trim(),
    r.country ?? "",
    r.weight ?? "",
    r.birth_year ? year - r.birth_year : "",
    r.place ?? "",
    r.score ?? "",
    r.contests,
    r.last_contest,
    r.last_competition ?? "",
  ]);
  saveCsv([header, ...lines], "ajr-athletes.csv");
}
