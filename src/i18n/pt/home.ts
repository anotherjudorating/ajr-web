// The home page: the question, the leaders of every weight, the biggest movers, the
// month's upsets and the coming tournaments.

import type { en } from "@/i18n/en";

export const home = {
  // the page's <title> and description (the site's name is added by the layout)
  title: "Ranking mundial alternativo de judô",
  description:
    "Um ranking de judô aberto e baseado em estatística: rating Glicko-2 de todas as lutas do World Tour desde 2009, os líderes de cada categoria, as maiores subidas e as maiores surpresas.",
  question: "Quem é o judoca mais forte neste momento?",
  lead: "Um rating Glicko-2 para cada atleta do World Tour da IJF, que só muda com quem ele vence e quem o vence.",
  howItWorks: "Como funciona",
  // LeaderPanel: men or women, the leader of every weight or the top of one
  leaders: {
    allWeights: "Todas as categorias",
    p4pMen: "Ranking P4P masculino",
    p4pWomen: "Ranking P4P feminino",
  },
  movers: {
    title: "Maiores variações",
    period: "últimos 90 dias",
  },
  upsets: {
    title: "Surpresas do mês",
    all: "Todas as surpresas",
    none: "Nenhuma surpresa nos últimos 30 dias.",
  },
  upcoming: {
    title: "Próximos torneios",
    all: "Todos os torneios",
    none: "Nenhum torneio anunciado.",
  },
} satisfies typeof en.home;
