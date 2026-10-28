#!/usr/bin/env python3
"""Upcoming tournament (Tokyo Grand Slam 2026) -> ../_stitch/upcoming.html

Before the draw is published: nothing but a note (shown for #nodraw).
After the draw: per weight the 4 athletes most likely to win a medal, each with the chance of any medal.
"""
import os

import chrome
from chrome import CHEV_TD, H2, H2ROW, ROW, TD, flag, footer, head, header

HERE = os.path.dirname(os.path.abspath(__file__))
import tournament as done_tour  # the result blocks of a finished tournament
T = '/tournaments/tokyo-2026'

# weight, [(athlete, nation, chance of any medal %)] — the 4 most likely medallists
MEN = [
    ('−60', [('Nagayama R.', 'JPN', 68), ('Yang Y.', 'TPE', 52), ('Sardalashvili G.', 'GEO', 47), ('Harim L.', 'ISR', 33)]),
    ('−66', [('Abe H.', 'JPN', 81), ('Maruyama J.', 'JPN', 55), ('Vieru D.', 'MDA', 39), ('Lima W.', 'BRA', 31)]),
    ('−73', [('Ishihara T.', 'JPN', 71), ('Lombardo M.', 'ITA', 64), ('Heydarov H.', 'AZE', 58), ('Tsend-Ochir T.', 'MGL', 41)]),
    ('−81', [('Grigalashvili T.', 'GEO', 74), ('Nagase T.', 'JPN', 62), ('Gauthier-Drapeau F.', 'CAN', 44), ('Lee J.', 'KOR', 36)]),
    ('−90', [('Bekauri L.', 'GEO', 70), ('Murao S.', 'JPN', 57), ('Mosakhlishvili T.', 'ESP', 40), ('Trippel E.', 'GER', 34)]),
    ('−100', [('Kotsoiev Z.', 'AZE', 63), ('Iida K.', 'JPN', 49), ('Sulamanidze V.', 'GEO', 45), ('Paltchik P.', 'ISR', 30)]),
    ('+100', [('Saito T.', 'JPN', 66), ('Riner T.', 'FRA', 61), ('Kim M.', 'KOR', 42), ('Bashaev T.', 'AIN', 35)]),
]
WOMEN = [
    ('−48', [('Tsunoda N.', 'JPN', 77), ('Babulfath T.', 'SWE', 51), ('Boukli S.', 'FRA', 43), ('Scutto A.', 'ITA', 32)]),
    ('−52', [('Abe U.', 'JPN', 79), ('Krasniqi D.', 'KOS', 58), ('Giuffrida O.', 'ITA', 41), ('Pimenta L.', 'BRA', 29)]),
    ('−57', [('Funakubo H.', 'JPN', 65), ('Deguchi C.', 'CAN', 63), ('Huh M.', 'KOR', 44), ('Cysique S.', 'FRA', 33)]),
    ('−63', [('Takaichi M.', 'JPN', 69), ('Agbegnenou C.', 'FRA', 66), ('Leski A.', 'SLO', 38), ('Fazliu L.', 'KOS', 31)]),
    ('−70', [('Niizoe S.', 'JPN', 64), ('Matic B.', 'CRO', 55), ('van Dijke S.', 'NED', 46), ('Butkereit M.', 'GER', 34)]),
    ('−78', [('Hamada S.', 'JPN', 67), ('Bellandi A.', 'ITA', 60), ('Malonga M.', 'FRA', 47), ('Wagner A.', 'GER', 28)]),
    ('+78', [('Sone A.', 'JPN', 72), ('Dicko R.', 'FRA', 69), ('Souza B.', 'BRA', 37), ('Kim H.', 'KOR', 30)]),
]


# day 1 finished, day 2 in progress, day 3 ahead (prototype of a tournament that is under way)
STATUS = {'−60': 'final', '−66': 'final', '−48': 'final', '−52': 'final',
          '−73': 'live', '−81': 'live', '−57': 'live', '−63': 'live'}
