#!/usr/bin/env python3
"""Upcoming tournament, one weight (Tokyo GS 2026, Men −73 kg) -> ../_stitch/upcoming_weight.html

Mirrors the finished weight page: Podium (outline medals = prediction, medal and gold chance instead of rating change)
and the contests of the draw by pool, each with both chances and the predicted winner in bold.
"""
import os

import chrome
from chrome import H2, H2ROW, LINK, flag, footer, head, header
from upcoming import T, status

HERE = os.path.dirname(os.path.abspath(__file__))

# predicted podium: athlete, nation, medal %, gold %
PODIUM = [('Ishihara T.', 'JPN', 78, 34), ('Lombardo M.', 'ITA', 70, 26), ('Heydarov H.', 'AZE', 66, 22), ('Pelivan P.', 'MDA', 41, 4)]
# draw, first round by pool: (white, nation), (blue, nation), white's chance
POOLS = [
    ('Pool A', [(('Ishihara T.', 'JPN'), ('Case A.', 'USA'), 91), (('Gaba J. B.', 'FRA'), ('Hojazoda B.', 'TJK'), 56),
                (('Stump N.', 'SUI'), ('Pelivan P.', 'MDA'), 43), (('Butbul T.', 'ISR'), ('Sanchez E.', 'ESP'), 61)]),
    ('Pool B', [(('Heydarov H.', 'AZE'), ('Terada M.', 'THA'), 94), (('Cargnin D.', 'BRA'), ('Osmanov A.', 'MDA'), 58),
                (('Makhmadbekov M.', 'UAE'), ('Karapetian F.', 'ARM'), 52), (('Hashimoto S.', 'JPN'), ('Gomboc A.', 'SLO'), 88)]),
    ('Pool C', [(('Lombardo M.', 'ITA'), ('Wieczerzak D.', 'GER'), 84), (('Shavdatuashvili L.', 'GEO'), ('Macias T.', 'SWE'), 72),
                (('Orujov R.', 'AZE'), ('Ebinuma M.', 'JPN'), 47), (('Le Blouch K.', 'FRA'), ('Mollaei S.', 'AZE'), 55)]),
    ('Pool D', [(('Tsend-Ochir T.', 'MGL'), ('Basile F.', 'ITA'), 69), (('An C.', 'KOR'), ('Ganbat B.', 'MGL'), 51),
                (('Batzaya T.', 'MGL'), ('Kim W.', 'KOR'), 49), (('Kyrgyzbayev Z.', 'KAZ'), ('Oumarov M.', 'CAN'), 57)]),
]
chrome.FLAG_SVG.setdefault('USA', '<rect width="16" height="12" fill="#B22234"/><rect y="2" width="16" height="2" fill="#FFF"/><rect y="6" width="16" height="2" fill="#FFF"/><rect y="10" width="16" height="2" fill="#FFF"/><rect width="7" height="6" fill="#3C3B6E"/>')
chrome.FLAG_SVG.setdefault('SUI', '<rect width="16" height="12" fill="#D52B1E"/><rect x="7" y="3" width="2" height="6" fill="#FFF"/><rect x="5" y="5" width="6" height="2" fill="#FFF"/>')
chrome.FLAG_SVG.setdefault('THA', '<rect width="16" height="12" fill="#A51931"/><rect y="2" width="16" height="8" fill="#F4F5F8"/><rect y="4" width="16" height="4" fill="#2D2A4A"/>')
chrome.FLAG_SVG.setdefault('ARM', '<rect width="16" height="4" fill="#D90012"/><rect y="4" width="16" height="4" fill="#0033A0"/><rect y="8" width="16" height="4" fill="#F2A800"/>')
chrome.FLAG_SVG.setdefault('KAZ', '<rect width="16" height="12" fill="#00AFCA"/><circle cx="8" cy="6" r="2.2" fill="#FEC50C"/>')
MARK = chrome.MARK


