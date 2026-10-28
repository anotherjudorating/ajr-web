#!/usr/bin/env python3
"""Tournament overview (Abu Dhabi Grand Slam 2026) -> ../_stitch/tournament.html"""
import os
from collections import Counter

import chrome
from chrome import (CHEV_TD, CHEV_TH, H2, H2ROW, LINK, ROW, TABLE, TD, TH, THEAD_TR,
                    flag, footer, head, header, name, pagination)

HERE = os.path.dirname(os.path.abspath(__file__))
T = '/tournaments/abu-dhabi-2026'

MEN = [
    ('−60', ('Nagayama R.', 'JPN'), ('Sardalashvili G.', 'GEO'), [('Yang Y.', 'TPE'), ('Harim L.', 'ISR')]),
    ('−66', ('Abe H.', 'JPN'), ('Vieru D.', 'MDA'), [('Maruyama J.', 'JPN'), ('Lima W.', 'BRA')]),
    ('−73', ('Heydarov H.', 'AZE'), ('Lombardo M.', 'ITA'), [('Ishihara T.', 'JPN'), ('Tsend-Ochir T.', 'MGL')]),
    ('−81', ('Gauthier-Drapeau F.', 'CAN'), ('Grigalashvili T.', 'GEO'), [('Lee J.', 'KOR'), ('Nagase T.', 'JPN')]),
    ('−90', ('Bekauri L.', 'GEO'), ('Mosakhlishvili T.', 'ESP'), [('Murao S.', 'JPN'), ('Trippel E.', 'GER')]),
    ('−100', ('Kotsoiev Z.', 'AZE'), ('Sulamanidze V.', 'GEO'), [('Paltchik P.', 'ISR'), ('Rakhimov T.', 'TJK')]),
    ('+100', ('Riner T.', 'FRA'), ('Kim M.', 'KOR'), [('Saito T.', 'JPN'), ('Bashaev T.', 'AIN')]),
]
WOMEN = [
    ('−48', ('Tsunoda N.', 'JPN'), ('Babulfath T.', 'SWE'), [('Boukli S.', 'FRA'), ('Scutto A.', 'ITA')]),
    ('−52', ('Krasniqi D.', 'KOS'), ('Giuffrida O.', 'ITA'), [('Pimenta L.', 'BRA'), ('Buchard A.', 'FRA')]),
    ('−57', ('Deguchi C.', 'CAN'), ('Huh M.', 'KOR'), [('Cysique S.', 'FRA'), ('Klimkait J.', 'CAN')]),
    ('−63', ('Agbegnenou C.', 'FRA'), ('Leski A.', 'SLO'), [('Fazliu L.', 'KOS'), ('Horikawa M.', 'JPN')]),
    ('−70', ('Matic B.', 'CRO'), ('Butkereit M.', 'GER'), [('van Dijke S.', 'NED'), ('Niizoe S.', 'JPN')]),
    ('−78', ('Bellandi A.', 'ITA'), ('Wagner A.', 'GER'), [('Lanir I.', 'ISR'), ('Malonga M.', 'FRA')]),
    ('+78', ('Dicko R.', 'FRA'), ('Souza B.', 'BRA'), [('Kim H.', 'KOR'), ('Sone A.', 'JPN')]),
]
UPSETS = [  # winner, loser, event, winner's chance
    (('Gauthier-Drapeau F.', 'CAN'), ('Grigalashvili T.', 'GEO'), 'Men −81 kg', 'Final', '14%'),
    (('Babulfath T.', 'SWE'), ('Boukli S.', 'FRA'), 'Women −48 kg', 'SF', '20%'),
    (('Lombardo M.', 'ITA'), ('Ishihara T.', 'JPN'), 'Men −73 kg', 'SF', '25%'),
    (('Mosakhlishvili T.', 'ESP'), ('Murao S.', 'JPN'), 'Men −90 kg', 'QF', '27%'),
    (('Fazliu L.', 'KOS'), ('Horikawa M.', 'JPN'), 'Women −63 kg', 'R16', '29%'),
]
GAINS = [  # athlete, event, result, before, after
    (('Heydarov H.', 'AZE'), 'Men −73 kg', 'Gold', 2245, 2275),
    (('Gauthier-Drapeau F.', 'CAN'), 'Men −81 kg', 'Gold', 2098, 2126),
    (('Babulfath T.', 'SWE'), 'Women −48 kg', 'Silver', 2187, 2212),
    (('Fazliu L.', 'KOS'), 'Women −63 kg', 'Bronze', 2141, 2163),
    (('Kotsoiev Z.', 'AZE'), 'Men −100 kg', 'Gold', 2268, 2287),
]


def slug(g, w):
    return f'{T}/{g}-' + ('plus-' + w[1:] if w.startswith('+') else w[1:])


