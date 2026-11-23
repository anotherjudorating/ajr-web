// The methodology's prose in French, paragraph by paragraph with the English (types.ts).
// Athletes' and tournaments' names in Latin letters, as in the data. Style: impersonal,
// no long dashes, IJF and AJR always compared symmetrically (the owner's decisions of
// 22.11). A no-break space before ":" "?" "!" as French typography wants.

import Link from "@/components/Link";

import type { Prose } from "./types";

const LINK = "underline decoration-rule underline-offset-2 hover:decoration-ink";
const REPO = "https://github.com/anotherjudorating/ajr-backend/tree/main/benchmark";

export const fr: Prose = {
  meta: {
    title: "Comment fonctionne la cote",
    description:
      "Pourquoi Another Judo Rating existe, comment un combat fait bouger la cote et à quel point elle prédit juste : Paris 2024, les points IJF face à la force, un calculateur, et un test sur 24 503 combats contre le classement IJF.",
  },
  title: "Comment fonctionne la cote",
  lead: () => (
    <>
      Une cote pour chaque judoka de la base judobase de l’IJF, d’après tous les combats seniors depuis 2009, environ 227 mille combats. Un nombre par
      athlète, qui répond à une seule question : quelle est la probabilité de battre le prochain adversaire. Cette page dit pourquoi la cote a été
      construite, comment elle est calculée et à quel point elle prédit juste.
    </>
  ),
  why: {
    intro: () => <>Deux choses l’ont déclenchée. La première s’est passée aux Jeux de Paris, la seconde se passe chaque week-end dans une Coupe d’Europe quelque part.</>,
    paris1: () => (
      <>
        Le 28 juillet 2024, à onze heures du matin, la finale olympique des −52 kg féminins s’est jouée en 1/8. Uta Abe, championne olympique de Tokyo,
        rencontrait Diyora Keldiyorova, de l’Ouzbékistan, qui serait championne olympique le soir même. C’était le deuxième combat de la journée pour
        Abe.
      </>
    ),
    paris2: () => (
      <>
        Pourquoi se rencontraient-elles si tôt ? Parce que le tirage au sort suit le classement IJF, la World Ranking List, et que c’est une course aux
        points. On marque des points pour le tour atteint dans les épreuves que l’IJF compte, les six meilleurs résultats de l’année comptent en entier,
        les six de l’année précédente à moitié. La liste décide qui est tête de série aux championnats du monde et aux Jeux olympiques, donc qui évite
        qui.
      </>
    ),
    paris3: () => (
      <>
        Abe arrivait à Paris en championne olympique de Tokyo avec quatre titres mondiaux. Elle avait fait l’impasse sur les championnats du monde 2024
        et disputé deux épreuves du World Tour dans l’année précédant la date limite, si bien qu’au classement IJF elle était 10e des engagées et non
        tête de série. Les Japonaises font souvent ainsi : quelques tournois choisis quand les autres en disputent une douzaine. Keldiyorova avait fait
        toute la saison et était tête de série n°1.
      </>
    ),
    paris4: () => (
      <>
        Keldiyorova l’a projetée pour ippon après trois minutes et a gagné l’or le soir même. Le problème, c’est le tirage. Ce combat aurait dû être une
        finale. Il était injuste pour Abe, et tout autant pour Keldiyorova. Elle a gagné, mais elle avait fait tout ce que le classement IJF demande et
        tirait quand même l’athlète la plus forte de la catégorie à quatre combats d’une médaille, et une défaite l’aurait renvoyée chez elle sans rien.
        Des têtes de série selon la force les auraient tenues à l’écart l’une de l’autre jusqu’au bloc final.
      </>
    ),
    paris5: () => (
      <>
        Des têtes de série selon la force demandent une mesure de la force, et les points IJF ne peuvent pas l’être : ils comptent où une athlète est
        allée et jusqu’où elle est montée, pas qui elle a battu. Une mesure de la force doit peser chaque combat, gagné ou perdu, selon qui était de
        l’autre côté, de sorte que deux tournois contre les meilleures comptent autant qu’une saison de tournois plus faciles. C’est ce que fait AJR.
      </>
    ),
    paris6: (x) => (
      <>
        À la veille du combat, Abe était première du classement AJR, {x.parisLead} points devant la suivante (un n°1 est autour de 2400, un n°10 autour
        de 2050), et Keldiyorova cinquième. AJR donnait à Abe {x.abeChance}% de chances dans leur combat. Une favorite à {x.abeChance}% perd un combat
        sur dix, et c’était celui-là.
      </>
    ),
    afterParisDraw: () => <>Voici le même tableau composé des deux façons, selon le classement IJF et selon la cote AJR.</>,
    afterDraw: () => (
      <>
        Un tableau ne prouve rien dans un sens ni dans l’autre, alors voici tous les tournois depuis le début des archives de l’IJF pour ses listes,
        mars 2025, et une question simple pour chaque catégorie : le numéro 1 a-t-il gagné ? Le numéro 1 IJF a gagné 341 des 1 091 médailles d’or, le
        numéro 1 AJR en a gagné 421. AJR était devant à tous les niveaux sauf les Coupes d’Europe, où l’IJF avait un or d’avance (44 contre 43).
      </>
    ),
    afterNumberOne: () => (
      <>
        Le classement IJF oublie aussi : une année sans compétition divise les points d’une athlète par deux et une deuxième les efface, comme si le repos
        la rendait plus faible que n’importe qui ayant continué à combattre. Une pause coûte peu dans AJR. Abe n’a rien disputé entre Antalya en mars
        et Paris en juillet, et sa cote a baissé de 9 points. Alice Bellandi, d’Italie, a gagné les −78 kg à Paris et n’a rien disputé pendant dix mois,
        sa cote a baissé de 36 points, et en juin 2025 elle est revenue et a gagné les championnats du monde.
      </>
    ),
    newcomers1: () => (
      <>
        Les athlètes hors équipe nationale commencent par les Coupes d’Europe et les Opens continentaux, et ils paient les voyages de leur poche. Une
        Coupe d’Europe ne rapporte aucun point IJF senior. Là où il y a des points IJF, ils paient le tour atteint, jamais l’adversaire : perdre en 1/16
        contre le numéro un mondial vaut la même chose que perdre contre le numéro 80. Beaucoup d’athlètes ont passé deux saisons ainsi, à bien
        combattre, à perdre contre de bons adversaires et à rentrer avec zéro. La plupart ont arrêté.
      </>
    ),
    newcomers2: () => (
      <>
        Ça marche aussi dans l’autre sens. Le 8 juin 2024, sept semaines avant Paris, Lasha Bekauri a gagné les −90 kg et Teddy Riner les +100 kg au
        Madrid European Open : 100 points chacun, un dixième d’un or de Grand Slam et les mêmes 100 points que n’importe quel or d’Open européen cette
        année-là. Les points IJF voient l’étiquette de l’épreuve. Les athlètes qui ont perdu contre Riner ou Bekauri ce jour-là ont reçu ce qu’ils
        auraient reçu en perdant contre n’importe qui.
      </>
    ),
    newcomers3: () => (
      <>
        AJR ne demande que qui vous avez battu, qui vous a battu, et quelle en était la probabilité. Bobur Yangiboyev, d’Ouzbékistan, a disputé ses deux
        premiers Grand Slams à six semaines d’écart et a fait exactement le même parcours aux deux : une victoire en 1/16, une défaite en 1/8. À Tbilisi
        il a battu Akhmed Turluev, coté 2033 contre 1150 pour lui, avec 4% de chances. À Douchanbé il a battu un débutant.
      </>
    ),
    afterPoints: () => <>L’IJF lui a donné 160 points pour chacun. Dans AJR, la première journée a fait passer sa cote de 1150 à 1612, la seconde de 1610 à 1641.</>,
    goldWorth: () => (
      <>
        Un or vaut ce que valaient ses combats. Amandine Buchard, de France, a gagné le Dushanbe Grand Slam en mai 2025 contre quatre athlètes cotées de
        1224 à 1675 : AJR lui donnait 90% de chances de battre les quatre. Akhmed Turluev, né en 2006, a gagné le Ljubljana European Open en février
        2026, son premier tournoi senior, en commençant par une victoire sur Muhammed Koc à 8%.
      </>
    ),
    afterTwoGolds: () => (
      <>
        L’IJF a donné 1 000 points à Buchard et 100 à Turluev. AJR a donné 12 à Buchard, parce qu’elle attendait chacune de ces victoires, et 885 à
        Turluev. C’est pourquoi le battre cinq semaines plus tard a tant rapporté à Yangiboyev.
      </>
    ),
    losses: () => (
      <>
        Les défaites comptent aussi. Le classement IJF garde les meilleurs résultats d’une athlète et oublie le reste, si bien qu’une tête de série qui
        sort à son premier combat dans une épreuve sur deux ne perd rien. Dans AJR chaque défaite coûte, davantage quand l’adversaire est faible, et une
        série de défaites se voit au classement bien avant de se voir dans les points.
      </>
    ),
  },
  number: {
    intro: () => <>La force d’un athlète, la confiance que la cote peut y accorder, et ce qu’un combat change.</>,
    skill1: () => (
      <>
        La <b>force</b> est la meilleure estimation du niveau d’un athlète. Le <b>RD</b> (rating deviation, l’incertitude) dit à quel point l’athlète est
        instable : de combien sa vraie force peut s’écarter de l’estimation, vers le haut ou vers le bas. Tout le monde part d’une force de 1500 avec un
        RD de 350. Les combats font baisser le RD, jusqu’à 50 à 80 pour un habitué, et une longue pause ou des résultats en dents de scie le font
        remonter.
      </>
    ),
    skill2: () => (
      <>
        La cote, le nombre de chaque classement, est la force moins le RD : la force qu’un athlète a prouvée, pas la meilleure estimation. Prenez deux
        athlètes avec une force de 2000. L’un a disputé cinquante combats cette année et a un RD de 60, sa cote est donc 1940. L’autre en a disputé
        trois et a un RD de 300, sa cote est donc 1700. Le second est peut-être tout aussi fort, et le classement le montrera quand les combats le
        montreront.
      </>
    ),
    formula: () => <>Cote = force − RD</>,
    formulaNote: () => <>Un nouveau venu qui gagne un grand combat a une force élevée mais un RD large : la cote attend la preuve.</>,
    calculator1: () => (
      <>
        Avant un combat, les deux cotes donnent une chance. Après, la cote du vainqueur monte et celle du vaincu descend : un peu quand le favori gagne,
        beaucoup quand c’est l’outsider, et davantage pour un athlète au RD large.
      </>
    ),
    calculator2: () => (
      <>
        L’épreuve, le tour et la manière de gagner ne comptent pas : seulement l’adversaire et le résultat. Perdre contre quelqu’un de bien plus fort ne
        coûte presque rien, perdre contre quelqu’un de plus faible coûte cher. Gagner encore et encore au même niveau rapporte de moins en moins, à
        mesure que la cote atteint ce niveau. Changez les nombres et choisissez le vainqueur. Depuis la page d’un combat, le calculateur s’ouvre avec ce
        combat chargé.
      </>
    ),
    career: () => (
      <>
        Sur une carrière, les deux courbes ressemblent à ceci, comme sur la page de chaque athlète. Voici la plus longue carrière des données, celle de
        Teddy Riner : la force en pointillé, la cote en trait plein, l’incertitude dans la bande entre les deux.
      </>
    ),
    afterRiner: () => (
      <>
        La bande grise est le RD : étroite quand il combat, plus large à chaque arrêt. Après la défaite contre Kageura en février 2020, il n’a rien
        disputé pendant onze mois, son RD est passé de 206 à 226 et sa cote a baissé de 20, jusqu’à ce que ses victoires de janvier 2021 la ramènent.
        Les plages hachurées marquées Inactif sont celles où douze mois s’étaient écoulés depuis son dernier combat : il était alors hors des
        classements.
      </>
    ),
    weights1: () => (
      <>
        Un classement liste les athlètes qui ont combattu dans les douze derniers mois. Après un an sans combat, un athlète sort des classements, la
        force est conservée, et le combat suivant le ramène.
      </>
    ),
    weights2: () => (
      <>
        Quiconque a combattu dans les 12 derniers mois figure dans au moins un classement, en général celui de sa catégorie. Un athlète qui a combattu
        dans deux catégories figure dans le classement de chaque catégorie où il a disputé trois tournois ou plus. Avec moins de trois partout, il
        figure dans un seul : la catégorie de ses derniers Jeux ou championnats dans ces 12 mois, et à défaut, celle où il a disputé le plus de
        tournois.
      </>
    ),
    afterTableRule: () => (
      <>
        La cote elle-même est unique pour toutes les catégories. Les athlètes forts qui montent de catégorie gagnent moins que leur cote ne l’annonce
        dans leurs premiers combats là-haut (un athlète du top 10 : 84% attendus, 72% gagnés), donc un changement fait faire un pas à la force, une
        fois, avant le premier combat dans la nouvelle catégorie : × 0,95 en montant, × 1,05 en descendant, quel que soit le nombre de catégories
        sautées. Tato Grigalashvili, champion du monde des −81 kg, est monté en −90 kg en février 2025 : sa force de 2586 est devenue 2456 avant son
        premier combat là, et sa cote a baissé avec elle. De retour en −81 kg deux mois plus tard, la force a remonté de 5%.
      </>
    ),
    weightMovesTitle: "Les changements de catégorie de Grigalashvili",
    medals1: () => (
      <>
        Le calculateur donne la chance d’un combat. Un tournoi, ce sont beaucoup de combats, donc la chance de médaille vient de jouer tout le tableau.
        Dès que l’IJF publie le tableau d’une catégorie, la veille, le calcul joue le tableau tiré 5 000 fois avec les cotes du jour : les combats déjà
        décidés restent tels quels, les autres sont joués aux chances de la cote. Il garde pour chaque athlète la chance d’atteindre les 1/4, les 1/2,
        la finale, l’or et une médaille quelconque, et pour chaque combat du tableau qui s’y trouvera probablement. Pendant un tournoi, les chances
        suivent chaque résultat.
      </>
    ),
    medals2: () => (
      <>
        Les tableaux sont ceux de l’IJF, à élimination directe avec repêchage à partir des 1/4. Un tournoi d’une autre forme, en poules de quelques
        athlètes, n’a pas de chances, et avant le tirage il n’y en a aucune. Le premier jour du Zagreb Grand Prix, le 13 novembre 2026, avec Scutto A.
        (ITA) qualifiée pour les 1/4 des −48 kg, sa chance était de 56% pour l’or et de 95% pour une médaille : une perdante des 1/4 peut encore
        atteindre le bronze par le repêchage.
      </>
    ),
    p4p: () => (
      <>
        La cote permet de comparer les athlètes de toutes les catégories par une seule mesure : de combien chacun domine sa propre catégorie. Les cotes
        elles-mêmes ne sont pas comparées, une cote en −60 kg et une en +100 kg ont été gagnées contre des adversaires différents. La règle : les
        candidats sont les trois premiers de chaque catégorie, chacun est mis face à la cote moyenne des sept meilleurs autres athlètes de la même
        catégorie, et l’écart entre les deux classe le classement toutes catégories. Un athlète présent dans deux classements compte une fois, avec le
        plus grand écart.
      </>
    ),
    teams: () => (
      <>
        La cote d’une nation est la cote moyenne de son meilleur athlète dans chaque catégorie : sept catégories pour le classement hommes ou femmes,
        les quatorze pour le classement mixte. Une catégorie où la nation n’a personne au classement compte comme la dernière place de cette catégorie,
        si bien qu’une nation forte dans beaucoup de catégories passe devant une nation à une seule star. Le classement compte aussi les catégories où
        une nation a le meilleur athlète de toutes les nations et celles où elle est dans les huit premières.
      </>
    ),
  },
  works: {
    intro: () => <>Une cote ne vaut que ce que valent ses prévisions. Chaque nombre ici est un combat prédit avant d’être disputé.</>,
    test: (x) => (
      <>
        Cinq modèles ont prédit chaque combat de juillet 2025 à novembre 2026 ({x.f.number(x.test)} au total), chacun avant qu’il soit disputé : une
        pièce, le classement IJF, l’Elo classique, le Glicko-2 standard et AJR. Deux scores : la précision, la part de combats gagnés par le favori, et
        le log loss, qui punit aussi une erreur sûre d’elle (plus bas est mieux, une pièce fait 0,693). AJR et IJF d’abord :
      </>
    ),
    allFive: () => <>Les cinq :</>,
    afterTable: (x) => (
      <>
        AJR est premier sur chaque ligne sauf une : dans les blocs finaux des grands tournois, le Glicko-2 standard désigne le vainqueur aussi souvent
        (tous deux à {x.pct(x.medalRounds.ours.accuracy)}), même si les chances d’AJR y sont mieux calibrées. Avec les nouveaux venus, le classement IJF
        bat l’Elo et le Glicko-2, l’inverse de ce qui était attendu : un nouveau venu a peu de points, et cela se révèle un signe juste de son niveau.
      </>
    ),
    notes: (x) => (
      <>
        Le classement IJF donne des points, pas des chances : sa chance est 1 / (1 + (points<sub>B</sub> / points<sub>A</sub>)<sup>k</sup>), avec k ={" "}
        {x.dec(x.k, 2)} ajusté sur les mois précédant le test. Dans {x.f.number(x.disagreements.n)} combats, AJR et l’IJF ont désigné des favoris
        différents, celui d’AJR a gagné <b>{x.pct(x.disagreements.ours_right / x.disagreements.n)}</b> d’entre eux (test exact de McNemar : p{" "}
        {x.disagreements.p < 0.001 ? `< ${x.dec(0.001, 3)}` : x.dec(x.disagreements.p, 3)}). Là où l’IJF ne pouvait pas choisir (points égaux, souvent
        tous deux à 0), cela compte pour moitié juste, comme une pièce. Scores de Brier, par modèle : {x.brier}.
      </>
    ),
    notesFormula: () => (
      <>
        La chance avant un combat : P(A bat B) = 1 / (1 + e<sup>−g × (cote<sub>A</sub> − cote<sub>B</sub>) / 173,72</sup>), avec g = 1 / √(1 + 3φ²/π²)
        et φ = √(RD<sub>A</sub>² + RD<sub>B</sub>²) / 173,72. La mise à jour qui suit est celle de Glicko-2 (Glickman, 2013), un combat par période de
        cote, le calculateur ci-dessus l’écrit en entier avec les nombres dedans.
      </>
    ),
    calibration: () => (
      <>
        Une chance doit vouloir dire ce qu’elle dit : sur cent combats avec un favori à 70%, le favori doit en gagner environ soixante-dix. Désigner
        souvent le vainqueur ne suffit pas, un modèle qui dit 99% chaque fois qu’il a raison et se trompe une fois sur trois ne sert à rien à un
        entraîneur avant un tirage.
      </>
    ),
    afterCalibration: (x) => (
      <>
        Un favori à 95% doit quand même perdre un combat sur vingt, et c’est le cas : {x.top.n - x.top.won} sur {x.f.number(x.top.n)} depuis juillet
        2025. Leurs vainqueurs étaient surtout des nouveaux : sur les 30 plus grosses surprises, 19 ont été gagnées par des athlètes de moins de dix
        combats seniors, trois d’entre eux à leur premier, des athlètes doués que la cote n’avait pas encore rencontrés. Trois autres vainqueurs
        revenaient après plus d’un an d’absence.
      </>
    ),
    beatTitle: "Battez la cote",
    oneRd1: () => (
      <>
        Le Glicko-2 standard classe les athlètes et prédit les combats par la force seule. AJR fait les deux par la force moins le RD. Retirer
        l’incertitude est une vieille idée : Mark Glickman propose de lire une cote comme une fourchette de deux RD de part et d’autre, et le TrueSkill
        de Microsoft classe les joueurs par la force moins trois RD. Combien de RD retirer, le n ci-dessous, a été choisi ici d’après les résultats.
      </>
    ),
    oneRd2: (x) => (
      <>
        Sans rien retirer, un débutant avec une grande victoire passe devant un habitué aux dizaines de combats. Avec trois RD, la règle des classements
        jusqu’en novembre 2026, les nouveaux venus restaient en bas un an ou plus. Un RD a donné le meilleur log loss sur les combats du test, et le
        favori en a gagné {x.pct(x.all.ours.accuracy)}, contre {x.pct(x.zero.accuracy)} avec la force nue. Le n a été choisi sur ces mêmes combats.
        Essayez les autres :
      </>
    ),
    limits: [
      "La manière de gagner : un ippon en dix secondes compte autant qu’une victoire par shido, par hansoku-make ou au golden score.",
      "Tout ce qui sort des combats individuels seniors publiés par la base judobase de l’IJF : kata, juniors, cadets, vétérans et épreuves par équipes (un champion du monde junior part de 1500 comme tout le monde), et quelques championnats du monde de 2009 à 2011 manquent.",
      "Blessures, maladie, nouvel entraîneur, public à domicile, longue journée de combats, styles et gardes : invisibles jusqu’à ce que les résultats les montrent.",
      "Ce que coûte vraiment un changement de catégorie à un athlète donné : le pas est un 5% fixe de la force, une fois par changement quelle que soit la distance, le même pour chaque catégorie, hommes et femmes.",
      "Les résultats que la base judobase de l’IJF n’a pas encore publiés : un combat entre dans la cote environ 20 minutes après y être apparu.",
    ],
    footer: () => (
      <>
        Le code, les données et chaque prédiction derrière ces nombres :{" "}
        <a href={REPO} className={LINK}>
          le benchmark sur GitHub
        </a>
        .
        <br />
        L’historique complet des cotes :{" "}
        <Link href="/data" className={LINK}>
          Exporter les données
        </Link>
        .
      </>
    ),
  },
};
