// A tournament's pages: the header, the overview, a weight's draw and results.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const tournament = {
  // the titles and descriptions for search engines (generateMetadata)
  meta: {
    title: "{name}: resultados de judô",
    description: "{name}: medalhistas de cada categoria, medalhas por país, as maiores surpresas e as variações de rating.",
    weightTitle: "{weight} {name}: resultados de judô",
    weightDescription: "{weight} no {name}.",
    // "…: ouro Fawaz M. (FRA), prata …"
    weightDescriptionMedallists: "{weight} no {name}: {medallists}.",
    medallist: "{medal} {name}",
    medallistOf: "{medal} {name} ({country})",
  },
  // the medals in lower case: the weight page's description, the medal columns' titles
  medal: { gold: "ouro", silver: "prata", bronze: "bronze" },
  // "−73 kg": a weight's row, a weight's option
  kg: "{label} kg",
  header: {
    // "7–8 dez 2026": the days of a tournament not over
    dates: "{range} {year}",
    live: "Ao vivo",
    upcoming: "Em breve",
    loading: "Carregando",
  },
  nav: {
    tournaments: "Torneios", // the breadcrumb
    weightCategories: "Categorias",
    all: "Todas", // the overview's tab
    notStarted: "Não começou",
  },
  // the tournament page before the IJF publishes the draw
  noDraw: {
    title: "Sorteio ainda não publicado",
    lead: "As chances de medalha aparecem aqui quando a IJF publica o sorteio, em geral um ou dois dias antes do torneio.",
  },
  // a weight's page before the weight starts
  weightNotStarted: {
    title: "{weight}: ainda não começou",
    lead: "A chave, as chances de medalha e as lutas aparecem aqui quando a IJF as publica, em geral na véspera do dia de luta.",
  },
  podium: {
    title: "Pódio",
    menOrWomen: "Masculino ou feminino",
    prediction: "Previsão do pódio",
    howItWorks: "Como funciona",
    ratingBeforeAfter: "Rating antes → depois do torneio",
  },
  nationMedals: {
    title: "Medalhas por país",
    allMenOrWomen: "Todos, masculino ou feminino",
    all: "Todos",
    nation: "País",
    total: "Total",
  },
  upsets: {
    title: "Maiores surpresas",
    all: forms({ one: "Ver {n} surpresa", other: "Ver todas as {n} surpresas" }),
  },
  gains: {
    title: "Maiores ganhos",
    all: "Todas as variações de rating",
    athlete: "Atleta",
    rating: "Rating",
  },
  // a weight's athletes, their places and their contests
  athletes: {
    title: "Atletas",
    search: "Buscar atleta",
    allNations: "Todos os países",
    allAthletes: "Todos os atletas",
    stillIn: "Na disputa",
    placed: "Classificados",
    sortPlace: "Ordem: lugar",
    sortRating: "Ordem: rating ↓",
    sortChange: "Ordem: +/− ↓",
    sortName: "Ordem: nome",
    place: "Lugar",
    athlete: "Atleta",
    nation: "País",
    winsLosses: "V–D",
    before: "Antes",
    rating: "Rating",
    showContests: "Mostrar lutas",
    contests: "Lutas", // the opened row's panel
    noContests: "Nenhuma luta ainda.",
  },
  contests: {
    title: "Lutas",
    showAs: "Mostrar as lutas como",
    bracket: "Chave",
    list: "Lista",
    athletes: "Atletas",
    chance: "Chance",
    winLoss: "V/D",
    // the group rows of the stages (several contests each)
    rounds: { BR: "Bronze", "1/2": "Semifinais", "1/4": "Quartas de final", ofFinal: "{code} de final" },
    noRound: "Lutas", // contests whose stage is not known
    upset: "Surpresa",
    walkover: "WO",
    // the letters of a result
    win: "V",
    loss: "D",
    walkoverCode: "WO",
    anUpset: "Uma surpresa",
    walkoverTitle: "WO: não lutou",
    // a contest to come, both athletes known
    nextTitle: "Ainda não disputada: as chances do AJR e o que cada resultado faria",
    // a contest to come, the athletes not known yet
    likelyTitle: "Ainda não definida: os mais prováveis de cada lado e as chances entre eles",
    toBeFought: "A disputar",
    bye: "Bye",
    pool: "Grupo {letter}",
  },
} satisfies typeof en.tournament;
