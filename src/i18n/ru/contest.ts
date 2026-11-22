// Страница схватки.

import type { en } from "@/i18n/en";

export const contest = {
  meta: {
    names: "{white} vs {blue}",
    title: "{names}: {round}, {competition}",
    noRound: "схватка", // схватка без известной стадии
  },
  tournaments: "Турниры", // хлебная крошка
  contest: "Схватка", // последний шаг крошек, когда стадия неизвестна
  heading: "{white} vs {blue}: {round}, {weight}, {competition}",
  result: {
    title: "Результат схватки",
    athlete: "Спортсмен",
    // оценки: иппон, ваза-ари, юко
    ippon: "И",
    wazaari: "В",
    yuko: "Ю",
    shido: "Сидо",
    result: "Итог",
    win: "Победа",
    notFoughtYet: "Ещё не прошла",
    walkover: "Неявка",
    notRated: "без рейтинга",
    time: "Время",
    goldenScore: "GS",
  },
  walkover: {
    title: "Изменение рейтинга",
    howRatingsWork: "Как устроен рейтинг",
    fusen: "Неявка: {name}, фусэн-гати (победа без схватки).",
    nothingFought: "Неявка: схватки не было, ни времени, ни оценок.",
    noChange: "Победа без борьбы ничего не говорит о том, кто сильнее, поэтому рейтинги не меняются.",
  },
  ratingChange: {
    title: "Изменение рейтинга",
    ifWins: "Если побеждает этот спортсмен",
    wins: "Побеждает {name}", // кнопка, выбирающая победителя предстоящей схватки
    howRatingsWork: "Как устроен рейтинг",
    athlete: "Спортсмен",
    chance: "Шанс",
    skill: "Сила",
    rd: "RD",
    rating: "Рейтинг",
    formula: "Рейтинг = сила − RD. Меньше RD, выше рейтинг.",
    picked: "Схватки ещё не было: что даст выбранный исход.",
  },
  road: {
    title: "Путь к схватке: {round}", // стадия со строчной буквы
    titleContest: "Путь к схватке",
    first: "Первая схватка на турнире.",
    upset: "Сенсация",
    theContest: "Схватка",
  },
  meetings: {
    title: "Прошлые встречи",
    level: "Ничья {white}–{blue}",
    leads: "{name} ведёт {more}–{fewer}",
    headToHead: "Очные встречи",
    first: "Их первая встреча.",
    firstBefore: "Их первая встреча: до этой не было.",
  },
} satisfies typeof en.contest;
