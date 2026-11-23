import type { Metadata } from "next";
import { type ReactNode, Suspense } from "react";

import { Calculator } from "@/components/methodology/Calculator";
import { Calibration, Upsets } from "@/components/methodology/Calibration";
import { Chapter, ChapterNav, ChapterStrip, Section, TryIt } from "@/components/methodology/Chapters";
import { PARIS } from "@/components/methodology/facts";
import { RdShift } from "@/components/methodology/RdShift";
import { RinerCareer, WeightMoves } from "@/components/methodology/SkillChart";
import { BeatTheModel, ListingRule } from "@/components/methodology/Stories";
import { DrawAnimation } from "@/components/methodology/DrawAnimation";
import { Figure } from "@/components/methodology/Figure";
import { NumberOneTable, ParisDraw, PointsOrStrength, TableRule, TwoGolds } from "@/components/methodology/Why";
import { PROSE } from "@/content/methodology";
import type { Facts, Slice } from "@/content/methodology/types";
import data from "@/data/methodology.json";
import type { Dict } from "@/i18n/en";
import type { Format } from "@/i18n/format";
import { currentLang, i18n } from "@/i18n/server";
import { t } from "@/i18n/t";
import { alternatesFor } from "@/lib/seo";

// The methodology, one page in three parts: why the rating exists (a story), how the
// rating is counted (the number, the calculator), does it work (the benchmark,
// ajr-backend benchmark/). The prose: src/content/methodology/<lang>.tsx; the figures'
// labels: the dictionary (methodology.*); the numbers: src/data/methodology.json.
export async function generateMetadata(): Promise<Metadata> {
  const lang = await currentLang();
  return {
    title: PROSE[lang].meta.title,
    description: PROSE[lang].meta.description,
    alternates: alternatesFor(lang, "/methodology"),
  };
}

const P = "mt-5";

// The benchmark's columns: from a coin to ours (the coin's, the same on every row, only from sm).
const COIN = "hidden sm:table-cell";
const MODELS = ["coin", "ijf", "elo", "glicko2", "ours"] as const;
const SLICES = ["all", "medal_rounds", "newcomers"] as const;
const slice = (key: string) => (data.benchmark.slices as unknown as Record<string, Slice>)[key];

// The numbers the prose puts in its sentences, formatted in the page's language.
function facts(f: Format, d: Dict): Facts {
  const dec = f.decimal;
  const all = slice("all");
  return {
    f,
    pct: (value, digits = 1) => f.formatChance(value, digits),
    dec,
    test: data.benchmark.test,
    all,
    medalRounds: slice("medal_rounds"),
    zero: data.rdShift.metrics.find((m) => m.n === 0)!,
    top: data.calibration.ours.find((b) => b.from === 0.95)!,
    disagreements: data.benchmark.disagreements,
    k: data.benchmark.k,
    brier: MODELS.map((k) => `${d.methodology.test.modelsShort[k]} ${dec(all[k].Brier, 3)}`).join(", "),
    parisLead: PARIS.abe.rating - PARIS.next,
    abeChance: Math.round(PARIS.abeChance * 100),
  };
}

// The layer for those who want the details: folded.
function Notes({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <details id={id} className="my-5 border-l-2 border-rule pl-4 group scroll-mt-32 lg:scroll-mt-24">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center gap-2 text-[14px] font-semibold text-claret hover:underline">
        {title}
        <span className="text-muted group-open:rotate-90 transition-transform" aria-hidden>
          ›
        </span>
      </summary>
      {children}
    </details>
  );
}

function Formula({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="my-4 px-4 py-3 border-l-2 border-claret bg-panel/40">
      <div className="font-serif text-[18px] text-ink">{children}</div>
      {note && <div className="mt-1 text-[13px] text-muted">{note}</div>}
    </div>
  );
}

