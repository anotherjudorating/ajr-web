// The methodology's prose in Spanish, paragraph by paragraph with the English (types.ts).
// Athletes' and tournaments' names in Latin letters, as in the data. Style: impersonal,
// no long dashes, comparisons always IJF and AJR side by side (the owner's decisions of 22.11).

import Link from "@/components/Link";

import type { Prose } from "./types";

const LINK = "underline decoration-rule underline-offset-2 hover:decoration-ink";
const REPO = "https://github.com/anotherjudorating/ajr-backend/tree/main/benchmark";

export const es: Prose = {
  meta: {
    title: "Cómo funciona el rating",
    description:
      "Por qué existe Another Judo Rating, cómo lo mueve un combate y qué tal predice: París 2024, los puntos IJF frente a la fuerza, una calculadora y una prueba con 24.503 combates frente al ranking IJF.",
  },
  title: "Cómo funciona el rating",
  lead: () => (
    <>
      Un rating de cada judoca de la base IJF judobase, con todos los combates sénior desde 2009, unos 227 mil. Un número por atleta, que responde a
      una sola pregunta: qué probabilidad tienes de ganar al siguiente rival. Esta página cuenta por qué existe, cómo se calcula y qué tal predice.
    </>
  ),
  why: {
    intro: () => <>Dos cosas lo pusieron en marcha. La primera pasó en los Juegos Olímpicos de París, la segunda pasa cada fin de semana en alguna Copa de Europa.</>,
    paris1: () => (
      <>
        El 28 de julio de 2024, a las once de la mañana, la final olímpica de −52 kg femenino se disputó en 1/8. Uta Abe, campeona olímpica en Tokio, se
        encontró con Diyora Keldiyorova, de Uzbekistán, que por la tarde sería campeona olímpica. Era el segundo combate del día de Abe.
      </>
    ),
    paris2: () => (
      <>
        ¿Por qué se cruzaban tan pronto? Porque el sorteo sigue el ranking IJF, la lista mundial, y esa lista es una carrera de puntos. Se ganan puntos por
        la ronda alcanzada en los eventos que la IJF cuenta, los seis mejores resultados del año valen al completo, los seis del año anterior a la mitad.
        La lista decide quién es cabeza de serie en el Campeonato del Mundo y en los Juegos Olímpicos, y por tanto quién evita a quién.
      </>
    ),
    paris3: () => (
      <>
        Abe llegó a París como campeona olímpica en Tokio y con cuatro títulos mundiales. Se había saltado el Mundial de 2024 y había disputado dos
        eventos del World Tour en el año anterior al corte, así que en el ranking IJF era la 10.ª entre las inscritas y no era cabeza de serie. Las
        japonesas lo hacen a menudo: unos pocos torneos elegidos mientras las demás disputan una docena. Keldiyorova había competido toda la temporada y
        era la cabeza de serie 1.
      </>
    ),
    paris4: () => (
      <>
        Keldiyorova la proyectó para ippon a los tres minutos y esa tarde ganó el oro. El problema es el sorteo. Ese combate tenía que haber sido una
        final. Fue injusto con Abe, e igual de injusto con Keldiyorova. Ganó, pero había hecho todo lo que pide el ranking IJF y aun así le tocó la
        atleta más fuerte del peso a cuatro combates de una medalla, y una derrota la habría mandado a casa sin nada. Un sorteo por fuerza las habría
        mantenido separadas hasta el bloque final.
      </>
    ),
    paris5: () => (
      <>
        Para ordenar por fuerza hace falta una medida de la fuerza, y los puntos IJF no pueden serlo: cuentan dónde fue una atleta y hasta dónde llegó, no
        a quién ganó. Una medida de la fuerza tiene que pesar cada combate, ganado o perdido, por quién estaba al otro lado, de modo que dos torneos
        contra las mejores valgan tanto como una temporada de torneos más fáciles. Eso es lo que hace AJR.
      </>
    ),
    paris6: (x) => (
      <>
        La víspera del combate Abe era primera en la clasificación AJR, {x.parisLead} puntos por delante de la siguiente (una n.º 1 está en torno a
        2400, una n.º 10 en torno a 2050), y Keldiyorova era quinta. AJR daba a Abe un {x.abeChance}% de probabilidad en su combate. Una favorita al{" "}
        {x.abeChance}% pierde un combate de cada diez, y este fue ese.
      </>
    ),
    afterParisDraw: () => <>Aquí está el mismo cuadro ordenado de las dos maneras, por ranking IJF y por rating AJR.</>,
    afterDraw: () => (
      <>
        Un solo sorteo no demuestra nada en ningún sentido, así que aquí están todos los torneos desde que empieza el archivo de listas de la IJF, marzo
        de 2025, con una pregunta sencilla para cada peso: ¿ganó el número 1? El número 1 de la IJF ganó 341 de 1091 oros, el número 1 de AJR ganó 421.
        AJR fue por delante en todos los niveles salvo en las Copas de Europa, donde la IJF ganó por un oro (44 a 43).
      </>
    ),
    afterNumberOne: () => (
      <>
        El ranking IJF además olvida: un año sin competir reduce a la mitad los puntos de una atleta y un segundo año los borra, como si descansar la
        hiciera más débil que cualquiera que siguió compitiendo. En AJR una pausa cuesta poco. Abe no combatió entre Antalya en marzo y París en julio,
        y su rating bajó 9 puntos. Alice Bellandi, de Italia, ganó los −78 kg en París y no combatió en diez meses, su rating bajó 36 puntos, y en junio
        de 2025 volvió y ganó el Campeonato del Mundo.
      </>
    ),
    newcomers1: () => (
      <>
        Los atletas fuera de una selección nacional empiezan en las Copas de Europa y en los Opens continentales, y los viajes los pagan ellos. Una Copa
        de Europa no da ni un punto IJF sénior. Donde hay puntos IJF, se pagan por la ronda alcanzada, nunca por el rival: perder en 1/16 con el número
        uno del mundo vale lo mismo que perder con el número 80. Muchos atletas pasaron un par de temporadas así, combatiendo bien, perdiendo con gente
        buena y volviendo a casa con cero. La mayoría lo dejó.
      </>
    ),
    newcomers2: () => (
      <>
        También funciona al revés. El 8 de junio de 2024, siete semanas antes de París, Lasha Bekauri ganó los −90 kg y Teddy Riner los +100 kg en el
        Madrid European Open: 100 puntos cada uno, la décima parte de un oro de Grand Slam y los mismos 100 que cualquier oro de European Open de ese
        año. Los puntos IJF ven la etiqueta del evento. Los atletas que perdieron con Riner o con Bekauri ese día recibieron lo que habrían recibido por
        perder con cualquiera.
      </>
    ),
    newcomers3: () => (
      <>
        AJR solo pregunta a quién ganaste, quién te ganó y qué probabilidad había. Bobur Yangiboyev, de Uzbekistán, disputó sus dos primeros Grand Slams
        con seis semanas de diferencia y llegó igual de lejos en ambos: una victoria en 1/16, una derrota en 1/8. En Tbilisi ganó a Akhmed Turluev, con
        un rating de 2033 frente a su 1150, con un 4% de probabilidad. En Dushanbe ganó a un debutante.
      </>
    ),
    afterPoints: () => <>La IJF le dio 160 puntos por cada uno. En AJR el primer día llevó su rating de 1150 a 1612, el segundo de 1610 a 1641.</>,
    goldWorth: () => (
      <>
        Un oro vale lo que valieron sus combates. Amandine Buchard, de Francia, ganó el Dushanbe Grand Slam en mayo de 2025 frente a cuatro atletas
        con ratings de 1224 a 1675: AJR le daba un 90% de probabilidad de ganar a las cuatro. Akhmed Turluev, nacido en 2006, ganó el Ljubljana European
        Open en febrero de 2026, su primer torneo sénior, y empezó con una victoria sobre Muhammed Koc al 8%.
      </>
    ),
    afterTwoGolds: () => (
      <>
        La IJF dio 1000 puntos a Buchard y 100 a Turluev. AJR dio 12 a Buchard, porque esperaba cada una de esas victorias, y 885 a Turluev. Por eso
        ganarle cinco semanas después valió tanto para Yangiboyev.
      </>
    ),
    losses: () => (
      <>
        Las derrotas también cuentan. El ranking IJF guarda los mejores resultados de una atleta y olvida el resto, así que una cabeza de serie que cae en
        su primer combate en todos los demás eventos no pierde nada. En AJR cada derrota cuesta, más cuanto más débil es el rival, y una serie de ellas
        se nota en la clasificación mucho antes que en los puntos.
      </>
    ),
  },
  number: {
    intro: () => <>Cuánto de fuerte es un atleta, cuánto puede fiarse de ello el rating y qué cambia un combate.</>,
    skill1: () => (
      <>
        La <b>fuerza</b> es la mejor estimación de lo fuerte que es un atleta. El <b>RD</b> (rating deviation, desviación del rating) representa lo
        inestable que es: cuánto puede alejarse su fuerza real de la estimada, hacia arriba o hacia abajo. Todos empiezan con una fuerza de 1500 y un RD
        de 350. Los combates bajan el RD, hasta 50 u 80 en un habitual, y una pausa larga o unos resultados que saltan lo vuelven a subir.
      </>
    ),
    skill2: () => (
      <>
        El rating, el número de todas las clasificaciones, es la fuerza menos el RD: la fuerza que un atleta ha demostrado, no la mejor estimación. Dos
        atletas con una fuerza de 2000. Uno disputó cincuenta combates este año y tiene un RD de 60, así que su rating es 1940. El otro disputó tres y
        tiene un RD de 300, así que su rating es 1700. El segundo puede ser igual de fuerte, y la clasificación lo mostrará cuando lo muestren los
        combates.
      </>
    ),
    formula: () => <>Rating = fuerza − RD</>,
    formulaNote: () => <>Un novato que gana un gran combate tiene una fuerza alta pero un RD grande: el rating espera la prueba.</>,
    calculator1: () => (
      <>
        Antes de un combate los dos ratings dan una probabilidad. Después, el rating del ganador sube y el del perdedor baja: un poco cuando gana el
        favorito, mucho cuando gana el otro, y más para un atleta con un RD grande.
      </>
    ),
    calculator2: () => (
      <>
        El evento, la ronda y cómo se ganó no cuentan: solo el rival y el resultado. Perder con alguien mucho más fuerte casi no cuesta nada, perder con
        alguien más débil cuesta mucho. Ganar una y otra vez al mismo nivel aporta cada vez menos, a medida que el rating llega a ese nivel. Cambia los
        números y elige al ganador. Desde la página de un combate la calculadora se abre con ese combate cargado.
      </>
    ),
    career: () => (
      <>
        A lo largo de una carrera las dos líneas se ven así, como en la página de cada atleta. Esta es la carrera más larga de los datos, la de Teddy
        Riner: la fuerza en línea discontinua, el rating en línea continua, la incertidumbre en la banda entre ambas.
      </>
    ),
    afterRiner: () => (
      <>
        La banda gris es el RD: estrecha mientras compite, más ancha cada vez que para. Tras la derrota con Kageura en febrero de 2020 no combatió en once
        meses, su RD creció de 206 a 226 y su rating bajó 20, hasta que sus victorias de enero de 2021 lo devolvieron. Los tramos rayados marcados como
        Inactivo son aquellos en los que habían pasado doce meses desde su último combate: ahí estaba fuera de las clasificaciones.
      </>
    ),
    weights1: () => (
      <>
        Una clasificación lista a los atletas que combatieron en los últimos doce meses. Tras un año sin combates el atleta sale de las clasificaciones,
        la fuerza se conserva y el siguiente combate lo devuelve.
      </>
    ),
    weights2: () => (
      <>
        Todo el que tenga un combate en los últimos 12 meses está en al menos una clasificación, normalmente la del peso en el que compite. Un atleta
        que combatió en dos pesos está en la clasificación de cada peso en el que tuvo tres o más torneos. Con menos de tres en todos los pesos, está en
        una: la del peso de sus últimos Juegos Olímpicos o campeonato en esos 12 meses, y si no los hubo, la del peso en el que disputó más torneos.
      </>
    ),
    afterTableRule: () => (
      <>
        El rating en sí es uno para todos los pesos. Los atletas fuertes que suben de peso ganan menos de lo que dice su rating en sus primeros combates
        allí (un atleta del top 10: 84% esperado, 72% ganado), así que un cambio da un salto a la fuerza una vez, antes del primer combate en el nuevo
        peso: × 0,95 al subir, × 1,05 al bajar, sean cuantos sean los pesos de diferencia. Tato Grigalashvili, campeón del mundo en −81 kg, subió a −90
        kg en febrero de 2025: su fuerza de 2586 pasó a 2456 antes de su primer combate allí, y su rating bajó con ella. De vuelta en −81 kg dos meses
        después, la fuerza subió un 5%.
      </>
    ),
    weightMovesTitle: "Los cambios de peso de Grigalashvili",
    medals1: () => (
      <>
        La calculadora da la probabilidad de un combate. Un torneo son muchos combates, así que la probabilidad de medalla sale de jugar todo el cuadro.
        Cuando la IJF publica el cuadro de un peso, la víspera, el proceso del rating juega el cuadro sorteado 5000 veces con los ratings de hoy: los
        combates ya decididos quedan como fueron, el resto se disputan con las probabilidades del rating. Guarda la probabilidad de cada atleta de llegar
        a 1/4, a 1/2, a la final, al oro y a cualquier medalla, y para cada combate del cuadro quién es probable que esté en él. Durante un torneo las
        probabilidades siguen cada resultado.
      </>
    ),
    medals2: () => (
      <>
        Los cuadros son los de la IJF: eliminación directa con repesca desde 1/4. Un torneo de otra forma, con grupos de pocos atletas, no tiene
        probabilidades, y antes del sorteo no hay ninguna. El primer día del Zagreb Grand Prix, el 13 de noviembre de 2026, con Scutto A. (ITA) en 1/4 de
        −48 kg, su probabilidad estaba en el 56% para el oro y el 95% para una medalla: quien pierde en 1/4 aún puede llegar al bronce por la repesca.
      </>
    ),
    p4p: () => (
      <>
        El rating permite comparar atletas de todos los pesos con una misma medida: cuánto se separa cada uno de su propio peso. Los ratings en sí no
        se comparan, un rating de −60 kg y uno de +100 kg se ganaron contra rivales distintos. La regla: los candidatos son los tres primeros de cada
        peso, cada uno se compara con la media de rating de los siete mejores atletas restantes del mismo peso, y la diferencia entre ambos ordena la
        clasificación libra por libra. Un atleta en las clasificaciones de dos pesos cuenta una vez, con la mayor diferencia.
      </>
    ),
    teams: () => (
      <>
        El rating de un país es la media de rating de su mejor atleta en cada peso: siete pesos para la tabla masculina o la femenina, los catorce para la
        mixta. Un peso en el que el país no tiene a nadie en la clasificación cuenta como el último puesto de ese peso, así que un país fuerte en muchos
        pesos queda por encima de uno con una sola estrella. La tabla también cuenta los pesos en los que un país tiene al mejor atleta de todos los
        países y los pesos en los que está entre los ocho mejores.
      </>
    ),
  },
  works: {
    intro: () => <>Un rating vale lo que valen sus pronósticos. Cada número de aquí es un combate predicho antes de disputarse.</>,
    test: (x) => (
      <>
        Cinco modelos predijeron todos los combates de julio de 2025 a noviembre de 2026 ({x.f.number(x.test)} en total), cada uno antes de disputarse: una
        moneda, el ranking IJF, el Elo clásico, el Glicko-2 de manual y AJR. Dos medidas: el acierto, cuántas veces ganó el favorito, y el log loss,
        que además castiga el error seguro de sí mismo (cuanto más bajo, mejor, una moneda saca 0,693). Primero AJR e IJF:
      </>
    ),
    allFive: () => <>Los cinco:</>,
    afterTable: (x) => (
      <>
        AJR es primero en todas las filas menos una: en las rondas de medalla de los grandes torneos el Glicko-2 de manual elige al ganador igual de a
        menudo (ambos {x.pct(x.medalRounds.ours.accuracy)}), aunque las probabilidades de AJR están mejor calibradas ahí. Con novatos, el ranking IJF
        supera a Elo y a Glicko-2, lo contrario de lo esperado: un novato tiene pocos puntos, y eso resulta ser una señal razonable de su nivel.
      </>
    ),
    notes: (x) => (
      <>
        El ranking IJF da puntos, no probabilidades: su probabilidad es 1 / (1 + (puntos<sub>B</sub> / puntos<sub>A</sub>)<sup>k</sup>), con k ={" "}
        {x.dec(x.k, 2)} ajustada en los meses anteriores a la prueba. En {x.f.number(x.disagreements.n)} combates AJR e IJF nombraron favoritos
        distintos, el de AJR ganó <b>{x.pct(x.disagreements.ours_right / x.disagreements.n)}</b> de ellos (prueba exacta de McNemar: p{" "}
        {x.disagreements.p < 0.001 ? `< ${x.dec(0.001, 3)}` : x.dec(x.disagreements.p, 3)}). Donde la IJF no podía elegir (mismos puntos, a menudo
        ambos en 0), cuenta como medio acierto, como una moneda. Puntuaciones de Brier, por modelo: {x.brier}.
      </>
    ),
    notesFormula: () => (
      <>
        La probabilidad antes de un combate: P(A gana a B) = 1 / (1 + e<sup>−g × (rating<sub>A</sub> − rating<sub>B</sub>) / 173,72</sup>), con g = 1 /
        √(1 + 3φ²/π²) y φ = √(RD<sub>A</sub>² + RD<sub>B</sub>²) / 173,72. La actualización posterior es la de Glicko-2 (Glickman, 2013), un combate
        por periodo de rating, la calculadora de arriba la escribe con los números dentro.
      </>
    ),
    calibration: () => (
      <>
        Una probabilidad debe significar lo que dice: de cien combates con un favorito al 70%, el favorito debería ganar unos setenta. Elegir al ganador
        a menudo no basta, un modelo que dice 99% cada vez que acierta y pierde una de cada tres no le sirve de nada a un entrenador antes de un sorteo.
      </>
    ),
    afterCalibration: (x) => (
      <>
        Un favorito al 95% debería perder de todos modos un combate de cada veinte, y lo pierde: {x.top.n - x.top.won} de {x.f.number(x.top.n)} desde
        julio de 2025. Quienes les ganaron eran casi siempre nuevos: de las 30 mayores sorpresas, 19 las ganaron atletas con menos de diez combates
        sénior, tres de ellos en el primero, atletas con talento a los que el rating aún no conocía. Otros tres ganadores volvían tras más de un año
        fuera.
      </>
    ),
    beatTitle: "Gana al rating",
    oneRd1: () => (
      <>
        El Glicko-2 de manual ordena a los atletas y predice los combates solo con la fuerza. AJR hace ambas cosas con la fuerza menos el RD. Quitar la
        incertidumbre es una idea antigua: Mark Glickman propone leer un rating como un intervalo de dos RD a cada lado, y el TrueSkill de Microsoft
        ordena a los jugadores por la fuerza menos tres RD. Cuántos RD quitar, la n de abajo, se eligió aquí por los resultados.
      </>
    ),
    oneRd2: (x) => (
      <>
        Sin quitar nada, un debutante con una gran victoria queda por encima de un habitual con decenas de combates. Con tres RD, la regla de las
        clasificaciones hasta noviembre de 2026, los novatos quedaban frenados un año o más. Un RD dio el mejor log loss en los combates de la prueba, y
        el favorito ganó {x.pct(x.all.ours.accuracy)} de ellos, frente al {x.pct(x.zero.accuracy)} con la fuerza sola. La n se eligió con estos mismos
        combates. Prueba las otras:
      </>
    ),
    limits: [
      "Cómo se ganó el combate: un ippon a los diez segundos cuenta lo mismo que una victoria por shido, por hansoku-make o en golden score.",
      "Todo lo que queda fuera de los combates individuales sénior que publica IJF judobase: kata, júnior, cadetes, veteranos y pruebas por equipos (un campeón del mundo júnior empieza en 1500 como cualquiera), y faltan algunos Campeonatos del Mundo de 2009 a 2011.",
      "Lesiones, enfermedades, un entrenador nuevo, el público de casa, un día largo de combates, estilos y agarres: invisibles hasta que los muestran los resultados.",
      "Cuánto le cuesta de verdad un cambio de peso a un atleta concreto: el salto es un 5% fijo de la fuerza, una vez por cambio sea cual sea la distancia, igual para todos los pesos, hombres y mujeres.",
      "Los resultados que IJF judobase aún no ha publicado: un combate entra en el rating unos 20 minutos después de aparecer allí.",
    ],
    footer: () => (
      <>
        El código, los datos y cada predicción detrás de estos números:{" "}
        <a href={REPO} className={LINK}>
          el benchmark en GitHub
        </a>
        .
        <br />
        La historia completa del rating:{" "}
        <Link href="/data" className={LINK}>
          Exportar datos
        </Link>
        .
      </>
    ),
  },
};
