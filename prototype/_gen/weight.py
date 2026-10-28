#!/usr/bin/env python3
"""Tournament weight page (Abu Dhabi GS 2026, Men −73 kg) -> ../_stitch/weight.html

Results table: place as a number, expandable rows (panel like Rankings "Last 90 days"),
mobile row like Rankings: Place | Athlete | Rating | +/− | expand. Contests block from weight_contests.py.
"""
import os

import chrome
from chrome import H2, H2ROW, TD, TH, THEAD_TR, flag, footer, head, header, pagination
from weight_contests import A, EXTRA_FLAGS, ROUNDS, block as contests_block
from weight_panels import panel

HERE = os.path.dirname(os.path.abspath(__file__))
chrome.FLAG_SVG.update(EXTRA_FLAGS)
T = '/tournaments/abu-dhabi-2026'

# place, athlete, pre-event rank, W–L, rating before, after
RESULTS = [
    (1, 'Heydarov H.', 4, '5–0', 2245, 2275), (2, 'Lombardo M.', 2, '4–1', 2269, 2284),
    (3, 'Ishihara T.', 1, '4–1', 2284, 2298), (3, 'Tsend-Ochir T.', 5, '4–1', 2241, 2252),
    (5, 'Pelivan P.', 8, '3–2', 2187, 2185), (5, 'Shavdatuashvili L.', 3, '3–2', 2247, 2244),
    (7, 'Stump N.', 10, '2–2', 2161, 2155), (7, 'Cargnin D.', 7, '2–2', 2211, 2208),
    (9, 'Gaba J. B.', 6, '1–1', 2224, 2221), (9, 'Hojazoda B.', 9, '1–1', 2176, 2174),
]
AFTER = {'Heydarov H.': 3, 'Lombardo M.': 2, 'Ishihara T.': 1, 'Tsend-Ochir T.': 4, 'Pelivan P.': 10, 'Shavdatuashvili L.': 5,
         'Stump N.': 13, 'Cargnin D.': 8, 'Gaba J. B.': 7, 'Hojazoda B.': 11}
SHORT = {'Final': 'Final', 'Bronze medal': 'Bronze', 'Repechage': 'Rep.', 'Semi-finals': 'SF', 'Quarter-finals': 'QF', 'Round of 16': 'R16'}
R32 = [('Heydarov H.', 'Case A.', 70, 4), ('Lombardo M.', 'Butbul T.', 74, 3)]  # first rounds shown in the panels only
ORDER = ['R32', 'R16', 'QF', 'SF', 'Rep.', 'Bronze', 'Final']


def contests_of(name):
    out = []
    for rnd, cs in ROUNDS:
        for w, l, ch, d in cs:
            if name == w:
                out.append((SHORT[rnd], l, A[l], ch, 'W', d))
            elif name == l:
                out.append((SHORT[rnd], w, A[w], 100 - ch, 'L', -d))
    for w, l, ch, d in R32:
        if name == w:
            out.append(('R32', l, A[l], ch, 'W', d))
    return sorted(out, key=lambda r: ORDER.index(r[0]))


def tabs():
    men = ['−60', '−66', '−73', '−81', '−90', '−100', '+100']
    women = ['−48', '−52', '−57', '−63', '−70', '−78', '+78']

    def row(label, g, ws, active):
        a = f'<a href="{T}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap text-[#66605C] hover:text-[#33302E]">All</a>'
        b = ''.join(f'<a href="{T}/{g}-{w[1:] if w[0] == "−" else "plus-" + w[1:]}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap tnum '
                    + ('font-bold text-[#33302E] border-b-2 border-[#990F3D]' if w == active else 'text-[#66605C] hover:text-[#33302E]') + f'">{w}</a>' for w in ws)
        return (f'<div class="flex items-center"><span class="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#66605C]">{label}</span>'
                f'<div class="flex flex-1 items-center justify-between sm:justify-start sm:gap-2 text-[13px] sm:text-[15px]">{a}{b}</div></div>')
    return f'<nav class="mt-6 flex flex-col gap-1 sm:max-w-[560px]" aria-label="Weight categories">{row("Men", "men", men, "−73")}{row("Women", "women", women, None)}</nav>'


