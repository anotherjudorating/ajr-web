// The frame of every page: the header, the footer, the search box, the language
// switcher and the error pages.

import type { en } from "@/i18n/en";

export const site = {
  name: "Another Judo Rating",
  header: {
    rankings: "Classifiche",
    explore: "Esplora",
    headToHead: "Testa a testa",
    records: "Record",
    search: "Cerca",
    closeSearch: "Chiudi la ricerca",
    searchAthletes: "Cerca atleti o tornei",
  },
  search: {
    athletes: "Atleti",
    tournaments: "Tornei",
    nations: "Nazioni",
    placeholder: "Atleti, tornei, nazioni",
    noMatches: "Nessun risultato rapido.",
    inExplore: "Cerca in Esplora",
  },
  footer: {
    methodology: "Metodologia",
    exportData: "Esporta i dati",
    contact: "Contatti",
    updated: "Rating aggiornati il {date}",
    source: "Fonte:",
    judobase: "IJF Judobase",
    github: "GitHub",
    namesNote: "Nomi degli atleti e dei tornei: come in IJF Judobase",
  },
  language: {
    label: "Lingua",
  },
  errors: {
    notFoundTitle: "Mate. Sore-made.",
    notFoundLead: "Il link potrebbe essere rotto.",
    errorTitle: "Matte.",
    errorLead: "La pagina non si è caricata. Di solito torna in un minuto.",
    siteErrorLead: "Il sito non si è caricato. Di solito torna in un minuto.",
    tryAgain: "Riprova",
    searchPlaceholder: "Cerca atleti o tornei",
    searchTip: "Prova con il solo cognome, per esempio “Tasoev”.",
    soon: "Presto",
    onItsWay: "La sezione «{section}» è in arrivo.",
    notBuilt: "Questa parte del sito non è ancora pronta. Le classifiche funzionano.",
  },
  breadcrumbs: {
    label: "Percorso",
    home: "Home",
  },
  rowLink: {
    open: "Apri",
  },
} satisfies typeof en.site;