def tabs():
    def row(label, g, ws):
        a = f'<a href="{T}/{g}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap font-bold text-[#33302E] border-b-2 border-[#990F3D]">All</a>'
        b = ''.join(f'<a href="{slug(g, w)}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap tnum text-[#66605C] hover:text-[#33302E]">{w}</a>' for w in ws)
        return (f'<div class="flex items-center"><span class="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#66605C]">{label}</span>'
                f'<div class="flex flex-1 items-center justify-between sm:justify-start sm:gap-2 text-[13px] sm:text-[15px]">{a}{b}</div></div>')
    return (f'<nav class="mt-6 flex flex-col gap-1 sm:max-w-[560px]" aria-label="Weight categories">'
            + row('Men', 'men', [r[0] for r in MEN]) + row('Women', 'women', [r[0] for r in WOMEN]) + '</nav>')


def stat(label, value, sub):
    return (f'<div class="min-w-0"><div class="text-[11px] font-bold uppercase tracking-wider text-[#66605C]">{label}</div>'
            f'<div class="serif mt-1 text-[24px] leading-[28px] font-bold tnum">{value}</div>'
            f'<div class="mt-0.5 text-[12px] text-[#66605C] truncate">{sub}</div></div>')


def medallists(title, g, rows):
    """4 medallists per weight, one per line on every width; rating change on the right"""
    body = ''
    for w, gold, silver, bronze in rows:
        lines = [(pl, a[0], a[1], chrome.delta_html(chrome.mock_delta(a[0], pl)), False)
                 for pl, a in ((1, gold), (2, silver), (3, bronze[0]), (3, bronze[1]))]
        body += chrome.podium_rows(w, f"location.href='{slug(g, w)}'", lines)
    return (f'<section><div class="{H2ROW}"><h2 class="{H2}">{title}</h2>'
            f'</div>'
            f'<table class="{TABLE}"><tbody>{body}</tbody></table></section>')


def upsets(data=None, link=('All 38 upsets', 'contests.html#t=adgs&res=uw&s=chance')):
    # same item layout as "Upsets of the month" on Home
    data = UPSETS if data is None else data
    known = {'14%': 138, '20%': 115, '25%': 103, '27%': 97, '29%': 91}  # same mock gaps as Home
    gap = lambda ch: known.get(ch, round((50 - int(ch[:-1])) * 3.8))
    sep = '<span class="inline-block w-px h-3 bg-[#D6CFC2] mx-2 align-middle"></span>'
    items = ''
    for i, (w, l, ev, rd, ch) in enumerate(data):
        lose = f'{100 - int(ch[:-1])}%'
        items += (f'<a href="/contest/{i}" class="block hover:bg-[#E9E2D3]/40 py-3 border-b border-[#D6CFC2] transition-colors group">'
                  f'<div class="flex items-center justify-between gap-3"><div class="flex items-center gap-1.5 min-w-0">{flag(w[1])}'
                  f'<span class="font-semibold text-[#33302E] truncate">{w[0].split(" ")[0]}</span><span class="text-[#0D7680] font-semibold tnum ml-2">{ch}</span></div>'
                  f'<div class="flex items-center gap-1.5 min-w-0"><span class="text-[#66605C] tnum mr-2">{lose}</span><span class="text-[#66605C] truncate">{l[0].split(" ")[0]}</span>{flag(l[1])}'
                  f'<span class="material-symbols-outlined text-[18px] text-[#66605C] ml-1 group-hover:translate-x-0.5 transition-transform">chevron_right</span></div></div>'
                  f'<div class="mt-1.5"><div class="h-1.5 w-full flex border border-[#33302E] overflow-hidden bg-transparent"><div class="bg-[#0D7680] h-full" style="width:{ch}"></div></div></div>'
                  f'<div class="mt-1.5 text-[12px] text-[#66605C] flex items-center justify-between gap-3"><span>{ev}{sep}{rd}</span><span class="tnum">Rating gap {gap(ch)} points</span></div></a>')
    return (f'<section><div class="{H2ROW}"><h2 class="{H2}">Biggest upsets</h2><a href="{link[1]}" class="{LINK}">{link[0]}</a></div>'
            f'<div class="flex flex-col text-[14px]">{items}</div></section>')


def gains(data=None):
    data = GAINS if data is None else data
    body = ''.join(
        f'<tr class="{ROW}" onclick="location.href=\'/athletes/{i}\'">'
        f'<td class="{TD}">{name(a[1], a[0], "font-semibold")}</td>'
        f'<td class="{TD} text-right whitespace-nowrap text-[#66605C]">{b0} → {b1}</td>'
        f'<td class="{TD} text-right font-semibold text-[#0D7680]">+{b1 - b0}</td>{CHEV_TD}</tr>'
        for i, (a, ev, res, b0, b1) in enumerate(data))
    return (f'<section><div class="{H2ROW}"><h2 class="{H2}">Biggest gains</h2><a href="contests.html#t=adgs&s=gain" class="{LINK}">All rating changes</a></div>'
            f'<table class="{TABLE}"><thead><tr class="{THEAD_TR}">'
            f'<th class="{TH} text-left">Athlete</th>'
            f'<th class="{TH} text-right w-28">Rating</th><th class="{TH} text-right w-14">+/−</th>{CHEV_TH}</tr></thead><tbody>{body}</tbody></table></section>')


