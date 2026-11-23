// A tournament's pages: the header, the overview, a weight's draw and results.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const tournament = {
  // the titles and descriptions for search engines (generateMetadata)
  meta: {
    title: "{name}: risultati di judo",
    description: "{name}: i medagliati di ogni categoria, le medaglie per nazione, le sorprese più grandi e le variazioni di rating.",
    weightTitle: "{weight} {name}: risultati di judo",
    weightDescription: "I {weight} al {name}.",
    // "…: oro Fawaz M. (FRA), argento …"
    weightDescriptionMedallists: "I {weight} al {name}: {medallists}.",
    medallist: "{medal} {name}",
    medallistOf: "{medal} {name} ({country})",
  },
  // the medals in lower case: the weight page's description, the medal columns' titles
  medal: { gold: "oro", silver: "argento", bronze: "bronzo" },
  // "−73 kg": a weight's row, a weight's option
  kg: "{label} kg",
  header: {
    // "7–8 dic 2026": the days of a tournament not over
    dates: "{range} {year}",
    live: "In corso",
    upcoming: "In arrivo",
    loading: "Caricamento",
  },
  nav: {
    tournaments: "Tornei", // the breadcrumb
    weightCategories: "Categorie di peso",
    all: "Tutte", // the overview's tab
    notStarted: "Non iniziata",
  },
  // the tournament page before the IJF publishes the draw
  noDraw: {
    title: "Sorteggio non ancora pubblicato",
    lead: "Le probabilità di medaglia compaiono qui quando l’IJF pubblica il sorteggio, di solito uno o due giorni prima del torneo.",
  },
  // a weight's page before the weight starts
  weightNotStarted: {
    title: "{weight}: non ancora iniziata",
    lead: "Tabellone, probabilità di medaglia e incontri compaiono qui quando l’IJF li pubblica, di solito il giorno prima della gara.",
  },
  podium: {
    title: "Podio",
    menOrWomen: "Uomini o donne",
    prediction: "Podio previsto",
    howItWorks: "Come funziona",
    ratingBeforeAfter: "Rating prima → dopo il torneo",
  },
  nationMedals: {
    title: "Medaglie per nazione",
    allMenOrWomen: "Tutti, uomini o donne",
    all: "Tutti",
    nation: "Nazione",
    total: "Totale",
  },
  upsets: {
    title: "Sorprese più grandi",
    all: forms({ one: "Tutte le sorprese: {n}", other: "Tutte le {n} sorprese" }),
  },
  gains: {
    title: "Guadagni più grandi",
    all: "Tutte le variazioni di rating",
    athlete: "Atleta",
    rating: "Rating",
  },
  // a weight's athletes, their places and their contests
  athletes: {
    title: "Atleti",
    search: "Cerca atleta",
    allNations: "Tutte le nazioni",
    allAthletes: "Tutti gli atleti",
    stillIn: "In gara",
    placed: "Classificati",
    sortPlace: "Ordina: posto",
    sortRating: "Ordina: rating ↓",
    sortChange: "Ordina: +/− ↓",
    sortName: "Ordina: nome",
    place: "Posto",
    athlete: "Atleta",
    nation: "Naz",
    winsLosses: "V–S",
    before: "Prima",
    rating: "Rating",
    showContests: "Mostra gli incontri",
    contests: "Incontri", // the opened row's panel
    noContests: "Ancora nessun incontro.",
  },
  contests: {
    title: "Incontri",
    showAs: "Mostra gli incontri come",
    bracket: "Tabellone",
    list: "Elenco",
    athletes: "Atleti",
    chance: "Prob.",
    winLoss: "V/S",
    // the group rows of the stages (several contests each)
    rounds: { BR: "Finali per il bronzo", "1/2": "Semifinali", "1/4": "Quarti di finale", ofFinal: "{code} di finale" },
    noRound: "Incontri", // contests whose stage is not known
    upset: "Sorpresa",
    walkover: "Forfait",
    // the letters of a result
    win: "V",
    loss: "S",
    walkoverCode: "WO",
    anUpset: "Una sorpresa",
    walkoverTitle: "Forfait: non ha combattuto",
    // a contest to come, both athletes known
    nextTitle: "Non ancora disputato: le probabilità AJR e che effetto avrebbe ciascun esito",
    // a contest to come, the athletes not known yet
    likelyTitle: "Non ancora deciso: i più probabili di ciascun lato e le loro probabilità l’uno contro l’altro",
    toBeFought: "Da disputare",
    bye: "Bye",
    pool: "Pool {letter}",
  },
} satisfies typeof en.tournament;
