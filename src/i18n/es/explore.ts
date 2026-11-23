// Explore: the lists of athletes, contests, tournaments and nations, and their filters.

import type { en } from "@/i18n/en";

export const explore = {
  // The tabs over every list (components/explore/ExploreTabs.tsx).
  tabs: {
    label: "Explorar",
    tournaments: "Torneos",
    athletes: "Atletas",
    contests: "Combates",
    nations: "Países",
  },
  // The parts of the toolbars (components/explore/Controls.tsx).
  controls: {
    exportCsv: "Descargar CSV",
  },
  // Filters that several lists share.
  filters: {
    searchAthlete: "Buscar atleta",
    allWeights: "Todos los pesos",
    allTournaments: "Todos los torneos",
  },
  tournaments: {
    meta: {
      title: "Resultados de torneos de judo",
      description:
        "Todos los torneos del World Tour de judo desde 2009: Juegos Olímpicos, Mundiales, Grand Slams y Grand Prix, con resultados, sorpresas y cuántas veces ganó el favorito.",
    },
    title: "Torneos",
    lead: "Todos los torneos con rating y cuántas veces ganó el favorito.",
    search: "Buscar torneo o ciudad",
    // The levels (the values are the backend's rank names).
    levels: {
      all: "Todos los niveles",
      olympics: "Juegos Olímpicos",
      worlds: "Campeonato del Mundo",
      masters: "Masters",
      grandSlam: "Grand Slam",
      grandPrix: "Grand Prix",
      continental: "Continental",
    },
    sort: {
      "date-desc": "Orden: fecha ↓",
      "date-asc": "Orden: fecha ↑",
      "accuracy-desc": "Orden: acierto del rating ↓",
      "accuracy-asc": "Orden: acierto del rating ↑",
      "upsets-desc": "Orden: sorpresas ↓",
      "upsets-asc": "Orden: sorpresas ↑",
    },
    columns: {
      dates: "Fechas",
      tournament: "Torneo",
      location: "Lugar",
      accuracy: "Acierto del rating",
      upsets: "Sorpresas",
    },
    // The month rows that group the year's tournaments: "enero 2026".
    months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    monthHeading: "{month} {year}",
    // The chips of a tournament not over yet.
    upcoming: "Próximo",
    live: "En curso",
    accuracyTip: "Combates ganados por el favorito del rating, de {contests}",
    empty: "Ningún torneo coincide con estos filtros.",
  },
  athletes: {
    meta: {
      title: "Todos los judocas con rating, búsqueda por nombre, país y peso",
      description: "Todos los judocas con rating desde 2009: búsqueda por nombre, filtros por país y peso, orden por rating, nombre o edad.",
    },
    title: "Atletas",
    lead: "Todos los atletas con rating, activos o no.",
    allCountries: "Todos los países",
    menAllWeights: "Hombres, todos los pesos",
    womenAllWeights: "Mujeres, todos los pesos",
    sort: {
      "name-asc": "Orden: nombre ↑",
      "name-desc": "Orden: nombre ↓",
      "age-asc": "Orden: edad ↑",
      "age-desc": "Orden: edad ↓",
      "rating-desc": "Orden: rating ↓",
    },
    columns: {
      athlete: "Atleta",
      nat: "País",
      weight: "Peso",
      age: "Edad",
      lastContest: "Último combate",
    },
    empty: "Ningún atleta coincide con estos filtros.",
    noun: "athletes", // "1–50 de 625 atletas"
  },
  contests: {
    meta: {
      title: "Combates de judo y sorpresas con probabilidades de victoria",
      description:
        "Todos los combates de judo con rating desde 2009 y la probabilidad de victoria de cada lado: búsqueda por atleta, filtros por torneo y peso, las mayores sorpresas.",
    },
    title: "Combates",
    lead: "Todos los combates con rating, con probabilidades de victoria y cambios de rating.",
    allContests: "Todos los combates",
    upsets: "Sorpresas",
    sort: {
      "date-desc": "Orden: fecha ↓",
      "date-asc": "Orden: fecha ↑",
      "chance-asc": "Orden: probabilidad del ganador ↑",
    },
    columns: {
      athletes: "Atletas",
      tournament: "Torneo",
      weight: "Peso",
      round: "Ronda",
      chance: "Prob.",
      result: "V/D",
      change: "+/−",
    },
    upset: "Sorpresa", // the chip of a row
    won: "V",
    lost: "D",
    empty: "Ningún combate coincide con estos filtros.",
    noun: "contests",
  },
  nations: {
    meta: {
      title: "Países del judo y sus atletas con rating",
      description: "Todos los países del judo con un atleta con rating: cuántos tienen y cuántos están hoy en las tablas, con una página para cada uno.",
    },
    title: "Países",
    lead: "Todos los países con atletas con rating.",
    search: "Buscar país",
    sort: {
      "name-asc": "Orden: nombre ↑",
      "name-desc": "Orden: nombre ↓",
      "athletes-desc": "Orden: atletas ↓",
      "athletes-asc": "Orden: atletas ↑",
    },
    columns: {
      nation: "País",
      athletes: "Atletas",
      athletesTip: "Atletas con rating, entre paréntesis los que hoy están en una tabla",
    },
    empty: "Ningún país coincide con estos filtros.",
    noun: "nations",
  },
} satisfies typeof en.explore;
