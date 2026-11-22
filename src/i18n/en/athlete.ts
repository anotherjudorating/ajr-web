// An athlete's page: the header, the charts, the contests, the lists.

import { forms } from "@/i18n/t";

export const athlete = {
  // The title and the description for search engines (app/[lang]/athletes/[id]/page.tsx).
  meta: {
    title: "{name} judo rating and results",
    // "Hidayat Heydarov (Azerbaijan, born 1997): #1 in men −73 kg with a rating of 2543, peak 2600 in Jul 2024."
    summary: "{name} ({who}): {standing}{peak}.",
    summaryNoWho: "{name}: {standing}{peak}.", // no nation and no year of birth
    born: "born {year}",
    judo: "judo", // the weight is not known: "rated in judo"
    ranked: "#{place} in {where} with a rating of {score}",
    unranked: "rated in {where}, out of the table (no contest in the last year)",
    peak: ", peak {score} in {month}", // after the standing; empty without a peak
  },
  // "−73 kg": a weight tab, a filter's option, the Rank chart's legend
  weightKg: "{weight} kg",
  header: {
    age: forms({ other: "{n} y.o." }),
    rank: "Rank",
    best: "Best",
    peak: "Peak",
    inactive: "Inactive",
    inactiveTitle: "No contest for over a year: out of the tables until the next one",
    tableOfWeek: "The table of that week",
    ijfTitle: "Position in the IJF World Ranking List. ↑ higher in IJF than in AJR, ↓ lower. Opens the athlete's IJF profile.",
    showOnChart: "Show it on the chart",
    // the weeks at #1: the heads of the small table and its rows
    weeks: "Weeks",
    total: "Total",
    longestRun: "Longest run",
    atOne: "At #1",
    p4pAtOne: "P4P #1",
    // the label of a run marked on the Rank chart
    weeksAtOne: forms({ one: "{n} week at #1", other: "{n} weeks at #1" }),
    weeksP4pAtOne: forms({ one: "{n} week at #1 pound for pound", other: "{n} weeks at #1 pound for pound" }),
    weeksTop8: forms({ one: "{n} week in the top 8", other: "{n} weeks in the top 8" }),
    firstAtOne: "First #1, at {age}", // a record's week: the first week at #1, with the age
    currentRating: "Current rating",
    lastRating: "Last rating, {month}", // an inactive athlete's
    change: "Change",
    rating: "Rating",
    days90: "90 days",
    months6: "6 months",
    skill: "skill",
    uncertainty: "uncertainty",
    howItWorks: "How it works",
  },
  chart: {
    rating: "Rating",
    rank: "Rank",
    ratingOrRank: "Rating or rank", // the switch's aria-label
    // the windows of every rating chart (the head-to-head's too)
    ranges: { "1Y": "1Y", "4Y": "4Y", All: "All" },
    peakPeriod: "Peak, {date}", // the peak's point in the tip
    inactive: "Inactive",
    inactiveZone: "No contest for over a year: out of the tables until the next one. The rating holds; its uncertainty grows, so the score drifts down.",
    inactiveLegend: "No contest for over a year: out of the tables",
    skillLabel: "Skill {n}",
    uncertaintyLabel: "−{n} uncertainty",
    ratingLabel: "Rating {n}",
    peakLabel: "Peak {score}",
    peakBefore: "Peak in {month}: show the whole career", // the peak is before the window
    showContests: "Show contests",
    takeMarkOff: "Take the mark off",
    takeMarkOffEsc: "Take the mark off (Esc)",
    // a marked run's label with its months: "12 weeks at #1, Jan 2024 – Mar 2024"
    runInMonth: "{label}, {month}",
    runOverMonths: "{label}, {from} – {to}",
    skill: "Skill",
    uncertainty: "Uncertainty",
    top8: "Top 8",
    // the Rank chart's tip
    weekOf: "Week of {date}",
    placeIn: "#{place} in {weight} kg",
    notInTable: "Not in the {weight} kg table",
    p4pPlace: "P4P #{place}",
    placeP4p: "#{place} pound for pound",
  },
  contests: {
    title: "Contests",
    search: "Search opponent or tournament",
    allYears: "All years",
    weight: "Weight",
    allWeights: "All weights",
    level: "Tournament level",
    allLevels: "All levels",
    // the result filter, by its value ("" is every contest)
    results: { "": "All contests", w: "Wins", l: "Losses", uw: "Upset wins", ul: "Upset losses" },
    sorts: {
      "date-desc": "Sort: date ↓",
      "date-asc": "Sort: date ↑",
      "chance-asc": "Sort: chance ↑",
      "chance-desc": "Sort: chance ↓",
      "gain-desc": "Sort: rating change ↓",
      "gain-asc": "Sort: rating change ↑",
    },
    exportCsv: "Export CSV",
    round: "Round",
    opponent: "Opponent",
    date: "Date",
    opponentRating: "Opp.",
    chance: "Chance",
    result: "Result",
    upset: "Upset",
    win: "W",
    loss: "L",
    theContest: "The contest",
    noMatch: "No contests match these filters.",
    range: "{from}–{to} of {total}", // "1–25 of 112 contests"
    show: "Show",
  },
  lists: {
    bestWins: "Best wins",
    toughestLosses: "Toughest losses",
    all: "All",
    opponentRating: "Opponent's rating before the contest",
    noneYet: "None yet.",
    frequentOpponents: "Frequent opponents",
    noRepeat: "No repeat opponents yet.",
    liveAndUpcoming: "Live and upcoming",
    dates: "Dates",
    tournament: "Tournament",
    gold: "Gold",
    medal: "Medal",
    live: "Live",
  },
  results: {
    title: "Results",
    level: "Level",
    // the medal columns' tooltips
    medals: { gold: "gold", silver: "silver", bronze: "bronze" },
    fifth: "Fifth place",
    seventh: "Seventh place",
    other: "Other",
    otherTitle: "Out earlier, or a result judobase does not give",
    total: "Total",
    totalTitle: "Tournaments entered",
    // the levels too long for one line of a phone, by their id (lib/levels.ts)
    short: {
      worlds: "World Ch.",
      continental: "Continental Ch.",
      opens: "Opens & Cups",
    },
  },
};
