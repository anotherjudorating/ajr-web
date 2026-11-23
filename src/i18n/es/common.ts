// Words used across the site: months, weights, the stages of a draw, places, counts.

import type { en } from "@/i18n/en";
import { countries } from "@/i18n/es/countries";
import { forms } from "@/i18n/t";

export const common = {
  // Three-letter months, lower case as Spanish writes them: "5 oct 2026".
  months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  // The month on its own: "mar 2026".
  monthsStandalone: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  // A place: "1.º", "2.º" (the RAE's form, one for every number; the noun is puesto).
  ordinal: forms({ other: "{n}.º" }),
  gender: { men: "Hombres", women: "Mujeres", mixed: "Mixto" },
  // "Hombres −73 kg": a table's or a page's weight
  weightTitle: "{gender} {label} kg",
  // The stage of a draw written out (the codes F, 1/2, 1/4, BR, REP, R1 stay as they are).
  rounds: {
    F: "Final",
    "1/2": "1/2 de final",
    "1/4": "1/4 de final",
    BR: "Combate por el bronce",
    REP: "Repesca",
    ofFinal: "{code} de final", // "1/8 de final"
    tour: "Ronda {n}", // a tour of a round robin
  },
  ratingGap: "Diferencia de rating: {points} puntos",
  // The levels of a tournament (lib/levels.ts), by id.
  levels: {
    olympics: "Juegos Olímpicos",
    worlds: "Campeonato del Mundo",
    continental: "Campeonatos continentales",
    masters: "Masters",
    grandSlam: "Grand Slam",
    grandPrix: "Grand Prix",
    opens: "Opens y copas continentales",
    other: "Otros",
  },
  // Nations by IOC code (es/countries.ts).
  countries,
  // The results as the database names them.
  results: { gold: "Oro", silver: "Plata", bronze: "Bronce", "5th": "5.º", "7th": "7.º" },
  contests: forms({ one: "{n} combate", other: "{n} combates" }),
  medals: forms({ one: "{n} medalla", other: "{n} medallas" }),
  athletes: forms({ one: "{n} atleta", other: "{n} atletas" }),
  tournaments: forms({ one: "{n} torneo", other: "{n} torneos" }),
  nations: forms({ one: "{n} país", other: "{n} países" }),
  weeks: forms({ one: "{n} semana", other: "{n} semanas" }),
  days: forms({ one: "{n} día", other: "{n} días" }),
  years: forms({ one: "{n} año", other: "{n} años" }),
  wins: forms({ one: "{n} victoria", other: "{n} victorias" }),
  losses: forms({ one: "{n} derrota", other: "{n} derrotas" }),
  // the records' rows (components/records: a record's noun names one of these)
  titles: forms({ one: "{n} título", other: "{n} títulos" }),
  rivalries: forms({ one: "{n} rivalidad", other: "{n} rivalidades" }),
  pairs: forms({ one: "{n} pareja", other: "{n} parejas" }),
} satisfies typeof en.common;
