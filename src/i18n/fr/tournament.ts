// A tournament's pages: the header, the overview, a weight's draw and results.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const tournament = {
  // the titles and descriptions for search engines (generateMetadata)
  meta: {
    title: "{name} : résultats judo",
    description: "{name} : les médaillés de chaque catégorie, les médailles par nation, les plus grosses surprises et les variations de cote.",
    weightTitle: "{weight} {name} : résultats judo",
    weightDescription: "{weight} au {name}.",
    // "…: or Fawaz M. (FRA), argent …"
    weightDescriptionMedallists: "{weight} au {name} : {medallists}.",
    medallist: "{medal} {name}",
    medallistOf: "{medal} {name} ({country})",
  },
  // the medals in lower case: the weight page's description, the medal columns' titles
  medal: { gold: "or", silver: "argent", bronze: "bronze" },
  // "−73 kg": a weight's row, a weight's option
  kg: "{label} kg",
  header: {
    // "7–8 déc 2026": the days of a tournament not over
    dates: "{range} {year}",
    live: "En direct",
    upcoming: "À venir",
    loading: "Chargement",
  },
  nav: {
    tournaments: "Tournois", // the breadcrumb
    weightCategories: "Catégories de poids",
    all: "Tout", // the overview's tab
    notStarted: "Pas commencé",
  },
  // the tournament page before the IJF publishes the draw
  noDraw: {
    title: "Tirage au sort pas encore publié",
    lead: "Les chances de médaille apparaissent ici dès que l’IJF publie le tirage au sort, en général un ou deux jours avant le tournoi.",
  },
  // a weight's page before the weight starts
  weightNotStarted: {
    title: "{weight} : pas commencé",
    lead: "Le tableau, les chances de médaille et les combats apparaissent ici dès que l’IJF les publie, en général la veille de la catégorie.",
  },
  podium: {
    title: "Podium",
    menOrWomen: "Hommes ou femmes",
    prediction: "Podium prévu",
    howItWorks: "Comment ça marche",
    ratingBeforeAfter: "Cote avant → après le tournoi",
  },
  nationMedals: {
    title: "Médailles par nation",
    allMenOrWomen: "Tout, hommes ou femmes",
    all: "Tout",
    nation: "Nation",
    total: "Total",
  },
  upsets: {
    title: "Plus grosses surprises",
    all: forms({ one: "La {n} surprise", other: "Les {n} surprises" }),
  },
  gains: {
    title: "Plus fortes hausses",
    all: "Toutes les variations de cote",
    athlete: "Athlète",
    rating: "Cote",
  },
  // a weight's athletes, their places and their contests
  athletes: {
    title: "Athlètes",
    search: "Rechercher un athlète",
    allNations: "Toutes les nations",
    allAthletes: "Tous les athlètes",
    stillIn: "En course",
    placed: "Classés",
    sortPlace: "Tri : place",
    sortRating: "Tri : cote ↓",
    sortChange: "Tri : +/− ↓",
    sortName: "Tri : nom",
    place: "Place",
    athlete: "Athlète",
    nation: "Nat",
    winsLosses: "V–D",
    before: "Avant",
    rating: "Cote",
    showContests: "Voir les combats",
    contests: "Combats", // the opened row's panel
    noContests: "Aucun combat pour l’instant.",
  },
  contests: {
    title: "Combats",
    showAs: "Afficher les combats en",
    bracket: "Tableau",
    list: "Liste",
    athletes: "Athlètes",
    chance: "Chance",
    winLoss: "V/D",
    // the group rows of the stages (several contests each)
    rounds: { BR: "Bronze", "1/2": "1/2 finales", "1/4": "1/4 de finale", ofFinal: "{code} de finale" },
    noRound: "Combats", // contests whose stage is not known
    upset: "Surprise",
    walkover: "Forfait",
    // the letters of a result
    win: "V",
    loss: "D",
    walkoverCode: "WO",
    anUpset: "Une surprise",
    walkoverTitle: "Forfait : n’a pas combattu",
    // a contest to come, both athletes known
    nextTitle: "Pas encore disputé : les chances AJR, et ce que ferait chaque résultat",
    // a contest to come, the athletes not known yet
    likelyTitle: "Pas encore décidé : le plus probable de chaque côté, et leurs chances l’un contre l’autre",
    toBeFought: "À disputer",
    bye: "Exempt",
    pool: "Poule {letter}",
  },
} satisfies typeof en.tournament;
