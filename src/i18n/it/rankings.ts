// The rankings: the weights, pound for pound, the nations, their tables and the panel.

import type { en } from "@/i18n/en";

export const rankings = {
  teams: "Nazioni",
  // WeightSwitcher: the small labels before the rows (a language may abbreviate)
  switcher: { men: "Uomini", women: "Donne", teams: "Nazioni" },
  breadcrumb: "Classifiche",
  // "−73 kg": a weight in a list or a column
  weightKg: "{label} kg",
  // the <title> of a past day's table
  pastTitle: "{title} al {date}",
  loading: "Caricamento…",
  // a weight's table (app/[lang]/rankings/[weight])
  weight: {
    title: "Ranking mondiale di judo {weight}",
    strongest: "I judoka più forti nei {weight}",
    strongestOn: "I judoka più forti nei {weight} al {date}",
    description: "{strongest}: {leaders}.",
    descriptionShort: "{strongest}.",
  },
  // pound for pound (app/[lang]/rankings/p4p/[gender])
  p4p: {
    title: "Ranking pound for pound del judo, {gender}",
    description: "I migliori judoka ({gender}) di tutte le categorie: quanto ciascuno sta sopra il resto della sua categoria.",
    breadcrumb: "Pound for pound, {gender}",
  },
  // the nations (app/[lang]/rankings/teams/[kind])
  nations: {
    title: "Ranking delle nazioni nel judo, {who}",
    who: { men: "uomini", women: "donne", mixed: "uomini e donne" },
    description: "Quale paese ha la squadra di judo più forte: ogni nazione valutata dal suo miglior atleta in ogni categoria.",
    descriptionTop: "{description} {top}.",
    breadcrumb: "Nazioni, {gender}",
  },
  // TableParts: the toolbar over a table and the pages under it
  toolbar: {
    searchAthlete: "Cerca atleta",
    searchNation: "Cerca nazione",
    allCountries: "Tutti i paesi",
    asOf: "Classifica a questa data",
    exportCsv: "Esporta CSV",
  },
  pagination: {
    range: "{from}–{to} di {count}", // "1–50 di 625 atleti"
    show: "Mostra",
  },
  sorts: {
    ratingDesc: "Ordina: rating ↓",
    ratingAsc: "Ordina: rating ↑",
    d90Desc: "Ordina: +/− 90 giorni ↓",
    d90Asc: "Ordina: +/− 90 giorni ↑",
    d6mDesc: "Ordina: +/− 6 mesi ↓",
    d6mAsc: "Ordina: +/− 6 mesi ↑",
    ledDesc: "Ordina: top 1 ↓",
    top8Desc: "Ordina: top 8 ↓",
    leadDesc: "Ordina: margine ↓",
    leadAsc: "Ordina: margine ↑",
  },
  // the tables' header cells
  columns: {
    athlete: "Atleta",
    nat: "NAZ",
    country: "Paese",
    weight: "Categoria",
    rating: "Rating",
    age: "Età",
    last: "Ultimo",
    trend: "Trend",
    d90: "90g",
    m6: "6m",
    change6m: "+/- 6m",
    lead: "Margine",
    nation: "Nazione",
    top1: "Top 1",
    top8: "Top 8",
    leadersAvg: "Media leader",
    leadersRatingAvg: "Media rating dei leader",
  },
  // what the header cells say on hover
  tips: {
    rank90: "Variazione di posizione, ultimi 90 giorni",
    rating90: "Variazione di rating, ultimi 90 giorni",
    rank6m: "Variazione di posizione, ultimi 182 giorni",
    rating6m: "Variazione di rating, ultimi 182 giorni",
    ijf: "Posizione nel ranking mondiale IJF",
    ijfDifference: "Posizione IJF rispetto a quella AJR: ↓ più in basso nell’IJF, ↑ più in alto",
    lead: "Punti di vantaggio sulla media dei 7 successivi della stessa categoria",
    top1: "Categorie in cui la nazione ha il miglior atleta di tutte le nazioni",
    top8: "Categorie in cui il miglior atleta della nazione è tra le 8 nazioni migliori",
    leadersAvg:
      "Rating medio del miglior atleta della nazione in ciascuna delle {weights} categorie, una categoria senza atleti conta come l’ultimo posto di quella classifica",
  },
  // the rating cell's tip: how the shown rating is made
  score: {
    glicko: "Rating Glicko-2",
    minusRd: "− RD ({rd})",
  },
  showLast90: "Mostra gli ultimi 90 giorni",
  noAthletes: "Nessun atleta corrisponde a questi filtri.",
  noNations: "Nessuna nazione corrisponde a questi filtri.",
  // Changes: an athlete not in the table back then
  changes: {
    new: "NEW",
    returning: "RE",
  },
  // AthletePanel: the expanded row
  panel: {
    ijf: "Ranking mondiale IJF",
    last90: "Ultimi 90 giorni",
    failed: "Impossibile caricare gli incontri.",
    none: "Nessun incontro negli ultimi 90 giorni.",
    upset: "Sorpresa",
    won: "V",
    lost: "S",
    contest: "L’incontro",
  },
  // Medal: the aria-label
  medal: {
    gold: "oro",
    silver: "argento",
    bronze: "bronzo",
    predicted: "{kind} previsto",
  },
  // chart.tsx: the names of a line's points and its tips
  chart: {
    today: "Oggi",
    weekOf: "Settimana del {date}",
    quarter: "T{n} {year}",
    inactive: "inattivo",
    rank: "Posizione",
    peak: "Picco {score}",
  },
} satisfies typeof en.rankings;
