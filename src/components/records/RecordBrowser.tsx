"use client";

import { useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";

import { Icon } from "@/components/Icon";
import { recordColumns } from "@/components/records/columns";
import { RecordTable } from "@/components/records/RecordTable";
import { recordText } from "@/components/records/text";
import { ViewSwitch } from "@/components/records/ViewSwitch";
import { CONTROL, Pagination, PlaceholderRows, saveCsv } from "@/components/rankings/TableParts";
import { useI18n } from "@/i18n/client";
import { localeFormat } from "@/i18n/format";
import type { RecordRow } from "@/lib/api";
import { places, type RecordInfo, type RecordView } from "@/lib/records";
import { WEIGHTS } from "@/lib/weights";

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

// The file is for machines and spreadsheets: its headers and values are English in
// every language (the English dictionary is fetched on the click, not with the page).
async function downloadCsv(rows: RecordRow[], ranks: number[], info: RecordInfo, view: RecordView) {
  const { en } = await import("@/i18n/en");
  const columns = recordColumns({ d: en, f: localeFormat("en", en) }, info, true, view.name);
  const lines = rows.map((row, i) => [ranks[i], ...columns.map((c) => c.csv(row))]);
  const suffix = view.key && info.views && view.key !== info.views[0].key ? `-${view.key}` : "";
  saveCsv([["Place", ...columns.map((c) => c.label)], ...lines], `ajr-${info.slug}${suffix}.csv`);
}

// One record's full list: search, the gender and weight filters (in the URL: the
// backend picks the rows), sort, CSV and pages.
export function RecordBrowser({
  info,
  view,
  rows,
  gender,
  weight,
  loading = false,
}: {
  info: RecordInfo;
  view: RecordView;
  rows: RecordRow[];
  gender: string; // "men", "women" or ""
  weight: string; // a weight's slug or ""
  loading?: boolean;
}) {
  const router = useRouter();
  const { d, f, t } = useI18n();
  const text = recordText(d, info);
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
  const columns = recordColumns({ d, f }, info, true, view.name);
  const athletes = info.subject === "athlete" || info.subject === "pair";
  const subject = info.subject === "pair" ? "athlete" : info.subject; // what the search box looks for

  const address = (nextGender: string, nextWeight: string, nextView: string) => {
    const params = new URLSearchParams();
    if (info.views && nextView !== info.views[0].key) params.set("view", nextView);
    if (nextGender) params.set("gender", nextGender);
    if (nextWeight) params.set("weight", nextWeight);
    const search = params.toString();
    return `/records/${info.slug}${search ? `?${search}` : ""}`;
  };
  const filter = (nextGender: string, nextWeight: string) => router.push(address(nextGender, nextWeight, view.key));

  return (
    <section>
      {info.views && (
        <div className="mt-5">
          <ViewSwitch info={info} current={view.key} href={(key) => address(gender, weight, key)} />
        </div>
      )}
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
            placeholder={d.records.browser.search[subject]}
            className="w-full h-8 pl-8 pr-2.5 bg-paper border border-rule text-[12px] placeholder:text-muted focus:outline-none focus:border-ink"
          />
        </div>
        {/* men or women for every record: a nation's or tournament's counts only that
            gender's athletes; the weights for the athletes' records */}
        {(
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
            <select
              value={gender}
              onChange={(e) => filter(e.target.value, "")}
              className={CONTROL}
            >
              <option value="">{d.records.browser.menAndWomen}</option>
              <option value="men">{d.common.gender.men}</option>
              <option value="women">{d.common.gender.women}</option>
            </select>
            {athletes && info.weights && (
              <select value={weight} onChange={(e) => filter("", e.target.value)} className={CONTROL}>
                <option value="">{d.records.browser.allWeights}</option>
                {WEIGHTS.map((w) => (
                  <option key={w.slug} value={w.slug}>
                    {f.weightTitle(w)}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={CONTROL}>
              <option value="value-desc">{t(d.records.browser.sortValueDesc, { label: text.sortLabel })}</option>
              <option value="value-asc">{t(d.records.browser.sortValueAsc, { label: text.sortLabel })}</option>
              <option value="date-desc">{d.records.browser.sortDateDesc}</option>
              <option value="date-asc">{d.records.browser.sortDateAsc}</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => downloadCsv(shown, shown.map((r) => ranks.get(r) ?? 0), info, view)}
            className="w-full md:w-auto shrink-0 h-8 px-3 inline-flex items-center justify-center gap-1.5 border border-rule text-[12px] text-ink hover:border-ink"
          >
            <Icon size={16} name="download" className="text-muted" />
            {d.records.browser.exportCsv}
          </button>
        </div>
      </div>

      <RecordTable rows={pageRows} ranks={pageRows.map((r) => ranks.get(r) ?? 0)} columns={columns} full>
        {loading && <PlaceholderRows columns={columns.length + 2} count={20} />}
      </RecordTable>
      {!loading && shown.length === 0 && (
        <p className="py-6 text-[14px] text-muted">{t(d.records.browser.empty, { noun: text.noun })}</p>
      )}

      <Pagination
        loading={loading}
        total={shown.length}
        first={first}
        count={pageRows.length}
        noun={text.noun}
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
