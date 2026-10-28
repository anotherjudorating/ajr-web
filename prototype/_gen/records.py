#!/usr/bin/env python3
"""Records: all-time bests in 5 tabs (Ratings, Medals, Contests, Tournaments, Nations) -> ../_stitch/records.html

Each card shows the top 5 (JS keeps 5 rows after the Men/Women filter and renumbers them);
"Full list" opens the record page (record.py, one template for every record).
"""
import os

import chrome
from chrome import CHEV_TD, CHEV_TH, H2, H2ROW, LINK, ROW, TABLE, TD, TH, THEAD_TR, flag, footer, head, header, name

HERE = os.path.dirname(os.path.abspath(__file__))
chrome.FLAG_SVG.setdefault('UZB', '<rect width="16" height="12" fill="#FFF"/><rect width="16" height="4" fill="#0099B5"/><rect y="8" width="16" height="4" fill="#1EB53A"/><rect y="3.8" width="16" height=".5" fill="#CE1126"/><rect y="7.7" width="16" height=".5" fill="#CE1126"/>')
chrome.FLAG_SVG.setdefault('BEL', '<rect width="5.33" height="12" fill="#000"/><rect x="5.33" width="5.34" height="12" fill="#FDDA24"/><rect x="10.67" width="5.33" height="12" fill="#EF3340"/>')
chrome.FLAG_SVG.setdefault('UKR', '<rect width="16" height="6" fill="#0057B7"/><rect y="6" width="16" height="6" fill="#FFD700"/>')

ATH = "location.href='/athletes/x'"
TOUR = "location.href='/tournaments/abu-dhabi-2026'"
CONTEST = "location.href='/contest/x'"
H2H = "location.href='/head-to-head'"
SHOW = 5  # rows per card

# extra athletes used to fill the mock lists so that Men and Women each have 5 rows
M_POOL = [('Lombardo M.', 'ITA', 'M −73'), ('Heydarov H.', 'AZE', 'M −73'), ('Grigalashvili T.', 'GEO', 'M −81'),
          ('Kotsoiev Z.', 'AZE', 'M −100'), ('Trippel E.', 'GER', 'M −90'), ('Nagase T.', 'JPN', 'M −81'),
          ('Ishihara T.', 'JPN', 'M −73'), ('Sulamanidze V.', 'GEO', 'M −100')]
W_POOL = [('Deguchi C.', 'CAN', 'W −57'), ('Bellandi A.', 'ITA', 'W −78'), ('Dicko R.', 'FRA', 'W +78'),
          ('Tsunoda N.', 'JPN', 'W −48'), ('Krasniqi D.', 'KOS', 'W −52'), ('Huh M.', 'KOR', 'W −57'),
          ('Matic B.', 'CRO', 'W −70'), ('Babulfath T.', 'SWE', 'W −48')]


def fill(data, step):
    """(athlete, nation, weight, value, sub) sorted by value desc -> add pool athletes below the last value
    until each gender has SHOW rows."""
    data = list(data)
    low = min(r[3] for r in data)
    for g, pool in (('M', M_POOL), ('W', W_POOL)):
        have = {r[0] for r in data}
        need = SHOW - sum(r[2][0] == g for r in data)
        for n, c, w in [p for p in pool if p[0] not in have][:max(need, 0)]:
            low -= step
            data.append((n, c, w, low, data[-1][4]))
    return sorted(data, key=lambda r: -r[3])


# --- Ratings ---
PEAK = fill([('Riner T.', 'FRA', 'M +100', 2421, 'Aug 2017'), ('Ono S.', 'JPN', 'M −73', 2408, 'Aug 2016'),
             ('Agbegnenou C.', 'FRA', 'W −63', 2396, 'Sep 2019'), ('Abe U.', 'JPN', 'W −52', 2372, 'Oct 2019'),
             ('Bekauri L.', 'GEO', 'M −90', 2361, 'Jul 2024')], 7)
LEAD = fill([('Riner T.', 'FRA', 'M +100', 168, 'Mar 2016'), ('Agbegnenou C.', 'FRA', 'W −63', 141, 'Feb 2020'),
             ('Ono S.', 'JPN', 'M −73', 127, 'Sep 2016'), ('Abe U.', 'JPN', 'W −52', 102, 'Nov 2019'),
             ('Bekauri L.', 'GEO', 'M −90', 88, 'Aug 2024')], 6)
NO1 = fill([('Riner T.', 'FRA', 'M +100', 2310, '2011–2017'), ('Agbegnenou C.', 'FRA', 'W −63', 1544, '2017–2021'),
            ('Ono S.', 'JPN', 'M −73', 1201, '2013–2016'), ('Abe U.', 'JPN', 'W −52', 988, '2018–2021'),
            ('Bilodid D.', 'UKR', 'W −48', 902, '2018–2021')], 61)
NO1_RUN = fill([('Riner T.', 'FRA', 'M +100', 1980, '2011–2016'), ('Agbegnenou C.', 'FRA', 'W −63', 1210, '2017–2020'),
                ('Ono S.', 'JPN', 'M −73', 1033, '2013–2016'), ('Bilodid D.', 'UKR', 'W −48', 702, '2018–2020'),
                ('Abe U.', 'JPN', 'W −52', 655, '2019–2021')], 47)
