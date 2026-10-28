#!/usr/bin/env python3
"""(Re)writes the shared toolbar into the Stitch pages (Tournaments, Rankings). Idempotent."""
import os
import re

import chrome

HERE = os.path.dirname(os.path.abspath(__file__))


def bal_div_end(s, a):
    d = 0
    for m in re.finditer(r'<div\b|</div>', s[a:]):
        d += 1 if m.group(0) == '<div' else -1
        if d == 0:
            return a + m.end()


def replace_after(path, marker, html):
    s = open(path, encoding='utf-8').read()
    k = s.find(marker)
    a = s.find('<div', k)
    s = s[:a] + html + s[bal_div_end(s, a):]
    open(path, 'w', encoding='utf-8').write(s)


DATE = ('<input id="as-of-date" type="date" value="2026-11-20" min="2005-01-01" max="2026-11-20" title="Ranking as of this date" '
        f'class="{chrome.SELECT} tabular-nums" style="font-family:\'IBM Plex Sans\',sans-serif">'
        '<button id="reset-today-btn" type="button" class="hidden"></button><span id="csv-export-tooltip" class="hidden"></span>')

RANKINGS = chrome.toolbar('rk-q', 'Search athlete', [
    chrome.select('rk-country', [('', 'All countries')] + [(c, c) for c in ['AZE', 'BRA', 'FRA', 'GBR', 'GEO', 'ISR', 'ITA', 'JPN', 'MDA', 'MGL', 'SUI', 'TJK', 'UAE']]),
    DATE,
    chrome.select('rk-sort', chrome.sort_options([('rating', 'rating', 'desc'), ('d90', '+/− 90 days', 'desc'), ('d6m', '+/− 6 months', 'desc')])),
])
TOURNAMENTS = chrome.toolbar('t-q', 'Search tournament or city', [
    chrome.select('t-level', [('all', 'All levels'), ('og', 'Olympic Games'), ('wch', 'World Championships'), ('mas', 'Masters'),
                              ('gs', 'Grand Slam'), ('gp', 'Grand Prix'), ('cont', 'Continental')]),
    chrome.select('t-year', [('2026', '2026'), ('2025', '2025'), ('2024', '2024'), ('2023', '2023')]),
    chrome.select('t-sort', chrome.sort_options([('date', 'date', 'asc'), ('accuracy', 'rating accuracy', 'desc'), ('upsets', 'upsets', 'desc')])),
])

ATHLETE = chrome.toolbar('ac-q', 'Search opponent or tournament', [
    chrome.select('ac-year', [('', 'All years'), ('2026', '2026'), ('2025', '2025')]),
    chrome.select('ac-res', [('', 'All contests'), ('w', 'Wins'), ('l', 'Losses'), ('uw', 'Upset wins'), ('ul', 'Upset losses')]),
    chrome.select('ac-sort', chrome.sort_options([('date', 'date', 'desc'), ('chance', 'chance', 'asc'), ('gain', 'rating change', 'desc')])),
]).replace('mt-6 ', 'mt-3 ', 1)

if __name__ == '__main__':
    src = os.path.join(HERE, '..', '_stitch')
    replace_after(os.path.join(src, 'rankings.html'), '<!-- 3. TOOLBAR (shared layout, _gen/chrome.toolbar) -->', RANKINGS)
    replace_after(os.path.join(src, 'tournaments.html'), '<!-- Toolbar (shared layout, _gen/chrome.toolbar) -->', TOURNAMENTS)
    replace_after(os.path.join(src, 'athlete.html'), '<!-- Heading & Toolbar (shared layout, _gen/chrome.toolbar) -->', ATHLETE)
    print('toolbars written')
