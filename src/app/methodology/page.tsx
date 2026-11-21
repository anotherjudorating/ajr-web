import type { Metadata } from "next";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";

import { Calculator } from "@/components/methodology/Calculator";
import { Calibration, Upsets } from "@/components/methodology/Calibration";
import { Chapter, ChapterNav, ChapterStrip, Section, TryIt } from "@/components/methodology/Chapters";
import { LIMITS, PARIS } from "@/components/methodology/facts";
import { RdShift } from "@/components/methodology/RdShift";
import { RinerCareer, WeightMoves } from "@/components/methodology/SkillChart";
import { BeatTheModel, ListingRule } from "@/components/methodology/Stories";
import { DrawAnimation } from "@/components/methodology/DrawAnimation";
import { Figure } from "@/components/methodology/Figure";
import { NumberOneTable, ParisDraw, PointsOrStrength, TableRule, TwoGolds } from "@/components/methodology/Why";
import data from "@/data/methodology.json";

// PROTOTYPE of the methodology, one page in three parts: why the rating exists (a
// story), how the rating is counted (the number, the calculator), does it work (the
// benchmark, ajr-backend benchmark/). The numbers: src/data/methodology.json.
export const metadata: Metadata = { title: "How the rating works", robots: { index: false } }; // until the owner approves

const P = "mt-5";
const LINK = "underline decoration-rule underline-offset-2 hover:decoration-ink";
const REPO = "https://github.com/anotherjudorating/ajr-backend/tree/main/benchmark";

const PARAMS = [
  ["Start: skill, RD, volatility σ", "1500, 350, 0.06"],
  ["τ (how fast the volatility moves)", "0.5"],
  ["RD growth a day away", "RD² + 5² a day, at most 350"],
  ["Rating period", "every contest"],
  ["Rating", "skill − 1 × RD"],
  ["A change of weight", "skill × 0.95 up, × 1.05 down"],
  ["Elo baseline", "start 1500, K = 32, scale 400"],
  ["Textbook Glicko-2 baseline", "monthly periods, same start and τ"],
] as const;

// The benchmark's columns: from a coin to ours (the coin's, the same on every row, only from sm).
const COIN = "hidden sm:table-cell";
const MODELS = [
  ["coin", "Coin flip", "Coin"],
  ["ijf", "IJF World Ranking List", "IJF"],
  ["elo", "Elo (K = 32)", "Elo"],
  ["glicko2", "Glicko-2, textbook", "Glicko-2"],
  ["ours", "Another Judo Rating", "AJR"],
] as const;
const SLICES = [
  ["all", "All contests"],
  ["medal_rounds", "Medal rounds of majors"],
  ["newcomers", "With a newcomer (under 10 contests)"],
] as const;
type Score = { "log loss": number; Brier: number; accuracy: number };
const slice = (key: string) => (data.benchmark.slices as unknown as Record<string, Record<string, Score> & { n: number }>)[key];

// The key figures of the test: 2 × 2 on phones, one row from sm, hairlines between.

