import { CONTACT, type DataProse, JUDOBASE, LICENSE, LINK } from "./types";

export const fr: DataProse = {
  meta: {
    title: "Données de cote judo, téléchargement CSV",
    description:
      "Téléchargez l’historique complet des cotes de chaque judoka du World Tour en CSV : tous les combats depuis 2009 avec les chances de victoire et les cotes avant et après. CC BY 4.0.",
  },
  title: "Exporter les données",
  intro: (
    <>
      Tout ce qui sert à construire les classements, en fichiers à télécharger et à recalculer. Une ligne par athlète et par combat : qui a combattu
      qui, quel jour et dans quelle catégorie, la chance de chaque côté avant le combat, et la cote, son incertitude et sa volatilité avant et après.
      Plus les athlètes et les compétitions pour faire les jointures.
    </>
  ),
  rebuilt: <>Les fichiers sont reconstruits chaque semaine.</>,
  files: "Fichiers",
  updated: "Mis à jour le {date}.",
  file: "Fichier",
  rows: "Lignes",
  size: "Taille",
  preparing: "L’archive est en préparation : revenez dans quelques jours.",
  licenseTitle: "Licence et source",
  license: (
    <>
      Les cotes, les chances de victoire et ces fichiers compilés sont publiés par Another Judo Rating sous licence{" "}
      <a href={LICENSE} className={LINK}>
        CC BY 4.0
      </a>
      : utilisez-les pour n’importe quoi, y compris commercialement, en citant « Another Judo Rating (anotherjudorating.com) ».
    </>
  ),
  source: (
    <>
      Les résultats des combats viennent de la{" "}
      <a href={JUDOBASE} target="_blank" rel="noopener" className={LINK}>
        base judobase de l’IJF
      </a>
      . L’IJF conserve tous les droits sur ses propres données, cette archive ne republie que les identifiants, les jours, les catégories et les
      résultats nécessaires pour reproduire la cote. Another Judo Rating est indépendant et n’est ni affilié à la Fédération internationale de judo ni
      approuvé par elle.
    </>
  ),
  cite: (site) => (
    <>
      Pour citer : <i>Another Judo Rating, rating history, {site}/data</i>.
    </>
  ),
  questions: (
    <>
      Questions, corrections ou demande de retrait :{" "}
      <a href={`mailto:${CONTACT}`} className={LINK}>
        {CONTACT}
      </a>
      .
    </>
  ),
};
