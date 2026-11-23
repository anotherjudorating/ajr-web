// A nation's page.

import { forms } from "@/i18n/t";

export const country = {
  meta: {
    title: "{name} judo team rating and best athletes",
    description: "{name} in judo: its strongest judoka in every weight, its tournaments and medals.",
    descriptionPlaced: "{name} in judo: #{place} among the nations, its strongest judoka in every weight, its tournaments and medals.",
  },
  // the breadcrumbs
  explore: "Explore",
  nations: "Nations",
  // the IJF's continental unions (lib/continents.ts names them by these keys)
  continents: { africa: "Africa", asia: "Asia", europe: "Europe", panAmerica: "Pan America", oceania: "Oceania" },
  ratedAthletes: forms({ one: "{n} rated athlete", other: "{n} rated athletes" }),
  // the medals in lower case: the medal columns' titles
  medal: { gold: "gold", silver: "silver", bronze: "bronze" },
  // "−73 kg": a weight's option
  kg: "{label} kg",
  header: {
    rank: "Rank",
    rankMixed: "Nations ranking, mixed",
    rankMen: "Nations ranking, men",
    rankWomen: "Nations ranking, women",
    leadersAvg: "Leaders rating avg",
    change: "Change",
    rating: "Rating",
    days90: "90 days",
    months6: "6 months",
    top1: "Top 1",
    top8: "Top 8 avg",
  },
  chart: {
    title: "Leaders rating avg",
    ranges: { "1Y": "1Y", "4Y": "4Y", All: "All" },
    today: "Today",
    // the drawing's description
    label: "Leaders rating average, {from} to {to}: {before} to {after}",
    peakTable: "The nations' table of that week",
    peakIn: "Peak in {month}: show the whole history",
    peak: "Peak {n}",
    showTournaments: "Show tournaments",
  },
  leaders: {
    men: "Men leaders",
    women: "Women leaders",
    weightPicker: "{title}: weight",
    allWeights: "All weights",
    allAthletes: "All athletes",
    weight: "Weight",
    athlete: "Athlete",
    rank: "Rank",
    worldRank: "World rank in the weight",
    rating: "Rating",
  },
  tournaments: {
    title: "Tournaments",
    search: "Search tournament",
    allYears: "All years",
    allLevels: "All levels",
    sortDateDesc: "Sort: date ↓",
    sortDateAsc: "Sort: date ↑",
    sortMedals: "Sort: medals ↓",
    tournament: "Tournament",
    date: "Date",
    total: "Total",
    noMatches: "No tournaments match these filters.",
  },
};
