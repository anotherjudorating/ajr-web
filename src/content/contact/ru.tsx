import { type ContactProse, DATA, EMAIL, ISSUES, LINK } from "./types";

export const ru: ContactProse = {
  meta: {
    title: "Контакты",
    description: "Как связаться с Another Judo Rating: вопросы, исправления и идеи по почте, ошибки и неверные результаты на GitHub.",
  },
  title: "Контакты",
  questions: (
    <>
      Вопросы, исправления и идеи:{" "}
      <a href={`mailto:${EMAIL}`} className={LINK}>
        {EMAIL}
      </a>
      .
    </>
  ),
  issues: (
    <>
      Неверный результат, пропавшая схватка, два спортсмена, склеенные в одного, или ошибка на сайте:{" "}
      <a href={ISSUES} target="_blank" rel="noopener" className={LINK}>
        откройте issue на GitHub
      </a>
      , со ссылкой на страницу.
    </>
  ),
  dataset: (
    <>
      Набор данных, его лицензия и запросы на удаление:{" "}
      <a href={`mailto:${DATA}`} className={LINK}>
        {DATA}
      </a>
      .
    </>
  ),
};
