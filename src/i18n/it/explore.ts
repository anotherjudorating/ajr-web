// Explore: the lists of athletes, contests, tournaments and nations, and their filters.

import type { en } from "@/i18n/en";

export const explore = {
  // The tabs over every list (components/explore/ExploreTabs.tsx).
  tabs: {
    label: "Esplora",
    tournaments: "Tornei",
    athletes: "Atleti",
    contests: "Incontri",
    nations: "Nazioni",
  },
  // The parts of the toolbars (components/explore/Controls.tsx).
  controls: {
    exportCsv: "Esporta CSV",
  },
  // Filters that several lists share.
  filters: {
    searchAthlete: "Cerca atleta",
    allWeights: "Tutte le categorie",
    allTournaments: "Tutti i tornei",
  },
  tournaments: {
    meta: {
      title: "Risultati dei tornei di judo",
      description:
        "Tutti i tornei del World Tour di judo dal 2009: Olimpiadi, Mondiali, Grand Slam e Grand Prix, con risultati, sorprese e quante volte ha vinto il favorito.",
    },
    title: "Tornei",
    lead: "Tutti i tornei con rating e quante volte ha vinto il favorito.",
    search: "Cerca torneo o città",
    // The levels (the values are the backend's rank names).
    levels: {
      all: "Tutti i livelli",
      olympics: "Giochi Olimpici",
      worlds: "Campionati del mondo",
      masters: "Masters",
      grandSlam: "Grand Slam",
      grandPrix: "Grand Prix",
      continental: "Continentali",
    },
    sort: {
      "date-desc": "Ordina: data ↓",
      "date-asc": "Ordina: data ↑",
      "accuracy-desc": "Ordina: precisione del rating ↓",
      "accuracy-asc": "Ordina: precisione del rating ↑",
      "upsets-desc": "Ordina: sorprese ↓",
      "upsets-asc": "Ordina: sorprese ↑",
    },
    columns: {
      dates: "Date",
      tournament: "Torneo",
      location: "Luogo",
      accuracy: "Precisione del rating",
      upsets: "Sorprese",
    },
    // The month rows that group the year's tournaments: "gennaio 2026".
    months: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
    monthHeading: "{month} {year}",
    // The chips of a tournament not over yet.
    upcoming: "In arrivo",
    live: "In corso",
    accuracyTip: "Incontri vinti dal favorito del rating, su {contests}",
    empty: "Nessun torneo corrisponde a questi filtri.",
  },
  athletes: {
    meta: {
      title: "Tutti i judoka con rating, cerca per nome, nazione e categoria",
      description: "Tutti i judoka con un rating dal 2009: cerca per nome, filtra per nazione e categoria, ordina per rating, nome o età.",
    },
    title: "Atleti",
    lead: "Tutti gli atleti con un rating, attivi o no.",
    allCountries: "Tutti i paesi",
    menAllWeights: "Uomini, tutte le categorie",
    womenAllWeights: "Donne, tutte le categorie",
    sort: {
      "name-asc": "Ordina: nome ↑",
      "name-desc": "Ordina: nome ↓",
      "age-asc": "Ordina: età ↑",
      "age-desc": "Ordina: età ↓",
      "rating-desc": "Ordina: rating ↓",
    },
    columns: {
      athlete: "Atleta",
      nat: "Naz",
      weight: "Categoria",
      age: "Età",
      lastContest: "Ultimo incontro",
    },
    empty: "Nessun atleta corrisponde a questi filtri.",
    noun: "atleti", // "1–50 di 625 atleti"
  },
  contests: {
    meta: {
      title: "Incontri di judo e sorprese con le probabilità di vittoria",
      description:
        "Tutti gli incontri di judo con rating dal 2009 con la probabilità di vittoria di ciascuno: cerca per atleta, filtra per torneo e categoria, trova le sorprese più grandi.",
    },
    title: "Incontri",
    lead: "Tutti gli incontri con rating, con probabilità di vittoria e variazioni di rating.",
    allContests: "Tutti gli incontri",
    upsets: "Sorprese",
    sort: {
      "date-desc": "Ordina: data ↓",
      "date-asc": "Ordina: data ↑",
      "chance-asc": "Ordina: probabilità del vincitore ↑",
    },
    columns: {
      athletes: "Atleti",
      tournament: "Torneo",
      weight: "Categoria",
      round: "Turno",
      chance: "Prob.",
      result: "V/S",
      change: "+/−",
    },
    upset: "Sorpresa", // the chip of a row
    won: "V",
    lost: "S",
    empty: "Nessun incontro corrisponde a questi filtri.",
    noun: "incontri",
  },
  nations: {
    meta: {
      title: "Le nazioni del judo e i loro atleti con rating",
      description: "Tutte le nazioni del judo con un atleta con rating: quanti ne hanno e quanti sono nelle classifiche di oggi, con una pagina per ciascuna.",
    },
    title: "Nazioni",
    lead: "Tutte le nazioni con atleti con rating.",
    search: "Cerca nazione",
    sort: {
      "name-asc": "Ordina: nome ↑",
      "name-desc": "Ordina: nome ↓",
      "athletes-desc": "Ordina: atleti ↓",
      "athletes-asc": "Ordina: atleti ↑",
    },
    columns: {
      nation: "Nazione",
      athletes: "Atleti",
      athletesTip: "Atleti con rating, tra parentesi quelli in classifica oggi",
    },
    empty: "Nessuna nazione corrisponde a questi filtri.",
    noun: "nazioni",
  },
} satisfies typeof en.explore;
