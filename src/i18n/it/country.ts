// A nation's page.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const country = {
  meta: {
    title: "{name}: rating della squadra di judo e migliori atleti",
    description: "{name} nel judo: i judoka più forti di ogni categoria, i tornei e le medaglie.",
    descriptionPlaced: "{name} nel judo: {place}ª tra le nazioni, i judoka più forti di ogni categoria, i tornei e le medaglie.",
  },
  // the breadcrumbs
  explore: "Esplora",
  nations: "Nazioni",
  // the IJF's continental unions (lib/continents.ts names them by these keys)
  continents: { africa: "Africa", asia: "Asia", europe: "Europa", panAmerica: "Panamerica", oceania: "Oceania" },
  ratedAthletes: forms({ one: "{n} atleta con rating", other: "{n} atleti con rating" }),
  // the medals in lower case: the medal columns' titles
  medal: { gold: "oro", silver: "argento", bronze: "bronzo" },
  // "−73 kg": a weight's option
  kg: "{label} kg",
  header: {
    rank: "Posizione",
    rankMixed: "Ranking nazioni, misto",
    rankMen: "Ranking nazioni, uomini",
    rankWomen: "Ranking nazioni, donne",
    leadersAvg: "Media rating dei leader",
    change: "Variazione",
    rating: "Rating",
    days90: "90 giorni",
    months6: "6 mesi",
    top1: "Top 1",
    top8: "Media top 8",
  },
  chart: {
    title: "Media rating dei leader",
    ranges: { "1Y": "1A", "4Y": "4A", All: "Tutto" },
    today: "Oggi",
    // the drawing's description
    label: "Media rating dei leader, dal {from} al {to}: da {before} a {after}",
    peakTable: "La classifica delle nazioni di quella settimana",
    peakIn: "Picco nel {month}: mostra tutta la storia",
    peak: "Picco {n}",
    showTournaments: "Mostra i tornei",
  },
  leaders: {
    men: "Leader uomini",
    women: "Leader donne",
    weightPicker: "{title}: categoria",
    allWeights: "Tutte le categorie",
    allAthletes: "Tutti gli atleti",
    weight: "Categoria",
    athlete: "Atleta",
    rank: "Pos.",
    worldRank: "Posizione mondiale nella categoria",
    rating: "Rating",
  },
  tournaments: {
    title: "Tornei",
    search: "Cerca torneo",
    allYears: "Tutti gli anni",
    allLevels: "Tutti i livelli",
    sortDateDesc: "Ordina: data ↓",
    sortDateAsc: "Ordina: data ↑",
    sortMedals: "Ordina: medaglie ↓",
    tournament: "Torneo",
    date: "Data",
    total: "Totale",
    noMatches: "Nessun torneo corrisponde a questi filtri.",
  },
} satisfies typeof en.country;
