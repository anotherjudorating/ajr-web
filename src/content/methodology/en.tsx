// The methodology's prose in English: the reference every other language follows
// paragraph by paragraph (types.ts). The figures between the paragraphs are the page's
// (app/[lang]/methodology/page.tsx), their labels the dictionary's (i18n/en/methodology.ts).

import Link from "@/components/Link";
import { LIMITS } from "@/components/methodology/facts";

import type { Prose } from "./types";

const LINK = "underline decoration-rule underline-offset-2 hover:decoration-ink";
const REPO = "https://github.com/anotherjudorating/ajr-backend/tree/main/benchmark";

export const en: Prose = {
  meta: {
    title: "How the rating works",
    description:
      "Why Another Judo Rating exists, how a contest moves it and how well it predicts: Paris 2024, IJF points against strength, a calculator, and a test on 24,503 contests against the IJF ranking.",
  },
  title: "How the rating works",
  lead: () => (
    <>
      A rating of every judoka in the IJF judobase, from every senior contest since 2009, about 227 thousand contests. One number per athlete, and it
      answers one question: how likely are you to beat the next person you fight. This page says why it was built, how it is counted, and how well it
      predicts.
    </>
  ),
  why: {
    intro: () => <>Two things started it. The first happened at the Paris Olympics, the second happens every weekend at a European Cup somewhere.</>,
    paris1: () => (
      <>
        On 28 July 2024, at eleven in the morning, the Olympic final of the women&apos;s −52 kg was fought in 1/8. Uta Abe, the Olympic champion of
        Tokyo, met Diyora Keldiyorova of Uzbekistan, who would be Olympic champion by the evening. It was Abe&apos;s second contest of the day.
      </>
    ),
    paris2: () => (
      <>
        Why were they meeting so early? Because the draw goes by the IJF rating, the World Ranking List, and it is a points race. You get points for the
        round you reach at the events the IJF counts, the best six results of the year count in full, the six of the year before at half. The list
        decides who is seeded at the World Championships and the Olympic Games, and so who avoids whom.
      </>
    ),
    paris3: () => (
      <>
        Abe came to Paris as the Olympic champion of Tokyo with four world titles. She had skipped the 2024 World Championships and fought two World
        Tour events in the year before the cut-off, so in the IJF rating she was 10th among the entrants and unseeded. Japanese athletes often do this:
        a few chosen tournaments while others fight a dozen. Keldiyorova had fought the whole season and was seed 1.
      </>
    ),
    paris4: () => (
      <>
        Keldiyorova threw her for ippon after three minutes and won the gold that evening. The problem is the draw. That contest should have been a
        final. It was unfair to Abe, and just as unfair to Keldiyorova. She won, but she had done everything the IJF rating asks and still drew the
        strongest athlete in the weight four contests from a medal, and a loss would have sent her home with nothing. A seeding by strength would have
        kept them apart until the final block.
      </>
    ),
    paris5: () => (
      <>
        A seeding by strength needs a measure of strength, and IJF points cannot be it: they count where an athlete went and how far she got, not whom
        she beat. A measure of strength has to weigh every contest, won or lost, by who stood on the other side, so that two tournaments against the
        best count for as much as a season of easier ones. That is what AJR does.
      </>
    ),
    paris6: (x) => (
      <>
        On the eve of the contest Abe was first on the AJR leaderboard, {x.parisLead} points clear of the next athlete (a #1 stands around 2400, a #10
        around 2050), and Keldiyorova was fifth. AJR gave Abe a {x.abeChance}% chance in their contest. A {x.abeChance}% favourite loses one contest in
        ten, and this was that one.
      </>
    ),
    afterParisDraw: () => <>Here is the same draw seeded both ways, by IJF rating and by AJR rating.</>,
    afterDraw: () => (
      <>
        One draw proves nothing either way, so here is every tournament since the IJF&apos;s archive of its lists begins, March 2025, and one plain
        question for each weight: did the number 1 win? The IJF number 1 won 341 of 1,091 golds, the AJR number 1 won 421. AJR was ahead at every level
        but the European Cups, where IJF was one gold ahead (44 to 43).
      </>
    ),
    afterNumberOne: () => (
      <>
        The IJF rating also forgets: a year off halves an athlete&apos;s points and a second year wipes them out, as if rest made her weaker than
        anyone who kept fighting. A break costs little in AJR. Abe fought nothing between Antalya in March and Paris in July, and her rating fell by 9
        points. Alice Bellandi of Italy won the −78 kg in Paris and fought nothing for ten months, her rating fell by 36 points, and in June 2025 she
        came back and won the World Championships.
      </>
    ),
    newcomers1: () => (
      <>
        Athletes outside a national team start at the European Cups and the Continental Opens, and they pay for the trips themselves. A European Cup
        carries no senior IJF points at all. Where there are IJF points, they pay for the round reached, never for whom you fought: losing in 1/16 to
        the world number one is worth the same as losing to the number 80. Plenty of athletes spent a couple of seasons like this, fighting well,
        losing to good people and flying home with zero. Most of them stopped.
      </>
    ),
    newcomers2: () => (
      <>
        It works the other way too. On 8 June 2024, seven weeks before Paris, Lasha Bekauri won the −90 kg and Teddy Riner the +100 kg at the Madrid
        European Open: 100 points each, a tenth of a Grand Slam gold and the same 100 as any European Open gold that year. The IJF points see the label
        on the event. The athletes who lost to Riner or Bekauri that day got what they would have got for losing to anyone.
      </>
    ),
    newcomers3: () => (
      <>
        AJR asks only whom you beat, who beat you, and how likely that was. Bobur Yangiboyev of Uzbekistan fought his first two Grand Slams six weeks
        apart and went just as far at both: a win in 1/16, a loss in 1/8. In Tbilisi he beat Akhmed Turluev, rated 2033 to his 1150, with a 4% chance.
        In Dushanbe he beat a debutant.
      </>
    ),
    afterPoints: () => <>The IJF gave him 160 points for each. In AJR the first day took his rating from 1150 to 1612, the second from 1610 to 1641.</>,
    goldWorth: () => (
      <>
        A gold is worth what its contests were worth. Amandine Buchard of France won the Dushanbe Grand Slam in May 2025 against four athletes rated
        1224 to 1675: AJR gave her a 90% chance of beating all four. Akhmed Turluev, born in 2006, won the Ljubljana European Open in February 2026,
        his first senior tournament, and began with a win over Muhammed Koc at 8%.
      </>
    ),
    afterTwoGolds: () => (
      <>
        The IJF gave Buchard 1,000 points and Turluev 100. AJR gave Buchard 12, because it expected every one of those wins, and Turluev 885. That is
        why beating him five weeks later was worth so much to Yangiboyev.
      </>
    ),
    losses: () => (
      <>
        Losses count too. The IJF rating keeps an athlete&apos;s best results and forgets the rest, so a seeded athlete who goes out in her first
        contest at every other event loses nothing. In AJR every loss costs, more the weaker the opponent, and a run of them shows on the leaderboard
        long before it shows in the points.
      </>
    ),
  },
  number: {
    intro: () => <>How strong an athlete is, how sure the rating can be of it, and what one contest changes.</>,
    skill1: () => (
      <>
        The <b>skill</b> is the best guess of how strong an athlete is. The <b>RD</b> (rating deviation) represents how unstable the athlete is: how
        far their real strength may be from the skill, up or down. Everyone starts at a skill of 1500 with an RD of 350. Contests bring the RD down, to
        50 to 80 for a regular, and a long break or results that jump around push it back up.
      </>
    ),
    skill2: () => (
      <>
        The rating, the number on every leaderboard, is the skill minus RD: the strength an athlete has proved, not the best guess. Take two athletes
        with a skill of 2000. One fought fifty contests this year and has an RD of 60, so the rating is 1940. The other fought three and has an RD of
        300, so the rating is 1700. The second may be just as strong, and the leaderboard will show it once the contests do.
      </>
    ),
    formula: () => <>Rating = skill − RD</>,
    formulaNote: () => <>A newcomer who wins one big contest has a high skill but a large RD: the rating waits for proof.</>,
    calculator1: () => (
      <>
        Before a contest the two ratings give a chance. After it the winner&apos;s rating goes up and the loser&apos;s goes down: a little when the
        favourite wins, a lot when the outsider does, and more for an athlete with a large RD.
      </>
    ),
    calculator2: () => (
      <>
        The event, the round and how you won do not count: only whom you met and the result. Losing to someone far stronger costs almost nothing, losing
        to someone weaker costs a lot. Winning again and again at the same level brings less each time, as the rating reaches that level. Change the
        numbers and pick the winner. From a contest&apos;s page the calculator opens with that contest loaded.
      </>
    ),
    career: () => (
      <>
        Over a career the two lines look like this, as on every athlete&apos;s page. Here is the longest career in the data, Teddy Riner&apos;s: the
        skill dashed, the rating solid, the uncertainty the band between them.
      </>
    ),
    afterRiner: () => (
      <>
        The grey band is the RD: narrow while he fights, wider whenever he stops. After the loss to Kageura in February 2020 he fought nothing for eleven
        months, his RD grew from 206 to 226 and his rating went down by 20, until his wins of January 2021 brought it back. The hatched stretches marked
        Inactive are where twelve months had passed since his last contest: there he was out of the leaderboards.
      </>
    ),
    weights1: () => (
      <>
        A leaderboard lists the athletes who fought in the last twelve months. After a year without a contest an athlete leaves the leaderboards, the
        skill is kept, and the next contest brings them back.
      </>
    ),
    weights2: () => (
      <>
        Everyone with a contest in the last 12 months stands on at least one leaderboard, usually the one of the weight they fight in. An athlete who
        fought in two weights stands on the leaderboard of each weight where they had three or more tournaments. With fewer than three in every weight,
        they stand on one: the weight of their latest Olympics or championships in those 12 months, and without one, the weight they fought most
        tournaments in.
      </>
    ),
    afterTableRule: () => (
      <>
        The rating itself is one for all weights. Strong athletes moving up a weight win less than their rating says in their first contests there (a
        top-10 athlete: 84% expected, 72% won), so a move steps the skill once, before the first contest in the new weight: × 0.95 going up, × 1.05
        coming down, however many weights apart. Tato Grigalashvili, world champion at −81 kg, went up to −90 kg in February 2025: his skill of 2586
        became 2456 before his first contest there, and his rating went down with it. Back at −81 kg two months later, the skill went up by 5%.
      </>
    ),
    weightMovesTitle: "Grigalashvili's weight moves",
    medals1: () => (
      <>
        The calculator gives the chance of one contest. A tournament is many contests, so the chance of a medal comes from playing the whole
        bracket. Once the IJF publishes a weight&apos;s draw, the day before, the rating job plays the drawn bracket 5,000 times with today&apos;s
        ratings: the contests already decided stay as they were, the rest are fought by the rating&apos;s chances. It saves every athlete&apos;s
        chance of the 1/4, the 1/2, the final, gold and any medal, and for every contest of the bracket who is likely to be in it. During a
        tournament the chances follow every result.
      </>
    ),
    medals2: () => (
      <>
        The brackets are the IJF&apos;s single elimination with repechage from the 1/4. A tournament of another shape, pools of a few athletes,
        gets no chances, and before the draw there are none. On the first day of the Zagreb Grand Prix, 13 November 2026, with Scutto A. (ITA)
        through to the 1/4 at −48 kg, her chance stood at 56% for gold and 95% for a medal: a loser of the 1/4 can still reach bronze through the
        repechage.
      </>
    ),
    p4p: () => (
      <>
        The rating lets one compare athletes of all weights by one measure: how far each stands above their own weight. The ratings themselves
        are not compared, a rating at −60 kg and one at +100 kg were won against different opponents. The rule: the candidates are the top three
        of every weight, each is set against the average rating of the seven best other athletes of the same weight, and the gap between the two
        ranks the pound-for-pound leaderboard. An athlete on two weights&apos; leaderboards counts once, with the bigger gap.
      </>
    ),
    teams: () => (
      <>
        A nation&apos;s rating is the average rating of its best athlete in every weight: seven weights for the men&apos;s or the women&apos;s
        table, all fourteen for the mixed one. A weight where the nation has nobody on the leaderboard counts as that weight&apos;s last place, so a
        nation strong in many weights ranks above one with a single star. The table also counts the weights where a nation has the best athlete
        of all nations and the weights where it is in the top eight.
      </>
    ),
  },
  works: {
    intro: () => <>A rating is only as good as its forecasts. Every number here is a contest predicted before it was fought.</>,
    test: (x) => (
      <>
        Five models predicted every contest from July 2025 to November 2026 ({x.f.number(x.test)} of them), each before it was fought: a coin, the IJF
        rating, the classic Elo, the textbook Glicko-2 and AJR. Two scores: accuracy, how often the favourite won, and the log loss, which also
        punishes a confident mistake (lower is better, a coin scores 0.693). AJR and IJF first:
      </>
    ),
    allFive: () => <>All five:</>,
    afterTable: (x) => (
      <>
        AJR is first on every row but one: in the medal rounds of majors the textbook Glicko-2 picks the winner as often (both{" "}
        {x.pct(x.medalRounds.ours.accuracy)}), though AJR&apos;s chances are better calibrated there. With newcomers, the IJF rating beats Elo and Glicko-2,
        the opposite of what was expected: a newcomer has few points, and that turns out to be a fair sign of a newcomer&apos;s level.
      </>
    ),
    notes: (x) => (
      <>
        The IJF rating gives points, not chances: its chance is 1 / (1 + (points<sub>B</sub> / points<sub>A</sub>)<sup>k</sup>), with k = {x.dec(x.k, 2)}{" "}
        fitted on the months before the test. In {x.f.number(x.disagreements.n)} contests AJR and IJF named different favourites, AJR&apos;s won{" "}
        <b>{x.pct(x.disagreements.ours_right / x.disagreements.n)}</b> of them (an exact McNemar test: p{" "}
        {x.disagreements.p < 0.001 ? `< ${x.dec(0.001, 3)}` : x.dec(x.disagreements.p, 3)}). Where IJF could not choose (equal points, often both at 0),
        it counts as half right, as a coin would. Brier scores, by model: {x.brier}.
      </>
    ),
    notesFormula: () => (
      <>
        The chance before a contest: P(A beats B) = 1 / (1 + e<sup>−g × (rating<sub>A</sub> − rating<sub>B</sub>) / 173.72</sup>), with g = 1 / √(1 +
        3φ²/π²) and φ = √(RD<sub>A</sub>² + RD<sub>B</sub>²) / 173.72. The update after it is Glicko-2&apos;s (Glickman, 2013), one contest per rating
        period, the calculator above writes it out with the numbers in.
      </>
    ),
    calibration: () => (
      <>
        A chance should mean what it says: of a hundred contests with a 70% favourite, the favourite should win about seventy. Picking the winner often
        is not enough, a model that says 99% every time it is right and loses one in three is worthless to a coach before a draw.
      </>
    ),
    afterCalibration: (x) => (
      <>
        A 95% favourite should still lose one contest in twenty, and does: {x.top.n - x.top.won} of {x.f.number(x.top.n)} since July 2025. Their
        winners were mostly new: of the 30 biggest upsets, 19 were won by athletes with fewer than ten senior contests, three of them in their first,
        talented athletes the rating had not met yet. Three more winners came back after over a year away.
      </>
    ),
    beatTitle: "Beat the rating",
    oneRd1: () => (
      <>
        Textbook Glicko-2 ranks athletes and predicts contests by the skill alone. AJR does both by the skill minus RD. Taking the uncertainty off is an
        old idea: Mark Glickman suggests reading a rating as a range of two RDs either way, and Microsoft&apos;s TrueSkill ranks players by the skill
        minus three RDs. How many RDs to take off, the n below, was chosen here by the results.
      </>
    ),
    oneRd2: (x) => (
      <>
        With nothing taken off, a debutant with one big win ranks above a regular with dozens of contests. With three RDs, the leaderboards&apos; rule
        until November 2026, newcomers were held down for a year or more. One RD gave the best log loss on the test contests, and the favourite won{" "}
        {x.pct(x.all.ours.accuracy)} of them, against {x.pct(x.zero.accuracy)} with the bare skill. The n was chosen on these same contests. Try the others:
      </>
    ),
    limits: LIMITS,
    footer: () => (
      <>
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
      </>
    ),
  },
};