def medal_table(men=None, women=None):
    c = Counter()
    for rows in (MEN if men is None else men, WOMEN if women is None else women):
        for _, gold, silver, bronze in rows:
            c[(gold[1], 'g')] += 1
            c[(silver[1], 's')] += 1
            for _, n in bronze:
                c[(n, 'b')] += 1
    nations = {n for n, _ in c}
    tbl = sorted(((n, c[(n, 'g')], c[(n, 's')], c[(n, 'b')]) for n in nations), key=lambda r: (-r[1], -r[2], -r[3], r[0]))
    total = len(tbl)
    tbl = tbl[:20]
    body = ''.join(
        f'<tr class="{ROW}{" hidden sm:table-row" if i >= 10 else ""}" onclick="location.href=\'/countries/{n.lower()}\'"><td class="{TD}"><div class="flex items-center gap-1.5">{flag(n)}<span class="font-medium">{n}</span></div></td>'
        f'<td class="{TD} text-center">{g}</td><td class="{TD} text-center">{s}</td><td class="{TD} text-center">{b}</td>'
        f'<td class="{TD} text-right font-semibold">{g + s + b}</td>{CHEV_TD}</tr>'
        for i, (n, g, s, b) in enumerate(tbl))
    return (f'<section><div class="{H2ROW}"><h2 class="{H2}">Medals by nation</h2><a href="rankings.html#teams-mixed" class="{LINK}">Nations ranking</a></div>'
            f'<table class="{TABLE}"><thead><tr class="{THEAD_TR}">'
            f'<th class="{TH} text-left">Nation</th><th class="{TH} text-center w-11 sm:w-14" title="Gold"><span class="inline-flex justify-center w-full">{chrome.medal(1, "w-4 h-5")}</span></th>'
            f'<th class="{TH} text-center w-11 sm:w-14" title="Silver"><span class="inline-flex justify-center w-full">{chrome.medal(2, "w-4 h-5")}</span></th><th class="{TH} text-center w-11 sm:w-14" title="Bronze"><span class="inline-flex justify-center w-full">{chrome.medal(3, "w-4 h-5")}</span></th>'
            f'<th class="{TH} text-right w-14 sm:w-16">Total</th>{CHEV_TH}</tr></thead><tbody>{body}</tbody></table>'
            + ('' if total <= 10 else  # a short table (tournament under way) needs no pagination
               '<div class="hidden sm:block">' + pagination(f'1–{min(20, total)} of {total} nations', shows=('10', '20', '50'), active='20', pages=('1', '2') if total > 20 else ('1',)) + '</div>'
               + '<div class="sm:hidden">' + pagination(f'1–10 of {total} nations', shows=('10', '20', '50'), active='10', pages=('1', '2', '3')) + '</div>')
            + '</section>')


def page():
    meta = '<span class="inline-block w-px h-3 bg-[#D6CFC2] mx-3 align-middle"></span>'
    top = f'''<nav class="flex flex-wrap items-center gap-1.5 text-[12px] text-[#66605C]" aria-label="Breadcrumb"><a href="/tournaments" class="hover:text-[#33302E]">Tournaments</a><span class="text-[#D6CFC2]">›</span><span class="text-[#33302E]">Abu Dhabi GS 2026</span></nav>
<h1 class="serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">Abu Dhabi Grand Slam 2026</h1>
<div class="mt-2 flex items-center text-[14px] text-[#66605C]"><span class="inline-flex items-center gap-1.5">{flag('UAE')}<span class="text-[#33302E]">Abu Dhabi, UAE</span></span></div>
{tabs()}'''
    blocks = f'''<div class="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24">{medallists('Men', 'men', MEN)}{medallists('Women', 'women', WOMEN)}</div>
<div class="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24 items-start">{medal_table()}<div class="flex flex-col gap-y-14 lg:gap-y-16">{upsets()}{gains()}</div></div>'''
    return (head('Abu Dhabi Grand Slam 2026', 'Medallists, upsets and rating changes at the Abu Dhabi Grand Slam 2026.')
            + header('Explore') + top + blocks + footer())


if __name__ == '__main__':
    out = os.path.join(HERE, '..', '_stitch', 'tournament.html')
    open(out, 'w', encoding='utf-8').write(page())
    print('written', os.path.normpath(out))
