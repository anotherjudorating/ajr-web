// Страницы турнира: шапка, обзор, сетка и результаты веса.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const tournament = {
  // заголовки и описания для поисковиков (generateMetadata)
  meta: {
    title: "{name}: результаты, дзюдо",
    description: "{name}: медалисты каждого веса, медали по странам, главные сенсации и изменения рейтинга.",
    weightTitle: "{weight}, {name}: результаты",
    weightDescription: "{weight} на турнире {name}.",
    // «…: золото Fawaz M. (FRA), серебро …»
    weightDescriptionMedallists: "{weight} на турнире {name}: {medallists}.",
    medallist: "{medal} {name}",
    medallistOf: "{medal} {name} ({country})",
  },
  // медали со строчной буквы: описание страницы веса, подсказки медальных колонок
  medal: { gold: "золото", silver: "серебро", bronze: "бронза" },
  // «−73 кг»: строка веса, пункт веса
  kg: "{label} кг",
  header: {
    // «7–8 дек 2026»: дни незакончившегося турнира
    dates: "{range} {year}",
    live: "Идёт",
    upcoming: "Скоро",
    loading: "Загрузка",
  },
  nav: {
    tournaments: "Турниры", // хлебная крошка
    weightCategories: "Весовые категории",
    all: "Все", // вкладка обзора
    notStarted: "Не начался",
  },
  // страница турнира до публикации жеребьёвки IJF
  noDraw: {
    title: "Жеребьёвка ещё не опубликована",
    lead: "Шансы на медали появятся здесь, когда IJF опубликует жеребьёвку, обычно за день-два до турнира.",
  },
  // страница веса до его начала
  weightNotStarted: {
    title: "{weight}: ещё впереди",
    lead: "Сетка, шансы на медали и схватки появятся здесь, когда IJF их опубликует, обычно накануне дня соревнований.",
  },
  podium: {
    title: "Подиум",
    menOrWomen: "Мужчины или женщины",
    prediction: "Прогноз подиума",
    howItWorks: "Как это устроено",
    ratingBeforeAfter: "Рейтинг до → после турнира",
  },
  nationMedals: {
    title: "Медали по странам",
    allMenOrWomen: "Все, мужчины или женщины",
    all: "Все",
    nation: "Страна",
    total: "Всего",
  },
  upsets: {
    title: "Главные сенсации",
    all: forms({ one: "Все {n} сенсация", few: "Все {n} сенсации", many: "Все {n} сенсаций", other: "Все {n} сенсации" }),
  },
  gains: {
    title: "Больше всех прибавили",
    all: "Все изменения рейтинга",
    athlete: "Спортсмен",
    rating: "Рейтинг",
  },
  // спортсмены веса, их места и схватки
  athletes: {
    title: "Спортсмены",
    search: "Поиск спортсмена",
    allNations: "Все страны",
    allAthletes: "Все спортсмены",
    stillIn: "Ещё борются",
    placed: "Завершили",
    sortPlace: "Сортировка: место",
    sortRating: "Сортировка: рейтинг ↓",
    sortChange: "Сортировка: +/− ↓",
    sortName: "Сортировка: имя",
    place: "Место",
    athlete: "Спортсмен",
    nation: "Стр.",
    winsLosses: "В–П",
    before: "До",
    rating: "Рейтинг",
    showContests: "Показать схватки",
    contests: "Схватки", // панель раскрытой строки
    noContests: "Схваток пока нет.",
  },
  contests: {
    title: "Схватки",
    showAs: "Показать схватки как",
    bracket: "Сетка",
    list: "Список",
    athletes: "Спортсмены",
    chance: "Шанс",
    winLoss: "В/П",
    // групповые строки стадий (по несколько схваток)
    rounds: { BR: "За бронзу", "1/2": "1/2 финала", "1/4": "1/4 финала", ofFinal: "{code} финала" },
    noRound: "Схватки", // схватки без известной стадии
    upset: "Сенсация",
    walkover: "Неявка",
    // буквы результата
    win: "В",
    loss: "П",
    walkoverCode: "WO",
    anUpset: "Сенсация",
    walkoverTitle: "Неявка: схватки не было",
    // предстоящая схватка, оба спортсмена известны
    nextTitle: "Ещё не прошла: шансы по рейтингу AJR и что даст каждый исход",
    // предстоящая схватка, спортсмены ещё не известны
    likelyTitle: "Ещё не определена: самые вероятные с каждой стороны и их шансы друг против друга",
    toBeFought: "Предстоит",
    bye: "Без соперника",
    pool: "Группа {letter}",
  },
} satisfies typeof en.tournament;