// AJR against the IJF rating on the test: accuracy side by side per slice, on a scale
// from a coin (50%) to 75%, and the contests where the two named different favourites.
function AjrVsIjf({ x, d }: { x: Facts; d: Dict }) {
  const s = d.methodology.test;
  const dis = x.disagreements;
  const at = (v: number) => `${Math.max(0, Math.min(100, ((v - 0.5) / 0.25) * 100))}%`;
  const right = Math.round((dis.ours_right / dis.n) * 100);
  return (
    <Figure title={s.ajrVsIjf} caption={t(s.contestsFromTo, { contests: x.f.count(d.common.contests, x.test, x.f.number(x.test)) })}>
      <div className="space-y-5 tabular-nums">
        <div className="flex items-end gap-3 text-[12px] text-muted">
          <span className="w-8" />
          <div className="relative flex-1 h-5">
            {[50, 55, 60, 65, 70, 75].map((v) => (
              <span key={v} className={`absolute bottom-0 ${v === 50 ? "" : v === 75 ? "-translate-x-full" : "-translate-x-1/2"} ${v === 55 || v === 65 ? "hidden sm:inline" : ""}`} style={{ left: `${((v - 50) / 25) * 100}%` }}>
                {v === 50 ? s.coin : `${v}%`}
              </span>
            ))}
          </div>
          <span className="w-14" />
        </div>
        {SLICES.map((key) => {
          const sl = slice(key);
          return (
            <div key={key}>
              <div className="text-[13px] font-semibold text-ink">
                {s.slices[key]} <span className="font-normal text-muted">({x.f.number(sl.n)})</span>
              </div>
              {(["ours", "ijf"] as const).map((m) => (
                <div key={m} className="mt-1.5 flex items-center gap-3">
                  <span className={`w-8 text-[12px] font-semibold ${m === "ours" ? "text-claret" : "text-ink"}`}>{s.modelsShort[m]}</span>
                  <div className="relative flex-1 h-4 bg-panel/60">
                    {[55, 60, 65, 70].map((v) => (
                      <span key={v} className="absolute inset-y-0 w-px bg-paper" style={{ left: `${((v - 50) / 25) * 100}%` }} aria-hidden />
                    ))}
                    <div className={`h-full ${m === "ours" ? "bg-claret" : "bg-ink/70"}`} style={{ width: at(sl[m].accuracy) }} />
                  </div>
                  <span className={`w-14 text-right font-serif text-[18px] font-bold ${m === "ours" ? "text-claret" : "text-ink"}`}>{x.pct(sl[m].accuracy)}</span>
                </div>
              ))}
            </div>
          );
        })}
        <div className="border-t border-rule pt-4">
          <div className="text-[13px] font-semibold text-ink">
            {s.differentWinners} <span className="font-normal text-muted">({x.f.number(dis.n)})</span>
          </div>
          <div className="mt-2 h-4 flex">
            <div className="h-full bg-claret" style={{ width: `${right}%` }} />
            <div className="h-full flex-1 bg-ink/70" />
          </div>
          <div className="mt-1 flex justify-between text-[13px]">
            <span className="font-semibold text-claret">{t(s.ajrPickWon, { n: right })}</span>
            <span className="font-semibold text-ink">{t(s.ijfPickWon, { n: 100 - right })}</span>
          </div>
        </div>
      </div>
    </Figure>
  );
}