# age when first #1 (youngest first)
YOUNG = [('Bilodid D.', 'UKR', 'W −48', '17 y 345 d', 'Sep 2018'), ('Abe U.', 'JPN', 'W −52', '18 y 102 d', 'Jul 2018'),
         ('Abe H.', 'JPN', 'M −66', '19 y 220 d', 'Dec 2017'), ('Riner T.', 'FRA', 'M +100', '19 y 310 d', 'Sep 2009'),
         ('Krasniqi D.', 'KOS', 'W −52', '20 y 41 d', 'Nov 2023'), ('Ishihara T.', 'JPN', 'M −73', '20 y 155 d', 'Mar 2024'),
         ('Tsunoda N.', 'JPN', 'W −48', '20 y 300 d', 'Oct 2019'), ('Heydarov H.', 'AZE', 'M −73', '21 y 8 d', 'Feb 2018'),
         ('Bekauri L.', 'GEO', 'M −90', '21 y 60 d', 'Jun 2021'), ('Deguchi C.', 'CAN', 'W −57', '21 y 120 d', 'Jan 2017')]

# --- Medals ---
# athlete, nation, gold, silver, bronze (IJF World Tour)
MEDALS = [('Riner T.', 'FRA', 41, 6, 4), ('Agbegnenou C.', 'FRA', 33, 7, 5), ('Abe U.', 'JPN', 24, 4, 3),
          ('Bekauri L.', 'GEO', 14, 6, 9), ('Krasniqi D.', 'KOS', 16, 9, 12), ('Tsunoda N.', 'JPN', 18, 3, 4),
          ('Abe H.', 'JPN', 19, 4, 3), ('Ono S.', 'JPN', 15, 3, 2), ('Grigalashvili T.', 'GEO', 12, 5, 6),
          ('Heydarov H.', 'AZE', 9, 4, 7), ('Deguchi C.', 'CAN', 13, 6, 5)]
MEDAL_RUN = fill([('Riner T.', 'FRA', 'M +100', 38, '2010–2020'), ('Agbegnenou C.', 'FRA', 'W −63', 27, '2016–2021'),
                  ('Abe U.', 'JPN', 'W −52', 19, '2017–2021'), ('Tsunoda N.', 'JPN', 'W −48', 15, '2022–2026'),
                  ('Bekauri L.', 'GEO', 'M −90', 13, '2023–2026')], 1)
# tournaments in a row with a gold medal
GOLD_RUN = fill([('Riner T.', 'FRA', 'M +100', 29, '2011–2019'), ('Agbegnenou C.', 'FRA', 'W −63', 16, '2017–2020'),
                 ('Abe U.', 'JPN', 'W −52', 11, '2018–2021'), ('Ono S.', 'JPN', 'M −73', 9, '2014–2016'),
                 ('Tsunoda N.', 'JPN', 'W −48', 7, '2023–2025')], 1)
YOUNG_GS = [('Bilodid D.', 'UKR', 'W −48', '16 y 201 d', 'Paris GS 2017'), ('Abe U.', 'JPN', 'W −52', '16 y 288 d', 'Tokyo GS 2016'),
            ('Abe H.', 'JPN', 'M −66', '17 y 94 d', 'Tokyo GS 2014'), ('Tsunoda N.', 'JPN', 'W −48', '17 y 312 d', 'Tokyo GS 2010'),
            ('Riner T.', 'FRA', 'M +100', '18 y 30 d', 'Paris GS 2007'), ('Krasniqi D.', 'KOS', 'W −52', '18 y 77 d', 'Abu Dhabi GS 2021'),
            ('Ishihara T.', 'JPN', 'M −73', '18 y 140 d', 'Tokyo GS 2019'), ('Heydarov H.', 'AZE', 'M −73', '18 y 200 d', 'Baku GS 2016'),
            ('Lombardo M.', 'ITA', 'M −73', '18 y 290 d', 'Paris GS 2018'), ('Deguchi C.', 'CAN', 'W −57', '18 y 310 d', 'Paris GS 2014')]
YOUNG_GS.sort(key=lambda r: tuple(int(x) for x in r[3].replace(' y ', ' ').replace(' d', '').split()))
# age at first Grand Slam gold
YOUNG_GS_GOLD = [('Abe U.', 'JPN', 'W −52', '17 y 105 d', 'Paris GS 2017'), ('Bilodid D.', 'UKR', 'W −48', '17 y 160 d', 'Tokyo GS 2018'),
                 ('Abe H.', 'JPN', 'M −66', '17 y 220 d', 'Tokyo GS 2014'), ('Krasniqi D.', 'KOS', 'W −52', '18 y 300 d', 'Antalya GS 2022'),
                 ('Riner T.', 'FRA', 'M +100', '19 y 15 d', 'Paris GS 2008'), ('Tsunoda N.', 'JPN', 'W −48', '19 y 88 d', 'Tokyo GS 2011'),
                 ('Ishihara T.', 'JPN', 'M −73', '19 y 240 d', 'Tokyo GS 2020'), ('Heydarov H.', 'AZE', 'M −73', '20 y 31 d', 'Baku GS 2017'),
                 ('Lombardo M.', 'ITA', 'M −73', '20 y 190 d', 'Tel Aviv GS 2020'), ('Deguchi C.', 'CAN', 'W −57', '20 y 205 d', 'Tokyo GS 2015')]
# athlete, nation, tournament, before, after
GAINS = [('Yusupov D.', 'UZB', 'Paris GS 2021', 2041, 2112), ('Tsunoda N.', 'JPN', 'Budapest WCH 2017', 2118, 2181),
         ('Gauthier-Drapeau F.', 'CAN', 'Montreal GP 2022', 2010, 2068), ('Krasniqi D.', 'KOS', 'Tokyo GS 2019', 2097, 2151),
         ('Heydarov H.', 'AZE', 'Tashkent GS 2024', 2150, 2201), ('Deguchi C.', 'CAN', 'Paris GS 2023', 2088, 2138),
         ('Matic B.', 'CRO', 'Zagreb GP 2023', 2050, 2098), ('Babulfath T.', 'SWE', 'Abu Dhabi GS 2026', 2140, 2186),
         ('Lombardo M.', 'ITA', 'Tbilisi GS 2023', 2133, 2178), ('Nagase T.', 'JPN', 'Tokyo GS 2018', 2101, 2145)]

