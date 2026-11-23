// Head-to-head: the form, the comparison, the chart.

import type { en } from "@/i18n/en";

export const h2h = {
  meta: {
    title: "Cara a cara en judo: compara dos judocas",
    description: "Compara dos judocas cualesquiera: su rating a lo largo del tiempo, la probabilidad de cada uno de ganar hoy y todos sus combates entre sí.",
    pairTitle: "{a} vs {b}",
    pairDescription: "Cara a cara: su rating, la probabilidad de cada uno de ganar hoy y todos sus combates entre sí.",
  },
  title: "Cara a cara",
  lead: "Compara dos atletas: rating, probabilidad de victoria y todos sus enfrentamientos.",
  form: {
    weightCategory: "Categoría de peso",
    chooseWeight: "Elegir peso",
    athlete: "Atleta {n}", // Atleta 1, Atleta 2
    clear: "Borrar",
    searchAthlete: "Buscar atleta",
    noAthletes: "No se encontraron atletas",
  },
  popular: {
    title: "Duelos populares",
    athletes: "Atletas",
    score: "Marcador",
    lastMeeting: "Último enfrentamiento",
  },
  comparison: {
    currentChances: "Probabilidades actuales",
    howRatingsWork: "Cómo funciona el rating",
    athlete: "Atleta",
    rank: "Puesto",
    rating: "Rating",
    skill: "Fuerza",
    rd: "RD",
    days90: "90 días",
    winsLosses12m: "V–D 12 m",
    chance: "Prob.",
    note: "Probabilidad según los ratings. Rating = fuerza − RD.",
    notMet: "Todavía no se han enfrentado en eventos de la IJF.",
    // the meetings' heading
    noMeetings: "Sin enfrentamientos todavía",
    level: "Empate {a}–{b}",
    leads: "{name} domina {high}–{low}",
    // the meetings table's heads, for screen readers
    date: "Fecha",
    tournament: "Torneo",
    round: "Ronda",
    winner: "Ganador",
    winnersChance: "Probabilidad del ganador",
    upset: "Sorpresa",
    theContest: "El combate",
  },
  chart: {
    rating: "Rating",
    // the chart's aria-label
    label: "Rating de {a} y {b}, de {from} a {to}",
  },
} satisfies typeof en.h2h;
