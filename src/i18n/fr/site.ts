// The frame of every page: the header, the footer, the search box, the language
// switcher and the error pages.

import type { en } from "@/i18n/en";

export const site = {
  name: "Another Judo Rating",
  header: {
    rankings: "Classements",
    explore: "Explorer",
    headToHead: "Face-à-face",
    records: "Records",
    search: "Rechercher",
    closeSearch: "Fermer la recherche",
    searchAthletes: "Rechercher un athlète ou un tournoi",
  },
  search: {
    athletes: "Athlètes",
    tournaments: "Tournois",
    nations: "Nations",
    placeholder: "Athlètes, tournois, nations",
    noMatches: "Aucun résultat rapide.",
    inExplore: "Chercher dans Explorer",
  },
  footer: {
    methodology: "Méthodologie",
    exportData: "Exporter les données",
    contact: "Contact",
    updated: "Classements mis à jour le {date}",
    source: "Source :",
    judobase: "IJF Judobase",
    github: "GitHub",
    namesNote: "Noms des athlètes et des tournois : comme dans IJF Judobase",
  },
  language: {
    label: "Langue",
  },
  errors: {
    notFoundTitle: "Mate. Sore-made.",
    notFoundLead: "Le lien est peut-être cassé.",
    errorTitle: "Matte.",
    errorLead: "La page n’a pas pu être chargée. Elle revient en général dans la minute.",
    siteErrorLead: "Le site n’a pas pu être chargé. Il revient en général dans la minute.",
    tryAgain: "Réessayer",
    searchPlaceholder: "Rechercher un athlète ou un tournoi",
    searchTip: "Essayez le nom de famille seul, par exemple « Tasoev ».",
    soon: "Bientôt",
    onItsWay: "{section} arrive bientôt.",
    notBuilt: "Cette partie du site n’est pas encore construite. Les classements, eux, sont en ligne.",
  },
  breadcrumbs: {
    label: "Fil d’Ariane",
    home: "Accueil",
  },
  rowLink: {
    open: "Ouvrir",
  },
} satisfies typeof en.site;
