// A nation's page.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const country = {
  meta: {
    title: "{name}: rating da seleção de judô e melhores atletas",
    description: "{name} no judô: seus judocas mais fortes em cada categoria, seus torneios e medalhas.",
    descriptionPlaced: "{name} no judô: nº {place} entre os países, seus judocas mais fortes em cada categoria, seus torneios e medalhas.",
  },
  // the breadcrumbs
  explore: "Explorar",
  nations: "Países",
  // the IJF's continental unions (lib/continents.ts names them by these keys)
  continents: { africa: "África", asia: "Ásia", europe: "Europa", panAmerica: "Pan-América", oceania: "Oceania" },
  ratedAthletes: forms({ one: "{n} atleta com rating", other: "{n} atletas com rating" }),
  // the medals in lower case: the medal columns' titles
  medal: { gold: "ouro", silver: "prata", bronze: "bronze" },
  // "−73 kg": a weight's option
  kg: "{label} kg",
  header: {
    rank: "Posição",
    rankMixed: "Ranking de países, misto",
    rankMen: "Ranking de países, masculino",
    rankWomen: "Ranking de países, feminino",
    leadersAvg: "Média dos líderes",
    change: "Variação",
    rating: "Rating",
    days90: "90 dias",
    months6: "6 meses",
    top1: "Top 1",
    top8: "Média top 8",
  },
  chart: {
    title: "Média dos líderes",
    ranges: { "1Y": "1A", "4Y": "4A", All: "Tudo" },
    today: "Hoje",
    // the drawing's description
    label: "Média de rating dos líderes, de {from} a {to}: de {before} a {after}",
    peakTable: "A tabela de países daquela semana",
    peakIn: "Pico em {month}: mostrar toda a história",
    peak: "Pico {n}",
    showTournaments: "Mostrar torneios",
  },
  leaders: {
    men: "Líderes masculinos",
    women: "Líderes femininas",
    weightPicker: "{title}: categoria",
    allWeights: "Todas as categorias",
    allAthletes: "Todos os atletas",
    weight: "Categoria",
    athlete: "Atleta",
    rank: "Posição",
    worldRank: "Posição mundial na categoria",
    rating: "Rating",
  },
  tournaments: {
    title: "Torneios",
    search: "Buscar torneio",
    allYears: "Todos os anos",
    allLevels: "Todos os níveis",
    sortDateDesc: "Ordem: data ↓",
    sortDateAsc: "Ordem: data ↑",
    sortMedals: "Ordem: medalhas ↓",
    tournament: "Torneio",
    date: "Data",
    total: "Total",
    noMatches: "Nenhum torneio com esses filtros.",
  },
} satisfies typeof en.country;