# --- Contests ---
STREAK = fill([('Riner T.', 'FRA', 'M +100', 154, '2010–2020'), ('Agbegnenou C.', 'FRA', 'W −63', 61, '2017–2021'),
               ('Ono S.', 'JPN', 'M −73', 39, '2015–2019'), ('Abe U.', 'JPN', 'W −52', 37, '2019–2022'),
               ('Abe H.', 'JPN', 'M −66', 33, '2018–2021')], 2)
# winner, loser, event, round, winner's chance
UPSETS = [(('Bertrand A.', 'BEL'), ('Ono S.', 'JPN'), 'Baku GS 2016', 'R32', 4),
          (('Yusupov D.', 'UZB'), ('Riner T.', 'FRA'), 'Paris GS 2021', 'R16', 6),
          (('Wagner A.', 'GER'), ('Agbegnenou C.', 'FRA'), 'Doha WM 2023', 'QF', 7),
          (('Krasniqi D.', 'KOS'), ('Abe U.', 'JPN'), 'Tokyo GS 2019', 'R16', 8),
          (('Babulfath T.', 'SWE'), ('Tsunoda N.', 'JPN'), 'Paris GS 2025', 'SF', 9),
          (('Giuffrida O.', 'ITA'), ('Abe U.', 'JPN'), 'Paris OG 2024', 'QF', 11),
          (('Huh M.', 'KOR'), ('Deguchi C.', 'CAN'), 'Tokyo GS 2024', 'Final', 12),
          (('Gauthier-Drapeau F.', 'CAN'), ('Grigalashvili T.', 'GEO'), 'Abu Dhabi GS 2026', 'Final', 14),
          (('Heydarov H.', 'AZE'), ('Ishihara T.', 'JPN'), 'Baku GS 2025', 'SF', 15),
          (('Lombardo M.', 'ITA'), ('Abe H.', 'JPN'), 'Paris GS 2025', 'R16', 16)]
GIANT = fill([('Krasniqi D.', 'KOS', 'W −52', 41, '34%'), ('Gauthier-Drapeau F.', 'CAN', 'M −81', 37, '39%'),
              ('Babulfath T.', 'SWE', 'W −48', 33, '36%'), ('Lombardo M.', 'ITA', 'M −73', 31, '28%'),
              ('Yusupov D.', 'UZB', 'M −100', 29, '41%')], 2)
# athlete A, athlete B, meetings, wins A, wins B
RIVAL = [(('Abe H.', 'JPN'), ('Maruyama J.', 'JPN'), 12, 7, 5), (('Bekauri L.', 'GEO'), ('Trippel E.', 'GER'), 11, 8, 3),
         (('Agbegnenou C.', 'FRA'), ('Trstenjak T.', 'SLO'), 10, 9, 1), (('Heydarov H.', 'AZE'), ('Lombardo M.', 'ITA'), 9, 5, 4),
         (('Riner T.', 'FRA'), ('Kim M.', 'KOR'), 9, 9, 0), (('Abe U.', 'JPN'), ('Krasniqi D.', 'KOS'), 9, 6, 3),
         (('Tsunoda N.', 'JPN'), ('Babulfath T.', 'SWE'), 8, 5, 3), (('Deguchi C.', 'CAN'), ('Huh M.', 'KOR'), 8, 4, 4),
         (('Bellandi A.', 'ITA'), ('Wagner A.', 'GER'), 7, 4, 3)]

# --- Tournaments --- tournament, host, date, average rating of entrants
STRONG = [('Tokyo OG 2020', 'JPN', 'Jul 2021', 2104), ('Paris OG 2024', 'FRA', 'Jul 2024', 2101),
          ('Tokyo WCH 2019', 'JPN', 'Aug 2019', 2093), ('Abu Dhabi WCH 2024', 'UAE', 'May 2024', 2088),
          ('Doha WM 2023', 'UAE', 'Dec 2023', 2084)]
# tournament, host, date, upsets, favourite won %
UNPRED = [('Zagreb GP 2023', 'CRO', 'Sep 2023', 61, 58.4), ('Tashkent GS 2022', 'UZB', 'Mar 2022', 57, 60.1),
          ('Montreal GP 2022', 'CAN', 'Jul 2022', 49, 61.0), ('Abu Dhabi GS 2026', 'UAE', 'Oct 2026', 38, 62.3),
          ('Baku GS 2016', 'AZE', 'May 2016', 52, 62.8)]
PRED = [('Tokyo GS 2019', 'JPN', 'Nov 2019', 14, 84.2), ('Paris GS 2020', 'FRA', 'Feb 2020', 17, 82.9),
        ('Tokyo OG 2020', 'JPN', 'Jul 2021', 19, 81.7), ('Düsseldorf GS 2019', 'GER', 'Feb 2019', 21, 81.0),
        ('Paris OG 2024', 'FRA', 'Jul 2024', 22, 80.6)]

# tournament, host, nations with a medal, medals awarded
PODIUM_NATIONS = [('Paris OG 2024', 'FRA', 31, 56), ('Tokyo OG 2020', 'JPN', 29, 56), ('Baku WCH 2018', 'AZE', 28, 64),
                  ('Doha WM 2023', 'UAE', 27, 64), ('Abu Dhabi GS 2026', 'UAE', 25, 56)]

