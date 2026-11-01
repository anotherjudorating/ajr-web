"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Icon } from "@/components/Icon";
import { recordColumns } from "@/components/records/columns";
import { RecordTable } from "@/components/records/RecordTable";
import { CONTROL, Pagination, PlaceholderRows, saveCsv } from "@/components/rankings/TableParts";
import type { RecordRow } from "@/lib/api";
import { places, type RecordInfo } from "@/lib/records";
import { WEIGHTS, weightTitle } from "@/lib/weights";

type Sort = "value-desc" | "value-asc" | "date-desc" | "date-asc";

// What the search box looks in: names of athletes, tournaments or nations.
function searchText(row: RecordRow): string {
  return [
    row.family_name,
    row.given_name,
    row.opponent_family_name,
    row.opponent_given_name,
    row.competition,
    row.country,
    row.country_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function downloadCsv(rows: RecordRow[], ranks: number[], info: RecordInfo) {
  const columns = recordColumns(info, true);
  const lines = rows.map((row, i) => [ranks[i], ...columns.map((c) => c.csv(row))]);
  saveCsv([["Place", ...columns.map((c) => c.label)], ...lines], `ajr-${info.slug}.csv`);
}

// One record's full list: search, the gender and weight filters (in the URL: the
// backend picks the rows), sort, CSV and pages.
export function RecordBrowser({
  info,
  rows,
  gender,
  weight,
  loading = false,
}: {
  info: RecordInfo;
  rows: RecordRow[];
  gender: string; // "men", "women" or ""
  weight: string; // a weight's slug or ""
  loading?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>(info.ascending ? "value-asc" : "value-desc");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  // a place is by the record's value among the rows of this gender and weight, whatever the search and sort
  const ranks = useMemo(() => {
    const numbers = places(rows);
    return new Map(rows.map((row, i) => [row, numbers[i]]));
  }, [rows]);
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter((r) => !needle || searchText(r).includes(needle));
    const [key, direction] = sort.split("-");
    const sign = direction === "asc" ? 1 : -1;
    return filtered.sort((a, b) =>
      key === "date" ? sign * (a.day ?? "").localeCompare(b.day ?? "") : sign * (a.value - b.value),
    );
  }, [rows, query, sort]);

  const pages = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(page, pages);
  const first = (currentPage - 1) * pageSize;
  const pageRows = shown.slice(first, first + pageSize);
  const columns = recordColumns(info, true);
  const athletes = info.subject === "athlete" || info.subject === "pair";

  const filter = (nextGender: string, nextWeight: string) => {
    const params = new URLSearchParams();
    if (nextGender) params.set("gender", nextGender);
    if (nextWeight) params.set("weight", nextWeight);
    const search = params.toString();
    router.push(`/records/${info.slug}${search ? `?${search}` : ""}`);
  };

  return (
    <section>
      <div className="mt-6 border-b-2 border-ink pb-2 flex flex-col lg:flex-row lg:items-center gap-2">
        <div className="relative w-full md:w-72 lg:w-56 shrink-0">
          <Icon
            size={16}
            name="search"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={`Search ${athletes ? "athlete" : info.subject}`}
            className="w-full h-8 pl-8 pr-2.5 bg-paper border border-rule text-[12px] placeholder:text-muted focus:outline-none focus:border-ink"
          />
        </div>
        {athletes && (
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
            <select
              value={gender}
              onChange={(e) => filter(e.target.value, "")}
              className={CONTROL}
            >
              <option value="">Men and women</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
            {info.weights && (
              <select value={weight} onChange={(e) => filter("", e.target.value)} className={CONTROL}>
                <option value="">All weights</option>
                {WEIGHTS.map((w) => (
                  <option key={w.slug} value={w.slug}>
                    {weightTitle(w)}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={CONTROL}>
              <option value="value-desc">Sort: {info.sortLabel} ↓</option>
              <option value="value-asc">Sort: {info.sortLabel} ↑</option>
              <option value="date-desc">Sort: date ↓</option>
              <option value="date-asc">Sort: date ↑</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => downloadCsv(shown, shown.map((r) => ranks.get(r) ?? 0), info)}
            className="w-full md:w-auto shrink-0 h-8 px-3 inline-flex items-center justify-center gap-1.5 border border-rule text-[12px] text-ink hover:border-ink"
          >
            <Icon size={16} name="download" className="text-muted" />
            Export CSV
          </button>
        </div>
      </div>

      <RecordTable rows={pageRows} ranks={pageRows.map((r) => ranks.get(r) ?? 0)} columns={columns} full>
        {loading && <PlaceholderRows columns={columns.length + 2} count={20} />}
      </RecordTable>
      {!loading && shown.length === 0 && (
        <p className="py-6 text-[14px] text-muted">No {info.noun} match these filters.</p>
      )}

      <Pagination
        loading={loading}
        total={shown.length}
        first={first}
        count={pageRows.length}
        noun={info.noun}
        pageSize={pageSize}
        onPageSize={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        page={currentPage}
        pages={pages}
        onPage={setPage}
      />
    </section>
  );
}
