// A tournament's pages: the header, the overview, a weight's draw and results.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const tournament = {
  // the titles and descriptions for search engines (generateMetadata)
  meta: {
    title: "{name}: resultados de judo",
    description: "{name}: medallistas de cada peso, medallas por país, las mayores sorpresas y los cambios de rating.",
    weightTitle: "{weight} en el {name}: resultados de judo",
    weightDescription: "{weight} en el {name}.",
    // "…: oro Fawaz M. (FRA), plata …"
    weightDescriptionMedallists: "{weight} en el {name}: {medallists}.",
    medallist: "{medal} {name}",
    medallistOf: "{medal} {name} ({country})",
  },
  // the medals in lower case: the weight page's description, the medal columns' titles
  medal: { gold: "oro", silver: "plata", bronze: "bronce" },
  // "−73 kg": a weight's row, a weight's option
  kg: "{label} kg",
  header: {
    // "7–8 dic 2026": the days of a tournament not over
    dates: "{range} {year}",
    live: "En curso",
    upcoming: "Próximo",
    loading: "Cargando",
  },
  nav: {
    tournaments: "Torneos", // the breadcrumb
    weightCategories: "Categorías de peso",
    all: "Todo", // the overview's tab
    notStarted: "Sin empezar",
  },
  // the tournament page before the IJF publishes the draw
  noDraw: {
    title: "Sorteo aún no publicado",
    lead: "Las probabilidades de medalla aparecen aquí cuando la IJF publica el sorteo, normalmente uno o dos días antes del torneo.",
  },
  // a weight's page before the weight starts
  weightNotStarted: {
    title: "{weight}: sin empezar",
    lead: "Su cuadro, las probabilidades de medalla y los combates aparecen aquí cuando la IJF los publica, normalmente la víspera de la competición.",
  },
  podium: {
    title: "Podio",
    menOrWomen: "Hombres o mujeres",
    prediction: "Podio previsto",
    howItWorks: "Cómo funciona",
    ratingBeforeAfter: "Rating antes → después del torneo",
  },
  nationMedals: {
    title: "Medallas por país",
    allMenOrWomen: "Todo, hombres o mujeres",
    all: "Todo",
    nation: "País",
    total: "Total",
  },
  upsets: {
    title: "Mayores sorpresas",
    all: forms({ one: "La sorpresa", other: "Todas las {n} sorpresas" }),
  },
  gains: {
    title: "Mayores subidas",
    all: "Todos los cambios de rating",
    athlete: "Atleta",
    rating: "Rating",
  },
  // a weight's athletes, their places and their contests
  athletes: {
    title: "Atletas",
    search: "Buscar atleta",
    allNations: "Todos los países",
    allAthletes: "Todos los atletas",
    stillIn: "Siguen",
    placed: "Terminaron",
    sortPlace: "Orden: puesto",
    sortRating: "Orden: rating ↓",
    sortChange: "Orden: +/− ↓",
    sortName: "Orden: nombre",
    place: "Puesto",
    athlete: "Atleta",
    nation: "País",
    winsLosses: "V–D",
    before: "Antes",
    rating: "Rating",
    showContests: "Ver combates",
    contests: "Combates", // the opened row's panel
    noContests: "Todavía sin combates.",
  },
  contests: {
    title: "Combates",
    showAs: "Ver los combates como",
    bracket: "Cuadro",
    list: "Lista",
    athletes: "Atletas",
    chance: "Prob.",
    winLoss: "V/D",
    // the group rows of the stages (several contests each)
    rounds: { BR: "Bronce", "1/2": "1/2 de final", "1/4": "1/4 de final", ofFinal: "{code} de final" },
    noRound: "Combates", // contests whose stage is not known
    upset: "Sorpresa",
    walkover: "Incomparecencia",
    // the letters of a result
    win: "V",
    loss: "D",
    walkoverCode: "WO",
    anUpset: "Una sorpresa",
    walkoverTitle: "Incomparecencia: no combatió",
    // a contest to come, both athletes known
    nextTitle: "Aún sin disputar: las probabilidades de AJR y lo que haría cada resultado",
    // a contest to come, the athletes not known yet
    likelyTitle: "Aún sin decidir: el más probable de cada lado y sus probabilidades entre sí",
    toBeFought: "Por disputar",
    bye: "Exento",
    pool: "Grupo {letter}",
  },
} satisfies typeof en.tournament;