# --- Nations --- code, value, sub
TEAM = [('JPN', 2262, 'Aug 2019'), ('FRA', 2231, 'Feb 2020'), ('GEO', 2188, 'Jul 2024'), ('KOR', 2171, 'Oct 2015'), ('AZE', 2160, 'Mar 2025')]
TEAM_NO1 = [('JPN', '4,980', '2010–2026'), ('FRA', 612, '2016–2018'), ('GEO', 203, '2024'), ('KOR', 88, '2012'), ('MGL', 41, '2014')]
TEAM_NO1_RUN = [('JPN', '3,105', '2017–2026'), ('FRA', 401, '2016–2017'), ('GEO', 156, '2024'), ('KOR', 61, '2012'), ('MGL', 41, '2014')]
# most medals by one nation at one tournament: code, medals, tournament
TEAM_MEDALS = [('JPN', 24, 'Tokyo GS 2019'), ('JPN', 22, 'Tokyo WCH 2019'), ('FRA', 19, 'Paris GS 2020'), ('GEO', 14, 'Tbilisi GS 2024'), ('KOR', 13, 'Seoul GP 2015')]
TEAM_MEDALS_OG = [('JPN', 12, 'Tokyo OG 2020'), ('JPN', 9, 'Paris OG 2024'), ('JPN', 7, 'Rio OG 2016'), ('FRA', 8, 'Paris OG 2024'), ('KOR', 6, 'London OG 2012')]
TEAM_MEDALS_OG.sort(key=lambda r: -r[1])
# nation medals: code, gold, silver, bronze
NAT_WT = [('JPN', 612, 401, 538), ('FRA', 301, 255, 389), ('KOR', 188, 190, 260), ('GEO', 176, 141, 198), ('BRA', 121, 139, 230),
          ('MGL', 102, 118, 175), ('AZE', 98, 87, 140)]
NAT_OG = [('JPN', 48, 21, 26), ('FRA', 18, 12, 31), ('KOR', 11, 16, 20), ('GEO', 9, 5, 10), ('BRA', 4, 3, 19),
          ('AZE', 3, 2, 7), ('MGL', 2, 5, 9)]

# gender of every athlete that appears with a weight, for rows that have no weight column
GENDER = {r[0]: r[2][0] for d in (PEAK, LEAD, NO1, NO1_RUN, YOUNG, MEDAL_RUN, GOLD_RUN, YOUNG_GS, YOUNG_GS_GOLD, STREAK, GIANT) for r in d}
GENDER.update({n: w[0] for n, _, w in M_POOL + W_POOL})
GENDER.update({'Bertrand A.': 'M', 'Yusupov D.': 'M', 'Gauthier-Drapeau F.': 'M', 'Wagner A.': 'W', 'Giuffrida O.': 'W',
               'Ono S.': 'M', 'Bilodid D.': 'W', 'Agbegnenou C.': 'W', 'Abe U.': 'W', 'Abe H.': 'M', 'Riner T.': 'M', 'Bekauri L.': 'M'})


def wt(w):
    return ('Men ' if w[0] == 'M' else 'Women ') + w[2:]


def slug(title):
    title = title.replace('|', '')
    return '/records/' + ''.join(ch if ch.isalnum() else '-' for ch in title.lower()).strip('-').replace('--', '-')


def section(title, thead, rows, tabs=None):
    """rows: tbody html, or with tabs a list of tbody html, one per tab label. Header: [tabs] Full list."""
    a = f'<a href="{slug(title)}" class="{LINK}">Full list</a>'
    if tabs:
        a = ('<div class="flex items-baseline gap-4 shrink-0"><div class="flex items-center gap-3 text-[13px] sm:text-[14px]">' + ''.join(
            f'<button type="button" data-tab="{i}" class="rec-tab pb-0.5 border-b-2 '
            + ('font-bold text-[#990F3D] border-[#990F3D]' if i == 0 else 'text-[#66605C] hover:text-[#33302E] border-transparent') + '">'
            # (full, short) labels: the short one on narrow phones
            + (f'<span class="hidden min-[480px]:inline">{t[0]}</span><span class="min-[480px]:hidden">{t[1]}</span>' if isinstance(t, tuple) else t) + '</button>'
            for i, t in enumerate(tabs)) + f'</div>{a}</div>')
        body = ''.join(f'<tbody data-pane="{i}"' + ('' if i == 0 else ' class="hidden"') + f'>{r}</tbody>' for i, r in enumerate(rows))
    else:
        body = f'<tbody>{rows}</tbody>'
    # "|" in a title = line break on narrow phones only (short first line, longer second one)
    t = title.replace('|', '<br class="mbr">')
    # controls sit on the title's last line, right above the table
    row = H2ROW.replace('items-baseline', 'items-end')
    return (f'<section class="rec"><div class="{row}"><h2 class="{H2}">{t}</h2>{a}</div>'
            f'<table class="{TABLE}"><thead><tr class="{THEAD_TR}">{thead}{CHEV_TH}</tr></thead>{body}</table></section>')


def th(label, cls='text-left', width=''):
    return f'<th class="{TH} {cls} {width}">{label}</th>'


