// The home page: the question, the leaders of every weight, the biggest movers, the
// month's upsets and the coming tournaments.

import type { en } from "@/i18n/en";

export const home = {
  // the page's <title> and description (the site's name is added by the layout)
  title: "Classement mondial de judo alternatif",
  description:
    "Un classement de judo ouvert et statistique : une cote Glicko-2 d’après tous les combats du World Tour depuis 2009, les leaders de chaque catégorie, les plus fortes hausses et les surprises.",
  question: "Qui est le judoka le plus fort en ce moment ?",
  lead: "Une cote Glicko-2 pour chaque athlète du World Tour de l’IJF, qui ne bouge qu’avec ses victoires et ses défaites, selon l’adversaire.",
  howItWorks: "Comment ça marche",
  // LeaderPanel: men or women, the leader of every weight or the top of one
  leaders: {
    allWeights: "Toutes catégories",
    p4pMen: "Classement P4P hommes",
    p4pWomen: "Classement P4P femmes",
  },
  movers: {
    title: "Hausses et baisses",
    period: "90 derniers jours",
  },
  upsets: {
    title: "Surprises du mois",
    all: "Toutes les surprises",
    none: "Aucune surprise depuis 30 jours.",
  },
  upcoming: {
    title: "À venir",
    all: "Tous les tournois",
    none: "Aucun tournoi annoncé.",
  },
} satisfies typeof en.home;
