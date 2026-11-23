// The home page: the question, the leaders of every weight, the biggest movers, the
// month's upsets and the coming tournaments.

import type { en } from "@/i18n/en";

export const home = {
  // the page's <title> and description (the site's name is added by the layout)
  title: "Ranking mundial de judo alternativo",
  description:
    "Un ranking de judo abierto y basado en estadística: un rating Glicko-2 con todos los combates del World Tour desde 2009, los líderes de cada peso, las mayores subidas y las sorpresas.",
  question: "¿Quién es el judoca más fuerte ahora mismo?",
  lead: "Un rating Glicko-2 para cada atleta del World Tour de la IJF que solo se mueve con a quién gana y quién le gana.",
  howItWorks: "Cómo funciona",
  // LeaderPanel: men or women, the leader of every weight or the top of one
  // LeaderPanel: the select is 112 px wide on a phone and the P4P link sits on the same
  // row as the heading, so both stay short (the heading already says men or women)
  leaders: {
    allWeights: "Peso: todos",
    p4pMen: "Ranking P4P",
    p4pWomen: "Ranking P4P",
  },
  movers: {
    title: "Subidas y bajadas",
    period: "últimos 90 días",
  },
  upsets: {
    title: "Sorpresas del mes",
    all: "Todas las sorpresas",
    none: "Sin sorpresas en los últimos 30 días.",
  },
  upcoming: {
    title: "Próximos",
    all: "Todos los torneos",
    none: "No hay torneos anunciados.",
  },
} satisfies typeof en.home;
