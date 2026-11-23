// A nation's page.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const country = {
  meta: {
    title: "{name}: rating del equipo de judo y mejores atletas",
    description: "{name} en el judo: sus judocas más fuertes en cada peso, sus torneos y sus medallas.",
    descriptionPlaced: "{name} en el judo: n.º {place} entre los países, sus judocas más fuertes en cada peso, sus torneos y sus medallas.",
  },
  // the breadcrumbs
  explore: "Explorar",
  nations: "Países",
  // the IJF's continental unions (lib/continents.ts names them by these keys)
  continents: { africa: "África", asia: "Asia", europe: "Europa", panAmerica: "Panamérica", oceania: "Oceanía" },
  ratedAthletes: forms({ one: "{n} atleta con rating", other: "{n} atletas con rating" }),
  // the medals in lower case: the medal columns' titles
  medal: { gold: "oro", silver: "plata", bronze: "bronce" },
  // "−73 kg": a weight's option
  kg: "{label} kg",
  header: {
    rank: "Puesto",
    rankMixed: "Ranking de países, mixto",
    rankMen: "Ranking de países, hombres",
    rankWomen: "Ranking de países, mujeres",
    leadersAvg: "Media de rating de los líderes",
    change: "Cambio",
    rating: "Rating",
    days90: "90 días",
    months6: "6 meses",
    top1: "Top 1",
    top8: "Media top 8",
  },
  chart: {
    title: "Media de rating de los líderes",
    ranges: { "1Y": "1A", "4Y": "4A", All: "Todo" },
    today: "Hoy",
    // the drawing's description
    label: "Media de rating de los líderes, de {from} a {to}: de {before} a {after}",
    peakTable: "La tabla de países de esa semana",
    peakIn: "Máximo en {month}: ver toda la historia",
    peak: "Máximo {n}",
    showTournaments: "Ver torneos",
  },
  leaders: {
    men: "Líderes masculinos",
    women: "Líderes femeninas",
    weightPicker: "{title}: peso",
    allWeights: "Todos los pesos",
    allAthletes: "Todos los atletas",
    weight: "Peso",
    athlete: "Atleta",
    rank: "Puesto",
    worldRank: "Puesto mundial en el peso",
    rating: "Rating",
  },
  tournaments: {
    title: "Torneos",
    search: "Buscar torneo",
    allYears: "Todos los años",
    allLevels: "Todos los niveles",
    sortDateDesc: "Orden: fecha ↓",
    sortDateAsc: "Orden: fecha ↑",
    sortMedals: "Orden: medallas ↓",
    tournament: "Torneo",
    date: "Fecha",
    total: "Total",
    noMatches: "Ningún torneo coincide con estos filtros.",
  },
} satisfies typeof en.country;
