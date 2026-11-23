// Explore: the lists of athletes, contests, tournaments and nations, and their filters.

import type { en } from "@/i18n/en";

export const explore = {
  // The tabs over every list (components/explore/ExploreTabs.tsx).
  tabs: {
    label: "Explorer",
    tournaments: "Tournois",
    athletes: "Athlètes",
    contests: "Combats",
    nations: "Nations",
  },
  // The parts of the toolbars (components/explore/Controls.tsx).
  controls: {
    exportCsv: "Exporter en CSV",
  },
  // Filters that several lists share.
  filters: {
    searchAthlete: "Rechercher un athlète",
    allWeights: "Toutes catégories",
    allTournaments: "Tous les tournois",
  },
  tournaments: {
    meta: {
      title: "Résultats des tournois de judo",
      description:
        "Tous les tournois du World Tour de judo depuis 2009 : Jeux olympiques, championnats du monde, Grand Slams et Grand Prix, avec les résultats, les surprises et la part de combats gagnés par le favori.",
    },
    title: "Tournois",
    lead: "Tous les tournois cotés et la part de combats gagnés par le favori.",
    search: "Rechercher un tournoi ou une ville",
    // The levels (the values are the backend's rank names).
    levels: {
      all: "Tous les niveaux",
      olympics: "Jeux olympiques",
      worlds: "Championnats du monde",
      masters: "Masters",
      grandSlam: "Grand Slam",
      grandPrix: "Grand Prix",
      continental: "Continental",
    },
    sort: {
      "date-desc": "Tri : date ↓",
      "date-asc": "Tri : date ↑",
      "accuracy-desc": "Tri : précision de la cote ↓",
      "accuracy-asc": "Tri : précision de la cote ↑",
      "upsets-desc": "Tri : surprises ↓",
      "upsets-asc": "Tri : surprises ↑",
    },
    columns: {
      dates: "Dates",
      tournament: "Tournoi",
      location: "Lieu",
      accuracy: "Précision de la cote",
      upsets: "Surprises",
    },
    // The month rows that group the year's tournaments: "janvier 2026".
    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    monthHeading: "{month} {year}",
    // The chips of a tournament not over yet.
    upcoming: "À venir",
    live: "En direct",
    accuracyTip: "Combats gagnés par le favori de la cote, sur {contests}",
    empty: "Aucun tournoi ne correspond à ces filtres.",
  },
  athletes: {
    meta: {
      title: "Tous les judokas cotés, recherche par nom, nation et catégorie",
      description: "Tous les judokas cotés depuis 2009 : recherche par nom, filtre par nation et catégorie, tri par cote, nom ou âge.",
    },
    title: "Athlètes",
    lead: "Tous les athlètes cotés, actifs ou non.",
    allCountries: "Tous les pays",
    menAllWeights: "Hommes, toutes catégories",
    womenAllWeights: "Femmes, toutes catégories",
    sort: {
      "name-asc": "Tri : nom ↑",
      "name-desc": "Tri : nom ↓",
      "age-asc": "Tri : âge ↑",
      "age-desc": "Tri : âge ↓",
      "rating-desc": "Tri : cote ↓",
    },
    columns: {
      athlete: "Athlète",
      nat: "Nat",
      weight: "Catégorie",
      age: "Âge",
      lastContest: "Dernier combat",
    },
    empty: "Aucun athlète ne correspond à ces filtres.",
    noun: "athletes", // "1–50 sur 625 athlètes"
  },
  contests: {
    meta: {
      title: "Combats de judo et surprises, avec les chances de victoire",
      description:
        "Tous les combats de judo cotés depuis 2009 avec la chance de chaque côté : recherche par athlète, filtre par tournoi et catégorie, les plus grosses surprises.",
    },
    title: "Combats",
    lead: "Tous les combats cotés, avec les chances de victoire et les variations de cote.",
    allContests: "Tous les combats",
    upsets: "Surprises",
    sort: {
      "date-desc": "Tri : date ↓",
      "date-asc": "Tri : date ↑",
      "chance-asc": "Tri : chance du vainqueur ↑",
    },
    columns: {
      athletes: "Athlètes",
      tournament: "Tournoi",
      weight: "Cat.",
      round: "Tour",
      chance: "Chance",
      result: "V/D",
      change: "+/−",
    },
    upset: "Surprise", // the chip of a row
    won: "V",
    lost: "D",
    empty: "Aucun combat ne correspond à ces filtres.",
    noun: "contests",
  },
  nations: {
    meta: {
      title: "Les nations du judo et leurs athlètes cotés",
      description: "Toutes les nations du judo avec un athlète coté : combien elles en ont et combien figurent aujourd’hui dans les classements, avec une page par nation.",
    },
    title: "Nations",
    lead: "Toutes les nations ayant des athlètes cotés.",
    search: "Rechercher une nation",
    sort: {
      "name-asc": "Tri : nom ↑",
      "name-desc": "Tri : nom ↓",
      "athletes-desc": "Tri : athlètes ↓",
      "athletes-asc": "Tri : athlètes ↑",
    },
    columns: {
      nation: "Nation",
      athletes: "Athlètes",
      athletesTip: "Athlètes cotés, entre parenthèses ceux présents aujourd’hui dans un classement",
    },
    empty: "Aucune nation ne correspond à ces filtres.",
    noun: "nations",
  },
} satisfies typeof en.explore;
