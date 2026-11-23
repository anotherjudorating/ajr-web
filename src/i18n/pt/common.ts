// Words used across the site: months, weights, the stages of a draw, places, counts.

import type { en } from "@/i18n/en";
import { countries } from "@/i18n/pt/countries";
import { forms } from "@/i18n/t";

export const common = {
  // Three letters, lower case, no dot: "5 out 2026".
  months: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  // The month on its own: "mar 2026".
  monthsStandalone: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  // A place: "1º", "2º", "11º" (Portuguese ordinals have one form).
  ordinal: forms({ other: "{n}º" }),
  gender: { men: "Masculino", women: "Feminino", mixed: "Misto" },
  // "Masculino −73 kg": a table's or a page's weight
  weightTitle: "{gender} {label} kg",
  // The stage of a draw written out (the codes F, 1/2, 1/4, BR, REP, R1 stay as they are).
  rounds: {
    F: "Final",
    "1/2": "Semifinal",
    "1/4": "Quartas de final",
    BR: "Luta pelo bronze",
    REP: "Repescagem",
    ofFinal: "{code} de final", // "1/8 de final"
    tour: "Rodada {n}", // a tour of a round robin
  },
  ratingGap: "Diferença de rating {points} pontos",
  // The levels of a tournament (lib/levels.ts), by id.
  levels: {
    olympics: "Jogos Olímpicos",
    worlds: "Campeonato Mundial",
    continental: "Campeonatos continentais",
    masters: "Masters",
    grandSlam: "Grand Slam",
    grandPrix: "Grand Prix",
    opens: "Opens e Copas continentais",
    other: "Outros",
  },
  // Nations by IOC code (pt/countries.ts).
  countries,
  // The results as the database names them.
  results: { gold: "Ouro", silver: "Prata", bronze: "Bronze", "5th": "5º", "7th": "7º" },
  contests: forms({ one: "{n} luta", other: "{n} lutas" }),
  medals: forms({ one: "{n} medalha", other: "{n} medalhas" }),
  athletes: forms({ one: "{n} atleta", other: "{n} atletas" }),
  tournaments: forms({ one: "{n} torneio", other: "{n} torneios" }),
  nations: forms({ one: "{n} país", other: "{n} países" }),
  weeks: forms({ one: "{n} semana", other: "{n} semanas" }),
  days: forms({ one: "{n} dia", other: "{n} dias" }),
  years: forms({ one: "{n} ano", other: "{n} anos" }),
  wins: forms({ one: "{n} vitória", other: "{n} vitórias" }),
  losses: forms({ one: "{n} derrota", other: "{n} derrotas" }),
  // the records' rows (components/records: a record's noun names one of these)
  titles: forms({ one: "{n} título", other: "{n} títulos" }),
  rivalries: forms({ one: "{n} rivalidade", other: "{n} rivalidades" }),
  pairs: forms({ one: "{n} dupla", other: "{n} duplas" }),
} satisfies typeof en.common;
