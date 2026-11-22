"use client";

import Link from "@/components/Link";
import { useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";

import { Flag } from "@/components/Flag";
import { CHEVRON_CELL, RowChevron } from "@/components/Icon";
import { HEAD_CELL, PlaceholderRows, ROW_CELL, saveCsv, Tip, Toolbar } from "@/components/rankings/TableParts";
import { useI18n } from "@/i18n/client";
import type { P4PRow } from "@/lib/api";
import { shortName, signed } from "@/lib/format";

type Sort = "lead-desc" | "lead-asc" | "rating-desc" | "rating-asc";

const NO_NAMES: Record<string, string> = {};

// Pound for pound: the top 3 of every weight by their lead over the 7 best others
// of their own weight. A few dozen rows: no pages.
export function P4PBrowser({
  rows,
  asOf,
  latest,
  path,
  csvName,
  countryNames = NO_NAMES,
  loading = false,
}: {
  rows: P4PRow[];
  asOf: string;
  latest: string;
  path: string;
  csvName: string;
  countryNames?: Record<string, string>; // IOC code → name, for the table's countries (lib/api.ts countryNames)
  loading?: boolean;
}) {
  const { d, t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState<Sort>("lead-desc");
  const sorts: Record<Sort, string> = {
    "lead-desc": d.rankings.sorts.leadDesc,
    "lead-asc": d.rankings.sorts.leadAsc,
    "rating-desc": d.rankings.sorts.ratingDesc,
    "rating-asc": d.rankings.sorts.ratingAsc,
  };
  // "−73 kg"
  const weightLabel = (weight: string) => t(d.rankings.weightKg, { label: weight.replace("-", "−") });

  const countries = useMemo(
    () =>
      [...new Set(rows.map((r) => r.country).filter((c): c is string => !!c))]
        .map((code) => ({ code, name: countryNames[code] ?? code }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [rows, countryNames],
  );
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        (!country || r.country === country) &&
        (!needle || `${r.family_name ?? ""} ${r.given_name ?? ""}`.toLowerCase().includes(needle)),
    );
    const value = (r: P4PRow) => (sort.startsWith("lead") ? r.gap : r.score);
    return [...filtered].sort((a, b) => (sort.endsWith("desc") ? value(b) - value(a) : value(a) - value(b)));
  }, [rows, query, country, sort]);

  return (
    <>
      <Toolbar
        query={query}
        onQuery={setQuery}
        countries={countries}
        country={country}
        onCountry={setCountry}
        asOf={asOf}
        latest={latest}
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
              <th className={`${HEAD_CELL} text-left`}>{d.rankings.columns.athlete}</th>
              <th className={`${HEAD_CELL} hidden sm:table-cell sm:w-28 text-left`}>{d.rankings.columns.country}</th>
              <th className={`${HEAD_CELL} hidden sm:table-cell sm:w-24 text-left`}>{d.rankings.columns.weight}</th>
              <th className={`${HEAD_CELL} w-14 sm:w-24 text-right relative group cursor-help`}>
                <span>{d.rankings.columns.lead}</span>
                <Tip>{d.rankings.tips.lead}</Tip>
              </th>
              <th className={`${HEAD_CELL} w-14 sm:w-20 text-right`}>{d.rankings.columns.rating}</th>
              <th className="hidden sm:table-cell w-8 h-9 py-0" />
            </tr>
          </thead>
          <tbody className="text-ink text-[14px] leading-[20px]">
            {loading && <PlaceholderRows columns={7} />}
            {shown.map((row, index) => (
              <tr
                key={row.athlete_id}
                onClick={() => router.push(`/athletes/${row.athlete_id}`)}
                className="border-b border-rule hover:bg-panel/60 cursor-pointer"
              >
                <td className={`${ROW_CELL} text-right tabular-nums font-medium`}>
                  {sort === "lead-desc" ? row.place : index + 1}
                </td>
                <td className={`${ROW_CELL} font-medium truncate`}>
                  <Flag ioc={row.country} className="sm:hidden mr-1.5" />
                  <Link
                    href={`/athletes/${row.athlete_id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline"
                  >
                    {shortName(row.family_name, row.given_name)}
                  </Link>
                </td>
                <td className={`${ROW_CELL} hidden sm:table-cell text-[13px]`}>
                  <span className="inline-flex items-center gap-1.5">
                    <Flag ioc={row.country} />
                    {row.country}
                  </span>
                </td>
                <td className={`${ROW_CELL} hidden sm:table-cell text-[13px] text-muted`}>{weightLabel(row.weight)}</td>
                <td className={`${ROW_CELL} text-right tabular-nums text-gain font-medium`}>{signed(row.gap)}</td>
                <td className={`${ROW_CELL} text-right tabular-nums font-bold`}>{row.score}</td>
                <td className={`${CHEVRON_CELL} hidden sm:table-cell`}>
                  <RowChevron />
                </td>
              </tr>
            ))}
            {!loading && shown.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-[14px] text-muted">
                  {d.rankings.noAthletes}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function downloadCsv(rows: P4PRow[], fileName: string) {
  const header = ["Place", "Athlete", "Country", "Weight", "Place in weight", "Lead", "Rating"];
  const lines = rows.map((r) => [
    r.place,
    `${r.family_name ?? ""} ${r.given_name ?? ""}`.trim(),
    r.country ?? "",
    r.weight,
    r.weight_place,
    r.gap,
    r.score,
  ]);
  saveCsv([header, ...lines], fileName);
}
