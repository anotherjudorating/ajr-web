import { CONTACT, type DataProse, JUDOBASE, LICENSE, LINK } from "./types";

export const es: DataProse = {
  meta: {
    title: "Datos del rating de judo, descarga en CSV",
    description:
      "Descarga la historia completa del rating de cada judoca del World Tour en CSV: todos los combates desde 2009 con probabilidades de victoria y ratings antes y después. CC BY 4.0.",
  },
  title: "Exportar datos",
  intro: (
    <>
      Todo aquello con lo que se construyen las tablas, en archivos que se pueden descargar y reproducir. Una fila por atleta y combate: quién
      combatió contra quién, qué día y en qué peso, la probabilidad de cada lado antes del combate, y el rating, su desviación y su volatilidad
      antes y después. Más los atletas y las competiciones para cruzar los datos.
    </>
  ),
  rebuilt: <>Los archivos se regeneran cada semana.</>,
  files: "Archivos",
  updated: "Actualizado el {date}.",
  file: "Archivo",
  rows: "Filas",
  size: "Tamaño",
  preparing: "El archivo se está preparando: vuelve en unos días.",
  licenseTitle: "Licencia y fuente",
  license: (
    <>
      Los ratings, las probabilidades de victoria y estos archivos compilados los publica Another Judo Rating bajo{" "}
      <a href={LICENSE} className={LINK}>
        CC BY 4.0
      </a>
      : se pueden usar para cualquier fin, también comercial, citando «Another Judo Rating (anotherjudorating.com)».
    </>
  ),
  source: (
    <>
      Los resultados de los combates proceden de{" "}
      <a href={JUDOBASE} target="_blank" rel="noopener" className={LINK}>
        IJF judobase
      </a>
      . La IJF conserva todos los derechos sobre sus propios datos: este archivo vuelve a publicar solo los identificadores, días, pesos y
      resultados necesarios para reproducir el rating. Another Judo Rating es independiente y no está afiliado a la Federación Internacional de
      Judo ni cuenta con su respaldo.
    </>
  ),
  cite: (site) => (
    <>
      Para citar: <i>Another Judo Rating, rating history, {site}/data</i>.
    </>
  ),
  questions: (
    <>
      Preguntas, correcciones o solicitudes de retirada:{" "}
      <a href={`mailto:${CONTACT}`} className={LINK}>
        {CONTACT}
      </a>
      .
    </>
  ),
};