def tr(g, onclick, i, split=False):
    """row start + rank cell; data-g lets the Men/Women filter hide it, .rk is renumbered by JS.
    split rows (nations: separate men's / women's lists) show only while that gender is selected;
    g == 'A' rows (nations, both genders) show only with All."""
    hide = ' style="display:none"' if i >= SHOW or split else ''
    sp = ' data-split="1"' if split else ''
    return (f'<tr class="{ROW} rec-row" data-g="{g}"{sp} onclick="{onclick}"{hide}>'
            f'<td class="{TD} rk text-right text-[#66605C] w-8 sm:w-10">{i + 1}</td>')


def athlete_rows(data, value, sub=None, onclick=ATH):
    out = ''
    for i, r in enumerate(data):
        n, c, w = r[0], r[1], r[2]
        out += (tr(w[0], onclick, i)
                + f'<td class="{TD}">{name(c, n)}</td>'
                f'<td class="{TD} text-[#66605C] whitespace-nowrap hidden sm:table-cell">{wt(w)}</td>'
                f'<td class="{TD} text-right font-bold">{value(r)}</td>'
                + (f'<td class="{TD} text-right text-[#66605C] whitespace-nowrap hidden sm:table-cell"><div class="truncate">{sub(r)}</div></td>' if sub else '')
                + f'{CHEV_TD}</tr>')
    return out


def athlete_head(value, sub=None, vw='w-20 sm:w-24', sw='w-28'):
    return (th('#', 'text-right', 'w-8 sm:w-10') + th('Athlete') + th('Weight', 'text-left hidden sm:table-cell', 'w-32')
            + th(value, 'text-right', vw) + (th(sub, 'text-right hidden sm:table-cell', sw) if sub else ''))


def age(r):
    return f'<span class="font-semibold">{r[3]}</span>'


# ---------- cards ----------
def peak():
    return section('Highest rating', athlete_head('Peak', 'Date'), athlete_rows(PEAK, lambda r: r[3], lambda r: r[4]))


def lead():
    return section('Biggest lead at #1', athlete_head('Over #2', 'Date'), athlete_rows(LEAD, lambda r: f'+{r[3]}', lambda r: r[4]))


def no1():
    return section('Longest at #1', athlete_head('Days', 'Period'),
                   [athlete_rows(NO1, lambda r: f'{r[3]:,}', lambda r: r[4]), athlete_rows(NO1_RUN, lambda r: f'{r[3]:,}', lambda r: r[4])],
                   tabs=('Total', 'In a row'))


def young():
    return section('Youngest #1', athlete_head('Age', 'Date', 'w-24 sm:w-28'), athlete_rows(YOUNG, age, lambda r: r[4]))


def medals():
    by_total = lambda r: (-(r[2] + r[3] + r[4]), -r[2])
    by_gold = lambda r: (-r[2], -(r[3] + r[4]))

    def rows(key):
        return ''.join(
            tr(GENDER[n], ATH, i) + f'<td class="{TD}">{name(c, n)}</td>'
            f'<td class="{TD} text-center{" font-bold" if key is by_gold else ""}">{g}</td><td class="{TD} text-center hidden sm:table-cell">{sv}</td>'
            f'<td class="{TD} text-center hidden sm:table-cell">{b}</td><td class="{TD} text-right{" font-bold" if key is by_total else ""}">{g + sv + b}</td>{CHEV_TD}</tr>'
            for i, (n, c, g, sv, b) in enumerate(sorted(MEDALS, key=key)))
    icon = lambda k, hide='': f'<th class="{TH} text-center w-10 sm:w-12 {hide}" title="{chrome.MEDAL_NAME[k]}"><span class="inline-flex justify-center w-full">{chrome.medal(k, "w-4 h-5")}</span></th>'
    head_ = (th('#', 'text-right', 'w-8 sm:w-10') + th('Athlete') + icon(1) + icon(2, 'hidden sm:table-cell') + icon(3, 'hidden sm:table-cell')
             + th('Total', 'text-right', 'w-14 sm:w-16'))
    return section('Most |World Tour medals', head_, [rows(by_total), rows(by_gold)], tabs=('Total', 'Gold'))


def medal_run():
    return section('Most medals in a row', athlete_head('In a row', 'Period'),
                   [athlete_rows(MEDAL_RUN, lambda r: r[3], lambda r: r[4]), athlete_rows(GOLD_RUN, lambda r: r[3], lambda r: r[4])],
                   tabs=('Any', 'Gold'))


def young_gs():
    return section('Youngest |Grand Slam medal', athlete_head('Age', 'Tournament', 'w-24 sm:w-28', 'w-36'),
                   [athlete_rows(YOUNG_GS, age, lambda r: r[4]), athlete_rows(YOUNG_GS_GOLD, age, lambda r: r[4])], tabs=('Any', 'Gold'))


def gains():
    data = sorted(GAINS, key=lambda r: -(r[4] - r[3]))
    rows = ''.join(
        tr(GENDER[n], ATH, i) + f'<td class="{TD}">{name(c, n)}</td>'
        f'<td class="{TD} text-[#66605C] hidden sm:table-cell"><div class="truncate">{t}</div></td>'
        f'<td class="{TD} text-right text-[#66605C] whitespace-nowrap hidden sm:table-cell">{b} → {a}</td>'
        f'<td class="{TD} text-right font-bold text-[#0D7680]">+{a - b}</td>{CHEV_TD}</tr>'
        for i, (n, c, t, b, a) in enumerate(data))
    head_ = (th('#', 'text-right', 'w-8 sm:w-10') + th('Athlete') + th('Tournament', 'text-left hidden sm:table-cell', 'w-40')
             + th('Rating', 'text-right hidden sm:table-cell', 'w-28') + th('+/−', 'text-right', 'w-14 sm:w-16'))
    return section('Biggest gain at one tournament', head_, rows)