def tabs():
    men = ['−60', '−66', '−73', '−81', '−90', '−100', '+100']
    women = ['−48', '−52', '−57', '−63', '−70', '−78', '+78']

    def row(label, g, ws, active):
        a = f'<a href="{T}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap text-[#66605C] hover:text-[#33302E]">All</a>'
        b = ''.join(f'<a href="{T}/{g}-{w[1:] if w[0] == "−" else "plus-" + w[1:]}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap tnum '
                    + ('font-bold text-[#33302E] border-b-2 border-[#990F3D]' if w == active
                       else 'text-[#990F3D] font-semibold' if status(w) == 'live' else 'text-[#66605C] hover:text-[#33302E]') + f'">{w}</a>' for w in ws)
        return (f'<div class="flex items-center"><span class="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#66605C]">{label}</span>'
                f'<div class="flex flex-1 items-center justify-between sm:justify-start sm:gap-2 text-[13px] sm:text-[15px]">{a}{b}</div></div>')
    return f'<nav class="mt-6 flex flex-col gap-1 sm:max-w-[560px]" aria-label="Weight categories">{row("Men", "men", men, "−73")}{row("Women", "women", women, None)}</nav>'


def podium():
    """same card as the finished podium; the rating line becomes medal / gold chance"""
    cards = ''
    for i, (n, c, med, gold) in enumerate(PODIUM):
        place = (1, 2, 3, 3)[i]
        cards += (f'<div class="flex items-start gap-3 min-w-0">{chrome.medal(place, "w-6 h-7 sm:w-7 sm:h-8 shrink-0 mt-0.5", outline=True)}'
                  f'<div class="min-w-0"><a href="/athletes/x" class="serif block text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px] font-semibold text-[#33302E] hover:underline truncate">{n}</a>'
                  f'<div class="mt-1 flex items-center gap-1.5 text-[12px] leading-[16px] text-[#33302E]">{flag(c)}<span class="font-medium">{c}</span></div>'
                  # phone: gold chance always on its own line under the medal chance; from 640px side by side
                  f'<div class="mt-1.5 flex flex-col sm:flex-row sm:items-baseline sm:gap-x-2 text-[13px] leading-[18px] tnum">'
                  f'<span class="text-[#33302E] whitespace-nowrap">{med}% medal</span><span class="text-[#66605C] whitespace-nowrap">{gold}% gold</span></div></div></div>')
    return (f'<section class="mt-10 lg:mt-12"><div class="{H2ROW}"><h2 class="{H2}">Podium prediction</h2></div>'
            f'<div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-x-14">{cards}</div></section>')


def predict_cells(white, blue, cw):
    """same columns as a result row (names, chip, chance, W/L, +/−); the predicted winner in bold, W/L and +/− not played yet: dashes"""
    td = 'px-2 sm:px-3 py-2 align-middle'
    dash = lambda j: f'<div class="h-6 flex items-center justify-{j} text-[#66605C]">–</div>' * 2
    names = chances = ''
    for (n, nat), ch, col in ((white, cw, 'white'), (blue, 100 - cw, 'blue')):
        fav = ch > 50
        names += (f'<div class="h-6 flex items-center gap-1.5 min-w-0"><span class="hidden sm:inline-block w-[6px] h-4 shrink-0 {MARK[col]} border border-[#33302E]"></span>'
                  f'{flag(nat)}<span class="truncate {"font-semibold text-[#33302E]" if fav else "text-[#66605C]"}">{n}</span></div>')
        chances += f'<div class="h-6 flex items-center justify-end {"font-semibold text-[#33302E]" if fav else "text-[#66605C]"}">{ch}%</div>'
    return (f'<td class="{td}">{names}</td><td class="{td} hidden sm:table-cell"></td><td class="{td} whitespace-nowrap tnum">{chances}</td><td class="{td}">{dash("center")}</td><td class="{td}">{dash("end")}</td>'
            '<td class="w-6 py-2 align-middle pl-1 pr-0 text-right text-[#66605C]"><span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td>')


