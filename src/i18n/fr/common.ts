// Words used across the site: months, weights, the stages of a draw, places, counts.

import type { en } from "@/i18n/en";
import { countries } from "@/i18n/fr/countries";
import { forms } from "@/i18n/t";

export const common = {
  // After a day: "5 oct 2026" (lowercase, no dot, four letters at most).
  months: ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"],
  // The month on its own: "mars 2026".
  monthsStandalone: ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"],
  // A place: 1er, 2e, 3e (Intl.PluralRules "fr" ordinal: one for 1, other for the rest).
  ordinal: forms({ one: "{n}er", other: "{n}e" }),
  gender: { men: "Hommes", women: "Femmes", mixed: "Mixte" },
  // "Hommes −73 kg": a table's or a page's weight
  weightTitle: "{gender} {label} kg",
  // The stage of a draw written out (the codes F, 1/2, 1/4, BR, REP, R1 stay as they are).
  rounds: {
    F: "Finale",
    "1/2": "1/2 finale",
    "1/4": "1/4 de finale",
    BR: "Combat pour le bronze",
    REP: "Repêchage",
    ofFinal: "{code} de finale", // "1/8 de finale"
    tour: "Tour {n}", // a tour of a round robin
  },
  ratingGap: "Écart de cote {points} points",
  // The levels of a tournament (lib/levels.ts), by id.
  levels: {
    olympics: "Jeux olympiques",
    worlds: "Championnats du monde",
    continental: "Championnats continentaux",
    masters: "Masters",
    grandSlam: "Grand Slam",
    grandPrix: "Grand Prix",
    opens: "Opens et coupes continentales",
    other: "Autres",
  },
  // Nations by IOC code (fr/countries.ts).
  countries,
  // The results as the database names them.
  results: { gold: "Or", silver: "Argent", bronze: "Bronze", "5th": "5e", "7th": "7e" },
  contests: forms({ one: "{n} combat", other: "{n} combats" }),
  medals: forms({ one: "{n} médaille", other: "{n} médailles" }),
  athletes: forms({ one: "{n} athlète", other: "{n} athlètes" }),
  tournaments: forms({ one: "{n} tournoi", other: "{n} tournois" }),
  nations: forms({ one: "{n} nation", other: "{n} nations" }),
  weeks: forms({ one: "{n} semaine", other: "{n} semaines" }),
  days: forms({ one: "{n} jour", other: "{n} jours" }),
  years: forms({ one: "{n} an", other: "{n} ans" }),
  wins: forms({ one: "{n} victoire", other: "{n} victoires" }),
  losses: forms({ one: "{n} défaite", other: "{n} défaites" }),
  // the records' rows (components/records: a record's noun names one of these)
  titles: forms({ one: "{n} titre", other: "{n} titres" }),
  rivalries: forms({ one: "{n} rivalité", other: "{n} rivalités" }),
  pairs: forms({ one: "{n} paire", other: "{n} paires" }),
} satisfies typeof en.common;
