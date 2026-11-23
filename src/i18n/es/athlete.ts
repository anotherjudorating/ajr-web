// An athlete's page: the header, the charts, the contests, the lists.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const athlete = {
  // The title and the description for search engines (app/[lang]/athletes/[id]/page.tsx).
  meta: {
    title: "{name}: rating y resultados en judo",
    // "Hidayat Heydarov (Azerbaiyán, 1997): n.º 1 en hombres −73 kg con un rating de 2543, máximo 2600 en jul 2024."
    summary: "{name} ({who}): {standing}{peak}.",
    summaryNoWho: "{name}: {standing}{peak}.", // no nation and no year of birth
    born: "{year}", // the year of birth alone: Spanish would need nacido/nacida
    judo: "judo", // the weight is not known: "con rating en judo"
    ranked: "n.º {place} en {where} con un rating de {score}",
    unranked: "con rating en {where}, fuera de la tabla (sin combates en el último año)",
    peak: ", máximo {score} en {month}", // after the standing; empty without a peak
  },
  // "−73 kg": a weight tab, a filter's option, the Rank chart's legend
  weightKg: "{weight} kg",
  header: {
    age: forms({ other: "{n} años" }),
    rank: "Puesto",
    best: "Mejor",
    peak: "Máximo",
    inactive: "Inactivo",
    inactiveTitle: "Más de un año sin combates: fuera de las tablas hasta el siguiente",
    tableOfWeek: "La tabla de esa semana",
    ijfTitle: "Puesto en el ranking mundial de la IJF. ↑ más alto en la IJF que en AJR, ↓ más bajo. Abre el perfil del atleta en la IJF.",
    showOnChart: "Verlo en el gráfico",
    // the weeks at #1: the heads of the small table and its rows
    weeks: "Semanas",
    total: "Total",
    longestRun: "Racha más larga",
    atOne: "Como n.º 1",
    p4pAtOne: "N.º 1 P4P",
    // the label of a run marked on the Rank chart
    weeksAtOne: forms({ one: "{n} semana como n.º 1", other: "{n} semanas como n.º 1" }),
    weeksP4pAtOne: forms({ one: "{n} semana como n.º 1 libra por libra", other: "{n} semanas como n.º 1 libra por libra" }),
    weeksTop8: forms({ one: "{n} semana en el top 8", other: "{n} semanas en el top 8" }),
    firstAtOne: "Primer n.º 1, a los {age}", // a record's week: the first week at #1, with the age
    currentRating: "Rating actual",
    lastRating: "Último rating, {month}", // an inactive athlete's
    change: "Cambio",
    rating: "Rating",
    days90: "90 días",
    months6: "6 meses",
    skill: "fuerza",
    uncertainty: "incertidumbre",
    howItWorks: "Cómo funciona",
  },
  chart: {
    rating: "Rating",
    rank: "Puesto",
    ratingOrRank: "Rating o puesto", // the switch's aria-label
    // the windows of every rating chart (the head-to-head's too)
    ranges: { "1Y": "1A", "4Y": "4A", All: "Todo" },
    peakPeriod: "Máximo, {date}", // the peak's point in the tip
    inactive: "Inactivo",
    inactiveZone: "Más de un año sin combates: fuera de las tablas hasta el siguiente. El rating se conserva, su incertidumbre crece y el número baja poco a poco.",
    inactiveLegend: "Más de un año sin combates: fuera de las tablas",
    skillLabel: "Fuerza {n}",
    uncertaintyLabel: "−{n} incertidumbre",
    ratingLabel: "Rating {n}",
    peakLabel: "Máximo {score}",
    peakBefore: "Máximo en {month}: ver toda la carrera", // the peak is before the window
    showContests: "Ver combates",
    takeMarkOff: "Quitar la marca",
    takeMarkOffEsc: "Quitar la marca (Esc)",
    // a marked run's label with its months: "12 semanas como n.º 1, ene 2024 – mar 2024"
    runInMonth: "{label}, {month}",
    runOverMonths: "{label}, {from} – {to}",
    skill: "Fuerza",
    uncertainty: "Incertidumbre",
    top8: "Top 8",
    // the Rank chart's tip
    weekOf: "Semana del {date}",
    placeIn: "N.º {place} en {weight} kg",
    notInTable: "Fuera de la tabla de {weight} kg",
    p4pPlace: "P4P n.º {place}",
    placeP4p: "N.º {place} libra por libra",
  },
  contests: {
    title: "Combates",
    search: "Buscar rival o torneo",
    allYears: "Todos los años",
    weight: "Peso",
    allWeights: "Todos los pesos",
    level: "Nivel del torneo",
    allLevels: "Todos los niveles",
    // the result filter, by its value ("" is every contest)
    results: { "": "Todos los combates", w: "Victorias", l: "Derrotas", uw: "Victorias sorpresa", ul: "Derrotas sorpresa" },
    sorts: {
      "date-desc": "Orden: fecha ↓",
      "date-asc": "Orden: fecha ↑",
      "chance-asc": "Orden: probabilidad ↑",
      "chance-desc": "Orden: probabilidad ↓",
      "gain-desc": "Orden: cambio de rating ↓",
      "gain-asc": "Orden: cambio de rating ↑",
    },
    exportCsv: "Descargar CSV",
    round: "Ronda",
    opponent: "Rival",
    date: "Fecha",
    opponentRating: "Rival",
    chance: "Prob.",
    result: "Resultado",
    upset: "Sorpresa",
    win: "V",
    loss: "D",
    theContest: "El combate",
    noMatch: "Ningún combate coincide con estos filtros.",
    range: "{from}–{to} de {total}", // "1–25 de 112 combates"
    show: "Mostrar",
  },
  lists: {
    bestWins: "Mejores victorias",
    toughestLosses: "Derrotas más duras",
    all: "Todo",
    opponentRating: "Rating del rival antes del combate",
    noneYet: "Todavía ninguna.",
    frequentOpponents: "Rivales frecuentes",
    noRepeat: "Todavía no ha repetido rival.",
    liveAndUpcoming: "En curso y próximos",
    dates: "Fechas",
    tournament: "Torneo",
    gold: "Oro",
    medal: "Medalla",
    live: "En curso",
  },
  results: {
    title: "Resultados",
    level: "Nivel",
    // the medal columns' tooltips
    medals: { gold: "oro", silver: "plata", bronze: "bronce" },
    fifth: "Quinto puesto",
    seventh: "Séptimo puesto",
    other: "Otros",
    otherTitle: "Eliminado antes, o un resultado que judobase no da",
    total: "Total",
    totalTitle: "Torneos disputados",
    // the levels too long for one line of a phone, by their id (lib/levels.ts)
    short: {
      worlds: "Mundial",
      continental: "Continental",
      opens: "Opens y copas",
    },
  },
} satisfies typeof en.athlete;
