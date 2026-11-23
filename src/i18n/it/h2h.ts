// Head-to-head: the form, the comparison, the chart.

import type { en } from "@/i18n/en";

export const h2h = {
  meta: {
    title: "Testa a testa nel judo, confronta due judoka",
    description: "Confronta due judoka qualsiasi: i loro rating nel tempo, la probabilità di vittoria di ciascuno oggi e tutti gli incontri tra loro.",
    pairTitle: "{a} vs {b}",
    pairDescription: "Testa a testa: i rating, la probabilità di vittoria di ciascuno oggi e tutti gli incontri tra loro.",
  },
  title: "Testa a testa",
  lead: "Confronta due atleti: rating, probabilità di vittoria e tutti i precedenti.",
  form: {
    weightCategory: "Categoria di peso",
    chooseWeight: "Scegli la categoria",
    athlete: "Atleta {n}", // Atleta 1, Atleta 2
    clear: "Cancella",
    searchAthlete: "Cerca atleta",
    noAthletes: "Nessun atleta trovato",
  },
  popular: {
    title: "Confronti più cercati",
    athletes: "Atleti",
    score: "Bilancio",
    lastMeeting: "Ultimo incontro",
  },
  comparison: {
    currentChances: "Probabilità attuali",
    howRatingsWork: "Come funziona il rating",
    athlete: "Atleta",
    rank: "Pos.",
    rating: "Rating",
    skill: "Forza",
    rd: "RD",
    days90: "90 giorni",
    winsLosses12m: "V–S 12 mesi",
    chance: "Probabilità",
    note: "Probabilità dai rating. Rating = forza − RD.",
    notMet: "Non si sono ancora incontrati in gare IJF.",
    // the meetings' heading
    noMeetings: "Nessun precedente",
    level: "Pari {a}–{b}",
    leads: "{name} conduce {high}–{low}",
    // the meetings table's heads, for screen readers
    date: "Data",
    tournament: "Torneo",
    round: "Turno",
    winner: "Vincitore",
    winnersChance: "Probabilità del vincitore",
    upset: "Sorpresa",
    theContest: "L’incontro",
  },
  chart: {
    rating: "Rating",
    // the chart's aria-label
    label: "Rating di {a} e {b}, dal {from} al {to}",
  },
} satisfies typeof en.h2h;
