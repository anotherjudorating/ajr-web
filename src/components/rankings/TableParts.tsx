"use client";

import { Icon } from "@/components/Icon";
import { pageNumbers } from "@/lib/pages";

// What the rankings tables (a weight, pound for pound, nations) share: the toolbar
// above, the pages below, the header cells and their tips.

export const PAGE_SIZES = [20, 50, 100];
export const CONTROL =
  "h-8 py-0 px-2.5 bg-paper border border-rule text-[12px] text-ink focus:outline-none focus:border-ink cursor-pointer min-w-0";
export const TH = "px-2 py-2 sm:px-3 sm:py-2.5 text-[10px] sm:text-[11px] text-muted uppercase tracking-wider font-semibold";
export const CELL = "px-2 py-2 sm:px-3 sm:py-2.5";

// Search, country, date, sort and CSV, as in the prototype.
export function Toolbar<Sort extends string>({
  query,
  onQuery,
  placeholder = "Search athlete",
  countries,
  country,
  onCountry,
  asOf,
  latest,
  onDay,
  sorts,
  sort,
  onSort,
  onCsv,
}: {
  query: string;
  onQuery: (query: string) => void;
  placeholder?: string;
  countries: { code: string; name: string }[];
  country: string;
  onCountry: (country: string) => void;
  asOf: string; // YYYY-MM-DD
  latest: string;
  onDay: (day: string) => void;
  sorts: Record<Sort, string>;
  sort: Sort;
  onSort: (sort: Sort) => void;
  onCsv: () => void;
}) {
  return (
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
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-8 pl-8 pr-2.5 bg-paper border border-rule text-[12px] placeholder:text-muted focus:outline-none focus:border-ink"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
        <select
          value={country}
          onChange={(e) => onCountry(e.target.value)}
          className={`${CONTROL} md:w-[110px]`} // the prototype's width, whatever the names
        >
          <option value="">All countries</option>
          {countries.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={asOf}
          min="2005-01-01"
          max={latest}
          title="Ranking as of this date"
          onChange={(e) => e.target.value && onDay(e.target.value)}
          className={`${CONTROL} md:w-[111px] tabular-nums`} // its width with a date, also while loading
        />
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
        <div className="min-w-0 grid md:block">
          <select value={sort} onChange={(e) => onSort(e.target.value as Sort)} className={CONTROL}>
            {(Object.entries(sorts) as [Sort, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onCsv}
          className="w-full md:w-auto shrink-0 h-8 px-3 inline-flex items-center justify-center gap-1.5 border border-rule text-[12px] text-ink hover:border-ink"
        >
          <Icon size={16} name="download" className="text-muted" />
          Export CSV
        </button>
      </div>
    </div>
  );
}

// "1–50 of 625 athletes · Show 20 50 100 · ‹ 1 2 3 … 13 ›"
export function Pagination({
  loading = false,
  total,
  first,
  count,
  noun,
  pageSize,
  onPageSize,
  page,
  pages,
  onPage,
}: {
  loading?: boolean;
  total: number;
  first: number; // index of the page's first row
  count: number; // rows on the page
  noun: string; // "athletes", "nations"
  pageSize: number;
  onPageSize: (size: number) => void;
  page: number;
  pages: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="w-full border-t border-rule py-4 flex items-center justify-between text-[12px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full text-[12px] text-muted">
        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
          <div className="text-muted">
            {loading ? "Loading…" : total ? `${first + 1}–${first + count} of ${total} ${noun}` : `0 ${noun}`}
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-muted">Show</span>
            {PAGE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onPageSize(size)}
                className={
                  size === pageSize
                    ? "font-bold text-ink border-b-2 border-claret px-1 pb-0.5"
                    : "text-muted hover:text-ink px-1 pb-0.5 border-b-2 border-transparent transition-colors cursor-pointer"
                }
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 w-full sm:w-auto">
          <PageButton disabled={page === 1} onClick={() => onPage(page - 1)}>
            ‹
          </PageButton>
          {pageNumbers(page, pages).map((n, i) =>
            n === "…" ? (
              <span key={`gap-${i}`} className="text-muted px-1 select-none flex items-center justify-center h-8">
                …
              </span>
            ) : (
              <PageButton key={n} active={n === page} onClick={() => onPage(n)}>
                {n}
              </PageButton>
            ),
          )}
          <PageButton disabled={page === pages} onClick={() => onPage(page + 1)}>
            ›
          </PageButton>
        </div>
      </div>
    </div>
  );
}

// A header cell's explanation on hover (the cell needs `relative group`).
export function Tip({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      className={`hidden group-hover:block absolute ${center ? "left-1/2 -translate-x-1/2" : "right-0"} bottom-full mb-1 z-30 bg-ink text-paper py-1 px-2 text-left whitespace-nowrap pointer-events-none select-none text-[11px] font-normal leading-tight normal-case tracking-normal`}
    >
      {children}
    </div>
  );
}

function PageButton({
  children,
  onClick,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  const base = "min-w-[32px] h-8 flex items-center justify-center text-sm";
  if (disabled) return <span className={`${base} text-muted opacity-40 cursor-not-allowed select-none`}>{children}</span>;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${active ? "font-bold text-ink border-b-2 border-claret" : "text-muted hover:text-ink cursor-pointer transition-colors"}`}
    >
      {children}
    </button>
  );
}