def streak():
    return section('Longest winning streak', athlete_head('Wins', 'Period'), athlete_rows(STREAK, lambda r: r[3], lambda r: r[4]))


def upsets():
    rows = ''
    for i, (w, l, ev, rnd, ch) in enumerate(UPSETS):
        rows += (tr(GENDER[w[0]], CONTEST, i)
                 + f'<td class="px-2 sm:px-3 py-2 align-middle"><div class="flex flex-col gap-1">{name(w[1], w[0])}'
                 f'<div class="flex items-center gap-1.5 min-w-0 text-[#66605C]">{flag(l[1])}<span class="truncate">{l[0]}</span></div></div></td>'
                 f'<td class="{TD} text-[#66605C] hidden sm:table-cell"><div class="truncate">{ev}</div><div class="text-[12px]">{rnd}</div></td>'
                 f'<td class="{TD} text-right font-bold text-[#0D7680]">{ch}%</td>{CHEV_TD}</tr>')
    head_ = (th('#', 'text-right', 'w-8 sm:w-10') + th('Winner / loser') + th('Tournament', 'text-left hidden sm:table-cell', 'w-40')
             + th('Chance', 'text-right', 'w-16 sm:w-20'))
    return section('Biggest upsets', head_, rows)


def giants():
    return section('Giant killer', athlete_head('Upset wins', 'Of all wins', 'w-24 sm:w-28'), athlete_rows(GIANT, lambda r: r[3], lambda r: r[4]))


def rivals():
    rows = ''
    for i, (a, b, m, wa, wb) in enumerate(RIVAL):
        rows += (tr(GENDER[a[0]], H2H, i)
                 + f'<td class="px-2 sm:px-3 py-2 align-middle"><div class="flex flex-col gap-1">{name(a[1], a[0])}{name(b[1], b[0])}</div></td>'
                 f'<td class="px-2 sm:px-3 py-2 align-middle text-right"><div class="flex flex-col gap-1 font-semibold"><span>{wa}</span><span>{wb}</span></div></td>'
                 f'<td class="{TD} text-right font-bold">{m}</td>{CHEV_TD}</tr>')
    head_ = (th('#', 'text-right', 'w-8 sm:w-10') + th('Athletes') + th('Wins', 'text-right', 'w-14 sm:w-16')
             + th('Contests', 'text-right', 'w-20 sm:w-24'))
    return section('Most frequent rivalry', head_, rows)


def tsplit(data, g, vi, asc=False):
    """mock men's / women's list from a tournaments list: shift the value at index vi, re-sort"""
    out = []
    for i, r in enumerate(data):
        j = (i * 5 + (2 if g == 'M' else 4)) % 7
        v = r[vi]
        if isinstance(v, float):
            nv = round(v + (j - 3) * 0.6 + (0.8 if g == 'M' else -0.8), 1)
        elif v > 1500:
            nv = v + (5 if g == 'M' else -7) - j
        else:
            nv = max(1, round(v * (0.55 if g == 'M' else 0.45)) + j - 3)
        out.append(tuple(nv if k == vi else x for k, x in enumerate(r)))
    return sorted(out, key=lambda r: r[vi] if asc else -r[vi])


def tsplit_rows(rowfn, data, vi, asc=False):
    return rowfn(data, 'A', False) + rowfn(tsplit(data, 'M', vi, asc), 'M', True) + rowfn(tsplit(data, 'W', vi, asc), 'W', True)


def tname(t, h):
    return f'<div class="flex items-center gap-1.5 min-w-0">{flag(h)}<span class="font-medium truncate">{t}</span></div>'


def strong():
    def rows1(data, g, sp):
        return ''.join(
            tr(g, TOUR, i, sp) + f'<td class="{TD}">{tname(t, h)}</td>'
            f'<td class="{TD} text-[#66605C] whitespace-nowrap hidden sm:table-cell">{d}</td>'
            f'<td class="{TD} text-right font-bold">{r}</td>{CHEV_TD}</tr>'
            for i, (t, h, d, r) in enumerate(data))
    head_ = (th('#', 'text-right', 'w-8 sm:w-10') + th('Tournament') + th('Date', 'text-left hidden sm:table-cell', 'w-24')
             + f'<th class="{TH} text-right w-20 sm:w-28" title="Average rating of the entrants"><span class="hidden sm:inline">Avg rating</span><span class="sm:hidden">Avg</span></th>')
    return section('Strongest tournament', head_, tsplit_rows(rows1, STRONG, 3))