def results():
    head_ = (f'<thead><tr class="{THEAD_TR}">'
             f'<th class="{TH} text-right w-12 sm:w-16">Place</th><th class="{TH} text-left">Athlete</th>'
             f'<th class="{TH} text-left w-24 hidden sm:table-cell">Nat</th>'
             f'<th class="{TH} text-right w-16 hidden sm:table-cell">W–L</th>'
             f'<th class="{TH} text-right w-20 hidden sm:table-cell">Before</th>'
             f'<th class="{TH} text-right w-16 sm:w-20">Rating</th><th class="{TH} text-right w-12 sm:w-16">+/−</th>'
             '<th class="w-10 sm:w-12 h-9 py-0"></th></tr></thead>')
    body = ''
    for i, (pl, n, pre, wl, b0, b1) in enumerate(RESULTS):
        d = b1 - b0
        place_td = f'<td class="{TD} text-right font-medium">{pl}</td>'
        dc, ds = ('text-[#0D7680]', f'+{d}') if d > 0 else ('text-[#CC0000]', f'−{abs(d)}') if d < 0 else ('text-[#66605C]', '–')
        body += (f'<tr class="res-row border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40 cursor-pointer" role="button" aria-expanded="false" data-panel="p{i}">'
                 f'{place_td}'
                 f'<td class="{TD}"><div class="flex items-center gap-1.5 min-w-0"><span class="sm:hidden flex">{flag(A[n])}</span><span class="font-medium truncate">{n}</span></div></td>'
                 f'<td class="{TD} hidden sm:table-cell"><div class="flex items-center gap-1.5">{flag(A[n])}<span class="text-[13px]">{A[n]}</span></div></td>'
                 f'<td class="{TD} text-right hidden sm:table-cell">{wl}</td>'
                 f'<td class="{TD} text-right text-[#66605C] hidden sm:table-cell">{b0}</td>'
                 f'<td class="{TD} text-right font-bold">{b1}</td>'
                 f'<td class="{TD} text-right font-semibold {dc}">{ds}</td>'
                 '<td class="w-10 sm:w-12 h-10 sm:h-11 py-0 align-middle text-center text-[#66605C] hover:bg-[#E9E2D3] hover:text-[#33302E]" title="Show contests"><span class="material-symbols-outlined text-[18px] align-middle transition-transform">expand_more</span></td></tr>')
        p = panel(contests_of(n))
        body += (f'<tr class="hidden" id="p{i}"><td colspan="5" class="p-0 sm:hidden">{p}</td>'
                 f'<td colspan="8" class="p-0 hidden sm:table-cell">{p}</td></tr>')
    return (f'<section class="mt-14 lg:mt-16"><div class="{H2ROW}"><h2 class="{H2}">Results</h2></div>'
            f'<table class="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum">{head_}<tbody>{body}</tbody></table>'
            + pagination('1–10 of 34 athletes', active='20', pages=('1', '2')) + '</section>')


SCRIPT = '''<script>
document.querySelectorAll('.res-row').forEach(function(r){r.addEventListener('click',function(){
  var p=document.getElementById(r.dataset.panel),open=p.classList.toggle('hidden')===false;
  r.setAttribute('aria-expanded',open);r.querySelector('.material-symbols-outlined').style.transform=open?'rotate(180deg)':'';});});
</script>'''


def page():
    top = f'''<nav class="flex flex-wrap items-center gap-1.5 text-[12px] text-[#66605C]" aria-label="Breadcrumb"><a href="/tournaments" class="hover:text-[#33302E]">Tournaments</a><span class="text-[#D6CFC2]">›</span><a href="{T}" class="hover:text-[#33302E]">Abu Dhabi GS 2026</a><span class="text-[#D6CFC2]">›</span><span class="text-[#33302E]">Men −73 kg</span></nav>
<h1 class="serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">Abu Dhabi Grand Slam 2026</h1>
<div class="mt-2 flex items-center text-[14px] text-[#66605C]"><span class="inline-flex items-center gap-1.5">{flag('UAE')}<span class="text-[#33302E]">Abu Dhabi, UAE</span></span></div>
{tabs()}'''
    # podium as in the Stitch design (kept verbatim in podium.html); links go to the athlete
    cards = ''
    for pl, n, pre, wl, b0, b1 in RESULTS[:4]:
        cards += (f'<div class="flex items-start gap-3 min-w-0">{chrome.medal(pl, "w-6 h-7 sm:w-7 sm:h-8 shrink-0 mt-0.5")}'
                  f'<div class="min-w-0"><a href="/athletes/x" class="serif block text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px] font-semibold text-[#33302E] hover:underline truncate">{n}</a>'
                  f'<div class="mt-1 flex items-center gap-1.5 text-[12px] leading-[16px] text-[#33302E]">{flag(A[n])}<span class="font-medium">{A[n]}</span></div>'
                  f'<div class="mt-1.5 flex items-baseline gap-2 text-[13px] leading-[18px] tnum" title="Rating before → after the tournament">'
                  f'<span class="text-[#66605C]">{b0} → {b1}</span><span class="font-bold text-[#0D7680]">+{b1 - b0}</span></div></div></div>')
    pod = f'<div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-x-14">{cards}</div>'
    top += f'<section class="mt-10 lg:mt-12"><div class="{H2ROW}"><h2 class="{H2}">Podium</h2></div>{pod}</section>'
    return (head('Men −73 kg — Abu Dhabi Grand Slam 2026', 'Results, contests and rating changes in Men −73 kg at the Abu Dhabi Grand Slam 2026.')
            + header('Explore') + top + results() + contests_block() + footer().replace('</body>', SCRIPT + '</body>'))


if __name__ == '__main__':
    out = os.path.join(HERE, '..', '_stitch', 'weight.html')
    open(out, 'w', encoding='utf-8').write(page())
    print('written', os.path.normpath(out))
