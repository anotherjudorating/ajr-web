// The frame of every page: the header, the footer, the search box, the language
// switcher and the error pages.

import type { en } from "@/i18n/en";

export const site = {
  name: "Another Judo Rating",
  header: {
    rankings: "Rankings",
    explore: "Explorar",
    headToHead: "Cara a cara",
    records: "Récords",
    search: "Buscar",
    closeSearch: "Cerrar la búsqueda",
    searchAthletes: "Buscar atletas o torneos",
  },
  search: {
    athletes: "Atletas",
    tournaments: "Torneos",
    nations: "Países",
    placeholder: "Atletas, torneos, países",
    noMatches: "Sin coincidencias rápidas.",
    inExplore: "Buscar en Explorar",
  },
  footer: {
    methodology: "Metodología",
    exportData: "Exportar datos",
    contact: "Contacto",
    updated: "Rankings actualizados el {date}",
    source: "Fuente:",
    judobase: "IJF Judobase",
    github: "GitHub",
    namesNote: "Nombres de atletas y torneos: como en IJF Judobase",
  },
  language: {
    label: "Idioma",
  },
  errors: {
    notFoundTitle: "Mate. Sore-made.",
    notFoundLead: "Puede que el enlace esté roto.",
    errorTitle: "Matte.",
    errorLead: "No se pudo cargar la página. Suele volver en un minuto.",
    siteErrorLead: "No se pudo cargar el sitio. Suele volver en un minuto.",
    tryAgain: "Intentar de nuevo",
    searchPlaceholder: "Buscar atletas o torneos",
    searchTip: "Prueba solo con el apellido, por ejemplo «Tasoev».",
    soon: "Pronto",
    onItsWay: "La sección «{section}» está en camino.",
    notBuilt: "Esta parte del sitio aún no está lista. Los rankings ya funcionan.",
  },
  breadcrumbs: {
    label: "Ruta de navegación",
    home: "Inicio",
  },
  rowLink: {
    open: "Abrir",
  },
} satisfies typeof en.site;
