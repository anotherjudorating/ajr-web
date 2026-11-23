// The methodology's prose in Italian, paragraph by paragraph with the English (types.ts).
// Athletes' and tournaments' names as the data writes them. Style: impersonal, no long
// dashes, comparisons always IJF and AJR side by side (the owner's decisions of 22.11).

import Link from "@/components/Link";

import type { Prose } from "./types";

const LINK = "underline decoration-rule underline-offset-2 hover:decoration-ink";
const REPO = "https://github.com/anotherjudorating/ajr-backend/tree/main/benchmark";

export const it: Prose = {
  meta: {
    title: "Come funziona il rating",
    description:
      "Perché esiste Another Judo Rating, come un incontro lo muove e quanto bene prevede: Parigi 2024, i punti IJF contro la forza, un calcolatore e un test su 24.503 incontri contro il ranking IJF.",
  },
  title: "Come funziona il rating",
  lead: () => (
    <>
      Un rating di ogni judoka presente in IJF judobase, su tutti gli incontri senior dal 2009, circa 227 mila. Un numero per atleta, che risponde a
      una sola domanda: quanto è probabile che batta il prossimo avversario. Questa pagina spiega perché è nato, come si calcola e quanto bene
      prevede.
    </>
  ),
  why: {
    intro: () => <>Due cose l’hanno fatto nascere. La prima è successa alle Olimpiadi di Parigi, la seconda succede ogni fine settimana in una Coppa Europa da qualche parte.</>,
    paris1: () => (
      <>
        Il 28 luglio 2024, alle undici di mattina, la finale olimpica dei −52 kg femminili si è disputata agli ottavi. Uta Abe, campionessa
        olimpica di Tokyo, ha incontrato Diyora Keldiyorova dell’Uzbekistan, che la sera stessa sarebbe diventata campionessa olimpica. Per Abe
        era il secondo incontro della giornata.
      </>
    ),
    paris2: () => (
      <>
        Perché si incontravano così presto? Perché il tabellone segue il ranking IJF, la World Ranking List, e quella è una corsa ai punti. I punti
        si prendono per il turno raggiunto nelle gare che l’IJF conta, i sei migliori risultati dell’anno valgono per intero, i sei dell’anno prima
        per metà. La lista decide chi è testa di serie ai Mondiali e ai Giochi Olimpici, e quindi chi evita chi.
      </>
    ),
    paris3: () => (
      <>
        Abe arrivava a Parigi da campionessa olimpica di Tokyo con quattro titoli mondiali. Aveva saltato i Mondiali 2024 e disputato due gare del
        World Tour nell’anno prima della chiusura del ranking, così nel ranking IJF era decima tra le iscritte e non testa di serie. Le atlete
        giapponesi lo fanno spesso: pochi tornei scelti mentre le altre ne fanno una dozzina. Keldiyorova aveva fatto tutta la stagione ed era la
        testa di serie n. 1.
      </>
    ),
    paris4: () => (
      <>
        Keldiyorova l’ha proiettata per ippon dopo tre minuti e quella sera ha vinto l’oro. Il problema è il tabellone. Quell’incontro doveva essere
        una finale. È stato ingiusto per Abe, e altrettanto ingiusto per Keldiyorova. Ha vinto, ma aveva fatto tutto ciò che il ranking IJF chiede e
        si è trovata comunque l’atleta più forte della categoria a quattro incontri dalla medaglia, e una sconfitta l’avrebbe rimandata a casa a mani
        vuote. Teste di serie per forza le avrebbero tenute separate fino al blocco finale.
      </>
    ),
    paris5: () => (
      <>
        Teste di serie per forza richiedono una misura della forza, e i punti IJF non possono esserlo: contano dove un’atleta è andata e fin dove è
        arrivata, non chi ha battuto. Una misura della forza deve pesare ogni incontro, vinto o perso, per chi stava dall’altra parte, così che due
        tornei contro le migliori valgano quanto una stagione di tornei più facili. È quello che fa AJR.
      </>
    ),
    paris6: (x) => (
      <>
        Alla vigilia dell’incontro Abe era prima nella classifica AJR, con {x.parisLead} punti di margine sulla seconda (un n. 1 sta intorno a 2400,
        un n. 10 intorno a 2050), e Keldiyorova era quinta. AJR dava ad Abe il {x.abeChance}% di probabilità nel loro incontro. Una favorita al{" "}
        {x.abeChance}% perde un incontro su dieci, e questo era quello.
      </>
    ),
    afterParisDraw: () => <>Ecco lo stesso tabellone con le teste di serie nei due modi, secondo il ranking IJF e secondo il rating AJR.</>,
    afterDraw: () => (
      <>
        Un tabellone da solo non prova nulla, in nessun senso, quindi ecco tutti i tornei da quando comincia l’archivio IJF delle sue liste, marzo
        2025, e una domanda semplice per ogni categoria: il numero 1 ha vinto? Il numero 1 IJF ha vinto 341 ori su 1091, il numero 1 AJR ne ha
        vinti 421. AJR è stato avanti a ogni livello tranne le Coppe Europa, dove IJF ha avuto un oro in più (44 a 43).
      </>
    ),
    afterNumberOne: () => (
      <>
        Il ranking IJF dimentica anche: un anno di pausa dimezza i punti di un’atleta e un secondo anno li cancella, come se il riposo la rendesse
        più debole di chiunque abbia continuato a gareggiare. In AJR una pausa costa poco. Abe non ha gareggiato tra Antalya a marzo e Parigi a
        luglio, e il suo rating è sceso di 9 punti. Alice Bellandi ha vinto i −78 kg a Parigi e non ha gareggiato per dieci mesi, il suo rating è
        sceso di 36 punti, e nel giugno 2025 è tornata e ha vinto i Mondiali.
      </>
    ),
    newcomers1: () => (
      <>
        Gli atleti fuori dalla nazionale cominciano dalle Coppe Europa e dagli Open continentali, e i viaggi li pagano di tasca propria. Una Coppa
        Europa non dà nessun punto IJF senior. Dove i punti IJF ci sono, pagano il turno raggiunto, mai l’avversario: perdere ai sedicesimi con il
        numero uno del mondo vale quanto perdere con il numero 80. Molti atleti hanno passato un paio di stagioni così, combattendo bene, perdendo
        con gente forte e tornando a casa con zero. La maggior parte ha smesso.
      </>
    ),
    newcomers2: () => (
      <>
        Vale anche al contrario. L’8 giugno 2024, sette settimane prima di Parigi, Lasha Bekauri ha vinto i −90 kg e Teddy Riner i +100 kg al Madrid
        European Open: 100 punti ciascuno, un decimo di un oro in un Grand Slam e gli stessi 100 di qualsiasi oro in un European Open quell’anno. I
        punti IJF vedono l’etichetta della gara. Gli atleti che quel giorno hanno perso con Riner o Bekauri hanno preso quel che avrebbero preso
        perdendo con chiunque.
      </>
    ),
    newcomers3: () => (
      <>
        AJR chiede solo chi hai battuto, chi ti ha battuto e quanto era probabile. Bobur Yangiboyev dell’Uzbekistan ha disputato i suoi primi due
        Grand Slam a sei settimane di distanza ed è arrivato allo stesso punto in entrambi: una vittoria ai sedicesimi, una sconfitta agli ottavi. A
        Tbilisi ha battuto Akhmed Turluev, rating 2033 contro il suo 1150, con il 4% di probabilità. A Dushanbe ha battuto un esordiente.
      </>
    ),
    afterPoints: () => <>L’IJF gli ha dato 160 punti per ciascuno. In AJR il primo giorno ha portato il suo rating da 1150 a 1612, il secondo da 1610 a 1641.</>,
    goldWorth: () => (
      <>
        Un oro vale quanto valevano i suoi incontri. Amandine Buchard ha vinto il Dushanbe Grand Slam nel maggio 2025 contro quattro atlete con
        rating da 1224 a 1675: AJR le dava il 90% di probabilità di batterle tutte e quattro. Akhmed Turluev, nato nel 2006, ha vinto il Ljubljana
        European Open nel febbraio 2026, il suo primo torneo senior, e ha cominciato con una vittoria su Muhammed Koc all’8%.
      </>
    ),
    afterTwoGolds: () => (
      <>
        L’IJF ha dato a Buchard 1000 punti e a Turluev 100. AJR ha dato a Buchard 12, perché si aspettava ognuna di quelle vittorie, e a Turluev 885.
        Per questo batterlo cinque settimane dopo è valso tanto a Yangiboyev.
      </>
    ),
    losses: () => (
      <>
        Contano anche le sconfitte. Il ranking IJF tiene i migliori risultati di un’atleta e dimentica il resto, così una testa di serie che esce al
        primo incontro in tutte le altre gare non perde nulla. In AJR ogni sconfitta costa, di più quanto più debole è l’avversario, e una serie di
        sconfitte si vede in classifica molto prima che nei punti.
      </>
    ),
  },
  number: {
    intro: () => <>Quanto è forte un atleta, quanto il rating può esserne sicuro, e che cosa cambia un incontro.</>,
    skill1: () => (
      <>
        La <b>forza</b> è la migliore stima di quanto un atleta sia forte. L’<b>RD</b> (rating deviation, la deviazione del rating) dice quanto
        l’atleta è instabile: quanto la sua forza reale può stare lontana dalla stima, in su o in giù. Tutti partono da una forza di 1500 con un RD
        di 350. Gli incontri abbassano l’RD, a 50 o 80 per chi gareggia regolarmente, e una lunga pausa o risultati che ballano lo fanno risalire.
      </>
    ),
    skill2: () => (
      <>
        Il rating, il numero in ogni classifica, è la forza meno l’RD: la forza che un atleta ha dimostrato, non la migliore stima. Due atleti con
        una forza di 2000. Uno ha disputato cinquanta incontri quest’anno e ha un RD di 60, quindi il rating è 1940. L’altro ne ha disputati tre e
        ha un RD di 300, quindi il rating è 1700. Il secondo può essere altrettanto forte, e la classifica lo mostrerà quando lo mostreranno gli
        incontri.
      </>
    ),
    formula: () => <>Rating = forza − RD</>,
    formulaNote: () => <>Un esordiente che vince un grande incontro ha una forza alta ma un RD grande: il rating aspetta le prove.</>,
    calculator1: () => (
      <>
        Prima di un incontro i due rating danno una probabilità. Dopo, il rating del vincitore sale e quello dello sconfitto scende: di poco quando
        vince il favorito, di molto quando vince lo sfavorito, e di più per un atleta con un RD grande.
      </>
    ),
    calculator2: () => (
      <>
        La gara, il turno e il modo in cui si vince non contano: solo chi si è incontrato e l’esito. Perdere con qualcuno molto più forte costa quasi
        nulla, perdere con qualcuno più debole costa molto. Vincere di continuo allo stesso livello rende ogni volta meno, man mano che il rating
        raggiunge quel livello. Cambia i numeri e scegli il vincitore. Dalla pagina di un incontro il calcolatore si apre con quell’incontro già
        caricato.
      </>
    ),
    career: () => (
      <>
        In una carriera le due linee hanno questo aspetto, come nella pagina di ogni atleta. Ecco la carriera più lunga dei dati, quella di Teddy
        Riner: la forza tratteggiata, il rating pieno, l’incertezza la fascia tra le due.
      </>
    ),
    afterRiner: () => (
      <>
        La fascia grigia è l’RD: stretta mentre gareggia, più larga ogni volta che si ferma. Dopo la sconfitta con Kageura nel febbraio 2020 non ha
        gareggiato per undici mesi, il suo RD è cresciuto da 206 a 226 e il suo rating è sceso di 20, finché le vittorie del gennaio 2021 non l’hanno
        riportato su. I tratti a righe segnati Inattivo sono quelli in cui erano passati dodici mesi dall’ultimo incontro: lì era fuori dalle
        classifiche.
      </>
    ),
    weights1: () => (
      <>
        Una classifica elenca gli atleti che hanno gareggiato negli ultimi dodici mesi. Dopo un anno senza incontri un atleta esce dalle classifiche,
        la forza resta, e il prossimo incontro lo riporta dentro.
      </>
    ),
    weights2: () => (
      <>
        Chiunque abbia un incontro negli ultimi 12 mesi sta in almeno una classifica, di solito quella della categoria in cui gareggia. Un atleta che
        ha gareggiato in due categorie sta nella classifica di ogni categoria in cui ha fatto tre o più tornei. Con meno di tre in ogni categoria sta
        in una sola: la categoria della sua ultima Olimpiade o del suo ultimo campionato in quei 12 mesi, e senza uno di questi, la categoria in cui
        ha fatto più tornei.
      </>
    ),
    afterTableRule: () => (
      <>
        Il rating in sé è uno per tutte le categorie. Gli atleti forti che salgono di categoria vincono meno di quanto dica il loro rating nei primi
        incontri lì (un atleta della top 10: 84% atteso, 72% vinto), quindi un passaggio fa fare alla forza un passo, una volta, prima del primo
        incontro nella nuova categoria: × 0,95 salendo, × 1,05 scendendo, quante che siano le categorie di distanza. Tato Grigalashvili, campione del
        mondo nei −81 kg, è salito ai −90 kg nel febbraio 2025: la sua forza di 2586 è diventata 2456 prima del suo primo incontro lì, e il rating è
        sceso con lei. Tornato ai −81 kg due mesi dopo, la forza è salita del 5%.
      </>
    ),
    weightMovesTitle: "I cambi di categoria di Grigalashvili",
    medals1: () => (
      <>
        Il calcolatore dà la probabilità di un incontro. Un torneo è molti incontri, quindi la probabilità di una medaglia viene dal giocare tutto
        il tabellone. Quando l’IJF pubblica il tabellone di una categoria, il giorno prima, il calcolo del rating gioca il tabellone sorteggiato
        5000 volte con i rating di oggi: gli incontri già decisi restano com’erano, gli altri si disputano con le probabilità del rating. Salva per
        ogni atleta la probabilità dei quarti, delle semifinali, della finale, dell’oro e di una medaglia qualsiasi, e per ogni incontro del
        tabellone chi è probabile che ci arrivi. Durante un torneo le probabilità seguono ogni risultato.
      </>
    ),
    medals2: () => (
      <>
        I tabelloni sono quelli IJF a eliminazione diretta con recuperi dai quarti. Un torneo di altra forma, gironi di pochi atleti, non ha
        probabilità, e prima del sorteggio non ce ne sono. Il primo giorno dello Zagreb Grand Prix, 13 novembre 2026, con Scutto A. (ITA) ai quarti
        nei −48 kg, la sua probabilità era del 56% per l’oro e del 95% per una medaglia: chi perde ai quarti può ancora arrivare al bronzo dai
        recuperi.
      </>
    ),
    p4p: () => (
      <>
        Il rating permette di confrontare atleti di tutte le categorie con una sola misura: quanto ciascuno sta sopra la propria categoria. I rating
        in sé non si confrontano, un rating nei −60 kg e uno nei +100 kg sono stati guadagnati contro avversari diversi. La regola: i candidati sono
        i primi tre di ogni categoria, ciascuno è messo a confronto con il rating medio dei sette migliori altri atleti della stessa categoria, e la
        differenza tra i due ordina la classifica pound for pound. Un atleta nelle classifiche di due categorie conta una volta, con la differenza
        maggiore.
      </>
    ),
    teams: () => (
      <>
        Il rating di una nazione è il rating medio del suo miglior atleta in ogni categoria: sette categorie per la classifica maschile o femminile,
        tutte e quattordici per quella mista. Una categoria in cui la nazione non ha nessuno in classifica conta come l’ultimo posto di quella
        categoria, quindi una nazione forte in molte categorie sta sopra una con una sola stella. La classifica conta anche le categorie in cui una
        nazione ha il miglior atleta di tutte le nazioni e quelle in cui è tra le prime otto.
      </>
    ),
  },
  works: {
    intro: () => <>Un rating vale quanto le sue previsioni. Ogni numero qui è un incontro previsto prima che fosse disputato.</>,
    test: (x) => (
      <>
        Cinque modelli hanno previsto ogni incontro da luglio 2025 a novembre 2026 ({x.f.number(x.test)} in tutto), ciascuno prima che fosse
        disputato: una moneta, il ranking IJF, l’Elo classico, il Glicko-2 da manuale e AJR. Due punteggi: la precisione, quante volte ha vinto il
        favorito, e il log loss, che punisce anche un errore fatto con sicurezza (più basso è meglio, una moneta fa 0,693). Prima AJR e IJF:
      </>
    ),
    allFive: () => <>Tutti e cinque:</>,
    afterTable: (x) => (
      <>
        AJR è primo in ogni riga tranne una: nelle finali dei grandi tornei il Glicko-2 da manuale indovina il vincitore altrettanto spesso (entrambi{" "}
        {x.pct(x.medalRounds.ours.accuracy)}), anche se lì le probabilità di AJR sono meglio calibrate. Con gli esordienti il ranking IJF batte Elo e
        Glicko-2, il contrario di quel che ci si aspettava: un esordiente ha pochi punti, e questo si rivela un indizio onesto del livello di un
        esordiente.
      </>
    ),
    notes: (x) => (
      <>
        Il ranking IJF dà punti, non probabilità: la sua probabilità è 1 / (1 + (punti<sub>B</sub> / punti<sub>A</sub>)<sup>k</sup>), con k ={" "}
        {x.dec(x.k, 2)} stimato sui mesi prima del test. In {x.f.number(x.disagreements.n)} incontri AJR e IJF indicavano favoriti diversi, quello di
        AJR ha vinto il <b>{x.pct(x.disagreements.ours_right / x.disagreements.n)}</b> delle volte (test esatto di McNemar: p{" "}
        {x.disagreements.p < 0.001 ? `< ${x.dec(0.001, 3)}` : x.dec(x.disagreements.p, 3)}). Dove IJF non poteva scegliere (punti uguali, spesso
        entrambi a 0), conta come mezzo giusto, come farebbe una moneta. Punteggi di Brier, per modello: {x.brier}.
      </>
    ),
    notesFormula: () => (
      <>
        La probabilità prima di un incontro: P(A batte B) = 1 / (1 + e<sup>−g × (rating<sub>A</sub> − rating<sub>B</sub>) / 173,72</sup>), con g =
        1 / √(1 + 3φ²/π²) e φ = √(RD<sub>A</sub>² + RD<sub>B</sub>²) / 173,72. L’aggiornamento dopo l’incontro è quello di Glicko-2 (Glickman,
        2013), un incontro per periodo di rating, il calcolatore qui sopra lo scrive per intero con i numeri dentro.
      </>
    ),
    calibration: () => (
      <>
        Una probabilità dovrebbe voler dire quel che dice: su cento incontri con un favorito al 70%, il favorito dovrebbe vincerne circa settanta.
        Indovinare spesso il vincitore non basta, un modello che dice 99% ogni volta che ha ragione e perde una volta su tre non serve a nulla a
        un allenatore prima di un sorteggio.
      </>
    ),
    afterCalibration: (x) => (
      <>
        Un favorito al 95% dovrebbe comunque perdere un incontro su venti, e lo perde: {x.top.n - x.top.won} su {x.f.number(x.top.n)} da luglio
        2025. Chi li ha battuti era per lo più nuovo: delle 30 sorprese più grandi, 19 le hanno firmate atleti con meno di dieci incontri senior,
        tre di loro al primo, talenti che il rating non aveva ancora incontrato. Altri tre vincitori tornavano dopo più di un anno di assenza.
      </>
    ),
    beatTitle: "Batti il rating",
    oneRd1: () => (
      <>
        Il Glicko-2 da manuale ordina gli atleti e prevede gli incontri con la sola forza. AJR fa entrambe le cose con la forza meno l’RD. Togliere
        l’incertezza è un’idea vecchia: Mark Glickman suggerisce di leggere un rating come un intervallo di due RD da ciascun lato, e il TrueSkill di
        Microsoft ordina i giocatori per la forza meno tre RD. Quanti RD togliere, l’n qui sotto, è stato scelto qui in base ai risultati.
      </>
    ),
    oneRd2: (x) => (
      <>
        Senza togliere nulla, un esordiente con una grande vittoria sta sopra un atleta con decine di incontri. Con tre RD, la regola delle classifiche
        fino a novembre 2026, gli esordienti restavano giù per un anno o più. Un RD ha dato il miglior log loss sugli incontri del test, e il favorito
        ne ha vinti il {x.pct(x.all.ours.accuracy)}, contro il {x.pct(x.zero.accuracy)} con la forza nuda. L’n è stato scelto su questi stessi incontri.
        Prova gli altri:
      </>
    ),
    limits: [
      "Come è stato vinto un incontro: un ippon in dieci secondi conta quanto una vittoria per shido, per hansoku-make o al golden score.",
      "Tutto ciò che sta fuori dagli incontri individuali senior pubblicati da IJF judobase: kata, juniores, cadetti, master e gare a squadre (un campione del mondo juniores parte da 1500 come tutti), e mancano alcuni Mondiali dal 2009 al 2011.",
      "Infortuni, malattie, un nuovo allenatore, il pubblico di casa, una lunga giornata di incontri, stili e prese: invisibili finché i risultati non li mostrano.",
      "Quanto costa davvero un cambio di categoria a un dato atleta: il passo è un 5% fisso della forza, una volta per passaggio quale che sia la distanza, uguale per ogni categoria, uomini e donne.",
      "I risultati che IJF judobase non ha ancora pubblicato: un incontro entra nel rating entro circa 20 minuti da quando compare lì.",
    ],
    footer: () => (
      <>
        Il codice, i dati e ogni previsione dietro questi numeri:{" "}
        <a href={REPO} className={LINK}>
          il benchmark su GitHub
        </a>
        .
        <br />
        La storia completa del rating:{" "}
        <Link href="/data" className={LINK}>
          Esporta i dati
        </Link>
        .
      </>
    ),
  },
};
