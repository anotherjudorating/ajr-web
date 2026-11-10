"use client";

import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { targetOf } from "@/lib/anchors";

// The page's #hash, read after hydration ("" on the server and at the first render,
// so the HTML matches). Read in an effect, not in render: on a client navigation
// Next updates the address after rendering, and pushState sends no hashchange.
export function useHash(): string {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const read = () => setHash(decodeURIComponent(window.location.hash.slice(1)));
    read();
    window.addEventListener("hashchange", read);
    window.addEventListener("popstate", read);
    return () => {
      window.removeEventListener("hashchange", read);
      window.removeEventListener("popstate", read);
    };
  }, []);
  return hash;
}

// Whether the address points at section `id`: the qualifier (null: not this section,
// "": the section itself), a ref for the <section>, and scrollNow() for a layout
// effect, once the section shows what the hash asked for (a level opened); given an
// element (the one whose id is the whole hash), it scrolls to that instead. It
// scrolls once per hash: the section's own changes (a click) do not scroll it again.
// Needed because Next scrolls to a hash only if the section is there at the first
// commit, and the athlete page's sections come after its data.
export function useHashTarget(id: string): {
  qualifier: string | null;
  ref: RefObject<HTMLElement | null>;
  scrollNow: (target?: HTMLElement | null) => void;
} {
  const hash = useHash();
  const qualifier = targetOf(hash, id);
  const ref = useRef<HTMLElement | null>(null);
  const scrolledFor = useRef<string | null>(null);
  const scrollNow = useCallback((target?: HTMLElement | null) => {
    const element = target ?? ref.current;
    if (qualifier === null || scrolledFor.current === hash || !element) return;
    scrolledFor.current = hash;
    scrollWhileGrowing(element);
  }, [hash, qualifier]);
  return { qualifier, ref, scrollNow };
}

// Scroll to `section` (below the header: scroll-padding-top, globals.css), and keep
// it there while the page settles: the rest may still be arriving (too short to
// scroll that far), and fonts or a chart above may change height after the first
// scroll. Every change of the page's size puts it back, for 5 seconds or until the
// reader scrolls, clicks or types.
export function scrollWhileGrowing(section: HTMLElement, target: () => number = () => topOf(section)): void {
  const place = () => {
    const y = target();
    if (Math.abs(window.scrollY - y) >= 2) window.scrollTo(0, y);
  };
  place();
  const observer = new ResizeObserver(place);
  const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
  const timer = window.setTimeout(stop, 5000);
  function stop() {
    observer.disconnect();
    window.clearTimeout(timer);
    for (const e of events) window.removeEventListener(e, stop);
  }
  observer.observe(document.body);
  document.fonts?.ready.then(place);
  for (const e of events) window.addEventListener(e, stop, { passive: true });
}

const padding = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

// The scroll that puts an element at the top, under the sticky header.
function topOf(element: HTMLElement): number {
  return element.getBoundingClientRect().top + window.scrollY - padding();
}

// A table's row in the middle of the screen; but a row near the table's top leaves
// the table's start (`start`: its toolbar, with the date) at the top, and one near
// its end leaves the table's end at the bottom, rather than the page around it.
export function rowTarget(row: HTMLElement, start: HTMLElement, end: HTMLElement): () => number {
  return () => {
    const box = row.getBoundingClientRect();
    const middle = box.top + window.scrollY + box.height / 2 - (window.innerHeight + padding()) / 2;
    const last = end.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    return Math.max(Math.min(middle, last), topOf(start));
  };
}

// A table's row a link marks (#athlete-<id>, #nation-<ioc>): lit, fading at the
// reader's first move (a click, a scroll, a key), as it has shown where the row is.
// `row` and `day` are the classes of the marked row and of the table's date.
export const TABLE_START = "table-start"; // the toolbar over the table, with the date
// A new `key` (another pick of the rows) lights them again.
export function useRowMark(active: boolean, key = ""): { row: string; day: string } {
  const [lit, setLit] = useState(true);
  const [litFor, setLitFor] = useState(key);
  if (litFor !== key) {
    setLitFor(key);
    setLit(true);
  }
  useEffect(() => {
    if (!active || !lit) return;
    const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    const fade = () => setLit(false);
    for (const e of events) window.addEventListener(e, fade, { passive: true, once: true });
    return () => {
      for (const e of events) window.removeEventListener(e, fade);
    };
  }, [active, lit]);
  if (!active) return { row: "", day: "" };
  const fade = "transition-colors duration-[1500ms]";
  return { row: `${fade} ${lit ? "bg-claret/10" : ""}`, day: `${fade} ${lit ? "bg-claret/10! border-claret!" : ""}` };
}

// Scroll a marked row (its id) into place once it is on the page (rowTarget, kept
// while the page settles), once per `key` (the hash, or a pick). The table's start is
// its toolbar (TABLE_START) or, without one, its section.
export function useRowScroll(id: string, ready: boolean, key = id): void {
  const scrolledFor = useRef("");
  useLayoutEffect(() => {
    const row = ready ? document.getElementById(id) : null;
    if (!row || scrolledFor.current === key) return;
    scrolledFor.current = key;
    const start = document.getElementById(TABLE_START) ?? row.closest("section");
    const table = row.closest("table");
    scrollWhileGrowing(row, start && table ? rowTarget(row, start, table) : undefined);
  });
}

// Go to a row of this page by its id: the address gets the hash (pushState sends no
// hashchange, so one is sent), and useHash, useRowMark and useRowScroll mark and
// scroll it as a link from another page would.
export function goToRow(id: string): void {
  window.history.pushState(null, "", `#${id}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
