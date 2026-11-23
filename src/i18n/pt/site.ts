// The frame of every page: the header, the footer, the search box, the language
// switcher and the error pages.

import type { en } from "@/i18n/en";

export const site = {
  name: "Another Judo Rating",
  header: {
    rankings: "Rankings",
    explore: "Explorar",
    headToHead: "Confrontos",
    records: "Recordes",
    search: "Buscar",
    closeSearch: "Fechar a busca",
    searchAthletes: "Buscar atletas ou torneios",
  },
  search: {
    athletes: "Atletas",
    tournaments: "Torneios",
    nations: "Países",
    placeholder: "Atletas, torneios, países",
    noMatches: "Nenhum resultado rápido.",
    inExplore: "Buscar em Explorar",
  },
  footer: {
    methodology: "Metodologia",
    exportData: "Exportar dados",
    contact: "Contato",
    updated: "Ratings atualizados em {date}",
    source: "Fonte:",
    judobase: "IJF Judobase",
    github: "GitHub",
    namesNote: "Nomes de atletas e de torneios: como no IJF Judobase",
  },
  language: {
    label: "Idioma",
  },
  errors: {
    notFoundTitle: "Mate. Sore-made.",
    notFoundLead: "O link pode estar quebrado.",
    errorTitle: "Matte.",
    errorLead: "A página não carregou. Em geral volta em um minuto.",
    siteErrorLead: "O site não carregou. Em geral volta em um minuto.",
    tryAgain: "Tentar de novo",
    searchPlaceholder: "Buscar atletas ou torneios",
    searchTip: "Tente só o sobrenome, por exemplo “Tasoev”.",
    soon: "Em breve",
    onItsWay: "{section} está a caminho.",
    notBuilt: "Esta parte do site ainda não existe. Os rankings já funcionam.",
  },
  breadcrumbs: {
    label: "Caminho",
    home: "Início",
  },
  rowLink: {
    open: "Abrir",
  },
} satisfies typeof en.site;
