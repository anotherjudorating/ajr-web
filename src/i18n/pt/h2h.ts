// Head-to-head: the form, the comparison, the chart.

import type { en } from "@/i18n/en";

export const h2h = {
  meta: {
    title: "Confronto direto no judô, compare dois judocas",
    description: "Compare dois judocas quaisquer: os ratings ao longo do tempo, a chance de cada um vencer hoje e todas as lutas entre eles.",
    pairTitle: "{a} x {b}",
    pairDescription: "Confronto direto: os ratings, a chance de cada um vencer hoje e todas as lutas entre eles.",
  },
  title: "Confrontos",
  lead: "Compare dois atletas: ratings, chance de vitória e todos os encontros.",
  form: {
    weightCategory: "Categoria",
    chooseWeight: "Escolha a categoria",
    athlete: "Atleta {n}", // Atleta 1, Atleta 2
    clear: "Limpar",
    searchAthlete: "Buscar atleta",
    noAthletes: "Nenhum atleta encontrado",
  },
  popular: {
    title: "Confrontos populares",
    athletes: "Atletas",
    score: "Placar",
    lastMeeting: "Último encontro",
  },
  comparison: {
    currentChances: "Chances atuais",
    howRatingsWork: "Como funciona o rating",
    athlete: "Atleta",
    rank: "Posição",
    rating: "Rating",
    skill: "Força",
    rd: "RD",
    days90: "90 dias",
    winsLosses12m: "V–D 12 m",
    chance: "Chance",
    note: "Chance calculada pelos ratings. Rating = força − RD.",
    notMet: "Ainda não se enfrentaram em eventos da IJF.",
    // the meetings' heading
    noMeetings: "Nenhum encontro ainda",
    level: "Empate em {a}–{b}",
    leads: "{name} lidera por {high}–{low}",
    // the meetings table's heads, for screen readers
    date: "Data",
    tournament: "Torneio",
    round: "Fase",
    winner: "Vencedor",
    winnersChance: "Chance do vencedor",
    upset: "Surpresa",
    theContest: "A luta",
  },
  chart: {
    rating: "Rating",
    // the chart's aria-label
    label: "Rating de {a} e {b}, de {from} a {to}",
  },
} satisfies typeof en.h2h;
