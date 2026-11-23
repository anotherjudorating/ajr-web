import { type ContactProse, DATA, EMAIL, ISSUES, LINK } from "./types";

export const es: ContactProse = {
  meta: {
    title: "Contacto",
    description: "Cómo escribir a Another Judo Rating: preguntas, correcciones e ideas por correo, errores y resultados equivocados en GitHub.",
  },
  title: "Contacto",
  questions: (
    <>
      Preguntas, correcciones e ideas:{" "}
      <a href={`mailto:${EMAIL}`} className={LINK}>
        {EMAIL}
      </a>
      .
    </>
  ),
  issues: (
    <>
      Un resultado equivocado, un combate que falta, dos atletas fundidos en uno o un error del sitio:{" "}
      <a href={ISSUES} target="_blank" rel="noopener" className={LINK}>
        abre un issue en GitHub
      </a>
      , con el enlace a la página.
    </>
  ),
  dataset: (
    <>
      El conjunto de datos, su licencia y las solicitudes de retirada:{" "}
      <a href={`mailto:${DATA}`} className={LINK}>
        {DATA}
      </a>
      .
    </>
  ),
};
