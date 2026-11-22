// Explore: the lists of athletes, contests, tournaments and nations, and their filters.

export const explore = {
  // The tabs over every list (components/explore/ExploreTabs.tsx).
  tabs: {
    label: "Explore",
    tournaments: "Tournaments",
    athletes: "Athletes",
    contests: "Contests",
    nations: "Nations",
  },
  // The parts of the toolbars (components/explore/Controls.tsx).
  controls: {
    exportCsv: "Export CSV",
  },
  // Filters that several lists share.
  filters: {
    searchAthlete: "Search athlete",
    allWeights: "All weights",
    allTournaments: "All tournaments",
  },
  tournaments: {
    meta: {
      title: "Judo tournament results",
      description:
        "Every judo World Tour tournament since 2009: Olympics, Worlds, Grand Slams and Grand Prix, with results, upsets and how often the favourite won.",
    },
    title: "Tournaments",
    lead: "Every rated tournament and how often the favourite won.",
    search: "Search tournament or city",
    // The levels (the values are the backend's rank names).
    levels: {
      all: "All levels",
      olympics: "Olympic Games",
      worlds: "World Championships",
      masters: "Masters",
      grandSlam: "Grand Slam",
      grandPrix: "Grand Prix",
      continental: "Continental",
    },
    sort: {
      "date-desc": "Sort: date ↓",
      "date-asc": "Sort: date ↑",
      "accuracy-desc": "Sort: rating accuracy ↓",
      "accuracy-asc": "Sort: rating accuracy ↑",
      "upsets-desc": "Sort: upsets ↓",
      "upsets-asc": "Sort: upsets ↑",
    },
    columns: {
      dates: "Dates",
      tournament: "Tournament",
      location: "Location",
      accuracy: "Rating accuracy",
      upsets: "Upsets",
    },
    // The month rows that group the year's tournaments: "January 2026".
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthHeading: "{month} {year}",
    // The chips of a tournament not over yet.
    upcoming: "Upcoming",
    live: "Live",
    accuracyTip: "Contests won by the rating favourite, of {contests}",
    empty: "No tournaments match these filters.",
  },
  athletes: {
    meta: {
      title: "Every rated judoka, search by name, nation and weight",
      description: "Every judoka with a rating since 2009: search by name, filter by nation and weight, sort by rating, name or age.",
    },
    title: "Athletes",
    lead: "Every athlete with a rating, active or not.",
    allCountries: "All countries",
    menAllWeights: "Men, all weights",
    womenAllWeights: "Women, all weights",
    sort: {
      "name-asc": "Sort: name ↑",
      "name-desc": "Sort: name ↓",
      "age-asc": "Sort: age ↑",
      "age-desc": "Sort: age ↓",
      "rating-desc": "Sort: rating ↓",
    },
    columns: {
      athlete: "Athlete",
      nat: "Nat",
      weight: "Weight",
      age: "Age",
      lastContest: "Last contest",
    },
    empty: "No athletes match these filters.",
    noun: "athletes", // "1–50 of 625 athletes"
  },
  contests: {
    meta: {
      title: "Judo contests and upsets with win chances",
      description:
        "Every rated judo contest since 2009 with each side's win chance: search by athlete, filter by tournament and weight, find the biggest upsets.",
    },
    title: "Contests",
    lead: "Every rated contest with win chances and rating changes.",
    allContests: "All contests",
    upsets: "Upsets",
    sort: {
      "date-desc": "Sort: date ↓",
      "date-asc": "Sort: date ↑",
      "chance-asc": "Sort: winner's chance ↑",
    },
    columns: {
      athletes: "Athletes",
      tournament: "Tournament",
      weight: "Weight",
      round: "Round",
      chance: "Chance",
      result: "W/L",
      change: "+/−",
    },
    upset: "Upset", // the chip of a row
    won: "W",
    lost: "L",
    empty: "No contests match these filters.",
    noun: "contests",
  },
  nations: {
    meta: {
      title: "Judo nations and their rated athletes",
      description: "Every judo nation with a rated athlete: how many it has and how many stand in today's tables, with a page for each.",
    },
    title: "Nations",
    lead: "Every nation with rated athletes.",
    search: "Search nation",
    sort: {
      "name-asc": "Sort: name ↑",
      "name-desc": "Sort: name ↓",
      "athletes-desc": "Sort: athletes ↓",
      "athletes-asc": "Sort: athletes ↑",
    },
    columns: {
      nation: "Nation",
      athletes: "Athletes",
      athletesTip: "Rated athletes; in brackets those in a table today",
    },
    empty: "No nations match these filters.",
    noun: "nations",
  },
};