# mock pre-tournament ratings (the real page uses Glicko-2 skill and RD)
RATING = {'Ishihara T.': 2298, 'Lombardo M.': 2284, 'Heydarov H.': 2275, 'Tsend-Ochir T.': 2252, 'Shavdatuashvili L.': 2244,
          'Hashimoto S.': 2235, 'Gaba J. B.': 2221, 'Cargnin D.': 2208, 'Makhmadbekov M.': 2196, 'Pelivan P.': 2185, 'Hojazoda B.': 2174,
          'Ebinuma M.': 2170, 'Le Blouch K.': 2160, 'Stump N.': 2155, 'Orujov R.': 2150, 'Case A.': 2142, 'Mollaei S.': 2140,
          'An C.': 2140, 'Kim W.': 2138, 'Ganbat B.': 2135, 'Butbul T.': 2130, 'Batzaya T.': 2130, 'Basile F.': 2125,
          'Karapetian F.': 2120, 'Kyrgyzbayev Z.': 2120, 'Macias T.': 2110, 'Osmanov A.': 2100, 'Sanchez E.': 2100,
          'Oumarov M.': 2095, 'Wieczerzak D.': 2090, 'Gomboc A.': 2010, 'Terada M.': 1950}


def chance(a, b):
    return round(100 / (1 + 10 ** ((RATING[b[0]] - RATING[a[0]]) / 400)))


# played so far (day 2, after the Round of 16): winners by contest, in draw order
WON_32 = ['Ishihara T.', 'Gaba J. B.', 'Pelivan P.', 'Butbul T.', 'Heydarov H.', 'Cargnin D.', 'Makhmadbekov M.', 'Gomboc A.',
          'Lombardo M.', 'Shavdatuashvili L.', 'Ebinuma M.', 'Le Blouch K.', 'Tsend-Ochir T.', 'An C.', 'Kim W.', 'Kyrgyzbayev Z.']
WON_16 = ['Ishihara T.', 'Pelivan P.', 'Heydarov H.', 'Gomboc A.', 'Lombardo M.', 'Ebinuma M.', 'An C.', 'Kim W.']


def most_likely_draw():
    """played rounds as they happened; from the quarter-finals on, the most likely path (favourite wins).
    Returns [(round, played, [(white, blue, white%, winner or None), ...])]"""
    fav = lambda a, b: a if chance(a, b) >= 50 else b
    los = lambda a, b: b if fav(a, b) is a else a
    ath = [x for _, cs in POOLS for w, bl, _ in cs for x in (w, bl)]
    by = {a[0]: a for a in ath}
    p32 = [(ath[i], ath[i + 1]) for i in range(0, 32, 2)]
    w32 = [by[n] for n in WON_32]
    p16 = [(w32[i], w32[i + 1]) for i in range(0, 16, 2)]
    w16 = [by[n] for n in WON_16]
    qf = [(w16[i], w16[i + 1]) for i in range(0, 8, 2)]
    pool_win = [fav(*p) for p in qf]; qf_lose = [los(*p) for p in qf]
    sf = [(pool_win[0], pool_win[1]), (pool_win[2], pool_win[3])]
    sf_win = [fav(*p) for p in sf]; sf_lose = [los(*p) for p in sf]
    rep = [(qf_lose[0], qf_lose[1]), (qf_lose[2], qf_lose[3])]
    rep_win = [fav(*p) for p in rep]
    bronze = [(rep_win[0], sf_lose[1]), (rep_win[1], sf_lose[0])]  # repechage A/B meets the SF loser of the C/D half
    final = [(sf_win[0], sf_win[1])]
    pred = lambda ps: [(a, b, chance(a, b), None) for a, b in ps]
    done = lambda ps, ws: [(a, b, chance(a, b), w[0]) for (a, b), w in zip(ps, ws)]
    return [('Final', False, pred(final)), ('Bronze medal', False, pred(bronze)), ('Repechage', False, pred(rep)),
            ('Semi-finals', False, pred(sf)), ('Quarter-finals', False, pred(qf)),
            ('Round of 16', True, done(p16, w16)), ('Round of 32', True, done(p32, w32))]


def played_cells(white, blue, cw, winner):
    """a finished contest: exactly like the results on a finished weight page"""
    win_ch = cw if winner == white[0] else 100 - cw
    delta = max(2, round((100 - win_ch) / 6))  # mock rating change, bigger for upsets
    return chrome.contest_cells(white, blue, cw, winner == white[0], delta)


