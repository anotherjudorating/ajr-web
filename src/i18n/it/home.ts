// The home page: the question, the leaders of every weight, the biggest movers, the
// month's upsets and the coming tournaments.

import type { en } from "@/i18n/en";

export const home = {
  // the page's <title> and description (the site's name is added by the layout)
  title: "Ranking mondiale alternativo del judo",
  description:
    "Un ranking del judo aperto e statistico: un rating Glicko-2 su tutti gli incontri del World Tour dal 2009, i leader di ogni categoria, chi sale, chi scende e le sorprese.",
  question: "Chi è il judoka più forte in questo momento?",
  lead: "Un rating Glicko-2 per ogni atleta del World Tour IJF, che si muove solo con chi batte e con chi lo batte.",
  howItWorks: "Come funziona",
  // LeaderPanel: men or women, the leader of every weight or the top of one
  leaders: {
    allWeights: "Tutte le categorie",
    p4pMen: "Ranking P4P maschile",
    p4pWomen: "Ranking P4P femminile",
  },
  movers: {
    title: "Chi sale e chi scende",
    period: "ultimi 90 giorni",
  },
  upsets: {
    title: "Sorprese del mese",
    all: "Tutte le sorprese",
    none: "Nessuna sorpresa negli ultimi 30 giorni.",
  },
  upcoming: {
    title: "In arrivo",
    all: "Tutti i tornei",
    none: "Nessun torneo annunciato.",
  },
} satisfies typeof en.home;
