#!/usr/bin/env python3
"""Replaces the "Contests" (by round) block of the weight page with a table built like
the Contests table on the Athlete screen; group rows are rounds instead of tournaments."""
import os
import re

from chrome import CONTEST_HEAD, H2, H2ROW, LINK, TH, THEAD_TR, contest_cells, flag, pagination

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', '_stitch', 'weight.html')

A = {  # athlete -> nation
    'Heydarov H.': 'AZE', 'Lombardo M.': 'ITA', 'Ishihara T.': 'JPN', 'Tsend-Ochir T.': 'MGL', 'Pelivan P.': 'MDA',
    'Shavdatuashvili L.': 'GEO', 'Stump N.': 'SUI', 'Cargnin D.': 'BRA', 'Hojazoda B.': 'TJK', 'Gaba J. B.': 'FRA',
    'Sanchez E.': 'ESP', 'Karapetian F.': 'ARM', 'Osmanov A.': 'MDA', 'Makhmadbekov M.': 'UAE', 'Terada M.': 'THA',
    'Butbul T.': 'ISR', 'Case A.': 'GBR',
}
# (round, [(winner, loser, winner's chance %, winner's rating change)])
ROUNDS = [
    ('Final', [('Heydarov H.', 'Lombardo M.', 47, 9)]),
    ('Bronze medal', [('Ishihara T.', 'Pelivan P.', 76, 3), ('Tsend-Ochir T.', 'Shavdatuashvili L.', 52, 5)]),
    ('Repechage', [('Pelivan P.', 'Stump N.', 58, 4), ('Shavdatuashvili L.', 'Cargnin D.', 56, 4)]),
    ('Semi-finals', [('Heydarov H.', 'Tsend-Ochir T.', 58, 7), ('Lombardo M.', 'Ishihara T.', 25, 11)]),
    ('Quarter-finals', [('Heydarov H.', 'Shavdatuashvili L.', 61, 5), ('Tsend-Ochir T.', 'Cargnin D.', 54, 5),
                        ('Lombardo M.', 'Pelivan P.', 68, 4), ('Ishihara T.', 'Stump N.', 72, 3)]),
    ('Round of 16', [('Heydarov H.', 'Hojazoda B.', 66, 5), ('Lombardo M.', 'Gaba J. B.', 59, 6),
                     ('Ishihara T.', 'Sanchez E.', 84, 2), ('Tsend-Ochir T.', 'Karapetian F.', 71, 3),
                     ('Pelivan P.', 'Osmanov A.', 63, 4), ('Shavdatuashvili L.', 'Makhmadbekov M.', 55, 5),
                     ('Stump N.', 'Terada M.', 57, 4), ('Cargnin D.', 'Butbul T.', 60, 4)]),
]
EXTRA_FLAGS = {
    'SUI': '<rect width="16" height="12" fill="#D52B1E"/><rect x="7" y="3" width="2" height="6" fill="#FFF"/><rect x="5" y="5" width="6" height="2" fill="#FFF"/>',
    'ARM': '<rect width="16" height="4" fill="#D90012"/><rect y="4" width="16" height="4" fill="#0033A0"/><rect y="8" width="16" height="4" fill="#F2A800"/>',
    'THA': '<rect width="16" height="12" fill="#A51931"/><rect y="2" width="16" height="8" fill="#F4F5F8"/><rect y="4" width="16" height="4" fill="#2D2A4A"/>',
    'GBR': '<rect width="16" height="12" fill="#012169"/><path d="M0 0 16 12M16 0 0 12" stroke="#FFF" stroke-width="2.4"/><path d="M8 0v12M0 6h16" stroke="#FFF" stroke-width="3.6"/><path d="M8 0v12M0 6h16" stroke="#C8102E" stroke-width="2"/>',
}

UPSET = '<span class="hidden sm:inline-block text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#0D7680] text-[#0D7680]">Upset</span>'


def who(n, cls):
    return f'<div class="flex items-center gap-1.5 min-w-0">{flag(A[n])}<span class="{cls} truncate">{n}</span></div>'


