"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

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
// effect, once the section shows what the hash asked for (a level opened). It
// scrolls once per hash: the section's own changes (a click) do not scroll it again.
// Needed because Next scrolls to a hash only if the section is there at the first
// commit, and the athlete page's sections come after its data.
export function useHashTarget(id: string): {
  qualifier: string | null;
  ref: RefObject<HTMLElement | null>;
  scrollNow: () => void;
} {
  const hash = useHash();
  const qualifier = targetOf(hash, id);
  const ref = useRef<HTMLElement | null>(null);
  const scrolledFor = useRef<string | null>(null);
  const scrollNow = useCallback(() => {
    if (qualifier === null || scrolledFor.current === hash || !ref.current) return;
    scrolledFor.current = hash;
    scrollWhileGrowing(ref.current);
  }, [hash, qualifier]);
  return { qualifier, ref, scrollNow };
}

// Scroll to `section` (below the header: scroll-padding-top, globals.css). The rest
// of the page may still be on its way, too short to scroll that far: scroll again as
// it grows, until the section is in place, the reader scrolls, or 5 seconds pass.
function scrollWhileGrowing(section: HTMLElement): void {
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const placed = () => Math.abs(section.getBoundingClientRect().top - padding) < 2;
  section.scrollIntoView();
  if (placed()) return;
  const observer = new ResizeObserver(() => {
    section.scrollIntoView();
    if (placed()) stop();
  });
  const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
  const timer = window.setTimeout(stop, 5000);
  function stop() {
    observer.disconnect();
    window.clearTimeout(timer);
    for (const e of events) window.removeEventListener(e, stop);
  }
  observer.observe(document.body);
  for (const e of events) window.addEventListener(e, stop, { passive: true });
}
