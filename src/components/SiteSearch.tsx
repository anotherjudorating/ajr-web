"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { type SearchHit, searchSite } from "@/lib/browser-api";
import { dateRange, shortName } from "@/lib/format";
import { WEIGHTS, weightTitle } from "@/lib/weights";

const GROUPS = [
  { kind: "athlete", title: "Athletes" },
  { kind: "tournament", title: "Tournaments" },
  { kind: "nation", title: "Nations" },
] as const;

function hrefOf(hit: SearchHit): string {
  if (hit.kind === "athlete") return `/athletes/${hit.id}`;
  if (hit.kind === "tournament") return `/tournaments/${hit.id}`;
  return `/countries/${(hit.country ?? "").toLowerCase()}`;
}

function labelOf(hit: SearchHit): { name: string; detail: string } {
  if (hit.kind === "athlete") {
    const weight = WEIGHTS.find((w) => w.api === hit.weight && w.gender === (hit.gender === "female" ? "women" : "men"));
    return { name: shortName(hit.family_name, hit.given_name), detail: weight ? weightTitle(weight) : (hit.weight ?? "") };
  }
  if (hit.kind === "tournament") {
    return { name: hit.name ?? "", detail: hit.date_from ? `${dateRange(hit.date_from, hit.date_to)} ${hit.date_from.slice(0, 4)}` : "" };
  }
  return { name: hit.name ?? "", detail: hit.country ?? "" };
}

// The header's search box and its instant results, as in the prototype: athletes,
// tournaments and nations under the box, and "Search in Explore" for the rest.
// `wide`: the phone's row, the results across the whole screen.
export function SiteSearch({ wide = false, autoFocus = false }: { wide?: boolean; autoFocus?: boolean }) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[] | null>(null); // null: nothing asked yet
  const [open, setOpen] = useState(false);

  // asks once typing pauses, from 2 letters; a newer question cancels the older one
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchSite(q, controller.signal).then(setHits, () => {});
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const q = query.trim();
  const shown = open && q.length >= 2 && hits !== null;
  const explore = `/explore/athletes?q=${encodeURIComponent(q)}`;
  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div ref={box} className={wide ? "relative flex-1" : "relative w-60"}>
      <Icon size={18} name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      <input
        type="text"
        autoComplete="off"
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            e.currentTarget.blur();
          }
          if (e.key === "Enter" && q.length >= 2) go(hits?.[0] ? hrefOf(hits[0]) : explore);
        }}
        placeholder="Athletes, tournaments, nations"
        className={`w-full h-8 pl-8 pr-2.5 bg-paper border rounded-none text-[12px] text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors ${wide ? "border-ink" : "border-rule"}`}
      />
      {shown && (
        <div
          className={`z-[60] bg-paper border border-ink shadow-[0_8px_24px_rgba(51,48,46,0.12)] max-h-[70vh] overflow-auto ${
            wide ? "fixed left-0 right-0 top-[56px] border-x-0" : "absolute right-0 top-full mt-1 w-[360px]"
          }`}
        >
          {GROUPS.map(({ kind, title }) => {
            const group = hits.filter((h) => h.kind === kind);
            if (group.length === 0) return null;
            return (
              <div key={kind}>
                <div className="px-3 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">{title}</div>
                {group.map((hit) => {
                  const { name, detail } = labelOf(hit);
                  return (
                    <Link
                      key={`${kind}-${hit.id ?? hit.country}`}
                      href={hrefOf(hit)}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-3 px-3 h-8 text-[13px] text-ink hover:bg-panel"
                    >
                      <span className="flex items-center gap-1.5 min-w-0">
                        <Flag ioc={hit.country} />
                        <span className="truncate font-medium">{name}</span>
                      </span>
                      <span className="shrink-0 text-[12px] text-muted">{detail}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
          {hits.length === 0 && <div className="px-3 py-3 text-[13px] text-muted">No quick matches.</div>}
          <Link
            href={explore}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 h-10 mt-1 border-t border-rule font-serif text-[14px] font-semibold text-claret hover:bg-panel"
          >
            Search in Explore
            <Icon size={18} name="arrow_forward" />
          </Link>
        </div>
      )}
    </div>
  );
}
