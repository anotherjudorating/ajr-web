#!/usr/bin/env python3
"""Rebuilds the expandable athlete panels in the weight page "Results" table in the same
style as the Rankings "Last 30 days" panel (serif 16px heading, plain rows, no table head)."""
import os
import re

from chrome import FLAG_SVG, flag
from weight_contests import EXTRA_FLAGS

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', '_stitch', 'weight.html')
FLAG_SVG.update(EXTRA_FLAGS)

PANELS = {  # detail row id -> [(round, opponent, nation, chance, result, change)]
    'row-detail-1': [('R32', 'Case A.', 'GBR', 70, 'W', 4), ('R16', 'Hojazoda B.', 'TJK', 66, 'W', 5),
                     ('QF', 'Shavdatuashvili L.', 'GEO', 61, 'W', 5), ('SF', 'Tsend-Ochir T.', 'MGL', 58, 'W', 7),
                     ('Final', 'Lombardo M.', 'ITA', 47, 'W', 9)],
    'row-detail-2': [('R32', 'Butbul T.', 'ISR', 74, 'W', 3), ('R16', 'Gaba J. B.', 'FRA', 59, 'W', 6),
                     ('QF', 'Pelivan P.', 'MDA', 68, 'W', 4), ('SF', 'Ishihara T.', 'JPN', 25, 'W', 11),
                     ('Final', 'Heydarov H.', 'AZE', 53, 'L', -9)],
}


def chip(color):
    return f'<span class="text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-current {color}">Upset</span>'


def panel(rows):
    total = sum(r[5] for r in rows)
    tc = 'text-[#0D7680]' if total >= 0 else 'text-[#CC0000]'
    body = ''
    for rnd, opp, nat, ch, res, d in rows:
        col = 'text-[#0D7680]' if res == 'W' else 'text-[#CC0000]'
        # upset = winner had under 30%: athlete's chance green on an upset win, red on an upset loss
        cc = 'text-[#0D7680] font-semibold' if res == 'W' and ch < 30 else 'text-[#CC0000] font-semibold' if res == 'L' and ch > 70 else 'text-[#33302E]'
        chance = f'<span class="w-24 shrink-0 text-right tnum {cc}">{ch}%</span>'
        sign = f'+{d}' if d > 0 else f'−{abs(d)}'
        body += (f'<div class="{"panel-contest border-b border-[#D6CFC2]/60 last:border-b-0 py-1.5 flex items-center justify-between gap-1.5 cursor-pointer hover:bg-[#F3EEE3]/50"}" onclick="location.href=\'/contest/x\'">'
                 f'<span class="w-10 shrink-0 text-[#66605C]">{rnd}</span>'
                 f'<div class="inline-flex items-center gap-1.5 min-w-0 flex-1">{flag(nat)}<span class="truncate font-medium text-[#33302E]">{opp}</span></div>'
                 f'{chance}<span class="w-6 shrink-0 text-center font-bold {col}">{res}</span>'
                 f'<span class="w-10 shrink-0 text-right font-bold tnum {col}">{sign}</span>'
                 '<span class="material-symbols-outlined text-[18px] text-[#66605C] shrink-0 -mr-1">chevron_right</span></div>')
    tsign = f'+{total}' if total > 0 else f'−{abs(total)}'
    return (f'<div class="bg-[#E9E2D3] border-t border-[#D6CFC2] border-l-[3px] border-l-[#990F3D] p-3 sm:p-4">'
            f'<div class="flex items-baseline gap-2 mb-2"><h3 class="serif text-[16px] leading-[20px] font-semibold text-[#33302E]">Contests</h3>'
            f'<span class="text-[14px] font-bold tnum {tc}">{tsign}</span></div>'
            f'<div class="flex flex-col text-[13px] w-full sm:max-w-[560px]">{body}</div></div>')


def visible_cols(s, detail_pos):
    t = s.rfind('<thead', 0, detail_pos)
    head = s[t:s.find('</thead>', t)]
    ths = re.findall(r'<th\b[^>]*>', head)
    return len(ths), sum(1 for th in ths if 'hidden sm:table-cell' not in th and 'hidden md:table-cell' not in th)


if __name__ == '__main__':
    s = open(SRC, encoding='utf-8').read()
    for pid, rows in PANELS.items():
        m = re.search(r'<tr\b[^>]*id="' + pid + r'"[^>]*>', s)
        end = s.find('</tr>', s.find('</table>', m.end())) + 5 if '<table' in s[m.end():m.end() + 2000] else s.find('</tr>', m.end()) + 5
        hidden = 'hidden ' if 'hidden' in m.group(0).split('class="')[1].split('"')[0].split() else ''
        total, mob = visible_cols(s, m.start())
        p = panel(rows)
        new = (f'<tr class="{hidden}athlete-panel" id="{pid}">'
               f'<td class="p-0 sm:hidden" colspan="{mob}">{p}</td><td class="p-0 hidden sm:table-cell" colspan="{total}">{p}</td></tr>')
        s = s[:m.start()] + new + s[end:]
        print(pid, 'cols', total, 'mobile', mob)
    open(SRC, 'w', encoding='utf-8').write(s)
