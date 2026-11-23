# Глоссарий переводов

Термины каждого языка сайта: русский ниже, затем французский, испанский, итальянский и португальский (пояснения к ним по-английски). Общие правила для всех языков: без длинных тире, без точек с запятой и точки-разделителя, безлично, сравнения «IJF» и «AJR» симметрично, имена спортсменов и названия турниров латиницей, как в данных IJF, стадии 1/16, 1/8, 1/4, 1/2 и слово «финал» на языке, веса «−73 kg» с настоящим минусом.

## Русский (ru)

Термины, выбранные для `src/i18n/ru/*.ts` и `src/content/*/ru.tsx`. Правила: без длинных тире, с «ё», без точек с запятой и точки-разделителя, безлично (без «мы»), сравнения всегда «IJF» и «AJR» симметрично, имена спортсменов и названия турниров латиницей, как в данных IJF. Стадии: 1/16, 1/8, 1/4, 1/2, финал. Веса: «−73 кг» (настоящий минус), в таблицах «−73».

| English | Русский | Где и почему |
|---|---|---|
| rating | рейтинг | везде; «рейтинг IJF» / «рейтинг AJR» |
| skill | сила | число Glicko μ: «сила 2100 − RD 70 = рейтинг 2030». Не «навык» и не «мастерство» |
| RD, rating deviation | RD, в прозе один раз «RD (rating deviation, разброс рейтинга)» | код остаётся латиницей |
| uncertainty | неопределённость | полоса на графике, строка «−176 неопределённость» |
| leaderboard, table | таблица | «таблица −73 кг», «вне таблиц» |
| ranking, rankings | рейтинг, «Рейтинги» (раздел) | «мировой рейтинг дзюдо», «рейтинг сборных» |
| IJF World Ranking List | мировой рейтинг IJF, рейтинг-лист IJF | в прозе второй вариант там, где речь о списке |
| pound for pound, P4P | P4P, в описаниях «вне весовых категорий» | «Рейтинг P4P», «№1 P4P» |
| nations, teams | страны (списки и фильтры), сборные (рейтинг команд) | «Рейтинг сборных», колонка «Страна» |
| NAT (узкая колонка кода) | Стр. | три буквы над флагом |
| contest | схватка | никогда «бой», «поединок» |
| win / loss (буквы W / L) | В / П | как в русских турнирных таблицах |
| W–L, W/L | В–П, В/П | |
| chance, win chance | шанс, шанс на победу | «70%», «1,74%» (запятая, без пробела перед %) |
| favourite / underdog | фаворит / аутсайдер | |
| upset | сенсация | «Сенсации месяца», «Главные сенсации», «победы-сенсации». Вариант «апсет» отвергнут как жаргон |
| movers (biggest movers) | «Взлёты и падения» | блок главной, в обе стороны |
| lead (points ahead) | отрыв | колонка «Отрыв» |
| peak | пик | |
| trend | тренд | |
| rank, place | место | «№1», «1-е место», колонка «Место»; «#1» в тексте пишется «№1» без пробела |
| seed, seeded, seeding | сеяный, посев | «первый номер посева», «не сеяная», «посев по рейтингу AJR» |
| draw (the draw) | жеребьёвка (событие), сетка (рисунок) | «Жеребьёвка ещё не опубликована», фигура «Сетка», переключатель «Сетка / Список» |
| bracket / list | сетка / список | |
| bye | без соперника (в женской сетке «без соперницы») | |
| walkover, WO, fusen-gachi | неявка, код WO, «фусэн-гати» | |
| golden score | голден скор, код GS | как говорят комментаторы, не «золотой счёт» |
| ippon, waza-ari, yuko, shido, hansoku-make | иппон, ваза-ари, юко, сидо, хансоку-маке | буквы в таблице схватки: И / В / Ю |
| round | стадия | колонка «Стадия», «Путь к схватке: 1/8 финала» |
| F, 1/2, 1/4, 1/8 … | Финал, 1/2 финала, 1/4 финала, 1/8 финала | коды в сетках остаются «F», «1/2» |
| BR, bronze medal contest | схватка за бронзу, в сетке «За бронзу» | |
| REP, repechage | утешение | |
| round-robin tour | круг | «Круг 1» |
| medal rounds | медальные схватки | |
| Grand Slam, Grand Prix, Masters, World Tour, European Open, European Cup | без перевода, латиницей | названия турниров по решению владельца. Уровень «Кубки Европы» и «континентальные Open» в прозе методологии, «Открытые турниры и кубки» в фильтрах |
| Olympic Games, World Championships, Continental Championships | Олимпийские игры, чемпионат мира, континентальные чемпионаты | уровни турниров в фильтрах |
| Other (level) | Прочие | |
| head-to-head | очные встречи | раздел шапки, страница. Вариант «личные встречи» не хуже, выбран короче для шапки 360 px |
| Explore | Каталог | списки турниров, спортсменов, схваток и стран. Не «Обзор» |
| Records | Рекорды | |
| Methodology | Методология (ссылка), «Как устроен рейтинг» (заголовок страницы) | |
| How it works, How ratings work | Как это устроено, Как устроен рейтинг | |
| Export data | Экспорт данных | |
| Export CSV | Скачать CSV | заголовки CSV остаются английскими |
| Contact | Контакты | |
| Updated | Обновлено | «Рейтинги обновлены 13 ноя 2026» |
| Live / Upcoming | Идёт / Скоро | метки турниров |
| Inactive | Неактивен | больше года без схваток |
| Still in / Placed | Ещё борются / Завершили | фильтр спортсменов веса |
| newcomer, debutant | новичок, дебютант | |
| regular | опытный спортсмен, «тот, кто борется регулярно» | |
| nemesis | Неудобный соперник | рекорд |
| giant killer | Гроза фаворитов | рекорд |
| golden score king | Король голден скора | рекорд |
| deepest team | Самая длинная скамейка | рекорд |
| greatest / longest rivalry | Главное / самое долгое противостояние | |
| least likely champion | Самый неожиданный чемпион | |
| log loss, Brier | log loss, оценка Брайера | log loss латиницей, как термин |
| accuracy | точность | |
| coin flip | монета | |
| Elo | Эло | |
| textbook Glicko-2 | Glicko-2 по учебнику | |
| volatility | волатильность | |
| IJF, AJR, P4P, RD, GS, WO | латиницей | |
| months after a day | 5 мая 2026, 13 ноя 2026 | три буквы, родительный падеж, без точки; месяц сам по себе: «май 2026» |
| numbers | 24 503 (узкий неразрывный пробел), 1,7% | Intl.NumberFormat("ru") |
| ordinals | 1-е, 5-е | одна форма |
| plurals | 1 схватка, 2 схватки, 5 схваток, 21 схватка | формы one / few / many |
| ranges | 1–50 из 625, 7–8 дек | короткое тире между числами оставлено как знак диапазона, как в английском (вопрос владельцу) |
| athletes' names | как в данных: «Abe U.», «Heydarov H.» | в прозе полные имена тоже латиницей: «Uta Abe» |
| countries | по-русски из таблицы `ru/countries.ts` | как страны называют себя по-русски: США, Республика Корея, КНДР, Великобритания, Тайвань (TPE), Беларусь, Кыргызстан, Молдова, Тимор-Лесте, «Нейтральные спортсмены» (AIN), «Команда беженцев» (EOR) |
| 404 «Mate. Sore-made.», «Matte.» | «Матэ. Соре-мадэ.», «Матэ.» | |

