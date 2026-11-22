// Words used across the site: months, weights, the stages of a draw, places, counts.

import { forms } from "@/i18n/t";

export const common = {
  // Three-letter months everywhere ("Sep", while en-GB writes "Sept").
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  // A place: 1st, 2nd, 3rd, 4th (Intl.PluralRules with type "ordinal" picks the form).
  ordinal: forms({ one: "{n}st", two: "{n}nd", few: "{n}rd", other: "{n}th" }),
  gender: { men: "Men", women: "Women", mixed: "Mixed" },
  // "Men −73 kg": a table's or a page's weight
  weightTitle: "{gender} {label} kg",
  // The stage of a draw written out (the codes F, 1/2, 1/4, BR, REP, R1 stay as they are).
  rounds: {
    F: "Final",
    "1/2": "Semi-final",
    "1/4": "Quarter-final",
    BR: "Bronze medal contest",
    REP: "Repechage",
    ofFinal: "{code} final", // "1/8 final"
    tour: "Round {n}", // a tour of a round robin
  },
  // The results as the database names them.
  results: { gold: "Gold", silver: "Silver", bronze: "Bronze", "5th": "5th", "7th": "7th" },
  contests: forms({ one: "{n} contest", other: "{n} contests" }),
  medals: forms({ one: "{n} medal", other: "{n} medals" }),
  athletes: forms({ one: "{n} athlete", other: "{n} athletes" }),
  tournaments: forms({ one: "{n} tournament", other: "{n} tournaments" }),
  nations: forms({ one: "{n} nation", other: "{n} nations" }),
  weeks: forms({ one: "{n} week", other: "{n} weeks" }),
  days: forms({ one: "{n} day", other: "{n} days" }),
  years: forms({ one: "{n} year", other: "{n} years" }),
  wins: forms({ one: "{n} win", other: "{n} wins" }),
  losses: forms({ one: "{n} loss", other: "{n} losses" }),
};
