// Explore: the lists of athletes, contests, tournaments and nations, and their filters.

import type { en } from "@/i18n/en";

export const explore = {
  // The tabs over every list (components/explore/ExploreTabs.tsx).
  tabs: {
    label: "Explorar",
    tournaments: "Torneios",
    athletes: "Atletas",
    contests: "Lutas",
    nations: "Países",
  },
  // The parts of the toolbars (components/explore/Controls.tsx).
  controls: {
    exportCsv: "Baixar CSV",
  },
  // Filters that several lists share.
  filters: {
    searchAthlete: "Buscar atleta",
    allWeights: "Todas as categorias",
    allTournaments: "Todos os torneios",
  },
  tournaments: {
    meta: {
      title: "Resultados de torneios de judô",
      description:
        "Todos os torneios do World Tour de judô desde 2009: Olimpíadas, Mundiais, Grand Slams e Grand Prix, com resultados, surpresas e a frequência com que o favorito venceu.",
    },
    title: "Torneios",
    lead: "Todos os torneios com rating e com que frequência o favorito venceu.",
    search: "Buscar torneio ou cidade",
    // The levels (the values are the backend's rank names).
    levels: {
      all: "Todos os níveis",
      olympics: "Jogos Olímpicos",
      worlds: "Campeonato Mundial",
      masters: "Masters",
      grandSlam: "Grand Slam",
      grandPrix: "Grand Prix",
      continental: "Continental",
    },
    sort: {
      "date-desc": "Ordem: data ↓",
      "date-asc": "Ordem: data ↑",
      "accuracy-desc": "Ordem: acerto do rating ↓",
      "accuracy-asc": "Ordem: acerto do rating ↑",
      "upsets-desc": "Ordem: surpresas ↓",
      "upsets-asc": "Ordem: surpresas ↑",
    },
    columns: {
      dates: "Datas",
      tournament: "Torneio",
      location: "Local",
      accuracy: "Acerto do rating",
      upsets: "Surpresas",
    },
    // The month rows that group the year's tournaments: "janeiro 2026".
    months: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
    monthHeading: "{month} de {year}",
    // The chips of a tournament not over yet.
    upcoming: "Em breve",
    live: "Ao vivo",
    accuracyTip: "Lutas vencidas pelo favorito do rating, de {contests}",
    empty: "Nenhum torneio com esses filtros.",
  },
  athletes: {
    meta: {
      title: "Todos os judocas com rating, busca por nome, país e categoria",
      description: "Todos os judocas com rating desde 2009: busque por nome, filtre por país e categoria, ordene por rating, nome ou idade.",
    },
    title: "Atletas",
    lead: "Todos os atletas com rating, ativos ou não.",
    allCountries: "Todos os países",
    menAllWeights: "Masculino, todas as categorias",
    womenAllWeights: "Feminino, todas as categorias",
    sort: {
      "name-asc": "Ordem: nome ↑",
      "name-desc": "Ordem: nome ↓",
      "age-asc": "Ordem: idade ↑",
      "age-desc": "Ordem: idade ↓",
      "rating-desc": "Ordem: rating ↓",
    },
    columns: {
      athlete: "Atleta",
      nat: "País",
      weight: "Categoria",
      age: "Idade",
      lastContest: "Última luta",
    },
    empty: "Nenhum atleta com esses filtros.",
    noun: "athletes", // "1–50 de 625 atletas": the name of a form in common
  },
  contests: {
    meta: {
      title: "Lutas de judô e surpresas com chances de vitória",
      description:
        "Todas as lutas de judô com rating desde 2009, com a chance de vitória de cada lado: busque por atleta, filtre por torneio e categoria, encontre as maiores surpresas.",
    },
    title: "Lutas",
    lead: "Todas as lutas com rating, com chances de vitória e variações de rating.",
    allContests: "Todas as lutas",
    upsets: "Surpresas",
    sort: {
      "date-desc": "Ordem: data ↓",
      "date-asc": "Ordem: data ↑",
      "chance-asc": "Ordem: chance do vencedor ↑",
    },
    columns: {
      athletes: "Atletas",
      tournament: "Torneio",
      weight: "Categoria",
      round: "Fase",
      chance: "Chance",
      result: "V/D",
      change: "+/−",
    },
    upset: "Surpresa", // the chip of a row
    won: "V",
    lost: "D",
    empty: "Nenhuma luta com esses filtros.",
    noun: "contests",
  },
  nations: {
    meta: {
      title: "Países do judô e seus atletas com rating",
      description: "Todos os países com um judoca com rating: quantos cada um tem e quantos estão nas tabelas de hoje, com uma página para cada país.",
    },
    title: "Países",
    lead: "Todos os países com atletas com rating.",
    search: "Buscar país",
    sort: {
      "name-asc": "Ordem: nome ↑",
      "name-desc": "Ordem: nome ↓",
      "athletes-desc": "Ordem: atletas ↓",
      "athletes-asc": "Ordem: atletas ↑",
    },
    columns: {
      nation: "País",
      athletes: "Atletas",
      athletesTip: "Atletas com rating, entre parênteses os que estão em uma tabela hoje",
    },
    empty: "Nenhum país com esses filtros.",
    noun: "nations",
  },
} satisfies typeof en.explore;
