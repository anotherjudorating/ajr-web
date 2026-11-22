// Очные встречи: форма, сравнение, график.

import type { en } from "@/i18n/en";

export const h2h = {
  meta: {
    title: "Очные встречи в дзюдо: сравнить двух дзюдоистов",
    description: "Сравните любых двух дзюдоистов: рейтинги во времени, шанс каждого победить сегодня и все их схватки между собой.",
    pairTitle: "{a} vs {b}",
    pairDescription: "Очные встречи: рейтинги, шанс каждого победить сегодня и все схватки между ними.",
  },
  title: "Очные встречи",
  lead: "Сравните двух спортсменов: рейтинги, шанс на победу и все их встречи.",
  form: {
    weightCategory: "Весовая категория",
    chooseWeight: "Выберите вес",
    athlete: "Спортсмен {n}", // Спортсмен 1, Спортсмен 2
    clear: "Очистить",
    searchAthlete: "Поиск спортсмена",
    noAthletes: "Спортсмены не найдены",
  },
  popular: {
    title: "Популярные пары",
    athletes: "Спортсмены",
    score: "Счёт",
    lastMeeting: "Последняя встреча",
  },
  comparison: {
    currentChances: "Шансы сегодня",
    howRatingsWork: "Как устроен рейтинг",
    athlete: "Спортсмен",
    rank: "Место",
    rating: "Рейтинг",
    skill: "Сила",
    rd: "RD",
    days90: "90 дней",
    winsLosses12m: "В–П за год",
    chance: "Шанс",
    note: "Шанс по рейтингам. Рейтинг = сила − RD.",
    notMet: "На турнирах IJF они ещё не встречались.",
    // заголовок встреч
    noMeetings: "Встреч пока нет",
    level: "Ничья {a}–{b}",
    leads: "{name} ведёт {high}–{low}",
    // заголовки таблицы встреч, для скринридеров
    date: "Дата",
    tournament: "Турнир",
    round: "Стадия",
    winner: "Победитель",
    winnersChance: "Шанс победителя",
    upset: "Сенсация",
    theContest: "Схватка",
  },
  chart: {
    rating: "Рейтинг",
    // aria-label графика
    label: "Рейтинг {a} и {b}, с {from} по {to}",
  },
} satisfies typeof en.h2h;
