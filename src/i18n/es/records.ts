// The records: the overview, each record page, the columns. The records themselves
// (slugs, backend names, kinds, views) are in lib/records.ts; their text is here, by
// the record's slug. `breakAfter`: where a title breaks on phones, in this language.

import type { en } from "@/i18n/en";
import type { RecordText } from "@/i18n/en/records";

const record = (text: RecordText): RecordText => text;

export const records = {
  meta: {
    title: "Récords históricos del judo",
    description: "Récords históricos del judo: los ratings más altos, los reinados más largos como n.º 1, más medallas, las mayores sorpresas y más.",
  },
  // "Rating más alto, récord de judo": a record page's title tag
  pageTitle: "{title}, récord de judo",
  title: "Récords",
  // {judobase} is the link to the IJF database, with the text below.
  lead: "Las mejores marcas de la historia, solo con los combates disponibles en {judobase}, desde 2009.",
  judobase: "IJF judobase",
  howRatingsWork: "Cómo funciona el rating",
  // The tabs of /records.
  groups: {
    ratings: "Ratings",
    medals: "Medallas",
    contests: "Combates",
    rivalries: "Rivalidades",
    tournaments: "Torneos",
    nations: "Países",
  },
  // /records (components/records/RecordsOverview.tsx).
  overview: {
    label: "Récords", // before the group tabs
    groupsLabel: "Grupos de récords", // the tabs' aria-label
    athletes: "Atletas", // before the Men/Women filter
    all: "Todos",
    fullList: "Lista completa",
  },
  viewSwitch: {
    label: "Vista",
  },
  // A record's full list (components/records/RecordBrowser.tsx).
  browser: {
    // The search box, by what one row is about.
    search: {
      athlete: "Buscar atleta",
      tournament: "Buscar torneo",
      nation: "Buscar país",
    },
    menAndWomen: "Hombres y mujeres",
    allWeights: "Todos los pesos",
    sortValueDesc: "Orden: {label} ↓",
    sortValueAsc: "Orden: {label} ↑",
    sortDateDesc: "Orden: fecha ↓",
    sortDateAsc: "Orden: fecha ↑",
    exportCsv: "Descargar CSV",
    empty: "Nada coincide con estos filtros.",
  },
  // The headers of the records' tables (components/records/columns.tsx).
  columns: {
    athlete: "Atleta",
    nat: "País",
    weight: "Peso",
    // "Hombres −73": a row's weight without the unit
    weightName: "{gender} {label}",
    peak: "Máximo",
    date: "Fecha",
    weeks: "Semanas",
    until: "Hasta",
    lead: "Ventaja",
    age: "Edad",
    total: "Total",
    inARow: "Seguidas",
    period: "Periodo",
    tournament: "Torneo",
    wins: "Victorias",
    avgChance: "Prob. media",
    overNo1: "Sobre el n.º 1",
    upsetWins: "Sorpresas",
    winnerLoser: "Ganador / perdedor",
    chance: "Prob.",
    avgRating: "Rating medio",
    avg: "Media", // the same header on phones
    avgRatingTip: "Rating medio de los participantes",
    nations: "Países",
    nationsTip: "Países con al menos una medalla",
    upsets: "Sorpresas",
    upsetsTip: "Combates que perdió el favorito del rating",
    favWon: "Ganó el fav.",
    favWonTip: "Combates ganados por el favorito del rating",
    rating: "Rating",
    golds: "Oros",
    medals: "Medallas",
    years: "Años",
    finals: "Finales",
    won: "Ganadas",
    wonShare: "% ganadas",
    contests: "Combates",
    time: "Tiempo",
    athletes: "Atletas",
    meetings: "Duelos",
    score: "Puntuación",
    nemesisOpponent: "Bestia negra / rival",
    weights: "Pesos",
    inTop10: "En el top 10",
    nation: "País",
  },
  // Each record's text, by its slug (lib/records.ts).
  list: {
    "highest-rating": record({
      title: "Rating más alto",
      description: "El rating más alto que alcanzó cada atleta desde 2011, una fila por atleta.",
      noun: "athletes",
      sortLabel: "máximo",
    }),
    "longest-at-1": record({
      title: "Más tiempo como n.º 1",
      description: "Semanas como n.º 1 del ranking de un peso desde 2011, en total. El peso es aquel con más semanas.",
      noun: "athletes",
      sortLabel: "semanas",
      views: {
        total: { label: "Total" },
        "in-a-row": { label: "Seguidas", description: "La racha más larga sin interrupción como n.º 1 del ranking de un peso desde 2011." },
      },
    }),
    "most-weeks-in-the-top-8": record({
      title: "Más semanas en el top 8",
      breakAfter: "Más semanas",
      description:
        "Semanas en el top 8 del ranking de un peso (los cabezas de serie de un Mundial o unos Juegos Olímpicos) desde 2011, en total. Una semana cuenta una vez aunque el atleta estuviera en dos pesos.",
      noun: "athletes",
      sortLabel: "semanas",
      views: {
        total: { label: "Total" },
        "in-a-row": { label: "Seguidas", description: "La racha más larga sin interrupción en el top 8 del ranking de un peso desde 2011." },
      },
    }),
    "longest-at-p4p-1": record({
      title: "Más tiempo como n.º 1 P4P",
      breakAfter: "Más tiempo",
      description: "Semanas como n.º 1 del ranking libra por libra, hombres y mujeres por separado, desde 2011, en total.",
      noun: "athletes",
      sortLabel: "semanas",
      views: {
        total: { label: "Total" },
        "in-a-row": {
          label: "Seguidas",
          description: "La racha más larga sin interrupción como n.º 1 del ranking libra por libra, hombres y mujeres por separado, desde 2011.",
        },
      },
    }),
    "biggest-p4p-lead": record({
      title: "Mayor ventaja P4P",
      description: "La mayor ventaja de un n.º 1 libra por libra sobre los 7 mejores de su peso, desde 2011.",
      noun: "athletes",
      sortLabel: "ventaja",
    }),
    "youngest-1": record({
      title: "N.º 1 más joven",
      description: "Los atletas más jóvenes en llegar al n.º 1 del ranking de un peso desde 2011. Edad por el año de nacimiento.",
      noun: "athletes",
      sortLabel: "edad",
    }),
    "most-world-tour-medals": record({
      title: "Más medallas del World Tour",
      breakAfter: "Más medallas",
      description: "Medallas en eventos del World Tour de la IJF y en los Juegos Olímpicos, una fila por atleta.",
      noun: "athletes",
      sortLabel: "medallas",
      views: {
        total: { label: "Total" },
        gold: { label: "Oro", description: "Medallas de oro en eventos del World Tour de la IJF y en los Juegos Olímpicos, una fila por atleta." },
      },
    }),
    "most-medals-in-a-row": record({
      title: "Más medallas seguidas",
      description: "Eventos del World Tour de la IJF y Juegos Olímpicos seguidos terminados con medalla.",
      noun: "athletes",
      sortLabel: "seguidas",
      views: {
        total: { label: "Total" },
        gold: { label: "Oro", description: "Eventos del World Tour de la IJF y Juegos Olímpicos ganados seguidos." },
      },
    }),
    "youngest-grand-slam-medal": record({
      title: "Medalla de Grand Slam más joven",
      breakAfter: "Medalla de Grand Slam",
      description: "Los atletas más jóvenes en ganar una medalla de Grand Slam. Edad por el año de nacimiento.",
      noun: "athletes",
      sortLabel: "edad",
      views: {
        any: { label: "Cualquier medalla" },
        gold: { label: "Oro", description: "Los campeones de Grand Slam más jóvenes. Edad por el año de nacimiento." },
      },
    }),
    "longest-medal-span": record({
      title: "Medallas más distantes",
      description: "Más años entre la primera y la última medalla de un atleta en eventos del World Tour de la IJF y en los Juegos Olímpicos.",
      noun: "athletes",
      sortLabel: "años",
    }),
    "best-finals-record": record({
      title: "Mejor balance en finales",
      description: "La proporción de finales ganadas en eventos del World Tour de la IJF y en los Juegos Olímpicos, para atletas con al menos 10 finales.",
      noun: "athletes",
      sortLabel: "ganadas",
    }),
    "least-likely-champion": record({
      title: "Campeón menos probable",
      breakAfter: "Campeón",
      description: "Campeones del World Tour a los que el rating dio la menor probabilidad de ganar todos los combates de su cuadro, desde 2011.",
      noun: "titles",
      sortLabel: "probabilidad",
    }),
    "longest-winning-streak": record({
      title: "Racha de victorias más larga",
      description: "Combates ganados seguidos.",
      noun: "athletes",
      sortLabel: "victorias",
    }),
    "biggest-upsets": record({
      title: "Mayores sorpresas",
      description: "Victorias sobre un atleta del top 10 del peso a las que el rating dio la menor probabilidad antes del combate, desde 2011.",
      noun: "contests",
      sortLabel: "probabilidad",
    }),
    "giant-killer": record({
      title: "Matagigantes",
      description: "Victorias sin ser favorito sobre atletas que entonces estaban en el top 10 del peso, desde 2011.",
      noun: "athletes",
      sortLabel: "sorpresas",
    }),
    "golden-score-king": record({
      title: "Rey del golden score",
      description: "Combates ganados en golden score, desde 2017.",
      noun: "athletes",
      sortLabel: "victorias en golden score",
    }),
    "longest-contest": record({
      title: "Combate más largo",
      description: "Los combates más largos del World Tour, golden score incluido.",
      noun: "contests",
      sortLabel: "tiempo",
    }),
    "greatest-rivalry": record({
      title: "Mayor rivalidad",
      description:
        "Las parejas que más veces se enfrentaron en la élite y de forma más igualada. Cada duelo puntúa por el rating del atleta más débil antes del combate, de 0 a 1900 a 1 a 2500. La suma se reduce si el cara a cara es desigual: Σ min(1, max(0, (rating − 1900) / 600)) × (1 − ((victorias − derrotas) / duelos)²).",
      noun: "rivalries",
      sortLabel: "puntuación",
    }),
    "longest-rivalry": record({
      title: "Rivalidad más larga",
      description:
        "Más años entre el primer y el último duelo de una pareja. Una pareja que se enfrentó pocas veces cuenta menos: años × (duelos − 1) / (duelos + 1).",
      noun: "rivalries",
      sortLabel: "puntuación",
    }),
    nemesis: record({
      title: "Bestia negra",
      description:
        "Atletas que ganaron una y otra vez a un rival más fuerte. Solo cuentan los duelos en los que el rating no los daba como favoritos: cada uno suma la victoria más allá de la probabilidad que tenían, y más cuanto más fuerte era el rival: Σ (victoria − probabilidad) × min(1, max(0, (rating del rival − 1900) / 600)).",
      noun: "pairs",
      sortLabel: "puntuación",
    }),
    "strongest-tournament": record({
      title: "Torneo más fuerte",
      description: "El rating medio, antes del torneo, de los 8 mejores participantes de cada peso, desde 2011.",
      noun: "tournaments",
      sortLabel: "rating medio",
    }),
    "most-nations-on-the-podium": record({
      title: "Más países en el podio",
      description: "Los torneos cuyas medallas se repartieron entre más países.",
      noun: "tournaments",
      sortLabel: "países",
    }),
    "most-unpredictable-tournament": record({
      title: "Torneo más impredecible",
      breakAfter: "Torneo",
      description: "Los torneos cuyos combates peor predijo el rating (el log loss más alto), desde 2011.",
      noun: "tournaments",
      sortLabel: "log loss",
    }),
    "highest-team-rating": record({
      title: "Rating de equipo más alto",
      description: "El rating de equipo más alto que alcanzó cada país desde 2011.",
      noun: "nations",
      sortLabel: "rating",
    }),
    "most-medals": record({
      title: "Más medallas",
      description: "Medallas en eventos del World Tour de la IJF y en los Juegos Olímpicos, por país.",
      noun: "nations",
      sortLabel: "medallas",
    }),
    "deepest-team": record({
      title: "Equipo con más fondo",
      description: "Más atletas de un mismo país en el top 10 de sus pesos en un mismo día, desde 2011.",
      noun: "nations",
      sortLabel: "atletas",
    }),
  },
} satisfies typeof en.records;
