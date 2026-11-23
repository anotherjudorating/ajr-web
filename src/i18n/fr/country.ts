// A nation's page.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const country = {
  meta: {
    title: "{name} : cote de l’équipe de judo et meilleurs athlètes",
    description: "{name} en judo : ses judokas les plus forts dans chaque catégorie, ses tournois et ses médailles.",
    descriptionPlaced: "{name} en judo : n°{place} des nations, ses judokas les plus forts dans chaque catégorie, ses tournois et ses médailles.",
  },
  // the breadcrumbs
  explore: "Explorer",
  nations: "Nations",
  // the IJF's continental unions (lib/continents.ts names them by these keys)
  continents: { africa: "Afrique", asia: "Asie", europe: "Europe", panAmerica: "Panamérique", oceania: "Océanie" },
  ratedAthletes: forms({ one: "{n} athlète coté", other: "{n} athlètes cotés" }),
  // the medals in lower case: the medal columns' titles
  medal: { gold: "or", silver: "argent", bronze: "bronze" },
  // "−73 kg": a weight's option
  kg: "{label} kg",
  header: {
    rank: "Rang",
    rankMixed: "Classement des nations, mixte",
    rankMen: "Classement des nations, hommes",
    rankWomen: "Classement des nations, femmes",
    leadersAvg: "Cote moyenne des leaders",
    change: "Variation",
    rating: "Cote",
    days90: "90 jours",
    months6: "6 mois",
    top1: "Top 1",
    top8: "Moy. top 8",
  },
  chart: {
    title: "Cote moyenne des leaders",
    ranges: { "1Y": "1 an", "4Y": "4 ans", All: "Tout" },
    today: "Aujourd’hui",
    // the drawing's description
    label: "Cote moyenne des leaders, du {from} au {to} : de {before} à {after}",
    peakTable: "Le classement des nations cette semaine-là",
    peakIn: "Pic en {month} : voir tout l’historique",
    peak: "Pic {n}",
    showTournaments: "Voir les tournois",
  },
  leaders: {
    men: "Leaders hommes",
    women: "Leaders femmes",
    weightPicker: "{title} : catégorie",
    allWeights: "Toutes catégories",
    allAthletes: "Tous les athlètes",
    weight: "Catégorie",
    athlete: "Athlète",
    rank: "Rang",
    worldRank: "Rang mondial dans la catégorie",
    rating: "Cote",
  },
  tournaments: {
    title: "Tournois",
    search: "Rechercher un tournoi",
    allYears: "Toutes les années",
    allLevels: "Tous les niveaux",
    sortDateDesc: "Tri : date ↓",
    sortDateAsc: "Tri : date ↑",
    sortMedals: "Tri : médailles ↓",
    tournament: "Tournoi",
    date: "Date",
    total: "Total",
    noMatches: "Aucun tournoi ne correspond à ces filtres.",
  },
} satisfies typeof en.country;