export default async function Methodology() {
  const { lang, d, f } = await i18n();
  const prose = PROSE[lang];
  const x = facts(f, d);
  const s = d.methodology.test;
  const { why, number, works } = prose;
  return (
    <div className="w-full flex gap-12 bg-paper">
      <article className="w-full min-w-0 max-w-[760px] pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8 text-[16px] leading-[1.7] text-ink">
        <h1 className="font-serif text-[32px] leading-[38px] sm:text-[40px] sm:leading-[46px] font-bold tracking-[-0.015em]">{prose.title}</h1>
        <p className="mt-4 text-[18px] text-muted">{prose.lead(x)}</p>
        <ChapterStrip />

        {/* Part 1: the story */}
        <Chapter id="why">{why.intro(x)}</Chapter>
        <Section id="paris">{d.methodology.chapters.sections.paris}</Section>
        <p className={P}>{why.paris1(x)}</p>
        <p className={P}>{why.paris2(x)}</p>
        <p className={P}>{why.paris3(x)}</p>
        <p className={P}>{why.paris4(x)}</p>
        <p className={P}>{why.paris5(x)}</p>
        <p className={P}>{why.paris6(x)}</p>
        <ParisDraw />
        <p className={P}>{why.afterParisDraw(x)}</p>
        <div id="draw" className="scroll-mt-32 lg:scroll-mt-24">
          <DrawAnimation />
        </div>
        <p className={P}>{why.afterDraw(x)}</p>
        <div id="number-one" className="scroll-mt-32 lg:scroll-mt-24">
          <NumberOneTable />
        </div>
        <p className={P}>{why.afterNumberOne(x)}</p>

        <Section id="newcomers">{d.methodology.chapters.sections.newcomers}</Section>
        <p className={P}>{why.newcomers1(x)}</p>
        <p className={P}>{why.newcomers2(x)}</p>
        <p className={P}>{why.newcomers3(x)}</p>
        <PointsOrStrength />
        <p className={P}>{why.afterPoints(x)}</p>
        <p className={P}>{why.goldWorth(x)}</p>
        <TwoGolds />
        <p className={P}>{why.afterTwoGolds(x)}</p>
        <p className={P}>{why.losses(x)}</p>

        {/* Part 2: the number and the calculator */}
        <Chapter id="number">{number.intro(x)}</Chapter>
        <Section id="skill">{d.methodology.chapters.sections.skill}</Section>
        <p className={P}>{number.skill1(x)}</p>
        <p className={P}>{number.skill2(x)}</p>
        <Formula note={number.formulaNote(x)}>{number.formula(x)}</Formula>
        <Section id="calculator">{d.methodology.chapters.sections.calculator}</Section>
        <p className={P}>{number.calculator1(x)}</p>
        <p className={P}>{number.calculator2(x)}</p>
        <Suspense fallback={null}>
          <Calculator />
        </Suspense>

        <p className={P}>{number.career(x)}</p>
        <RinerCareer />
        <p className={P}>{number.afterRiner(x)}</p>

        <Section id="weights">{d.methodology.chapters.sections.weights}</Section>
        <p className={P}>{number.weights1(x)}</p>
        <p className={P}>{number.weights2(x)}</p>
        <TableRule />
        <p className={P}>{number.afterTableRule(x)}</p>
        <TryIt title={number.weightMovesTitle}>
          <div className="px-4 sm:px-5">
            <WeightMoves />
            <ListingRule />
          </div>
        </TryIt>

        <Section id="p4p">{d.methodology.chapters.sections.p4p}</Section>
        <p className={P}>{number.p4p(x)}</p>
        <p className={P}>{number.teams(x)}</p>

        {/* Part 3: the test */}
        <Chapter id="works">{works.intro(x)}</Chapter>
        <Section id="test">{d.methodology.chapters.sections.test}</Section>
        <p className={P}>{works.test(x)}</p>
        <AjrVsIjf x={x} d={d} />
        <p className={P}>{works.allFive(x)}</p>
        <div className="my-8 overflow-x-auto">
          <table className="w-full text-[13px] sm:text-[14px] tabular-nums border-collapse">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-3 font-semibold" />
                {MODELS.map((key) => (
                  <th key={key} className={`py-2 px-1.5 sm:px-2 font-semibold text-right ${key === "ours" ? "text-claret" : ""} ${key === "coin" ? COIN : ""}`}>
                    {s.modelsShort[key]}
                  </th>
                ))}
              </tr>
            </thead>
            {SLICES.map((key) => {
              const sl = slice(key);
              const best = (metric: "accuracy" | "log loss") =>
                MODELS.reduce((b, m) => (metric === "accuracy" ? Math.max(b, sl[m].accuracy) : Math.min(b, sl[m]["log loss"])), metric === "accuracy" ? 0 : 9);
              return (
                <tbody key={key}>
                  <tr>
                    <td colSpan={6} className="pt-4 pb-1 text-[12px] font-semibold uppercase tracking-wider text-muted">
                      {s.slices[key]} ({x.f.number(sl.n)})
                    </td>
                  </tr>
                  {(["accuracy", "log loss"] as const).map((metric) => (
                    <tr key={metric} className="border-b border-rule">
                      <td className="py-1.5 pr-2 sm:pr-3">{metric === "accuracy" ? s.accuracy : s.logLoss}</td>
                      {MODELS.map((m) => {
                        const v = sl[m][metric];
                        const top = Math.abs(v - best(metric)) < 5e-4;
                        return (
                          <td key={m} className={`py-1.5 px-1.5 sm:px-2 text-right ${top ? "font-semibold" : ""} ${m === "ours" ? "text-claret" : ""} ${m === "coin" ? COIN : ""}`}>
                            {metric === "accuracy" ? x.pct(v) : x.dec(v, 3)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              );
            })}
          </table>
        </div>
        <p className={P}>{works.afterTable(x)}</p>
        <Notes id="test-notes" title={s.notesTitle}>
          <p className={P}>{works.notes(x)}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-[14px] tabular-nums border-collapse">
              <tbody>
                {s.params.map(([k, v]) => (
                  <tr key={k} className="border-b border-rule">
                    <td className="py-1.5 pr-3 text-muted">{k}</td>
                    <td className="py-1.5 text-right">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`${P} text-[14px]`}>{works.notesFormula(x)}</p>
        </Notes>

        <Section id="calibration">{d.methodology.chapters.sections.calibration}</Section>
        <p className={P}>{works.calibration(x)}</p>
        <Calibration />
        <p className={P}>{works.afterCalibration(x)}</p>
        <Upsets />
        <TryIt title={works.beatTitle}>
          <BeatTheModel />
        </TryIt>

        <Section id="one-rd">{d.methodology.chapters.sections.oneRd}</Section>
        <p className={P}>{works.oneRd1(x)}</p>
        <p className={P}>{works.oneRd2(x)}</p>
        <RdShift />

        <Section id="limits">{d.methodology.chapters.sections.limits}</Section>
        <ul className="mt-4 list-disc pl-5 space-y-2">
          {works.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className="mt-10 text-[14px] text-muted">{works.footer(x)}</p>
      </article>
      <div className="hidden lg:block pt-[48.75px]">
        <ChapterNav />
      </div>
    </div>
  );
}