def podium_nations():
    def rows1(data, g, sp):
        return ''.join(
            tr(g, TOUR, i, sp) + f'<td class="{TD}">{tname(t, h)}</td>'
            f'<td class="{TD} text-right text-[#66605C] hidden sm:table-cell">{m}</td>'
            f'<td class="{TD} text-right font-bold">{n}</td>{CHEV_TD}</tr>'
            for i, (t, h, n, m) in enumerate(data))
    head_ = (th('#', 'text-right', 'w-8 sm:w-10') + th('Tournament') + th('Medals', 'text-right hidden sm:table-cell', 'w-20')
             + f'<th class="{TH} text-right w-20 sm:w-24" title="Nations with at least one medal">Nations</th>')
    # men's / women's: half the medals each
    halves = lambda g: [(t, h, n, m // 2) for t, h, n, m in tsplit(PODIUM_NATIONS, g, 2)]
    return section('Most nations on the podium', head_,
                   rows1(PODIUM_NATIONS, 'A', False) + rows1(halves('M'), 'M', True) + rows1(halves('W'), 'W', True))


def tour_pred(title, data, asc):
    def rows1(d, g, sp):
        return ''.join(
            tr(g, TOUR, i, sp) + f'<td class="{TD}">{tname(t, h)}</td>'
            f'<td class="{TD} text-right text-[#66605C] hidden sm:table-cell">{u}</td>'
            f'<td class="{TD} text-right font-bold">{p:.1f}%</td>{CHEV_TD}</tr>'
            for i, (t, h, dt, u, p) in enumerate(d))
    head_ = (th('#', 'text-right', 'w-8 sm:w-10') + th('Tournament') + th('Upsets', 'text-right hidden sm:table-cell', 'w-20')
             + f'<th class="{TH} text-right w-20 sm:w-24 whitespace-nowrap" title="Contests won by the rating favourite">Fav. won</th>')
    # men's / women's: upsets roughly halved
    def half(g):
        return [(t, h, dt, max(1, u // 2 + (1 if g == 'M' else -1)), p) for t, h, dt, u, p in tsplit(data, g, 4, asc)]
    return section(title, head_, rows1(data, 'A', False) + rows1(half('M'), 'M', True) + rows1(half('W'), 'W', True))


def _num(v):
    return int(str(v).replace(',', '')) if not isinstance(v, int) else v


def gsplit(data, g):
    """mock men's / women's list from a nations list: (code, value, sub) or (code, gold, silver, bronze)"""
    out = []
    for i, r in enumerate(data):
        j = (i * 7 + (3 if g == 'M' else 5)) % 9
        if len(r) == 4 and isinstance(r[3], int):          # medals table
            f = 0.56 if g == 'M' else 0.44
            out.append((r[0], *[max(0, round(x * f) + (j % 3) - 1) for x in r[1:]]))
            continue
        v = _num(r[1])
        nv = v + (6 if g == 'M' else -9) - j if v > 1500 and len(str(v)) == 4 and isinstance(r[1], int) and v < 2600 else max(1, round(v * (0.6 if g == 'M' else 0.5)) + j)
        out.append((r[0], f'{nv:,}' if isinstance(r[1], str) else nv, r[2]))
    key = (lambda r: (-r[1], -r[2], -r[3])) if len(out[0]) == 4 and isinstance(out[0][3], int) else (lambda r: -_num(r[1]))
    return sorted(out, key=key)


def split_rows(rowfn, data):
    """All list + men's + women's lists in one tbody; the filter picks one"""
    return rowfn(data, 'A', False) + rowfn(gsplit(data, 'M'), 'M', True) + rowfn(gsplit(data, 'W'), 'W', True)


def nation_medals():
    icon = lambda k: f'<th class="{TH} text-center w-9 sm:w-11" title="{chrome.MEDAL_NAME[k]}"><span class="inline-flex justify-center w-full">{chrome.medal(k, "w-4 h-5")}</span></th>'

    def rows1(data, g, sp):
        data = sorted(data, key=lambda r: (-r[1], -r[2], -r[3]))
        return ''.join(
            tr(g, f"location.href='/countries/{c.lower()}'", i, sp) + f'<td class="{TD}">{name(c, c)}</td>'
            f'<td class="{TD} text-center">{gd}</td><td class="{TD} text-center">{sv}</td><td class="{TD} text-center">{b}</td>'
            f'<td class="{TD} text-right font-bold">{gd + sv + b}</td>{CHEV_TD}</tr>'
            for i, (c, gd, sv, b) in enumerate(data))
    head_ = th('#', 'text-right', 'w-8 sm:w-10') + th('Nation') + icon(1) + icon(2) + icon(3) + th('Total', 'text-right', 'w-14 sm:w-16')
    return section('Most medals', head_, [split_rows(rows1, NAT_WT), split_rows(rows1, NAT_OG)], tabs=(('World Tour', 'WT'), ('Olympics', 'OG')))


def nation_block(title, data, value_label, sub_label, tabs=None):
    """data: list of rows, or with tabs a list of row lists (one per tab)"""
    def rows1(d, g, sp):
        return ''.join(
            tr(g, f"location.href='/countries/{c.lower()}'", i, sp) + f'<td class="{TD}">{name(c, c)}</td>'
            f'<td class="{TD} text-[#66605C] whitespace-nowrap"><div class="truncate">{sub}</div></td>'
            f'<td class="{TD} text-right font-bold">{v}</td>{CHEV_TD}</tr>'
            for i, (c, v, sub) in enumerate(d))
    head_ = (th('#', 'text-right', 'w-8 sm:w-10') + th('Nation', 'text-left', 'w-20 sm:w-24') + th(sub_label)
             + th(value_label, 'text-right', 'w-20 sm:w-24'))
    return section(title, head_, [split_rows(rows1, d) for d in data] if tabs else split_rows(rows1, data), tabs=tabs)


# ---------- page ----------
GROUPS = [
    ('ratings', 'Ratings', 'Athletes', 2, lambda: [peak(), lead(), no1(), young(), gains()]),
    ('medals', 'Medals', 'Athletes', 2, lambda: [medals(), medal_run(), young_gs()]),
    ('contests', 'Contests', 'Athletes', 2, lambda: [streak(), upsets(), giants(), rivals()]),
    ('tournaments', 'Tournaments', 'Athletes', 2, lambda: [strong(), podium_nations(), tour_pred('Most |unpredictable tournament', UNPRED, True),
                                                      tour_pred('Most predictable tournament', PRED, False)]),
    ('nations', 'Nations', 'Athletes', 2, lambda: [nation_block('Highest team rating', TEAM, 'Rating', 'Date'),
                                             nation_block('Longest |at #1 nation', [TEAM_NO1_RUN, TEAM_NO1], 'Days', 'Period', tabs=('In a row', 'Total')),
                                             nation_medals(),
                                             nation_block('Most medals |at one tournament', [TEAM_MEDALS, TEAM_MEDALS_OG], 'Medals', 'Tournament', tabs=(('World Tour', 'WT'), ('Olympics', 'OG')))]),
]


def tabs_row():
    tabs = ''.join(f'<a href="#{k}" data-group="{k}" class="rec-group px-1 py-1.5 sm:px-2 whitespace-nowrap text-[13px] sm:text-[15px] border-b-2 '
                   + ('font-bold text-[#33302E] border-[#990F3D]' if i == 0 else 'text-[#66605C] hover:text-[#33302E] border-transparent') + f'">{t}</a>'
                   for i, (k, t, *_) in enumerate(GROUPS))
    g = ''.join(f'<button type="button" data-g="{v}" class="rec-g px-1 pb-0.5 border-b-2 '
                + ('font-bold text-[#33302E] border-[#990F3D]' if v == '' else 'text-[#66605C] hover:text-[#33302E] border-transparent') + f'">{t}</button>'
                for v, t in (('', 'All'), ('M', 'Men'), ('W', 'Women')))
    return (f'<div class="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">'
            f'<nav class="flex items-center gap-2" aria-label="Record groups">{tabs}</nav>'
            f'<div id="rec-gender" class="flex items-center gap-3 text-[13px] sm:text-[14px]"><span id="rec-gender-label" class="text-[11px] font-bold uppercase tracking-wider text-[#66605C]">Athletes</span>{g}</div></div>')


SCRIPT = """<script>
(function(){
  var G='', SHOW=%d;
  // top N rows per table after the Men/Women filter, renumbered
  function apply(){
    document.querySelectorAll('section.rec tbody').forEach(function(b){
      var n=0;
      b.querySelectorAll('tr.rec-row').forEach(function(r){
        var g=r.dataset.g, ok=g==='A'?!G:r.dataset.split?G===g:(!G||!g||g===G);ok=ok&&n<SHOW;
        r.style.display=ok?'':'none';
        if(ok){n++;r.querySelector('.rk').textContent=n;}
      });
    });
  }
  function mark(els,on){els.forEach(function(x){var a=on(x);x.classList.toggle('font-bold',a);x.classList.toggle('text-[#33302E]',a);
    x.classList.toggle('border-[#990F3D]',a);x.classList.toggle('text-[#66605C]',!a);x.classList.toggle('border-transparent',!a);});}
  // group tabs (hash)
  function group(){
    var k=location.hash.slice(1)||'ratings', pane=document.getElementById('g-'+k);
    if(!pane){k='ratings';pane=document.getElementById('g-ratings');}
    document.querySelectorAll('.rec-pane').forEach(function(p){p.classList.toggle('hidden',p!==pane);});
    mark(document.querySelectorAll('.rec-group'),function(a){return a.dataset.group===k;});
    document.getElementById('rec-gender').style.visibility=pane.dataset.filter?'visible':'hidden';
    document.getElementById('rec-gender-label').textContent=pane.dataset.filter||'';
  }
  window.addEventListener('hashchange',group);
  document.querySelectorAll('.rec-g').forEach(function(b){b.addEventListener('click',function(){
    G=b.dataset.g;mark(document.querySelectorAll('.rec-g'),function(x){return x===b;});apply();});});
  // Total / Gold, Total / In a row inside a card
  document.querySelectorAll('section.rec').forEach(function(sec){
    var tabs=sec.querySelectorAll('.rec-tab');
    tabs.forEach(function(t){t.addEventListener('click',function(){
      tabs.forEach(function(x){var on=x===t;x.classList.toggle('font-bold',on);x.classList.toggle('text-[#990F3D]',on);x.classList.toggle('border-[#990F3D]',on);
        x.classList.toggle('text-[#66605C]',!on);x.classList.toggle('border-transparent',!on);});
      sec.querySelectorAll('tbody[data-pane]').forEach(function(b){b.classList.toggle('hidden',b.dataset.pane!==t.dataset.tab);});
    });});
  });
  group();apply();
})();
</script>""" % SHOW


def page():
    top = ('<h1 class="serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">Records</h1>'
           '<p class="mt-1.5 text-[14px] text-[#66605C]">All-time bests, based only on contests available in the <a href="https://judobase.ijf.org/#/dashboard" target="_blank" rel="noopener" class="underline hover:text-[#33302E]">IJF judobase</a>.</p>'
           + tabs_row())
    panes = ''
    for i, (k, t, athletes, cols, cards) in enumerate(GROUPS):
        grid = ('grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-y-16 lg:gap-x-24' if cols == 2
                else 'grid grid-cols-1 lg:grid-cols-3 gap-y-14 lg:gap-x-12')
        panes += (f'<div id="g-{k}" data-filter="{athletes}" class="rec-pane mt-10 lg:mt-12 {grid} items-start{"" if i == 0 else " hidden"}">'
                  + ''.join(cards()) + '</div>')
    style = '<style>.mbr{display:none}@media (max-width:479px){.mbr{display:inline}}</style>'
    return (head('Records', 'All-time judo records: highest ratings, longest reigns at #1, most medals, biggest upsets and more.')
            + header('Records') + style + top + panes + footer().replace('</body>', SCRIPT + '</body>'))


if __name__ == '__main__':
    out = os.path.join(HERE, '..', '_stitch', 'records.html')
    open(out, 'w', encoding='utf-8').write(page())
    print('written', os.path.normpath(out))
