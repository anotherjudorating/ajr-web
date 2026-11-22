// Слова, общие для всего сайта: месяцы, веса, стадии сетки, места, счётчики.

import type { en } from "@/i18n/en";
import { countries } from "@/i18n/ru/countries";
import { forms } from "@/i18n/t";

export const common = {
  // После числа: «5 мая 2026» (родительный падеж, без точки).
  months: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
  // Месяц сам по себе: «май 2026».
  monthsStandalone: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
  // Место: «1-е», «2-е», «11-е» (у русских порядковых одна форма).
  ordinal: forms({ other: "{n}-е" }),
  gender: { men: "Мужчины", women: "Женщины", mixed: "Смешанный" },
  // «Мужчины −73 кг»: вес в заголовке таблицы или страницы
  weightTitle: "{gender} {label} кг",
  // Стадия сетки словами (коды F, 1/2, 1/4, BR, REP, R1 остаются как есть).
  rounds: {
    F: "Финал",
    "1/2": "1/2 финала",
    "1/4": "1/4 финала",
    BR: "Схватка за бронзу",
    REP: "Утешение",
    ofFinal: "{code} финала", // «1/8 финала»
    tour: "Круг {n}", // круг в групповом турнире
  },
  ratingGap: "Разница рейтингов {points}",
  // Уровни турниров (lib/levels.ts), по id.
  levels: {
    olympics: "Олимпийские игры",
    worlds: "Чемпионат мира",
    continental: "Континентальные чемпионаты",
    masters: "Masters",
    grandSlam: "Grand Slam",
    grandPrix: "Grand Prix",
    opens: "Открытые турниры и кубки",
    other: "Прочие",
  },
  // Названия стран по коду IOC (ru/countries.ts).
  countries,
  // Результаты так, как их называет база.
  results: { gold: "Золото", silver: "Серебро", bronze: "Бронза", "5th": "5-е", "7th": "7-е" },
  contests: forms({ one: "{n} схватка", few: "{n} схватки", many: "{n} схваток", other: "{n} схватки" }),
  medals: forms({ one: "{n} медаль", few: "{n} медали", many: "{n} медалей", other: "{n} медали" }),
  athletes: forms({ one: "{n} спортсмен", few: "{n} спортсмена", many: "{n} спортсменов", other: "{n} спортсмена" }),
  tournaments: forms({ one: "{n} турнир", few: "{n} турнира", many: "{n} турниров", other: "{n} турнира" }),
  nations: forms({ one: "{n} страна", few: "{n} страны", many: "{n} стран", other: "{n} страны" }),
  weeks: forms({ one: "{n} неделя", few: "{n} недели", many: "{n} недель", other: "{n} недели" }),
  days: forms({ one: "{n} день", few: "{n} дня", many: "{n} дней", other: "{n} дня" }),
  years: forms({ one: "{n} год", few: "{n} года", many: "{n} лет", other: "{n} года" }),
  wins: forms({ one: "{n} победа", few: "{n} победы", many: "{n} побед", other: "{n} победы" }),
  losses: forms({ one: "{n} поражение", few: "{n} поражения", many: "{n} поражений", other: "{n} поражения" }),
  // строки рекордов (components/records: noun рекорда называет одну из этих форм)
  titles: forms({ one: "{n} титул", few: "{n} титула", many: "{n} титулов", other: "{n} титула" }),
  rivalries: forms({ one: "{n} противостояние", few: "{n} противостояния", many: "{n} противостояний", other: "{n} противостояния" }),
  pairs: forms({ one: "{n} пара", few: "{n} пары", many: "{n} пар", other: "{n} пары" }),
} satisfies typeof en.common;