## French (fr)

Rules: impersonal (no « nous »), no long dashes or semicolons, IJF and AJR always symmetric (« classement IJF » / « cote AJR », « points IJF » / « points AJR », « le numéro 1 IJF » / « le numéro 1 AJR »), athletes' and tournaments' names as in the IJF data, a no-break space before « : » « ? » « ! » (not before « % », where the formatter writes « 70% »), decimal comma, stages 1/16, 1/8, 1/4, 1/2, finale, weights « −73 kg ».

| English | Français | Where and why |
|---|---|---|
| rating (the number) | cote | the Glicko number of an athlete or a nation: « cote 2030 », « cote AJR », column « Cote ». « Classement » is the list, and French judo has no word for a strength number. « Cote » is the chess usage for an Elo number (Belgium, Québec, chess clubs) and short enough for a column. Not « note », not « score » (the test's scores). Proofreader's first question: does « cote » read as betting odds next to « chance »? |
| ranking, rankings, leaderboard, table | classement, « Classements » (the section) | the list of a weight, the IJF World Ranking List: « classement mondial IJF », « hors classement » (out of the tables). Not « tableau », which is the draw |
| IJF World Ranking List | classement mondial IJF, World Ranking List once in the prose | |
| skill | force | the Glicko μ: « force 2100 − RD 70 = cote 2030 ». Not « niveau » (vaguer), not « compétence » |
| RD, rating deviation | RD, once in the prose « RD (rating deviation, l’incertitude) » | the code stays |
| uncertainty | incertitude | the band on the chart, « −176 incertitude » |
| pound for pound, P4P | P4P in short labels, « toutes catégories » in titles and descriptions | « Classement P4P hommes », « n°1 toutes catégories » |
| nations, teams | nations (lists, filters, the nations ranking), « Équipes » (the switcher's row) | « Classement des nations », column « Nation », « cote d’équipe » for a nation's rating |
| NAT (the narrow code column) | NAT / Nat | three letters over the flag, as in English |
| contest | combat | never « match » or « rencontre » for a contest (« rencontre » is kept for a meeting between two athletes in the head-to-head) |
| win / loss (letters W / L) | V / D | as French result tables write them, « V–D 12 mois », « V/D » |
| chance, win chance | chance, chance de victoire | « 70% », « 1,74% » (the formatter's form, no space before %) |
| favourite / underdog | favori / outsider | « outsider » is the usual French sports word |
| upset | surprise | « Surprises du mois », « Plus grosses surprises », « victoires surprises », chip « Surprise ». « Exploit » names the winner's feat, « surprise » the contest, and it fits a chip |
| movers (biggest movers) | Hausses et baisses | the home block, both directions |
| lead (points ahead) | avance | column « Avance », « Plus grande avance P4P » |
| peak | pic | « Pic 2600 », « pic à 2600 en juil 2024 » |
| trend | tendance | |
| rank, place | rang, place, « n°1 » | « N°1 », « 1er », column « Rang », « n°{place} » without a space, « #1 » never |
| seed, seeded, seeding | tête de série, « têtes de série selon » | « tête de série n°1 », « non tête de série », « Têtes de série selon le classement IJF / la cote AJR » |
| draw (the event) | tirage au sort, le tirage | « Tirage au sort pas encore publié », the methodology's figure « Le tirage au sort » |
| bracket (the drawing) | tableau | the figure, the switch « Tableau / Liste », « tout le tableau », « la moitié du tableau » |
| bye | exempt | |
| walkover, WO, fusen-gachi | forfait, code WO, « fusen-gachi » | |
| golden score | golden score, code GS | the French judo word |
| ippon, waza-ari, yuko, shido, hansoku-make | ippon, waza-ari, yuko, shido, hansoku-make | the letters in the contest table: I / W / Y |
| round (a stage) | tour | column « Tour », « le tour atteint » |
| F, 1/2, 1/4, 1/8 … | Finale, 1/2 finale, 1/4 de finale, 1/8 de finale, 1/16 de finale | the codes in the brackets stay « F », « 1/2 »; the group rows « 1/2 finales », « 1/4 de finale », « 1/8 de finale » |
| BR, bronze medal contest | combat pour le bronze, in the bracket's rows « Bronze » | |
| REP, repechage | repêchage | |
| round-robin tour | tour | « Tour 1 » |
| medal rounds | blocs finaux | « blocs finaux des grands tournois », the French term for the medal session |
| Grand Slam, Grand Prix, Masters, World Tour, European Open, European Cup | as in English | named events in English, by the owner's decision. In generic prose « Coupe d’Europe », « Opens continentaux », « championnats du monde » |
| Olympic Games, World Championships, Continental Championships | Jeux olympiques, Championnats du monde, Championnats continentaux | the levels' filters, « Ch. du monde » and « Ch. continentaux » on phones |
| Other (level) | Autres | |
| head-to-head | face-à-face | the header, the page, the comparison. Four syllables, fits the 360 px header |
| Explore | Explorer | the lists of tournaments, athletes, contests, nations |
| Records | Records | the French word |
| Methodology | Méthodologie (the link), « Comment fonctionne la cote » (the page's title) | |
| How it works, How ratings work | Comment ça marche, Comment fonctionne la cote | |
| Export data | Exporter les données | |
| Export CSV | Exporter en CSV | CSV headers stay English |
| Contact | Contact | |
| Updated | mis à jour | « Classements mis à jour le 13 nov 2026 » |
| Live / Upcoming | En direct / À venir | |
| Inactive | Inactif | over a year without a contest |
| Still in / Placed | En course / Classés | the weight's athletes filter |
| newcomer, debutant | nouveau venu, débutant | |
| regular | habitué | « un habitué aux dizaines de combats » |
| nemesis | Bête noire | the record |
| giant killer | Tueur de géants | the record |
| golden score king | Roi du golden score | |
| deepest team | Équipe la plus dense | « densité » is the French sports word for a deep squad |
| greatest / longest rivalry | Plus grande / plus longue rivalité | |
| least likely champion | Champion le plus improbable | |
| strongest tournament | Tournoi le plus relevé | « relevé » is the French word for a strong field |
| log loss, Brier | log loss, score de Brier | |
| accuracy | précision | |
| coin flip | pile ou face, « pièce » in short labels | |
| Elo, textbook Glicko-2 | Elo, Glicko-2 standard | |
| volatility | volatilité | |
| IJF, AJR, P4P, RD, GS, WO | as in English | |
| months after a day | 5 oct 2026, 13 nov 2026 | janv févr mars avr juin juil août sept oct nov déc: lowercase, no dot, four letters at most, the same array on its own (« mars 2026 ») |
| numbers | 24 503 (narrow no-break space), 1,7% | Intl.NumberFormat("fr"), literal numbers in the prose written the same way |
| ordinals | 1er, 2e, 3e | Intl ordinal rules: one « {n}er », other « {n}e »; used for an athlete's place (« 1er de la catégorie ») |
| plurals | 1 combat, 2 combats, 0 combat | one / other |
| ranges | 1–50 sur 625, 7–8 déc | the en dash between two numbers kept as a range sign, as in English |
| athletes' names | as in the data: « Abe U. », « Heydarov H. » | full names in the prose in Latin too: « Uta Abe » |
| countries | in French from the table `fr/countries.ts` | as the countries call themselves where French allows: Biélorussie (the French press form, « Bélarus » is the diplomatic one), Corée du Sud, Corée du Nord, Taïwan (TPE), Kirghizistan, Moldavie, Timor oriental, Eswatini, « Athlètes individuels neutres » (AIN), « Équipe des réfugiés » (EOR), RDA, RFA, URSS, Zaïre |
| 404 « Mate. Sore-made. », « Matte. » | unchanged, in romaji | |

## Italian (it)

Terms chosen for `src/i18n/it/*.ts` and `src/content/*/it.tsx`. Rules: no long dashes, no semicolons, no middle dot, impersonal (no "noi"), comparisons always "ranking IJF" / "rating AJR" side by side, athletes' and tournaments' names as in the IJF data, stages 1/16, 1/8, 1/4, 1/2, finale, weights "−73 kg" (real minus), decimal comma, typographic apostrophe (l’atleta).

| English | Italiano | Where and why |
|---|---|---|
| rating | rating | the number, everywhere ("rating AJR", "rating più alto"). Italian sport writes "rating" for a computed strength (chess, tennis analytics), "punti" would clash with IJF points |
| ranking, rankings (the list) | ranking (one list: "ranking mondiale IJF", "ranking P4P"), classifiche (the section) | header "Classifiche", breadcrumb; "classifica" is also the leaderboard of one weight |
| skill | forza | the Glicko μ: "forza 2100 − RD 70 = rating 2030". Not "abilità" |
| RD, rating deviation | RD, once in prose "RD (rating deviation, la deviazione del rating)" | code stays Latin |
| uncertainty | incertezza | the band on the chart, "−176 incertezza" |
| leaderboard, table | classifica | "classifica dei −73 kg", "fuori dalle classifiche" |
| pound for pound, P4P | P4P, "pound for pound" written out in titles and prose | Italian coverage uses the English phrase |
| nations, teams | nazioni (lists, filters, the nations ranking); "squadra" only in "rating di squadra" and "squadra più profonda" | header switcher "Nazioni", column "Paese" for the country filter |
| NAT (narrow code column) | NAZ (rankings), Naz (records, explore) | three letters over the flag |
| contest | incontro | FIJLKAM and the press say "incontro", never "combattimento" or "match" |
| win / loss (letters) | V / S | as Italian tables write vittorie / sconfitte, "V–S", "V/S" |
| chance, win chance | probabilità (column head "Prob.") | "70%", "1,74%" |
| favourite / underdog | favorito / sfavorito | |
| upset | sorpresa | "Sorprese del mese", "Vittorie a sorpresa". "Upset" as an anglicism was rejected |
| movers (biggest movers) | Chi sale e chi scende | the home block, both directions |
| lead (points ahead) | margine | column "Margine", "Margine P4P più grande" |
| peak | picco | |
| trend | trend | the column, an Italian word now |
| rank, place | posizione (the rank in a list, column "Pos."), posto (a tournament place), "n. 1" | "#1" is written "n. 1" with a space, as Italian press does |
| seed, seeded, seeding | testa di serie, teste di serie | "testa di serie n. 1", "non testa di serie", "teste di serie secondo il rating AJR" |
| draw (the draw) | sorteggio (the event), tabellone (the bracket) | "Sorteggio non ancora pubblicato", figure "Il tabellone", switch "Tabellone / Elenco" |
| bracket / list | tabellone / elenco | |
| bye | bye | the Italian bracket word too |
| walkover, WO, fusen-gachi | forfait, code WO, "fusen-gachi" | "Vittoria per forfait: {name} non si è presentato" |
| golden score | golden score, code GS | as commentators say it |
| ippon, waza-ari, yuko, shido, hansoku-make | ippon, waza-ari, yuko, shido, hansoku-make | letters in the contest table stay I / W / Y (as the IJF scoreboard) |
| round | turno | column "Turno", "Il cammino verso l’incontro: 1/8 di finale" |
| F, 1/2, 1/4, 1/8 … | Finale, Semifinale, Quarto di finale, 1/8 di finale | codes in brackets stay "F", "1/2"; group rows "Semifinali", "Quarti di finale" |
| BR, bronze medal contest | finale per il bronzo | the press' term, "Finali per il bronzo" as a group row |
| REP, repechage | recuperi | the Italian federation's word |
| round-robin tour | girone, turno n | "Girone, turno 1" |
| medal rounds | finali dei grandi tornei | the test's slice |
| Grand Slam, Grand Prix, Masters, World Tour, European Open, European Cup | untranslated | tournament names stay English (owner's decision), "Coppe Europa" and "Open continentali" as levels in prose and filters |
| Olympic Games, World Championships, Continental Championships | Giochi Olimpici, Campionati del mondo (short "Mondiali"), Campionati continentali (short "Continentali") | |
| Other (level) | Altri | |
| head-to-head | testa a testa | header and page, the usual Italian sports phrase |
| Explore | Esplora | the catalogue of tournaments, athletes, contests and nations |
| Records | Record | invariable in Italian, singular and plural |
| Methodology | Metodologia (link), "Come funziona il rating" (page title) | |
| How it works, How ratings work | Come funziona, Come funziona il rating | |
| Export data | Esporta i dati | |
| Export CSV | Esporta CSV | CSV headers stay English |
| Contact | Contatti | |
| Updated | Aggiornato, "Rating aggiornati il 13 nov 2026" | |
| Live / Upcoming | In corso / In arrivo | tournament chips |
| Inactive | Inattivo | over a year without a contest |
| Still in / Placed | In gara / Classificati | a weight's athletes filter |
| newcomer, debutant | esordiente | |
| regular | atleta di lungo corso, "chi gareggia regolarmente" | |
| nemesis | Bestia nera | the record, the Italian idiom for an opponent one keeps losing to |
| giant killer | Ammazzagrandi | the record, the press' word |
| golden score king | Re del golden score | |
| deepest team | Squadra più profonda | |
| greatest / longest rivalry | Rivalità più grande / più lunga | |
| least likely champion | Campione meno probabile | |
| log loss, Brier | log loss, punteggio di Brier | |
| accuracy | precisione | |
| coin flip | moneta | |
| Elo, textbook Glicko-2 | Elo, Glicko-2 da manuale | |
| volatility | volatilità | |
| IJF, AJR, P4P, RD, GS, WO | Latin, as they are | |
| months after a day | 5 ott 2026, 13 nov 2026 | three letters, lowercase, no dot (gen feb mar apr mag giu lug ago set ott nov dic), the same for a month alone: "mar 2026" |
| numbers | 24.503, 1,7% | Intl.NumberFormat("it"): a point for thousands (none in four-digit numbers: 1091), a comma for decimals |
| ordinals | 1º, 5º, 8º | one form, the masculine ordinal sign (an athlete's place, a nation's place) |
| plurals | 1 incontro, 2 incontri | one / other |
| ranges | 1–50 di 625, 7–8 dic | the short dash between numbers kept as a range sign, as in English |
| athletes' names | as in the data: "Abe U.", "Heydarov H." | full names in prose also Latin: "Uta Abe" |
| countries | in Italian from `it/countries.ts` | as the press writes them: Stati Uniti, Corea del Sud, Corea del Nord, Regno Unito, Taiwan (TPE), Bielorussia, Repubblica Ceca, Moldavia, RD del Congo, Timor Est, "Atleti neutrali individuali" (AIN), "Squadra dei rifugiati" (EOR), URSS, Jugoslavia, Cecoslovacchia, Germania Est / Ovest, Zaire |
| 404 "Mate. Sore-made.", "Matte." | unchanged, romaji | |

## Portuguese (pt, Brazilian)

Terms chosen for `src/i18n/pt/*.ts` and `src/content/*/pt.tsx`. Brazilian Portuguese (judô, judoca, luta, chave), without slang a reader in Portugal would not follow. Rules: no long dashes, no semicolons, no middle dot, impersonal (no nós/a gente), comparisons always "ranking IJF" / "rating AJR" symmetric, athletes' and tournaments' names as in the IJF data. Stages: 1/16, oitavas (1/8 in codes), quartas, semifinal, final. Weights: "−73 kg" (real minus), "−73" in tables.

| English | Português | Where and why |
|---|---|---|
| rating | rating | everywhere, the number: "rating AJR", "rating 2543". Brazilian chess and sports press use "rating" for an Elo-type number. "Pontuação" would be confused with IJF points, "classificação" and "ranking" are the list |
| ranking, rankings | ranking, "Rankings" (the section) | "ranking mundial de judô", "ranking de países". The IJF list is "ranking IJF" or "ranking mundial da IJF" |
| skill | força | the Glicko μ: "força 2100 − RD 70 = rating 2030". Not "habilidade" or "nível" |
| RD, rating deviation | RD, once in prose "RD (rating deviation, o desvio do rating)" | the code stays |
| uncertainty | incerteza | the band on the chart, "−176 incerteza" |
| leaderboard, table | tabela | "tabela de −73 kg", "fora das tabelas" |
| pound for pound, P4P | P4P in labels, "peso por peso" in sentences | "Ranking P4P masculino", "1º peso por peso" |
| nations, teams | países (lists, filters, columns), seleções (the teams ranking's name, "rating de seleção") | "Ranking de países", column "País" |
| NAT (narrow column) | País / PAÍS | over the flag |
| contest | luta | never "combate" (Portugal) or "partida" |
| win / loss (W / L) | V / D | as Brazilian tables write vitória / derrota |
| W–L, W/L | V–D, V/D | |
| chance, win chance | chance, chance de vitória | "70%", "1,74%" (comma, no space before %) |
| favourite / underdog | favorito / azarão | "azarão" is the Brazilian press's word, understood in Portugal |
| upset | surpresa | "Surpresas do mês", "Maiores surpresas", "vitórias surpresa". "Zebra" is the Brazilian slang and very natural in speech, but informal and opaque in Portugal, so the neutral word was chosen for labels. A proofreader may prefer "zebra" on the home page |
| movers (biggest movers) | Maiores variações | the home block, both directions |
| lead (points ahead) | vantagem | column "Vantagem", "Maior vantagem P4P" |
| peak | pico | |
| trend | tendência | |
| rank, place | posição (in a ranking), lugar (at a tournament) | "nº 1" with a space, "1º" as ordinal, columns "Posição" and "Lugar" |
| seed, seeded, seeding | cabeça de chave, cabeças de chave | "cabeça de chave 1", "sem cabeça de chave", "cabeças de chave pelo rating AJR" |
| draw (the event) | sorteio | "Sorteio ainda não publicado", figure "O sorteio" |
| draw, bracket (the drawing) | chave | "a chave real", switch "Chave / Lista" |
| bye | bye | the word Brazilian brackets use |
| walkover, WO, fusen-gachi | WO, "fusen-gachi" in brackets | "WO: não lutou" |
| golden score | golden score, code GS | as the commentators say it, not "ponto de ouro" |
| ippon, waza-ari, yuko, shido, hansoku-make | ippon, waza-ari, yuko, shido, hansoku-make | letters in the contest table: I / W / Y |
| round | fase | column "Fase", "Caminho até a luta" |
| F, 1/2, 1/4, 1/8 … | Final, Semifinal, Quartas de final, 1/8 de final | the codes in brackets stay "F", "1/2"; in prose "oitavas", "quartas", "semifinais" |
| BR, bronze medal contest | Luta pelo bronze, in the bracket "Bronze" | |
| REP, repechage | Repescagem | |
| round-robin tour | Rodada | "Rodada 1" |
| medal rounds | lutas por medalha | |
| Grand Slam, Grand Prix, Masters, World Tour, European Open, European Cup | untranslated | tournament names by the owner's decision. The level "Copas da Europa" and "Opens continentais" in the methodology's prose, "Opens e Copas continentais" in the filters |
| Olympic Games, World Championships, Continental Championships | Jogos Olímpicos, Campeonato Mundial (short "Mundial"), Campeonatos continentais | tournament levels in the filters |
| Other (level) | Outros | |
| head-to-head | Confrontos (the header and the page), confronto direto (in sentences) | "Confronto direto no judô", "Confrontos anteriores" |
| Explore | Explorar | the lists of tournaments, athletes, contests and nations |
| Records | Recordes | |
| Methodology | Metodologia (link), "Como funciona o rating" (the page's title) | |
| How it works, How ratings work | Como funciona, Como funciona o rating | |
| Export data | Exportar dados | |
| Export CSV | Baixar CSV | CSV headers stay English |
| Contact | Contato | |
| Updated | Atualizado | "Ratings atualizados em 13 nov 2026" |
| Live / Upcoming | Ao vivo / Em breve | tournament chips |
| Inactive | Inativo | more than a year without a contest |
| Still in / Placed | Na disputa / Classificados | the weight's athletes filter |
| newcomer, debutant | novato, estreante | |
| regular | veterano, "quem luta sempre" | |
| nemesis | Carrasco | the record: the Brazilian press's word for the opponent who always beats you |
| giant killer | Caçador de gigantes | record |
| golden score king | Rei do golden score | record |
| deepest team | Elenco mais profundo | record |
| greatest / longest rivalry | Maior / mais longa rivalidade | |
| least likely champion | Campeão menos provável | |
| log loss, Brier | log loss, escore de Brier | |
| accuracy | acerto | "Acerto do rating" |
| coin flip | moeda | |
| Elo | Elo | |
| textbook Glicko-2 | Glicko-2 clássico | |
| volatility | volatilidade | |
| IJF, AJR, P4P, RD, GS, WO | as they are | |
| months after a day | 5 mai 2026, 13 nov 2026 | three letters, lower case, no dot, both arrays the same (jan fev mar abr mai jun jul ago set out nov dez). Full names lower case in the explore month rows: "janeiro de 2026" |
| numbers | 24.503, 1,7% | Intl.NumberFormat("pt"): a point for thousands, a comma for decimals |
| ordinals | 1º, 5º | one form, masculine (lugar, posto), "{n}º" |
| plurals | 1 luta, 2 lutas, 0 lutas | Intl.PluralRules("pt") gives one for 0 and 1: "0 lutas" would need a zero form the site never shows |
| ranges | 1–50 de 625, 7–8 dez | the short dash between numbers kept as a range sign, as in English |
| athletes' names | as in the data: "Abe U.", "Heydarov H." | in prose too: "Uta Abe" |
| countries | from the table `pt/countries.ts` | Estados Unidos, Coreia do Sul, Coreia do Norte, Reino Unido, Taiwan (TPE), Belarus (the press's current form, not Bielorrússia), Tchéquia, Catar, Mianmar, "Atletas neutros" (AIN), "Equipe de refugiados" (EOR), URSS, Iugoslávia, Tchecoslováquia, Alemanha Oriental / Ocidental, Zaire |
| 404 "Mate. Sore-made.", "Matte." | unchanged, romaji | |
