// An athlete's page: the header, the charts, the contests, the lists.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const athlete = {
  // The title and the description for search engines (app/[lang]/athletes/[id]/page.tsx).
  meta: {
    title: "{name}: rating e risultati nel judo",
    // "Hidayat Heydarov (Azerbaigian, nato nel 1997): n. 1 nei −73 kg uomini con un rating di 2543, picco 2600 nel lug 2024."
    summary: "{name} ({who}): {standing}{peak}.",
    summaryNoWho: "{name}: {standing}{peak}.", // no nation and no year of birth
    born: "classe {year}",
    judo: "judo", // the weight is not known: "con rating nel judo"
    ranked: "n. {place} in {where} con un rating di {score}",
    unranked: "con rating in {where}, fuori classifica (nessun incontro nell’ultimo anno)",
    peak: ", picco {score} nel {month}", // after the standing; empty without a peak
  },
  // "−73 kg": a weight tab, a filter's option, the Rank chart's legend
  weightKg: "{weight} kg",
  header: {
    age: forms({ other: "{n} anni" }),
    rank: "Pos.",
    best: "Migliore",
    peak: "Picco",
    inactive: "Inattivo",
    inactiveTitle: "Nessun incontro da oltre un anno: fuori dalle classifiche fino al prossimo",
    tableOfWeek: "La classifica di quella settimana",
    ijfTitle: "Posizione nel ranking mondiale IJF. ↑ più in alto nell’IJF che in AJR, ↓ più in basso. Apre il profilo IJF dell’atleta.",
    showOnChart: "Mostra sul grafico",
    // the weeks at #1: the heads of the small table and its rows
    weeks: "Settimane",
    total: "Totale",
    longestRun: "Serie più lunga",
    atOne: "Al n. 1",
    p4pAtOne: "N. 1 P4P",
    // the label of a run marked on the Rank chart
    weeksAtOne: forms({ one: "{n} settimana al n. 1", other: "{n} settimane al n. 1" }),
    weeksP4pAtOne: forms({ one: "{n} settimana al n. 1 pound for pound", other: "{n} settimane al n. 1 pound for pound" }),
    weeksTop8: forms({ one: "{n} settimana nella top 8", other: "{n} settimane nella top 8" }),
    firstAtOne: "Primo n. 1, a {age}", // a record's week: the first week at #1, with the age
    currentRating: "Rating attuale",
    lastRating: "Ultimo rating, {month}", // an inactive athlete's
    change: "Variazione",
    rating: "Rating",
    days90: "90 giorni",
    months6: "6 mesi",
    skill: "forza",
    uncertainty: "incertezza",
    howItWorks: "Come funziona",
  },
  chart: {
    rating: "Rating",
    rank: "Posizione",
    ratingOrRank: "Rating o posizione", // the switch's aria-label
    // the windows of every rating chart (the head-to-head's too)
    ranges: { "1Y": "1A", "4Y": "4A", All: "Tutto" },
    peakPeriod: "Picco, {date}", // the peak's point in the tip
    inactive: "Inattivo",
    inactiveZone: "Nessun incontro da oltre un anno: fuori dalle classifiche fino al prossimo. Il rating resta, la sua incertezza cresce e il punteggio scende piano.",
    inactiveLegend: "Nessun incontro da oltre un anno: fuori dalle classifiche",
    skillLabel: "Forza {n}",
    uncertaintyLabel: "−{n} incertezza",
    ratingLabel: "Rating {n}",
    peakLabel: "Picco {score}",
    peakBefore: "Picco nel {month}: mostra tutta la carriera", // the peak is before the window
    showContests: "Mostra gli incontri",
    takeMarkOff: "Togli il segno",
    takeMarkOffEsc: "Togli il segno (Esc)",
    // a marked run's label with its months: "12 settimane al n. 1, gen 2024 – mar 2024"
    runInMonth: "{label}, {month}",
    runOverMonths: "{label}, {from} – {to}",
    skill: "Forza",
    uncertainty: "Incertezza",
    top8: "Top 8",
    // the Rank chart's tip
    weekOf: "Settimana del {date}",
    placeIn: "N. {place} nei {weight} kg",
    notInTable: "Fuori dalla classifica dei {weight} kg",
    p4pPlace: "N. {place} P4P",
    placeP4p: "N. {place} pound for pound",
  },
  contests: {
    title: "Incontri",
    search: "Cerca avversario o torneo",
    allYears: "Tutti gli anni",
    weight: "Categoria",
    allWeights: "Tutte le categorie",
    level: "Livello del torneo",
    allLevels: "Tutti i livelli",
    // the result filter, by its value ("" is every contest)
    results: { "": "Tutti gli incontri", w: "Vittorie", l: "Sconfitte", uw: "Vittorie a sorpresa", ul: "Sconfitte a sorpresa" },
    sorts: {
      "date-desc": "Ordina: data ↓",
      "date-asc": "Ordina: data ↑",
      "chance-asc": "Ordina: probabilità ↑",
      "chance-desc": "Ordina: probabilità ↓",
      "gain-desc": "Ordina: variazione di rating ↓",
      "gain-asc": "Ordina: variazione di rating ↑",
    },
    exportCsv: "Esporta CSV",
    round: "Turno",
    opponent: "Avversario",
    date: "Data",
    opponentRating: "Avv.",
    chance: "Prob.",
    result: "Esito",
    upset: "Sorpresa",
    win: "V",
    loss: "S",
    theContest: "L’incontro",
    noMatch: "Nessun incontro corrisponde a questi filtri.",
    range: "{from}–{to} di {total}", // "1–25 di 112 incontri"
    show: "Mostra",
  },
  lists: {
    bestWins: "Vittorie migliori",
    toughestLosses: "Sconfitte più pesanti",
    all: "Tutte",
    opponentRating: "Rating dell’avversario prima dell’incontro",
    noneYet: "Ancora nessuna.",
    frequentOpponents: "Avversari frequenti",
    noRepeat: "Nessun avversario incontrato più di una volta.",
    liveAndUpcoming: "In corso e in arrivo",
    dates: "Date",
    tournament: "Torneo",
    gold: "Oro",
    medal: "Medaglia",
    live: "In corso",
  },
  results: {
    title: "Risultati",
    level: "Livello",
    // the medal columns' tooltips
    medals: { gold: "oro", silver: "argento", bronze: "bronzo" },
    fifth: "Quinto posto",
    seventh: "Settimo posto",
    other: "Altro",
    otherTitle: "Eliminazione prima, o un risultato che judobase non dà",
    total: "Totale",
    totalTitle: "Tornei disputati",
    // the levels too long for one line of a phone, by their id (lib/levels.ts)
    short: {
      worlds: "Mondiali",
      continental: "Continentali",
      opens: "Open e Coppe",
    },
  },
} satisfies typeof en.athlete;