// The layer for those who want the details: folded.
function Notes({ id, title = "Test details and settings", children }: { id?: string; title?: string; children: ReactNode }) {
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
function AjrVsIjf() {
  const d = data.benchmark.disagreements;
  const at = (v: number) => `${Math.max(0, Math.min(100, ((v - 0.5) / 0.25) * 100))}%`;
  const right = Math.round((d.ours_right / d.n) * 100);
  return (
    <Figure
      title="AJR against IJF"
      caption={`${data.benchmark.test.toLocaleString("en-US")} contests from July 2025 to November 2026.`}
    >
      <div className="space-y-5 tabular-nums">
        <div className="flex items-end gap-3 text-[12px] text-muted">
          <span className="w-8" />
          <div className="relative flex-1 h-5">
            {[50, 55, 60, 65, 70, 75].map((v) => (
              <span key={v} className={`absolute bottom-0 ${v === 50 ? "" : v === 75 ? "-translate-x-full" : "-translate-x-1/2"} ${v === 55 || v === 65 ? "hidden sm:inline" : ""}`} style={{ left: `${((v - 50) / 25) * 100}%` }}>
                {v === 50 ? "50% coin" : `${v}%`}
              </span>
            ))}
          </div>
          <span className="w-14" />
        </div>
        {SLICES.map(([key, label]) => {
          const s = slice(key);
          return (
            <div key={key}>
              <div className="text-[13px] font-semibold text-ink">
                {label} <span className="font-normal text-muted">({s.n.toLocaleString("en-US")})</span>
              </div>
              {(["ours", "ijf"] as const).map((m) => (
                <div key={m} className="mt-1.5 flex items-center gap-3">
                  <span className={`w-8 text-[12px] font-semibold ${m === "ours" ? "text-claret" : "text-ink"}`}>{m === "ours" ? "AJR" : "IJF"}</span>
                  <div className="relative flex-1 h-4 bg-panel/60">
                    {[55, 60, 65, 70].map((v) => (
                      <span key={v} className="absolute inset-y-0 w-px bg-paper" style={{ left: `${((v - 50) / 25) * 100}%` }} aria-hidden />
                    ))}
                    <div className={`h-full ${m === "ours" ? "bg-claret" : "bg-ink/70"}`} style={{ width: at(s[m].accuracy) }} />
                  </div>
                  <span className={`w-14 text-right font-serif text-[18px] font-bold ${m === "ours" ? "text-claret" : "text-ink"}`}>
                    {(s[m].accuracy * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          );
        })}
        <div className="border-t border-rule pt-4">
          <div className="text-[13px] font-semibold text-ink">
            Contests where AJR and IJF picked different winners <span className="font-normal text-muted">({d.n.toLocaleString("en-US")})</span>
          </div>
          <div className="mt-2 h-4 flex">
            <div className="h-full bg-claret" style={{ width: `${right}%` }} />
            <div className="h-full flex-1 bg-ink/70" />
          </div>
          <div className="mt-1 flex justify-between text-[13px]">
            <span className="font-semibold text-claret">AJR&apos;s pick won {right} times in 100</span>
            <span className="font-semibold text-ink">IJF&apos;s {100 - right}</span>
          </div>
        </div>
      </div>
    </Figure>
  );
}

export default function Methodology() {
  const all = slice("all");
  const d = data.benchmark.disagreements;
  const zero = data.rdShift.metrics.find((m) => m.n === 0)!;
  const top = data.calibration.ours.find((b) => b.from === 0.95)!;
  return (
    <div className="w-full flex gap-12 bg-paper">
      <article className="w-full min-w-0 max-w-[760px] pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8 text-[16px] leading-[1.7] text-ink">
        <h1 className="font-serif text-[32px] leading-[38px] sm:text-[40px] sm:leading-[46px] font-bold tracking-[-0.015em]">How the rating works</h1>
        <p className="mt-4 text-[18px] text-muted">
          A rating of every judoka in the IJF judobase, from every senior contest since 2009, about 227 thousand contests. One number per
          athlete, and it answers one question: how likely are you to beat the next person you fight. This page says why it was built, how it is
          counted, and how well it predicts.
        </p>
        <ChapterStrip />

        {/* Part 1: the story */}
        <Chapter id="why">
          Two things started it. The first happened at the Paris Olympics, the second happens every weekend at a European Cup somewhere.
        </Chapter>
        <Section id="paris">An Olympic final in 1/8</Section>
        <p className={P}>
          On 28 July 2024, at eleven in the morning, the Olympic final of the women&apos;s −52 kg was fought in 1/8. Uta Abe,
          the Olympic champion of Tokyo, met Diyora Keldiyorova of Uzbekistan, who would be Olympic champion
          by the evening. It was Abe&apos;s second contest of the day.
        </p>
        <p className={P}>
          Why were they meeting so early? Because the draw goes by the IJF rating, the World Ranking List, and it is a points race. You get points
          for the round you reach at the events the IJF counts, the best six results of the year count in full, the six of the year before at
          half. The list decides who is seeded at the World Championships and the Olympic Games, and so who avoids whom.
        </p>
        <p className={P}>
          Abe came to Paris as the Olympic champion of Tokyo with four world titles. She had skipped the 2024 World Championships and fought
          two World Tour events in the year before the cut-off, so in the IJF rating she was 10th among the entrants and unseeded. Japanese
          athletes often do this: a few chosen tournaments while others fight a dozen. Keldiyorova had fought the whole season and was seed 1.
        </p>
        <p className={P}>
          Keldiyorova threw her for ippon after three minutes and won the gold that evening. The problem is the draw. That contest should have
          been a final. It was unfair to Abe, and just as unfair to Keldiyorova. She won, but she had done everything the IJF rating asks and
          still drew the strongest athlete in the weight four contests from a medal, and a loss would have sent her home with nothing. A
          seeding by strength would have kept them apart until the final block.
        </p>
        <p className={P}>
          A seeding by strength needs a measure of strength, and IJF points cannot be it: they count where an athlete went and how far she got,
          not whom she beat. A measure of strength has to weigh every contest, won or lost, by who stood on the other side, so that two
          tournaments against the best count for as much as a season of easier ones. That is what AJR does.
        </p>
        <p className={P}>
          On the eve of the contest Abe was first on the AJR leaderboard, {PARIS.abe.rating - PARIS.next} points clear of the next athlete (a #1
          stands around 2400, a #10 around 2050), and Keldiyorova was fifth. AJR gave Abe a {Math.round(PARIS.abeChance * 100)}% chance in their contest. A{" "}
          {Math.round(PARIS.abeChance * 100)}% favourite loses one contest in ten, and this was that one.
        </p>
        <ParisDraw />
        <p className={P}>Here is the same draw seeded both ways, by IJF rating and by AJR rating.</p>
        <div id="draw" className="scroll-mt-32 lg:scroll-mt-24">
          <DrawAnimation />
        </div>
        <p className={P}>
          One draw proves nothing either way, so here is every tournament since the IJF&apos;s archive of its lists begins, March 2025, and
          one plain question for each weight: did the number 1 win? The IJF number 1 won 341 of 1,091 golds, the AJR number 1 won 421. AJR was
          ahead at every level but the European Cups, where IJF was one gold ahead (44 to 43).
        </p>
        <div id="number-one" className="scroll-mt-32 lg:scroll-mt-24">
          <NumberOneTable />
        </div>
        <p className={P}>
          The IJF rating also forgets: a year off halves an athlete&apos;s points and a second year wipes them out, as if rest made her weaker
          than anyone who kept fighting. A break costs little in AJR. Abe fought nothing between Antalya in March and Paris in July, and her
          rating fell by 9 points. Alice Bellandi of Italy won the −78 kg in Paris and fought nothing for ten months, her rating fell by 36
          points, and in June 2025 she came back and won the World Championships.
        </p>

        <Section id="newcomers">Points punish the young</Section>
        <p className={P}>
          Athletes outside a national team start at the European Cups and the Continental Opens, and they pay for the trips themselves. A
          European Cup carries no senior IJF points at all. Where there are IJF points, they pay for the round reached, never for whom you fought:
          losing in 1/16 to the world number one is worth the same as losing to the number 80. Plenty of athletes spent a
          couple of seasons like this, fighting well, losing to good people and flying home with zero. Most of them stopped.
        </p>
        <p className={P}>
          It works the other way too. On 8 June 2024, seven weeks before Paris, Lasha Bekauri won the −90 kg and Teddy Riner the +100 kg at
          the Madrid European Open: 100 points each, a tenth of a Grand Slam gold and the same 100 as any European Open gold that year. The
          IJF points see the label on the event. The athletes who lost to Riner or Bekauri that day got what they would
          have got for losing to anyone.
        </p>
        <p className={P}>
          AJR asks only whom you beat, who beat you, and how likely that was. Bobur Yangiboyev of Uzbekistan fought his first two Grand Slams
          six weeks apart and went just as far at both: a win in 1/16, a loss in 1/8. In Tbilisi he beat Akhmed Turluev, rated 2033 to his
          1150, with a 4% chance. In Dushanbe he beat a debutant.
        </p>
        <PointsOrStrength />
        <p className={P}>
          The IJF gave him 160 points for each. In AJR the first day took his rating from 1150 to 1612, the second from 1610 to 1641.
        </p>
        <p className={P}>
          A gold is worth what its contests were worth. Amandine Buchard of France won the Dushanbe Grand Slam in May 2025 against four athletes rated 1224 to
          1675: AJR gave her a 90% chance of beating all four. Akhmed Turluev, born in 2006, won the Ljubljana European Open in February 2026,
          his first senior tournament, and began with a win over Muhammed Koc at 8%.
        </p>
        <TwoGolds />
        <p className={P}>
          The IJF gave Buchard 1,000 points and Turluev 100. AJR gave Buchard 12, because it expected every one of those wins, and Turluev 885.
          That is why beating him five weeks later was worth so much to Yangiboyev.
        </p>
        <p className={P}>
          Losses count too. The IJF rating keeps an athlete&apos;s best results and forgets the rest, so a seeded athlete who goes out in
          her first contest at every other event loses nothing. In AJR every loss costs, more the weaker the opponent, and a run of them
          shows on the leaderboard long before it shows in the points.
        </p>

        {/* Part 2: the number and the calculator */}
        <Chapter id="number">How strong an athlete is, how sure the rating can be of it, and what one contest changes.</Chapter>
        <Section id="skill">Skill, uncertainty, rating</Section>
        <p className={P}>
          The <b>skill</b> is the best guess of how strong an athlete is. The <b>RD</b> (rating deviation) represents how unstable the athlete
          is: how far their real strength may be from the skill, up or down. Everyone starts at a skill of 1500 with an RD of 350. Contests
          bring the RD down, to 50 to 80 for a regular, and a long break or results that jump around push it back up.
        </p>
        <p className={P}>
          The rating, the number on every leaderboard, is the skill minus RD: the strength an athlete has proved, not the best guess. Take two
          athletes with a skill of 2000. One fought fifty contests this year and has an RD of 60, so the rating is 1940. The other fought three
          and has an RD of 300, so the rating is 1700. The second may be just as strong, and the leaderboard will show it once the contests do.
        </p>
        <Formula note="A newcomer who wins one big contest has a high skill but a large RD: the rating waits for proof.">Rating = skill − RD</Formula>
        <Section id="calculator">The calculator</Section>
        <p className={P}>
          Before a contest the two ratings give a chance. After it the winner&apos;s rating goes up and the loser&apos;s goes down: a little when the favourite wins, a lot when
          the outsider does, and more for an athlete with a large RD.
        </p>
        <p className={P}>
          The event, the round and how you won do not count: only whom you met and the result. Losing to someone far stronger costs almost
          nothing, losing to someone weaker costs a lot. Winning again and again at the same level brings less each time, as the rating reaches
          that level. Change the numbers and pick the winner. From a contest&apos;s page the calculator opens with that
          contest loaded.
        </p>
        <Suspense fallback={null}>
          <Calculator />
        </Suspense>

        <p className={P}>
          Over a career the two lines look like this, as on every athlete&apos;s page. Here is the longest career in the data, Teddy Riner&apos;s: the skill dashed, the rating solid, the
          uncertainty the band between them.
        </p>
        <RinerCareer />
        <p className={P}>
          The grey band is the RD: narrow while he fights, wider whenever he stops. After the loss to Kageura in February 2020 he fought
          nothing for eleven months, his RD grew from 206 to 226 and his rating went down by 20, until his wins of January 2021 brought it
          back. The hatched stretches marked Inactive are where twelve months had passed since his last contest: there he was out
          of the leaderboards.
        </p>

        <Section id="weights">Weights and leaderboards</Section>
        <p className={P}>
          A leaderboard lists the athletes who fought in the last twelve months. After a year without a contest an athlete leaves the leaderboards, the
          skill is kept, and the next contest brings them back.
        </p>
        <p className={P}>
          Everyone with a contest in the last 12 months stands on at least one leaderboard, usually the one of the weight they fight in. An
          athlete who fought in two weights stands on the leaderboard of each weight where they had three or more tournaments. With fewer
          than three in every weight, they stand on one: the weight of their latest Olympics or championships in those 12 months, and without
          one, the weight they fought most tournaments in.
        </p>
        <TableRule />
        <p className={P}>
          The rating itself is one for all weights. Strong athletes moving up a weight win less than their rating says in their first contests
          there (a top-10 athlete: 84% expected, 72% won), so a move steps the skill once, before the first contest in the new weight: × 0.95
          going up, × 1.05 coming down, however many weights apart. Tato Grigalashvili, world champion at −81 kg, went up to −90 kg in February 2025:
          his skill of 2586 became 2456 before his first contest there, and his rating went down with it. Back at −81 kg two months
          later, the skill went up by 5%.
        </p>
        <TryIt title="Grigalashvili's weight moves">
          <div className="px-4 sm:px-5">
            <WeightMoves />
            <ListingRule />
          </div>
        </TryIt>

        {/* Part 3: the test */}
        <Chapter id="works">A rating is only as good as its forecasts. Every number here is a contest predicted before it was fought.</Chapter>
        <Section id="test">Five models, one test</Section>
        <p className={P}>
          Five models predicted every contest from July 2025 to November 2026 ({data.benchmark.test.toLocaleString("en-US")} of them), each
          before it was fought: a coin, the IJF rating, the classic Elo, the textbook Glicko-2 and AJR. Two scores: accuracy, how often
          the favourite won, and the log loss, which also punishes a confident mistake (lower is better, a coin scores 0.693). AJR and IJF
          first:
        </p>
        <AjrVsIjf />
        <p className={P}>All five:</p>
        <div className="my-8 overflow-x-auto">
          <table className="w-full text-[13px] sm:text-[14px] tabular-nums border-collapse">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-3 font-semibold" />
                {MODELS.map(([key, , short]) => (
                  <th key={key} className={`py-2 px-1.5 sm:px-2 font-semibold text-right ${key === "ours" ? "text-claret" : ""} ${key === "coin" ? COIN : ""}`}>
                    {short}
                  </th>
                ))}
              </tr>
            </thead>
            {SLICES.map(([key, label]) => {
              const s = slice(key);
              const best = (metric: "accuracy" | "log loss") =>
                MODELS.reduce((b, [m]) => (metric === "accuracy" ? Math.max(b, s[m].accuracy) : Math.min(b, s[m]["log loss"])), metric === "accuracy" ? 0 : 9);
              return (
                <tbody key={key}>
                  <tr>
                    <td colSpan={6} className="pt-4 pb-1 text-[12px] font-semibold uppercase tracking-wider text-muted">
                      {label} ({s.n.toLocaleString("en-US")})
                    </td>
                  </tr>
                  {(["accuracy", "log loss"] as const).map((metric) => (
                    <tr key={metric} className="border-b border-rule">
                      <td className="py-1.5 pr-2 sm:pr-3">{metric === "accuracy" ? "Accuracy" : "Log loss"}</td>
                      {MODELS.map(([m]) => {
                        const v = s[m][metric];
                        const top = Math.abs(v - best(metric)) < 5e-4;
                        return (
                          <td key={m} className={`py-1.5 px-1.5 sm:px-2 text-right ${top ? "font-semibold" : ""} ${m === "ours" ? "text-claret" : ""} ${m === "coin" ? COIN : ""}`}>
                            {metric === "accuracy" ? `${(v * 100).toFixed(1)}%` : v.toFixed(3)}
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
        <p className={P}>
          AJR is first on every row but one: in the medal rounds of majors the textbook Glicko-2 picks the winner as often (both{" "}
          {(slice("medal_rounds").ours.accuracy * 100).toFixed(1)}%), though AJR&apos;s chances are better calibrated there. With newcomers, the IJF
          rating beats Elo and Glicko-2, the opposite of what was expected: a newcomer has few points, and that turns out to be a fair sign of a
          newcomer&apos;s level.
        </p>
        <Notes id="test-notes">
          <p className={P}>
            The IJF rating gives points, not chances: its chance is 1 / (1 + (points<sub>B</sub> / points<sub>A</sub>)<sup>k</sup>), with k ={" "}
            {data.benchmark.k} fitted on the months before the test. In {d.n.toLocaleString("en-US")} contests AJR and IJF named
            different favourites, AJR&apos;s won <b>{((d.ours_right / d.n) * 100).toFixed(1)}%</b> of them (an exact McNemar test: p{" "}
            {d.p < 0.001 ? "< 0.001" : d.p.toFixed(3)}). Where IJF could not choose (equal points, often both at 0), it counts as half right, as a coin
            would. Brier scores, by model: {MODELS.map(([k, , short]) => `${short} ${all[k].Brier.toFixed(3)}`).join(", ")}.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-[14px] tabular-nums border-collapse">
              <tbody>
                {PARAMS.map(([k, v]) => (
                  <tr key={k} className="border-b border-rule">
                    <td className="py-1.5 pr-3 text-muted">{k}</td>
                    <td className="py-1.5 text-right">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`${P} text-[14px]`}>
            The chance before a contest: P(A beats B) = 1 / (1 + e<sup>−g × (rating<sub>A</sub> − rating<sub>B</sub>) / 173.72</sup>), with g =
            1 / √(1 + 3φ²/π²) and φ = √(RD<sub>A</sub>² + RD<sub>B</sub>²) / 173.72. The update after it is Glicko-2&apos;s (Glickman, 2013), one
            contest per rating period, the calculator above writes it out with the numbers in.
          </p>
        </Notes>

        <Section id="calibration">How to read a chance</Section>
        <p className={P}>
          A chance should mean what it says: of a hundred contests with a 70% favourite, the favourite should win about seventy. Picking the winner
          often is not enough, a model that says 99% every time it is right and loses one in three is worthless to a coach before a draw.
        </p>
        <Calibration />
        <p className={P}>
          A 95% favourite should still lose one contest in twenty, and does: {top.n - top.won} of {top.n.toLocaleString("en-US")} since July 2025.
          Their winners were mostly new: of the 30 biggest upsets, 19 were won by athletes with fewer than ten senior contests, three of them in
          their first, talented athletes the rating had not met yet. Three more winners came back after over a year away.
        </p>
        <Upsets />
        <TryIt title="Beat the rating">
          <BeatTheModel />
        </TryIt>

        <Section id="one-rd">Why skill minus one RD</Section>
        <p className={P}>
          Textbook Glicko-2 ranks athletes and predicts contests by the skill alone. AJR does both by the skill minus RD. Taking the uncertainty
          off is an old idea: Mark Glickman suggests reading a rating as a range of two RDs either way, and Microsoft&apos;s TrueSkill ranks
          players by the skill minus three RDs. How many RDs to take off, the n below, was chosen here by the results.
        </p>
        <p className={P}>
          With nothing taken off, a debutant with one big win ranks above a regular with dozens of contests. With three RDs, the leaderboards&apos;
          rule until November 2026, newcomers were held down for a year or more. One RD gave the best log loss on the test contests, and the favourite won{" "}
          {(all.ours.accuracy * 100).toFixed(1)}% of them, against {(zero.accuracy * 100).toFixed(1)}% with the bare skill. The n was chosen on
          these same contests. Try the others:
        </p>
        <RdShift />

        <Section id="limits">What it cannot see</Section>
        <ul className="mt-4 list-disc pl-5 space-y-2">
          {LIMITS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className="mt-10 text-[14px] text-muted">
          The code, the data and every prediction behind these numbers:{" "}
          <a href={REPO} className={LINK}>
            the benchmark on GitHub
          </a>
          .
          <br />
          The full rating history:{" "}
          <Link href="/data" className={LINK}>
            Export data
          </Link>
          .
        </p>
      </article>
      <div className="hidden lg:block pt-[48.75px]">
        <ChapterNav />
      </div>
    </div>
  );
}
