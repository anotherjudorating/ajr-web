// A contest's page.

import type { en } from "@/i18n/en";

export const contest = {
  meta: {
    names: "{white} vs {blue}",
    title: "{names}: {round}, {competition}",
    noRound: "incontro", // a contest whose stage is not known
  },
  tournaments: "Tornei", // the breadcrumb
  contest: "Incontro", // the breadcrumb's last step when the stage is not known
  heading: "{white} vs {blue}: {round}, {weight}, {competition}",
  result: {
    title: "Esito dell’incontro",
    athlete: "Atleta",
    // the scores: ippon, waza-ari, yuko
    ippon: "I",
    wazaari: "W",
    yuko: "Y",
    shido: "Shido",
    result: "Esito",
    win: "Vittoria",
    notFoughtYet: "Non ancora disputato",
    walkover: "Forfait",
    notRated: "senza rating",
    time: "Tempo",
    goldenScore: "GS",
  },
  walkover: {
    title: "Variazione di rating",
    howRatingsWork: "Come funziona il rating",
    fusen: "Vittoria per forfait: {name} non si è presentato (fusen-gachi).",
    nothingFought: "Vittoria per forfait: nessun incontro, niente cronometro e niente punteggio.",
    noChange: "Una vittoria senza combattere non dice nulla su chi è più forte, quindi non cambia nessuno dei due rating.",
  },
  ratingChange: {
    title: "Variazione di rating",
    ifWins: "Se vince questo atleta",
    wins: "Vince {name}", // the button that picks the winner of a contest to come
    howRatingsWork: "Come funziona il rating",
    athlete: "Atleta",
    chance: "Probabilità",
    skill: "Forza",
    rd: "RD",
    rating: "Rating",
    formula: "Rating = forza − RD. RD più basso, rating più alto.",
    picked: "Non ancora disputato: che effetto avrebbe l’esito scelto.",
  },
  road: {
    title: "Il cammino verso l’incontro: {round}", // the stage in lower case
    titleContest: "Il cammino verso l’incontro",
    first: "Primo incontro del torneo.",
    upset: "Sorpresa",
    theContest: "L’incontro",
  },
  meetings: {
    title: "Precedenti",
    level: "Pari {white}–{blue}",
    leads: "{name} conduce {more}–{fewer}",
    headToHead: "Testa a testa",
    first: "Il loro primo incontro.",
    firstBefore: "Il loro primo incontro: nessun precedente.",
  },
} satisfies typeof en.contest;