def contests():
    rounds = most_likely_draw()
    rows = ''
    for rnd, played, cs in rounds:
        tag = ''  # unplayed rounds are told apart by the dashes in W/L and +/−
        inner = (f'<div class="flex items-center justify-between"><span class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-[#66605C] transition-transform duration-150 round-icon">expand_more</span><span class="text-[12px] font-bold uppercase text-[#33302E]">{rnd}</span></span>'
                 f'<span class="text-[12px] text-[#66605C]">{len(cs)} contest{"s" if len(cs) > 1 else ""}</span></div>')
        # 4 visible columns on phones, 5 from 640px: one group cell per layout so no phantom column appears
        rows += (f'<tr class="round-row h-8 bg-[#E9E2D3] border-b border-[#D6CFC2] cursor-pointer select-none hover:bg-[#E9E2D3]/80" role="button" tabindex="0" aria-expanded="true"><td colspan="5" class="sm:hidden px-2 h-8 py-0 align-middle">{inner}</td>'
                 f'<td colspan="6" class="hidden sm:table-cell px-3 h-8 py-0 align-middle">{inner}</td></tr>')
        for white, blue, cw, winner in cs:
            target = 'contest.html' if played else '/head-to-head'
            rows += (f'<tr class="border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40 cursor-pointer" onclick="location.href=\'{target}\'">'
                     + (played_cells(white, blue, cw, winner) if played else predict_cells(white, blue, cw)) + '</tr>')
    import re
    ghost = '<thead aria-hidden="true"><tr>' + re.sub(r'>[^<]*</th>', '></th>', chrome.CONTEST_HEAD.replace(chrome.TH, 'p-0 h-0')).replace('h-9 py-0 pl-1 pr-0', 'p-0 h-0') + '</tr></thead>'
    opts = ''.join(f'<option>{r}</option>' for r, _, _ in rounds)
    sel = ('<select class="w-32 sm:w-36 rounded-none border border-[#D6CFC2] bg-[#F3EEE3] text-[#33302E] text-xs py-1 px-2 focus:outline-none focus:border-[#33302E] cursor-pointer">'
           f'<option>All rounds</option>{opts}</select>')
    return (f'<section class="mt-14 lg:mt-16"><div class="flex flex-row items-center justify-between gap-3 border-b-2 border-[#33302E] pb-2">'
            f'<h2 class="{H2}">Contests with predictions</h2>'
            f'<a href="/methodology" class="{LINK}">How it works</a></div>'
            f'<table class="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum">{ghost}<tbody>{rows}</tbody></table>'
            '<p class="mt-3 text-[12px] text-[#66605C]">Where there is no result yet, we show a prediction based on ratings, with win chances.</p></section>')


def page():
    meta = '<span class="inline-block w-px h-3 bg-[#D6CFC2] mx-3 align-middle"></span>'
    top = f'''<nav class="flex flex-wrap items-center gap-1.5 text-[12px] text-[#66605C]" aria-label="Breadcrumb"><a href="/tournaments" class="hover:text-[#33302E]">Tournaments</a><span class="text-[#D6CFC2]">›</span><a href="{T}" class="hover:text-[#33302E]">Tokyo GS 2026</a><span class="text-[#D6CFC2]">›</span><span class="text-[#33302E]">Men −73 kg</span></nav>
<h1 class="serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">Tokyo Grand Slam 2026</h1>
<div class="mt-2 flex flex-wrap items-center gap-y-1 text-[14px] text-[#66605C]"><span class="inline-flex items-center gap-1.5">{flag('JPN')}<span class="text-[#33302E]">Tokyo, JPN</span></span>{meta}<span>7–9 Dec 2026</span>{meta}<span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#990F3D] text-[#990F3D]"><span class="w-1.5 h-1.5 rounded-full bg-[#990F3D]"></span>Live</span></div>
{tabs()}'''
    return (head('Men −73 kg — Tokyo Grand Slam 2026', 'Predicted podium and draw with win chances in Men −73 kg at the Tokyo Grand Slam 2026.')
            + header('Explore') + top + podium() + contests() + footer())


if __name__ == '__main__':
    out = os.path.join(HERE, '..', '_stitch', 'upcoming_weight.html')
    open(out, 'w', encoding='utf-8').write(page())
    print('written', os.path.normpath(out))