def block():
    rows = ''
    shown = 0
    for rnd, cs in ROUNDS:
        inner = (f'<div class="flex items-center justify-between"><span class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-[#66605C] transition-transform duration-150 round-icon">expand_more</span><span class="text-[12px] font-bold uppercase text-[#33302E]">{rnd}</span></span>'
                 f'<span class="text-[12px] text-[#66605C]">{len(cs)} contest{"s" if len(cs) > 1 else ""}</span></div>')
        # 4 visible columns on mobile, 5 from 640px: one group cell per layout so no phantom column appears
        rows += (f'<tr class="round-row h-8 bg-[#E9E2D3] border-b border-[#D6CFC2] cursor-pointer select-none hover:bg-[#E9E2D3]/80" role="button" tabindex="0" aria-expanded="true">'
                 f'<td colspan="5" class="sm:hidden px-2 h-8 py-0 align-middle">{inner}</td>'
                 f'<td colspan="6" class="hidden sm:table-cell px-3 h-8 py-0 align-middle">{inner}</td></tr>')
        for w, l, ch, d in cs:
            white_first = shown % 2 == 1  # who wore white alternates in the mock (final: Lombardo in white, as on the Contest screen)
            white, blue = ((w, A[w]), (l, A[l])) if white_first else ((l, A[l]), (w, A[w]))
            cw = ch if white_first else 100 - ch
            rows += (f'<tr class="border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40 cursor-pointer" onclick="location.href=\'/contest/{shown}\'">'
                     + contest_cells(white, blue, cw, white_first, d) + '</tr>')
            shown += 1
    # no visible header (round rows say enough); a zero-height row keeps the column widths of the fixed table
    import re
    ghost = re.sub(r'>[^<]*</th>', '></th>', CONTEST_HEAD.replace(TH, 'p-0 h-0')).replace('h-9 py-0 pl-1 pr-0', 'p-0 h-0')
    head = f'<thead aria-hidden="true"><tr>{ghost}</tr></thead>'
    opts = ''.join(f'<option>{r}</option>' for r, _ in ROUNDS)
    # round filter sits right of the title, like the weight select on Home
    sel = (f'<select class="w-32 sm:w-36 rounded-none border border-[#D6CFC2] bg-[#F3EEE3] text-[#33302E] text-xs py-1 px-2 focus:outline-none focus:border-[#33302E] cursor-pointer">'
           f'<option>All rounds</option>{opts}<option>Round of 32</option></select>')
    # all contests of this weight in Explore › Contests (tournament + weight preselected)
    link = f'<a href="contests.html#t=adgs&w=M%20%E2%88%9273" class="{LINK}">All contests</a>'
    return (f'<section class="mt-14 lg:mt-16"><div class="flex flex-row items-center justify-between gap-3 border-b-2 border-[#33302E] pb-2">'
            f'<h2 class="{H2}">Contests</h2>{link}</div>'
            f'<table class="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum">{head}<tbody>{rows}</tbody></table>'
            + pagination(f'1–{shown} of 33 contests', active='20', pages=('1', '2')) + '</section>')


def balanced_div_end(s, start):
    depth = 0
    for m in re.finditer(r'<div\b|</div>', s[start:]):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            return start + m.end()
    raise ValueError('unbalanced')


if __name__ == '__main__':
    import chrome
    chrome.FLAG_SVG.update(EXTRA_FLAGS)
    s = open(SRC, encoding='utf-8').read()
    marker = '<!-- 7. CONTESTS BY ROUND -->'
    if marker in s:
        a = s.find('<div', s.find(marker))
        b = balanced_div_end(s, a)
        s = s[:s.find(marker)] + '<!-- CONTESTS (generated by _gen/weight_contests.py) -->' + block() + s[b:]
    else:
        m = re.search(r'<!-- CONTESTS \(generated by _gen/weight_contests.py\) --><section.*?</section>', s, re.S)
        s = s[:m.start()] + '<!-- CONTESTS (generated by _gen/weight_contests.py) -->' + block() + s[m.end():]
    open(SRC, 'w', encoding='utf-8').write(s)
    print('weight.html: contests block rebuilt')
