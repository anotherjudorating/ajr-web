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
export function scrollWhileGrowing(section: HTMLElement): void {
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const place = () => {
    if (Math.abs(section.getBoundingClientRect().top - padding) >= 2) section.scrollIntoView();
  };
  section.scrollIntoView();
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
