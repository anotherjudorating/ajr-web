"use client";

import { useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";

import { TABLE_START, useHash, useRowMark, useRowScroll } from "@/components/anchors";

import { Flag } from "@/components/Flag";
import { CHEVRON_CELL, RowChevron } from "@/components/Icon";
import { RowLink } from "@/components/RowLink";
import { HEAD_CELL, Pagination, PlaceholderRows, ROW_CELL, saveCsv, Tip, Toolbar } from "@/components/rankings/TableParts";
import { useI18n } from "@/i18n/client";
import type { TeamRow } from "@/lib/api";
import { nationRow } from "@/lib/anchors";

type Sort = "rating-desc" | "rating-asc" | "led-desc" | "top8-desc";

// Nations by the average rating of their best athlete in every weight.
export function TeamsBrowser({
  rows,
  weights,
  asOf,
  latest,
  path,
  csvName,
  loading = false,
}: {
  rows: TeamRow[];
  weights: number; // 7, or 14 for mixed
  asOf: string;
  latest: string;
  path: string;
  csvName: string;
  loading?: boolean;
}) {
  const { d, t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState<Sort>("rating-desc");
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const sorts: Record<Sort, string> = {
    "rating-desc": d.rankings.sorts.ratingDesc,
    "rating-asc": d.rankings.sorts.ratingAsc,
    "led-desc": d.rankings.sorts.ledDesc,
    "top8-desc": d.rankings.sorts.top8Desc,
  };

  const countries = useMemo(
    () =>
      rows
        .filter((r) => r.country)
        .map((r) => ({ code: r.country!, name: r.country_name ?? r.country! }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [rows],
  );
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        (!country || r.country === country) &&
        (!needle || `${r.country_name ?? ""} ${r.country ?? ""}`.toLowerCase().includes(needle)),
    );
    const value: Record<Sort, (r: TeamRow) => number> = {
      "rating-desc": (r) => -r.rating,
      "rating-asc": (r) => r.rating,
      "led-desc": (r) => -r.weights_led * 10000 - r.rating / 10,
      "top8-desc": (r) => -r.weights_top8 * 10000 - r.rating / 10,
    };
    return [...filtered].sort((a, b) => value[sort](a) - value[sort](b));
  }, [rows, query, country, sort]);

  // #nation-<ioc> (a country page's peak): that nation's row, opened at its page,
  // marked and scrolled to, as an athlete's in the weights' tables
  const hash = useHash();
  const marked = hash.startsWith("nation-") ? hash.slice("nation-".length) : null;
  const lit = useRowMark(marked !== null);
  const markedAt = marked === null ? -1 : shown.findIndex((r) => r.country === marked);
  const [placedFor, setPlacedFor] = useState("");
  if (markedAt >= 0 && placedFor !== hash) {
    setPlacedFor(hash);
    setPage(Math.floor(markedAt / pageSize) + 1);
  }
  useRowScroll(hash, placedFor === hash);

  const pages = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(page, pages);
  const first = (currentPage - 1) * pageSize;
  const pageRows = shown.slice(first, first + pageSize);
  const reset = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setPage(1);
  };

  return (
    <>
      <Toolbar
        query={query}
        onQuery={reset(setQuery)}
        placeholder={d.rankings.toolbar.searchNation}
        countries={countries}
        country={country}
        onCountry={reset(setCountry)}
        asOf={asOf}
        latest={latest}
        id={TABLE_START}
        dayMark={lit.day}
        onDay={(day) => router.push(day >= latest ? path : `${path}/${day}`)}
        sorts={sorts}
        sort={sort}
        onSort={setSort}
        onCsv={() => downloadCsv(shown, csvName)}
      />
      <div className="w-full border-b border-rule bg-paper">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-panel border-b border-rule">
              <th className={`${HEAD_CELL} w-9 sm:w-12 text-right`}>#</th>
              <th className={`${HEAD_CELL} text-left`}>{d.rankings.columns.nation}</th>
              <th className={`${HEAD_CELL} hidden sm:table-cell sm:w-20 whitespace-nowrap text-right relative group cursor-help`}>
                <span>{d.rankings.columns.top1}</span>
                <Tip>{d.rankings.tips.top1}</Tip>
              </th>
              <th className={`${HEAD_CELL} w-12 sm:w-20 whitespace-nowrap text-right relative group cursor-help`}>
                <span>{d.rankings.columns.top8}</span>
                <Tip>{d.rankings.tips.top8}</Tip>
              </th>
              <th className={`${HEAD_CELL} w-24 sm:w-40 whitespace-nowrap text-right relative group cursor-help`}>
                <span className="sm:hidden">{d.rankings.columns.leadersAvg}</span>
                <span className="hidden sm:inline">{d.rankings.columns.leadersRatingAvg}</span>
                <Tip>{t(d.rankings.tips.leadersAvg, { weights })}</Tip>
              </th>
              <th className="w-8 sm:w-10 h-9 py-0" />
            </tr>
          </thead>
          <tbody className="text-ink text-[14px] leading-[20px]">
            {loading && <PlaceholderRows columns={6} count={15} />}
            {pageRows.map((row, index) => (
              <RowLink
                key={row.country ?? index}
                href={row.country ? `/countries/${row.country.toLowerCase()}` : "/rankings/teams/mixed"}
                label={row.country_name ?? row.country ?? undefined}
                id={row.country ? nationRow(row.country) : undefined}
                className={`border-b border-rule hover:bg-panel/60 ${row.country === marked ? lit.row : ""}`}
              >
                <td className={`${ROW_CELL} text-right tabular-nums font-medium`}>
                  {sort === "rating-desc" ? row.place : first + index + 1}
                </td>
                <td className={`${ROW_CELL} font-medium`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Flag ioc={row.country} />
                    <span className="truncate">{row.country_name ?? row.country}</span>
                  </div>
                </td>
                <td className={`${ROW_CELL} hidden sm:table-cell text-right tabular-nums`}>{row.weights_led}</td>
                <td className={`${ROW_CELL} text-right tabular-nums`}>{row.weights_top8}</td>
                <td className={`${ROW_CELL} text-right tabular-nums font-bold`}>{row.rating}</td>
                <td className={`${CHEVRON_CELL}`}>
                  <RowChevron />
                </td>
              </RowLink>
            ))}
            {!loading && shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-[14px] text-muted">
                  {d.rankings.noNations}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        loading={loading}
        total={shown.length}
        first={first}
        count={pageRows.length}
        noun={d.common.nations}
        pageSize={pageSize}
        onPageSize={reset(setPageSize)}
        page={currentPage}
        pages={pages}
        onPage={setPage}
      />
    </>
  );
}

function downloadCsv(rows: TeamRow[], fileName: string) {
  const header = ["Place", "Nation", "IOC", "Top 1", "Top 8", "Leaders rating avg"];
  const lines = rows.map((r) => [r.place, r.country_name ?? "", r.country ?? "", r.weights_led, r.weights_top8, r.rating]);
  saveCsv([header, ...lines], fileName);
}
