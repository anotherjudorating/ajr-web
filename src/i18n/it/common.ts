// Words used across the site: months, weights, the stages of a draw, places, counts.

import type { en } from "@/i18n/en";
import { countries } from "@/i18n/it/countries";
import { forms } from "@/i18n/t";

export const common = {
  // Three-letter months, lowercase, no dot: "5 ott 2026".
  months: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
  // The month on its own: "mar 2026".
  monthsStandalone: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
  // A place: 1º, 2º, 8º (Italian ordinals have one written form; Intl gives many for 8, 11, 80...).
  ordinal: forms({ many: "{n}º", other: "{n}º" }),
  gender: { men: "Uomini", women: "Donne", mixed: "Misto" },
  // "Uomini −73 kg": a table's or a page's weight
  weightTitle: "{gender} {label} kg",
  // The stage of a draw written out (the codes F, 1/2, 1/4, BR, REP, R1 stay as they are).
  rounds: {
    F: "Finale",
    "1/2": "Semifinale",
    "1/4": "Quarto di finale",
    BR: "Finale per il bronzo",
    REP: "Recuperi",
    ofFinal: "{code} di finale", // "1/8 di finale"
    tour: "Girone, turno {n}", // a tour of a round robin
  },
  ratingGap: "Differenza di rating {points} punti",
  // The levels of a tournament (lib/levels.ts), by id.
  levels: {
    olympics: "Giochi Olimpici",
    worlds: "Campionati del mondo",
    continental: "Campionati continentali",
    masters: "Masters",
    grandSlam: "Grand Slam",
    grandPrix: "Grand Prix",
    opens: "Open e Coppe continentali",
    other: "Altri",
  },
  // Nations' names by IOC code (it/countries.ts).
  countries,
  // The results as the database names them.
  results: { gold: "Oro", silver: "Argento", bronze: "Bronzo", "5th": "5º", "7th": "7º" },
  contests: forms({ one: "{n} incontro", other: "{n} incontri" }),
  medals: forms({ one: "{n} medaglia", other: "{n} medaglie" }),
  athletes: forms({ one: "{n} atleta", other: "{n} atleti" }),
  tournaments: forms({ one: "{n} torneo", other: "{n} tornei" }),
  nations: forms({ one: "{n} nazione", other: "{n} nazioni" }),
  weeks: forms({ one: "{n} settimana", other: "{n} settimane" }),
  days: forms({ one: "{n} giorno", other: "{n} giorni" }),
  years: forms({ one: "{n} anno", other: "{n} anni" }),
  wins: forms({ one: "{n} vittoria", other: "{n} vittorie" }),
  losses: forms({ one: "{n} sconfitta", other: "{n} sconfitte" }),
  // the records' rows (components/records: a record's noun names one of these)
  titles: forms({ one: "{n} titolo", other: "{n} titoli" }),
  rivalries: forms({ one: "{n} rivalità", other: "{n} rivalità" }),
  pairs: forms({ one: "{n} coppia", other: "{n} coppie" }),
} satisfies typeof en.common;