LIVE_ROUND = 'QF next'
DAY3 = '9 Dec'
# live weights: chances re-simulated after R32 and R16 (eliminated athletes drop out)
LIVE = {'−73': [('Ishihara T.', 'JPN', 78), ('Lombardo M.', 'ITA', 70), ('Heydarov H.', 'AZE', 66), ('Pelivan P.', 'MDA', 41)],
        '−81': [('Grigalashvili T.', 'GEO', 83), ('Nagase T.', 'JPN', 71), ('Lee J.', 'KOR', 49), ('Gauthier-Drapeau F.', 'CAN', 41)],
        '−57': [('Deguchi C.', 'CAN', 79), ('Funakubo H.', 'JPN', 70), ('Huh M.', 'KOR', 52), ('Cysique S.', 'FRA', 36)],
        '−63': [('Agbegnenou C.', 'FRA', 81), ('Takaichi M.', 'JPN', 74), ('Leski A.', 'SLO', 45), ('Fazliu L.', 'KOS', 39)]}


def status(w):
    return STATUS.get(w, 'upcoming')


def status_label(w):
    st = status(w)
    if st == 'final':
        return ''  # finished weights need no label: filled medals and rating changes say it
    if st == 'live':
        return ('<span class="flex items-center gap-1 text-[11px] leading-[14px] font-semibold text-[#990F3D]">'
                '<span class="w-1.5 h-1.5 rounded-full bg-[#990F3D]"></span>Live</span>')
    return f'<span class="block text-[11px] leading-[14px] text-[#66605C]">{DAY3}</span>'


def slug(g, w):
    return f'{T}/{g}-' + ('plus-' + w[1:] if w.startswith('+') else w[1:])


def tabs():
    def row(label, g, ws):
        a = f'<a href="{T}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap font-bold text-[#33302E] border-b-2 border-[#990F3D]">All</a>'
        # live weights: the number itself in claret
        col = lambda w: 'text-[#990F3D] font-semibold' if status(w) == 'live' else 'text-[#66605C] hover:text-[#33302E]'
        b = ''.join(f'<a href="{slug(g, w)}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap tnum {col(w)}" title="{"Live" if status(w) == "live" else ""}">{w}</a>' for w in ws)
        return (f'<div class="flex items-center"><span class="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#66605C]">{label}</span>'
                f'<div class="flex flex-1 items-center justify-between sm:justify-start sm:gap-2 text-[13px] sm:text-[15px]">{a}{b}</div></div>')
    return (f'<nav class="mt-6 flex flex-col gap-1 sm:max-w-[560px]" aria-label="Weight categories">'
            + row('Men', 'men', [r[0] for r in MEN]) + row('Women', 'women', [r[0] for r in WOMEN]) + '</nav>')


def who(a, pct=True):
    n, c, p = a
    return (f'<div class="flex items-center gap-1.5 min-w-0">{flag(c)}<span class="truncate">{n}</span>'
            + (f'<span class="pl-1 shrink-0 tnum font-semibold">{p}%</span>' if pct else '') + '</div>')


def favourites(title, g, rows):
    """same layout as the medallists of a finished tournament: 4 lines per weight. Finished weights: filled medals and
    rating change; live and upcoming weights: outline medals and the chance of any medal."""
    body = ''
    for w, ath in rows:
        st = status(w)
        ath = LIVE.get(w, ath)
        done = st == 'final'
        lines = [(pl, a[0], a[1], chrome.delta_html(chrome.mock_delta(a[0], pl)) if done else f'<span class="font-semibold">{a[2]}%</span>', not done)
                 for pl, a in zip((1, 2, 3, 3), ath)]
        target = 'weight.html' if done else slug(g, w)
        body += chrome.podium_rows(f'<span class="block">{w}</span>{status_label(w)}', f"location.href='{target}'", lines)
    return (f'<section><div class="{H2ROW}"><h2 class="{H2}">{title}</h2>'
            f'</div>'
            f'<table class="{chrome.TABLE}"><tbody>{body}</tbody></table></section>')


# results so far (day 1 finished, day 2 in progress)
def finished_rows(rows):
    return [(w, ath[0][:2], ath[1][:2], [ath[2][:2], ath[3][:2]]) for w, ath in rows if status(w) == 'final']


UPSETS_SO_FAR = [(('Gomboc A.', 'SLO'), ('Hashimoto S.', 'JPN'), 'Men −73 kg', 'R32', '21%'),
                 (('Harim L.', 'ISR'), ('Choi D.', 'KOR'), 'Men −60 kg', 'R16', '24%'),
                 (('Gomboc A.', 'SLO'), ('Makhmadbekov M.', 'UAE'), 'Men −73 kg', 'R16', '26%'),
                 (('Scutto A.', 'ITA'), ('Boukli S.', 'FRA'), 'Women −48 kg', 'QF', '28%')]
