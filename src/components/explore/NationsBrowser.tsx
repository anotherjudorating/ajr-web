"use client";

import { useMemo, useState } from "react";

import { CsvButton, ExploreTitle, SearchBox, Select, ToolbarRow } from "@/components/explore/Controls";
import { Flag } from "@/components/Flag";
import { CHEVRON_CELL, RowChevron } from "@/components/Icon";
import { HEAD_CELL, Pagination, PlaceholderRows, ROW_CELL, saveCsv } from "@/components/rankings/TableParts";
import { RowLink } from "@/components/RowLink";
import type { NationRow } from "@/lib/api";

const SORTS = [
  { value: "name-asc", label: "Sort: name ↑" },
  { value: "name-desc", label: "Sort: name ↓" },
  { value: "athletes-desc", label: "Sort: athletes ↓" },
  { value: "athletes-asc", label: "Sort: athletes ↑" },
];

// Every nation with rated athletes; a row opens the nation's page.
export function NationsBrowser({ rows, loading = false }: { rows: NationRow[]; loading?: boolean }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [size, setSize] = useState(50);
  const [page, setPage] = useState(1);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter((r) => !needle || `${r.name} ${r.country}`.toLowerCase().includes(needle));
    const [key, direction] = sort.split("-");
    const sign = direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) =>
      key === "name" ? sign * a.name.localeCompare(b.name) : sign * (a.athletes - b.athletes) || a.name.localeCompare(b.name),
    );
  }, [rows, query, sort]);
  const pages = Math.max(1, Math.ceil(shown.length / size));
  const current = Math.min(page, pages);
  const first = (current - 1) * size;
  const pageRows = shown.slice(first, first + size);

  return (
    <>
      <ExploreTitle title="Nations" lead="Every nation with rated athletes." />
      <ToolbarRow>
        <SearchBox
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Search nation"
        />
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <Select value={sort} onChange={setSort} options={SORTS} />
          </div>
          <CsvButton
            onClick={() =>
              saveCsv([["Nation", "IOC", "Athletes", "In a table today"], ...shown.map((r) => [r.name, r.country, r.athletes, r.active])], "ajr-nations.csv")
            }
          />
        </div>
      </ToolbarRow>
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Nation</th>
            <th className={`${HEAD_CELL} w-24 sm:w-32 text-right`} title="Rated athletes; in brackets those in a table today">
              Athletes
            </th>
            <th className="w-8 sm:w-10 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody className="text-[13px] sm:text-[14px]">
          {loading && <PlaceholderRows columns={3} count={12} />}
          {pageRows.map((row) => (
            <RowLink key={row.country} href={`/countries/${row.country.toLowerCase()}`} className="border-b border-rule hover:bg-panel/40">
              <td className={ROW_CELL}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Flag ioc={row.country} />
                  <span className="font-medium truncate">{row.name}</span>
                </div>
              </td>
              <td className={`${ROW_CELL} text-right tabular-nums`}>
                {row.athletes} <span className="text-muted">({row.active})</span>
              </td>
              <td className={`${CHEVRON_CELL}`}>
                <RowChevron />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
      {!loading && shown.length === 0 && <p className="py-6 text-[14px] text-muted">No nations match these filters.</p>}
      <Pagination
        loading={loading}
        total={shown.length}
        first={first}
        count={pageRows.length}
        noun="nations"
        pageSize={size}
        onPageSize={(value) => {
          setSize(value);
          setPage(1);
        }}
        page={current}
        pages={pages}
        onPage={setPage}
      />
    </>
  );
}
