// The methodology's prose in Portuguese (Brazilian), paragraph by paragraph with the English
// (types.ts). Athletes' and tournaments' names as in the data. Style: impersonal, no long
// dashes, comparisons always IJF and AJR symmetric (the owner's decisions of 22.11).

import Link from "@/components/Link";

import type { Prose } from "./types";

const LINK = "underline decoration-rule underline-offset-2 hover:decoration-ink";
const REPO = "https://github.com/anotherjudorating/ajr-backend/tree/main/benchmark";

export const pt: Prose = {
  meta: {
    title: "Como funciona o rating",
    description:
      "Por que o Another Judo Rating existe, como uma luta o move e quanto ele acerta: Paris 2024, pontos IJF contra força, uma calculadora e um teste em 24.503 lutas contra o ranking IJF.",
  },
  title: "Como funciona o rating",
  lead: () => (
    <>
      Um rating de cada judoca do IJF judobase, com todas as lutas adultas desde 2009, cerca de 227 mil lutas. Um número por atleta, e ele responde a
      uma pergunta: qual é a chance de vencer o próximo adversário. Esta página conta por que ele foi criado, como é calculado e quanto acerta.
    </>
  ),
  why: {
    intro: () => <>Duas coisas deram início a tudo. A primeira aconteceu na Olimpíada de Paris, a segunda acontece todo fim de semana em alguma Copa da Europa.</>,
    paris1: () => (
      <>
        Em 28 de julho de 2024, às onze da manhã, a final olímpica do feminino −52 kg foi disputada nas oitavas. Uta Abe, campeã olímpica em Tóquio,
        enfrentou Diyora Keldiyorova, do Uzbequistão, que à noite seria campeã olímpica. Era a segunda luta de Abe no dia.
      </>
    ),
    paris2: () => (
      <>
        Por que elas se encontraram tão cedo? Porque o sorteio segue o ranking IJF, a World Ranking List, e ele é uma corrida por pontos. Ganham-se
        pontos pela fase alcançada nos eventos que a IJF conta: os seis melhores resultados do ano valem por inteiro, os seis do ano anterior pela
        metade. A lista decide quem é cabeça de chave no Mundial e nos Jogos Olímpicos, e portanto quem escapa de quem.
      </>
    ),
    paris3: () => (
      <>
        Abe chegou a Paris como campeã olímpica de Tóquio e com quatro títulos mundiais. Tinha deixado de disputar o Mundial de 2024 e lutado dois
        eventos do World Tour no ano anterior à data de corte, por isso no ranking IJF era a 10ª entre as inscritas e não era cabeça de chave. As
        japonesas fazem isso com frequência: alguns torneios escolhidos enquanto as outras disputam uma dúzia. Keldiyorova tinha lutado a temporada
        inteira e era a cabeça de chave 1.
      </>
    ),
    paris4: () => (
      <>
        Keldiyorova a projetou para ippon depois de três minutos e ganhou o ouro naquela noite. O problema é o sorteio. Aquela luta devia ter sido uma
        final. Foi injusto com Abe, e igualmente injusto com Keldiyorova. Ela venceu, mas tinha feito tudo o que o ranking IJF pede e ainda assim
        pegou a atleta mais forte da categoria a quatro lutas de uma medalha, e uma derrota a mandaria para casa sem nada. Cabeças de chave definidas
        pela força teriam separado as duas até o bloco final.
      </>
    ),
    paris5: () => (
      <>
        Definir cabeças de chave pela força exige uma medida de força, e os pontos IJF não servem: eles contam onde a atleta foi e até onde chegou, não
        quem ela venceu. Uma medida de força tem que pesar cada luta, vencida ou perdida, por quem estava do outro lado, para que dois torneios contra
        as melhores valham tanto quanto uma temporada de torneios mais fáceis. É isso que o AJR faz.
      </>
    ),
    paris6: (x) => (
      <>
        Na véspera da luta Abe era a primeira da tabela AJR, {x.parisLead} pontos à frente da segunda (um nº 1 fica em torno de 2400, um nº 10 em
        torno de 2050), e Keldiyorova era a quinta. O AJR dava a Abe {x.abeChance}% de chance na luta. Um favorito de {x.abeChance}% perde uma luta
        em dez, e foi essa.
      </>
    ),
    afterParisDraw: () => <>Aqui está a mesma chave montada das duas formas, pelo ranking IJF e pelo rating AJR.</>,
    afterDraw: () => (
      <>
        Uma chave não prova nada em nenhum sentido, por isso aqui estão todos os torneios desde que começa o arquivo de listas da IJF, março de 2025,
        e uma pergunta simples para cada categoria: o número 1 ganhou? O número 1 da IJF ganhou 341 de 1.091 ouros, o número 1 do AJR ganhou 421. O
        AJR ficou à frente em todos os níveis menos nas Copas da Europa, onde a IJF levou um ouro a mais (44 a 43).
      </>
    ),
    afterNumberOne: () => (
      <>
        O ranking IJF também esquece: um ano parado corta os pontos de uma atleta pela metade e o segundo ano os apaga, como se o descanso a
        deixasse mais fraca do que qualquer uma que seguiu lutando. Uma pausa custa pouco no AJR. Abe não lutou nada entre Antalya, em março, e Paris,
        em julho, e seu rating caiu 9 pontos. Alice Bellandi, da Itália, ganhou o −78 kg em Paris e ficou dez meses sem lutar, seu rating caiu 36
        pontos, e em junho de 2025 ela voltou e ganhou o Mundial.
      </>
    ),
    newcomers1: () => (
      <>
        Atletas fora de uma seleção começam pelas Copas da Europa e pelos Opens continentais, e pagam as viagens do próprio bolso. Uma Copa da Europa
        não dá nenhum ponto IJF adulto. Onde há pontos IJF, eles pagam pela fase alcançada, nunca por quem se enfrentou: perder nas 1/16 para o
        número um do mundo vale o mesmo que perder para o número 80. Muitos atletas passaram duas ou três temporadas assim, lutando bem, perdendo para
        gente boa e voltando para casa com zero. A maioria parou.
      </>
    ),
    newcomers2: () => (
      <>
        Funciona também no outro sentido. Em 8 de junho de 2024, sete semanas antes de Paris, Lasha Bekauri ganhou o −90 kg e Teddy Riner o +100 kg no
        Madrid European Open: 100 pontos cada, um décimo de um ouro de Grand Slam e os mesmos 100 de qualquer ouro de European Open naquele ano. Os
        pontos IJF veem o rótulo do evento. Os atletas que perderam para Riner ou Bekauri naquele dia receberam o que receberiam por perder para
        qualquer um.
      </>
    ),
    newcomers3: () => (
      <>
        O AJR só pergunta quem você venceu, quem venceu você e qual era a chance disso. Bobur Yangiboyev, do Uzbequistão, lutou seus dois primeiros
        Grand Slams com seis semanas de intervalo e foi igualmente longe nos dois: uma vitória nas 1/16, uma derrota nas oitavas. Em Tbilisi ele venceu
        Akhmed Turluev, rating 2033 contra seus 1150, com 4% de chance. Em Dushanbe venceu um estreante.
      </>
    ),
    afterPoints: () => <>A IJF deu a ele 160 pontos por cada um. No AJR o primeiro dia levou seu rating de 1150 a 1612, o segundo de 1610 a 1641.</>,
    goldWorth: () => (
      <>
        Um ouro vale o que valeram suas lutas. Amandine Buchard, da França, ganhou o Dushanbe Grand Slam em maio de 2025 contra quatro atletas de
        rating entre 1224 e 1675: o AJR dava a ela 90% de chance de vencer as quatro. Akhmed Turluev, nascido em 2006, ganhou o Ljubljana European
        Open em fevereiro de 2026, seu primeiro torneio adulto, e começou com uma vitória sobre Muhammed Koc com 8%.
      </>
    ),
    afterTwoGolds: () => (
      <>
        A IJF deu 1.000 pontos a Buchard e 100 a Turluev. O AJR deu 12 a Buchard, porque esperava cada uma daquelas vitórias, e 885 a Turluev. Por
        isso vencê-lo cinco semanas depois valeu tanto para Yangiboyev.
      </>
    ),
    losses: () => (
      <>
        As derrotas também contam. O ranking IJF guarda os melhores resultados de uma atleta e esquece o resto, por isso uma cabeça de chave que cai
        na primeira luta em todos os outros eventos não perde nada. No AJR cada derrota custa, mais quanto mais fraco o adversário, e uma sequência
        delas aparece na tabela muito antes de aparecer nos pontos.
      </>
    ),
  },
  number: {
    intro: () => <>Quanto um atleta é forte, quanta certeza o rating pode ter disso, e o que uma luta muda.</>,
    skill1: () => (
      <>
        A <b>força</b> é a melhor estimativa de quanto um atleta é forte. O <b>RD</b> (rating deviation, o desvio do rating) representa quanto o
        atleta é instável: a que distância sua força real pode estar da estimativa, para cima ou para baixo. Todos começam com força 1500 e RD 350. As
        lutas baixam o RD, até 50 a 80 para quem luta sempre, e uma pausa longa ou resultados que oscilam o empurram de volta para cima.
      </>
    ),
    skill2: () => (
      <>
        O rating, o número de todas as tabelas, é a força menos o RD: a força que um atleta provou, não a melhor estimativa. Dois atletas com força
        2000. Um lutou cinquenta vezes neste ano e tem RD 60, rating 1940. O outro lutou três vezes e tem RD 300, rating 1700. O segundo pode ser tão
        forte quanto o primeiro, e a tabela vai mostrar isso quando as lutas mostrarem.
      </>
    ),
    formula: () => <>Rating = força − RD</>,
    formulaNote: () => <>Um estreante que ganha uma luta grande tem força alta mas RD grande: o rating espera pela prova.</>,
    calculator1: () => (
      <>
        Antes de uma luta os dois ratings dão uma chance. Depois dela o rating do vencedor sobe e o do perdedor cai: pouco quando o favorito vence,
        muito quando o azarão vence, e mais para um atleta com RD grande.
      </>
    ),
    calculator2: () => (
      <>
        O evento, a fase e a forma da vitória não contam: só quem se enfrentou e o resultado. Perder para alguém muito mais forte custa quase nada,
        perder para alguém mais fraco custa muito. Vencer repetidamente no mesmo nível rende menos a cada vez, à medida que o rating chega a esse
        nível. Mude os números e escolha o vencedor. A partir da página de uma luta a calculadora abre com essa luta carregada.
      </>
    ),
    career: () => (
      <>
        Ao longo de uma carreira as duas linhas ficam assim, como na página de cada atleta. Aqui está a carreira mais longa dos dados, a de Teddy
        Riner: a força tracejada, o rating em linha cheia, a incerteza na faixa entre as duas.
      </>
    ),
    afterRiner: () => (
      <>
        A faixa cinza é o RD: estreita enquanto ele luta, mais larga sempre que ele para. Depois da derrota para Kageura em fevereiro de 2020 ele
        ficou onze meses sem lutar, seu RD cresceu de 206 para 226 e seu rating caiu 20, até as vitórias de janeiro de 2021 o trazerem de volta. Os
        trechos hachurados marcados como Inativo são onde doze meses haviam passado desde a última luta: ali ele estava fora das tabelas.
      </>
    ),
    weights1: () => (
      <>
        Uma tabela lista os atletas que lutaram nos últimos doze meses. Depois de um ano sem luta o atleta sai das tabelas, a força fica guardada, e a
        próxima luta o traz de volta.
      </>
    ),
    weights2: () => (
      <>
        Todo atleta com uma luta nos últimos 12 meses está em pelo menos uma tabela, em geral a da categoria em que luta. Um atleta que lutou em duas
        categorias está na tabela de cada categoria em que teve três ou mais torneios. Com menos de três em todas, está em uma só: a categoria da sua
        Olimpíada ou do seu campeonato mais recente nesses 12 meses, e sem nenhum deles, a categoria em que disputou mais torneios.
      </>
    ),
    afterTableRule: () => (
      <>
        O rating em si é um só para todas as categorias. Atletas fortes que sobem de categoria vencem menos do que o rating diz nas primeiras lutas lá
        (um atleta do top 10: 84% esperado, 72% vencido), por isso uma mudança dá um passo na força, uma vez, antes da primeira luta na nova categoria:
        × 0,95 ao subir, × 1,05 ao descer, não importa quantas categorias de distância. Tato Grigalashvili, campeão mundial no −81 kg, subiu para o
        −90 kg em fevereiro de 2025: sua força de 2586 virou 2456 antes da primeira luta lá, e o rating caiu junto. De volta ao −81 kg dois meses
        depois, a força subiu 5%.
      </>
    ),
    weightMovesTitle: "As mudanças de categoria de Grigalashvili",
    medals1: () => (
      <>
        A calculadora dá a chance de uma luta. Um torneio são muitas lutas, por isso a chance de medalha vem de jogar a chave inteira. Quando a IJF
        publica a chave de uma categoria, na véspera, o cálculo do rating joga a chave sorteada 5.000 vezes com os ratings de hoje: as lutas já
        decididas ficam como foram, as outras são disputadas pelas chances do rating. Ele guarda a chance de cada atleta de chegar às quartas, às
        semifinais, à final, ao ouro e a qualquer medalha, e para cada luta da chave quem tem mais chance de estar nela. Durante um torneio as chances
        seguem cada resultado.
      </>
    ),
    medals2: () => (
      <>
        As chaves são a eliminatória simples da IJF com repescagem a partir das quartas. Um torneio de outro formato, grupos de poucos atletas, não
        recebe chances, e antes do sorteio não há nenhuma. No primeiro dia do Zagreb Grand Prix, 13 de novembro de 2026, com Scutto A. (ITA) nas
        quartas do −48 kg, sua chance estava em 56% para o ouro e 95% para uma medalha: quem perde nas quartas ainda pode chegar ao bronze pela
        repescagem.
      </>
    ),
    p4p: () => (
      <>
        O rating permite comparar atletas de todas as categorias por uma mesma medida: quanto cada um está acima da própria categoria. Os ratings em
        si não são comparados, um rating no −60 kg e um no +100 kg foram conquistados contra adversários diferentes. A regra: os candidatos são os três
        primeiros de cada categoria, cada um é posto diante do rating médio dos sete melhores outros atletas da mesma categoria, e a diferença entre os
        dois ordena a tabela peso por peso. Um atleta nas tabelas de duas categorias conta uma vez, com a maior diferença.
      </>
    ),
    teams: () => (
      <>
        O rating de um país é o rating médio do seu melhor atleta em cada categoria: sete categorias para a tabela masculina ou feminina, as catorze
        para a mista. Uma categoria em que o país não tem ninguém na tabela conta como o último lugar daquela categoria, por isso um país forte em
        muitas categorias fica acima de um país com uma única estrela. A tabela também conta as categorias em que um país tem o melhor atleta de todos
        os países e as categorias em que está entre os oito primeiros.
      </>
    ),
  },
  works: {
    intro: () => <>Um rating vale o que valem suas previsões. Cada número aqui é uma luta prevista antes de ser disputada.</>,
    test: (x) => (
      <>
        Cinco modelos previram todas as lutas de julho de 2025 a novembro de 2026 ({x.f.number(x.test)} lutas), cada uma antes de ser disputada: uma
        moeda, o ranking IJF, o Elo clássico, o Glicko-2 clássico e o AJR. Duas notas: o acerto, com que frequência o favorito venceu, e o log loss,
        que também pune um erro confiante (menor é melhor, uma moeda faz 0,693). Primeiro AJR e IJF:
      </>
    ),
    allFive: () => <>Os cinco:</>,
    afterTable: (x) => (
      <>
        O AJR é o primeiro em todas as linhas menos uma: nas lutas por medalha dos grandes torneios o Glicko-2 clássico acerta o vencedor com a mesma
        frequência (ambos {x.pct(x.medalRounds.ours.accuracy)}), embora as chances do AJR sejam mais bem calibradas ali. Com estreantes, o ranking IJF
        supera o Elo e o Glicko-2, o contrário do esperado: um estreante tem poucos pontos, e isso acaba sendo um sinal razoável do nível de um
        estreante.
      </>
    ),
    notes: (x) => (
      <>
        O ranking IJF dá pontos, não chances: sua chance é 1 / (1 + (pontos<sub>B</sub> / pontos<sub>A</sub>)<sup>k</sup>), com k = {x.dec(x.k, 2)}{" "}
        ajustado nos meses anteriores ao teste. Em {x.f.number(x.disagreements.n)} lutas AJR e IJF apontaram favoritos diferentes, o do AJR venceu{" "}
        <b>{x.pct(x.disagreements.ours_right / x.disagreements.n)}</b> delas (teste exato de McNemar: p{" "}
        {x.disagreements.p < 0.001 ? `< ${x.dec(0.001, 3)}` : x.dec(x.disagreements.p, 3)}). Onde a IJF não podia escolher (pontos iguais, muitas vezes
        ambos em 0), conta como meio acerto, como faria uma moeda. Escores de Brier, por modelo: {x.brier}.
      </>
    ),
    notesFormula: () => (
      <>
        A chance antes de uma luta: P(A vence B) = 1 / (1 + e<sup>−g × (rating<sub>A</sub> − rating<sub>B</sub>) / 173,72</sup>), com g = 1 / √(1 +
        3φ²/π²) e φ = √(RD<sub>A</sub>² + RD<sub>B</sub>²) / 173,72. A atualização depois dela é a do Glicko-2 (Glickman, 2013), uma luta por período
        de rating, e a calculadora acima a escreve com os números dentro.
      </>
    ),
    calibration: () => (
      <>
        Uma chance deve querer dizer o que diz: de cem lutas com um favorito de 70%, o favorito deve vencer cerca de setenta. Acertar o vencedor
        com frequência não basta, um modelo que diz 99% toda vez que acerta e perde uma em três não serve para nada a um treinador antes de um
        sorteio.
      </>
    ),
    afterCalibration: (x) => (
      <>
        Um favorito de 95% ainda deve perder uma luta em vinte, e perde: {x.top.n - x.top.won} de {x.f.number(x.top.n)} desde julho de 2025. Quem os
        venceu eram na maioria novatos: das 30 maiores surpresas, 19 foram de atletas com menos de dez lutas adultas, três deles na primeira, atletas
        talentosos que o rating ainda não conhecia. Outros três vencedores voltavam de mais de um ano parados.
      </>
    ),
    beatTitle: "Vença o rating",
    oneRd1: () => (
      <>
        O Glicko-2 clássico ordena os atletas e prevê as lutas só pela força. O AJR faz as duas coisas pela força menos o RD. Tirar a incerteza é uma
        ideia antiga: Mark Glickman sugere ler um rating como uma faixa de dois RD para cada lado, e o TrueSkill da Microsoft ordena os jogadores pela
        força menos três RD. Quantos RD tirar, o n abaixo, foi escolhido aqui pelos resultados.
      </>
    ),
    oneRd2: (x) => (
      <>
        Sem tirar nada, um estreante com uma grande vitória fica acima de um veterano com dezenas de lutas. Com três RD, a regra das tabelas até
        novembro de 2026, os novatos ficavam presos embaixo por um ano ou mais. Um RD deu o melhor log loss nas lutas do teste, e o favorito venceu{" "}
        {x.pct(x.all.ours.accuracy)} delas, contra {x.pct(x.zero.accuracy)} com a força pura. O n foi escolhido nessas mesmas lutas. Experimente os
        outros:
      </>
    ),
    limits: [
      "Como a luta foi vencida: um ippon em dez segundos conta o mesmo que uma vitória por shido, por hansoku-make ou no golden score.",
      "Tudo o que está fora das lutas individuais adultas que o IJF judobase publica: kata, juniores, cadetes, veteranos e eventos por equipes (um campeão mundial júnior começa em 1500 como qualquer um), e alguns Mundiais de 2009 a 2011 faltam.",
      "Lesões, doenças, um técnico novo, torcida em casa, um dia longo de lutas, estilos e pegadas: invisíveis até que os resultados os mostrem.",
      "Quanto uma mudança de categoria custa de fato a um atleta em particular: o passo é 5% fixos da força, uma vez por mudança não importa a distância, igual para todas as categorias, masculino e feminino.",
      "Resultados que o IJF judobase ainda não publicou: uma luta chega ao rating cerca de 20 minutos depois de aparecer lá.",
    ],
    footer: () => (
      <>
        O código, os dados e cada previsão por trás destes números:{" "}
        <a href={REPO} className={LINK}>
          o benchmark no GitHub
        </a>
        .
        <br />
        A história completa do rating:{" "}
        <Link href="/data" className={LINK}>
          Exportar dados
        </Link>
        .
      </>
    ),
  },
};