# rating changes are final only when a weight is over
GAINS_SO_FAR = [(('Nagayama R.', 'JPN'), 'Men −60 kg', 'Gold', 2201, 2229), (('Babulfath T.', 'SWE'), 'Women −48 kg', 'Silver', 2187, 2210),
                (('Harim L.', 'ISR'), 'Men −60 kg', 'Bronze', 2112, 2133), (('Krasniqi D.', 'KOS'), 'Women −52 kg', 'Silver', 2163, 2181),
                (('Abe H.', 'JPN'), 'Men −66 kg', 'Gold', 2240, 2256)]


def so_far():
    """Medals by nation, Biggest upsets and Biggest gains as soon as there are results — same blocks as a finished tournament"""
    medals = done_tour.medal_table(finished_rows(MEN), finished_rows(WOMEN))
    ups = done_tour.upsets(UPSETS_SO_FAR, ('All upsets', 'contests.html#res=uw&s=chance'))
    gns = done_tour.gains(GAINS_SO_FAR)
    return (f'<div class="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24 items-start">{medals}'
            f'<div class="flex flex-col gap-y-14 lg:gap-y-16">{ups}{gns}</div></div>')


def page():
    meta = '<span class="inline-block w-px h-3 bg-[#D6CFC2] mx-3 align-middle"></span>'
    top = f'''<nav class="flex flex-wrap items-center gap-1.5 text-[12px] text-[#66605C]" aria-label="Breadcrumb"><a href="/tournaments" class="hover:text-[#33302E]">Tournaments</a><span class="text-[#D6CFC2]">›</span><span class="text-[#33302E]">Tokyo GS 2026</span></nav>
<h1 class="serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">Tokyo Grand Slam 2026</h1>
<div class="mt-2 flex flex-wrap items-center gap-y-1 text-[14px] text-[#66605C]"><span class="inline-flex items-center gap-1.5">{flag('JPN')}<span class="text-[#33302E]">Tokyo, JPN</span></span>{meta}<span>7–9 Dec 2026</span>{meta}<span id="u-chip" class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#990F3D] text-[#990F3D]"><span class="w-1.5 h-1.5 rounded-full bg-[#990F3D]"></span>Live</span></div>'''
    draw = (f'<div id="u-draw">{tabs()}'
            '<p class="mt-6 text-[14px] text-[#66605C] max-w-3xl">Day 2 of 3. Finished weights show the medallists; the rest show chances to win a medal, re-simulated after every contest. '
            '<a href="/methodology" class="serif font-semibold text-[#990F3D] hover:underline whitespace-nowrap">How it works</a></p>'
            f'<div class="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24">{favourites("Men", "men", MEN)}{favourites("Women", "women", WOMEN)}</div>'
            + so_far() + '</div>')
    nodraw = ('<div id="u-nodraw" class="hidden mt-10 lg:mt-12 border-t-2 border-[#33302E] pt-6 max-w-2xl">'
              '<h2 class="serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight">Draw not published yet</h2>'
              '<p class="mt-2 text-[14px] text-[#66605C]">Medal chances appear here once the IJF publishes the draw, usually a day or two before the tournament.</p></div>')
    script = '''<script>
// prototype: #nodraw shows the state before the draw is published
if (location.hash === '#nodraw') { document.getElementById('u-draw').classList.add('hidden'); document.getElementById('u-nodraw').classList.remove('hidden');
  var c = document.getElementById('u-chip'); c.className = 'text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#66605C] text-[#66605C]'; c.textContent = 'Upcoming'; }
</script>'''
    return (head('Tokyo Grand Slam 2026', 'Medal chances for every weight at the Tokyo Grand Slam 2026.') + header('Explore')
            + top + draw + nodraw + footer().replace('</body>', script + '</body>'))


if __name__ == '__main__':
    out = os.path.join(HERE, '..', '_stitch', 'upcoming.html')
    open(out, 'w', encoding='utf-8').write(page())
    print('written', os.path.normpath(out))
