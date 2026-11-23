// The rankings: the weights, pound for pound, the nations, their tables and the panel.

import type { en } from "@/i18n/en";

export const rankings = {
  teams: "Equipos",
  // WeightSwitcher: the small labels before the rows (a language may abbreviate)
  switcher: { men: "Hombres", women: "Mujeres", teams: "Equipos" },
  breadcrumb: "Rankings",
  // "−73 kg": a weight in a list or a column
  weightKg: "{label} kg",
  // the <title> of a past day's table
  pastTitle: "{title} el {date}",
  loading: "Cargando…",
  // a weight's table (app/[lang]/rankings/[weight])
  weight: {
    title: "{weight}: ranking mundial de judo",
    strongest: "Los judocas más fuertes de {weight}",
    strongestOn: "Los judocas más fuertes de {weight} el {date}",
    description: "{strongest}: {leaders}.",
    descriptionShort: "{strongest}.",
  },
  // pound for pound (app/[lang]/rankings/p4p/[gender])
  p4p: {
    title: "Ranking de judo libra por libra, {gender}",
    description: "Los mejores judocas ({gender}) de todos los pesos: cuánto se separa cada uno del resto de su categoría.",
    breadcrumb: "Libra por libra, {gender}",
  },
  // the nations (app/[lang]/rankings/teams/[kind])
  nations: {
    title: "Ranking de países de judo, {who}",
    who: { men: "hombres", women: "mujeres", mixed: "hombres y mujeres" },
    description: "Qué país tiene el equipo de judo más fuerte: cada país puntuado por su mejor atleta en cada peso.",
    descriptionTop: "{description} {top}.",
    breadcrumb: "Países, {gender}",
  },
  // TableParts: the toolbar over a table and the pages under it
  toolbar: {
    searchAthlete: "Buscar atleta",
    searchNation: "Buscar país",
    allCountries: "Todos los países",
    asOf: "Ranking en esta fecha",
    exportCsv: "Descargar CSV",
  },
  pagination: {
    range: "{from}–{to} de {count}", // "1–50 de 625 atletas"
    show: "Mostrar",
  },
  sorts: {
    ratingDesc: "Orden: rating ↓",
    ratingAsc: "Orden: rating ↑",
    d90Desc: "Orden: +/− 90 días ↓",
    d90Asc: "Orden: +/− 90 días ↑",
    d6mDesc: "Orden: +/− 6 meses ↓",
    d6mAsc: "Orden: +/− 6 meses ↑",
    ledDesc: "Orden: top 1 ↓",
    top8Desc: "Orden: top 8 ↓",
    leadDesc: "Orden: ventaja ↓",
    leadAsc: "Orden: ventaja ↑",
  },
  // the tables' header cells
  columns: {
    athlete: "Atleta",
    nat: "País",
    country: "País",
    weight: "Peso",
    rating: "Rating",
    age: "Edad",
    last: "Último",
    trend: "Tendencia",
    d90: "90 d",
    m6: "6 m",
    change6m: "+/− 6 m",
    lead: "Ventaja",
    nation: "País",
    top1: "Top 1",
    top8: "Top 8",
    leadersAvg: "Media líderes",
    leadersRatingAvg: "Media de rating de los líderes",
  },
  // what the header cells say on hover
  tips: {
    rank90: "Cambio de puesto, últimos 90 días",
    rating90: "Cambio de rating, últimos 90 días",
    rank6m: "Cambio de puesto, últimos 182 días",
    rating6m: "Cambio de rating, últimos 182 días",
    ijf: "Puesto en el ranking mundial de la IJF",
    ijfDifference: "Puesto IJF comparado con el de AJR: ↓ más bajo en la IJF, ↑ más alto",
    lead: "Puntos de ventaja sobre la media de los 7 siguientes de su peso",
    top1: "Pesos en los que el país tiene al mejor atleta de todos los países",
    top8: "Pesos en los que el mejor atleta del país está entre los 8 mejores países",
    leadersAvg:
      "Rating medio del mejor atleta del país en cada uno de los {weights} pesos. Un peso sin atleta cuenta como el último puesto de esa tabla",
  },
  // the rating cell's tip: how the shown rating is made
  score: {
    glicko: "Rating Glicko-2",
    minusRd: "− RD ({rd})",
  },
  showLast90: "Ver los últimos 90 días",
  noAthletes: "Ningún atleta coincide con estos filtros.",
  noNations: "Ningún país coincide con estos filtros.",
  // Changes: an athlete not in the table back then
  changes: {
    new: "NUEVO",
    returning: "VUELVE",
  },
  // AthletePanel: the expanded row
  panel: {
    ijf: "Ranking mundial IJF",
    last90: "Últimos 90 días",
    failed: "No se pudieron cargar los combates.",
    none: "Sin combates en los últimos 90 días.",
    upset: "Sorpresa",
    won: "V",
    lost: "D",
    contest: "El combate",
  },
  // Medal: the aria-label
  medal: {
    gold: "oro",
    silver: "plata",
    bronze: "bronce",
    predicted: "{kind} previsto",
  },
  // chart.tsx: the names of a line's points and its tips
  chart: {
    today: "Hoy",
    weekOf: "Semana del {date}",
    quarter: "T{n} {year}",
    inactive: "inactivo",
    rank: "Puesto",
    peak: "Máximo {score}",
  },
} satisfies typeof en.rankings;
