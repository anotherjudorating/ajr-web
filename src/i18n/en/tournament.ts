// A tournament's pages: the header, the overview, a weight's draw and results.

import { forms } from "@/i18n/t";

export const tournament = {
  // the titles and descriptions for search engines (generateMetadata)
  meta: {
    title: "{name} judo results",
    description: "{name}: medallists of every weight, medals by nation, the biggest upsets and rating changes.",
    weightTitle: "{weight} {name} judo results",
    weightDescription: "{weight} at the {name}.",
    // "…: gold Fawaz M. (FRA), silver …"
    weightDescriptionMedallists: "{weight} at the {name}: {medallists}.",
    medallist: "{medal} {name}",
    medallistOf: "{medal} {name} ({country})",
  },
  // the medals in lower case: the weight page's description, the medal columns' titles
  medal: { gold: "gold", silver: "silver", bronze: "bronze" },
  // "−73 kg": a weight's row, a weight's option
  kg: "{label} kg",
  header: {
    // "7–8 Dec 2026": the days of a tournament not over
    dates: "{range} {year}",
    live: "Live",
    upcoming: "Upcoming",
    loading: "Loading",
  },
  nav: {
    tournaments: "Tournaments", // the breadcrumb
    weightCategories: "Weight categories",
    all: "All", // the overview's tab
    notStarted: "Not started",
  },
  // the tournament page before the IJF publishes the draw
  noDraw: {
    title: "Draw not published yet",
    lead: "Medal chances appear here once the IJF publishes the draw, usually a day or two before the tournament.",
  },
  // a weight's page before the weight starts
  weightNotStarted: {
    title: "{weight}: not started",
    lead: "Its draw, medal chances and contests appear here once the IJF publishes them, usually the day before it is fought.",
  },
  podium: {
    title: "Podium",
    menOrWomen: "Men or women",
    prediction: "Podium prediction",
    howItWorks: "How it works",
    ratingBeforeAfter: "Rating before → after the tournament",
  },
  nationMedals: {
    title: "Medals by nation",
    allMenOrWomen: "All, men or women",
    all: "All",
    nation: "Nation",
    total: "Total",
  },
  upsets: {
    title: "Biggest upsets",
    all: forms({ one: "All {n} upset", other: "All {n} upsets" }),
  },
  gains: {
    title: "Biggest gains",
    all: "All rating changes",
    athlete: "Athlete",
    rating: "Rating",
  },
  // a weight's athletes, their places and their contests
  athletes: {
    title: "Athletes",
    search: "Search athlete",
    allNations: "All nations",
    allAthletes: "All athletes",
    stillIn: "Still in",
    placed: "Placed",
    sortPlace: "Sort: place",
    sortRating: "Sort: rating ↓",
    sortChange: "Sort: +/− ↓",
    sortName: "Sort: name",
    place: "Place",
    athlete: "Athlete",
    nation: "Nat",
    winsLosses: "W–L",
    before: "Before",
    rating: "Rating",
    showContests: "Show contests",
    contests: "Contests", // the opened row's panel
    noContests: "No contests yet.",
  },
  contests: {
    title: "Contests",
    showAs: "Show the contests as",
    bracket: "Bracket",
    list: "List",
    athletes: "Athletes",
    chance: "Chance",
    winLoss: "W/L",
    // the group rows of the stages (several contests each)
    rounds: { BR: "Bronze medal", "1/2": "Semi-finals", "1/4": "Quarter-finals", ofFinal: "{code} finals" },
    noRound: "Contests", // contests whose stage is not known
    upset: "Upset",
    walkover: "Walkover",
    // the letters of a result
    win: "W",
    loss: "L",
    walkoverCode: "WO",
    anUpset: "An upset",
    walkoverTitle: "Walkover: did not fight",
    // a contest to come, both athletes known
    nextTitle: "Not fought yet: our chances; what each result would do",
    // a contest to come, the athletes not known yet
    likelyTitle: "Not decided yet: the likeliest of each side, and their chances against each other",
    toBeFought: "To be fought",
    bye: "Bye",
    pool: "Pool {letter}",
  },
};
