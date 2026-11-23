import { type ContactProse, DATA, EMAIL, ISSUES, LINK } from "./types";

export const pt: ContactProse = {
  meta: {
    title: "Contato",
    description: "Como falar com o Another Judo Rating: perguntas, correções e ideias por e-mail, erros e resultados incorretos no GitHub.",
  },
  title: "Contato",
  questions: (
    <>
      Perguntas, correções e ideias:{" "}
      <a href={`mailto:${EMAIL}`} className={LINK}>
        {EMAIL}
      </a>
      .
    </>
  ),
  issues: (
    <>
      Um resultado errado, uma luta que falta, dois atletas juntados em um só ou um erro no site:{" "}
      <a href={ISSUES} target="_blank" rel="noopener" className={LINK}>
        abra uma issue no GitHub
      </a>
      , com o link da página.
    </>
  ),
  dataset: (
    <>
      O conjunto de dados, sua licença e pedidos de remoção:{" "}
      <a href={`mailto:${DATA}`} className={LINK}>
        {DATA}
      </a>
      .
    </>
  ),
};
