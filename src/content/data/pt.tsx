import { CONTACT, type DataProse, JUDOBASE, LICENSE, LINK } from "./types";

export const pt: DataProse = {
  meta: {
    title: "Dados do rating de judô, download em CSV",
    description:
      "Baixe a história completa do rating de cada judoca do World Tour em CSV: todas as lutas desde 2009 com chances de vitória e ratings antes e depois. CC BY 4.0.",
  },
  title: "Exportar dados",
  intro: (
    <>
      Tudo de que as tabelas são feitas, em arquivos para baixar e reproduzir. Uma linha por atleta por luta: quem lutou com quem, em que dia e em que
      categoria, a chance de cada lado antes da luta, e o rating, seu desvio e sua volatilidade antes e depois. Mais os atletas e as competições para
      cruzar.
    </>
  ),
  rebuilt: <>Os arquivos são refeitos toda semana.</>,
  files: "Arquivos",
  updated: "Atualizado em {date}.",
  file: "Arquivo",
  rows: "Linhas",
  size: "Tamanho",
  preparing: "O arquivo está sendo preparado: volte em alguns dias.",
  licenseTitle: "Licença e fonte",
  license: (
    <>
      Os ratings, as chances de vitória e estes arquivos compilados são publicados pelo Another Judo Rating sob a licença{" "}
      <a href={LICENSE} className={LINK}>
        CC BY 4.0
      </a>
      : use para o que quiser, inclusive comercialmente, citando a fonte “Another Judo Rating (anotherjudorating.com)”.
    </>
  ),
  source: (
    <>
      Os resultados das lutas vêm do{" "}
      <a href={JUDOBASE} target="_blank" rel="noopener" className={LINK}>
        IJF judobase
      </a>
      . A IJF mantém todos os direitos sobre os próprios dados. Este arquivo republica só os identificadores, os dias, as categorias e os resultados
      necessários para reproduzir o rating. O Another Judo Rating é independente, sem vínculo com a Federação Internacional de Judô e sem o aval
      dela.
    </>
  ),
  cite: (site) => (
    <>
      Para citar: <i>Another Judo Rating, rating history, {site}/data</i>.
    </>
  ),
  questions: (
    <>
      Perguntas, correções ou um pedido de remoção:{" "}
      <a href={`mailto:${CONTACT}`} className={LINK}>
        {CONTACT}
      </a>
      .
    </>
  ),
};
