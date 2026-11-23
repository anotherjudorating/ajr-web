"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { useI18n } from "@/i18n/client";

// The page's three chapters, each with its sections: the story, the number and how a
// contest moves it, the test. The sections are the questions a reader asks in order.
// The ids are the anchors; the titles are in the dictionary (methodology.chapters),
// a section's under `key`.
export const CHAPTERS = [
  {
    id: "why",
    sections: [
      { id: "paris", key: "paris" },
      { id: "newcomers", key: "newcomers" },
    ],
  },
  {
    id: "number",
    sections: [
      { id: "skill", key: "skill" },
      { id: "calculator", key: "calculator" },
      { id: "weights", key: "weights" },
      { id: "p4p", key: "p4p" },
    ],
  },
  {
    id: "works",
    sections: [
      { id: "test", key: "test" },
      { id: "calibration", key: "calibration" },
      { id: "one-rd", key: "oneRd" },
      { id: "limits", key: "limits" },
    ],
  },
] as const;

type ChapterId = (typeof CHAPTERS)[number]["id"];
type SectionId = (typeof CHAPTERS)[number]["sections"][number]["id"];
const ALL_IDS: string[] = CHAPTERS.flatMap((c) => [c.id, ...c.sections.map((s) => s.id)]);

// A chapter's opening: its number, its title, a rule over it; the navigation's target.
export function Chapter({ id, children }: { id: ChapterId; children?: ReactNode }) {
  const { d, t } = useI18n();
  const index = CHAPTERS.findIndex((c) => c.id === id);
  return (
    <div id={id} className="scroll-mt-32 lg:scroll-mt-24 mt-16 pt-4 border-t-2 border-ink">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-claret">{t(d.methodology.chapters.part, { n: index + 1 })}</div>
      <h2 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[42px] font-bold text-ink">{d.methodology.chapters[id].title}</h2>
      {children && <p className="mt-3 text-[17px] text-muted">{children}</p>}
    </div>
  );
}

// A section's heading, the navigation's finer target.
export function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-32 lg:scroll-mt-24 font-serif text-[22px] leading-[28px] sm:text-[24px] sm:leading-[30px] font-bold text-ink mt-12 mb-2">
      {children}
    </h3>
  );
}

// "Try it yourself": a figure folded under the story, for the reader who wants to
// touch the thing the text just described.
export function TryIt({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  const { d } = useI18n();
  return (
    <details open={open} className="my-6 border border-rule bg-panel/40 group">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden px-4 sm:px-5 py-3 flex items-center gap-3 text-[14px] font-semibold text-ink hover:bg-panel/70 whitespace-nowrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-claret">{d.methodology.chapters.tryIt}</span>
        <span className="min-w-0 truncate">{title}</span>
        <span className="ml-auto text-muted group-open:rotate-90 transition-transform" aria-hidden>
          ›
        </span>
      </summary>
      <div className="border-t border-rule">{children}</div>
    </details>
  );
}

// The chapter and the section in view (the last whose top passed a third of the screen).
function useCurrent(): { chapter: string; section: string | null } {
  const [current, setCurrent] = useState<{ chapter: string; section: string | null }>({ chapter: CHAPTERS[0].id, section: null });
  useEffect(() => {
    const update = () => {
      let found: string = CHAPTERS[0].id;
      for (const id of ALL_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight / 3) found = id;
      }
      // at the bottom the last section is the one being read, however short
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) found = CHAPTERS[2].sections[2].id;
      const chapter = CHAPTERS.find((c) => c.id === found || c.sections.some((s) => s.id === found)) ?? CHAPTERS[0];
      const section = chapter.sections.some((s) => s.id === found) ? found : null;
      setCurrent((c) => (c.chapter === chapter.id && c.section === section ? c : { chapter: chapter.id, section }));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return current;
}

// The page's contents on a desktop: a column at the right that stays in view, the
// current chapter and section marked.
export function ChapterNav() {
  const { d } = useI18n();
  const { chapter, section } = useCurrent();
  return (
    <nav aria-label={d.methodology.chapters.contents} className="hidden lg:block sticky top-24 self-start w-60 shrink-0 text-[14px]">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">{d.methodology.chapters.contents}</div>
      <ol className="border-l border-rule">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={chapter === c.id && !section ? "true" : undefined}
              className={`block pl-3 py-1.5 -ml-px border-l-2 ${chapter === c.id ? "border-claret text-ink font-semibold" : "border-transparent text-muted hover:text-ink"}`}
            >
              <span className="tabular-nums mr-2 text-muted">{i + 1}</span>
              {d.methodology.chapters[c.id].title}
            </a>
            {chapter === c.id && (
              <ol className="mb-1">
                {c.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={section === s.id ? "true" : undefined}
                      className={`block pl-8 py-1 -ml-px border-l-2 text-[13px] ${section === s.id ? "border-claret text-ink" : "border-transparent text-muted hover:text-ink"}`}
                    >
                      {d.methodology.chapters.sections[s.key]}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// On a phone: a strip of chapters under the header, sticky, the current one marked.
export function ChapterStrip() {
  const { d } = useI18n();
  const { chapter } = useCurrent();
  const strip = useRef<HTMLElement>(null);
  // how far down the page the reader is, as a claret line under the strip
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);
  useEffect(() => {
    const nav = strip.current;
    const link = nav?.querySelector<HTMLElement>(`a[href="#${chapter}"]`);
    if (nav && link) nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
  }, [chapter]);
  return (
    <div className="lg:hidden sticky top-[84px] md:top-16 z-30 -mx-4 sm:-mx-6 md:-mx-8 bg-paper border-b border-rule">
      <nav ref={strip} aria-label={d.methodology.chapters.contents} className="relative px-4 sm:px-6 md:px-8 overflow-x-auto">
        <ol className="flex gap-5 h-10 items-center whitespace-nowrap text-[13px] pr-8">
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className={chapter === c.id ? "text-claret font-semibold" : "text-muted"}>
                {i + 1} {d.methodology.chapters[c.id].short}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-10 w-12 bg-gradient-to-l from-paper" />
      <div aria-hidden className="absolute left-0 -bottom-px h-[2px] bg-claret" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}
