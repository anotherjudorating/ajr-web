#!/usr/bin/env python3
"""Builds the clickable prototype from the screens exported from Stitch (_stitch/).

Run: python3 build.py   then open index.html (or serve the folder).
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '_stitch')

# output file -> (source file, title, status)
PAGES = {
    'index.html': ('home.html', 'Home', 'polished'),
    'rankings.html': ('rankings.html', 'Rankings (Men −73 kg)', 'polished'),
    'athlete.html': ('athlete.html', 'Athlete (Heydarov H.)', 'polished'),
    'tournaments.html': ('tournaments.html', 'Tournaments', 'polished'),
    'contest.html': ('contest.html', 'Contest (Lombardo M. vs Heydarov H.)', 'polished'),
    'h2h.html': ('h2h_local.html', 'Head-to-head', 'polished'),
    'tournament.html': ('tournament.html', 'Tournament overview (Abu Dhabi GS 2026)', 'polished'),
    'upcoming.html': ('upcoming.html', 'Live tournament (Tokyo GS 2026, day 2 of 3; #nodraw = before the draw)', 'draft'),
    'upcoming_weight.html': ('upcoming_weight.html', 'Live tournament weight (Tokyo GS 2026, Men −73 kg)', 'draft'),
    'weight.html': ('weight.html', 'Tournament weight (Men −73 kg)', 'polished'),
    'contests.html': ('contests.html', 'Explore › Contests', 'polished'),
    'athletes.html': ('athletes.html', 'Explore › Athletes', 'polished'),
    'nations.html': ('nations.html', 'Explore › Nations', 'polished'),
    'country.html': ('country.html', 'Country (Japan)', 'polished'),
    'records.html': ('records.html', 'Records', 'draft'),
    'record.html': ('record.html', 'Record › full list (Highest rating)', 'draft'),
    '404.html': ('notfound.html', '404 / not built yet (Methodology)', 'draft'),
}

H2H_HASH = """<script>
(function(){var h=decodeURIComponent(location.hash.slice(1));if(h.indexOf('|')>0){var p=h.split('|');if(window.pickPair)pickPair(p[0],p[1]);}})();
</script>"""


def build_page(out, src):
    s = open(os.path.join(SRC, src), encoding='utf-8').read()
    # Stitch leaves export-time styles on <html> (fixed 1280px width, overflow hidden, opacity 0)
    s = re.sub(r'<html\b[^>]*>', '<html lang="en">', s, count=1)
    # desktop logo: full name instead of "AJR"
    s = re.sub(r'(<a\b[^>]*>)\s*AJR\s*(</a>)', lambda m: m.group(1).replace('text-[26px] leading-[30px]', 'text-[22px] leading-[28px] whitespace-nowrap') + 'Another Judo Rating' + m.group(2), s)
    # helper classes used by generated blocks (Stitch pages don't define them)
    if '.serif{' not in s:
        s = s.replace('</head>', "<style>.serif{font-family:'Source Serif 4',Georgia,serif}.tnum{font-variant-numeric:tabular-nums}</style></head>", 1)
    extra = H2H_HASH if out == 'h2h.html' else ''
    s = s.replace('</body>', extra + '<script src="proto.js"></script></body>', 1)
    open(os.path.join(HERE, out), 'w', encoding='utf-8').write(s)


def build_index():
    rows = ''.join(
        f'<tr class="border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40"><td class="h-11 px-3"><a class="font-medium hover:underline" href="{out}">{title}</a></td>'
        f'<td class="h-11 px-3 text-[#66605C]">{out}</td><td class="h-11 px-3 text-right">'
        + ('<span class="text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#0D7680] text-[#0D7680]">Polished</span>' if st == 'polished'
           else '<span class="text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#66605C] text-[#66605C]">Draft</span>')
        + '</td></tr>'
        for out, (_, title, st) in PAGES.items())
    html = f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>AJR prototype — screens</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-[#F3EEE3] text-[#33302E]" style="font-family:'IBM Plex Sans',sans-serif">
<main class="max-w-[880px] mx-auto px-4 sm:px-6 py-8">
<h1 class="text-[36px] leading-[40px] font-bold" style="font-family:'Source Serif 4',serif">AJR prototype</h1>
<p class="mt-1.5 text-[14px] text-[#66605C]">Static screens from Stitch with mock data, linked together. Start at Home and click around.</p>
<table class="mt-8 w-full border-collapse text-[14px]"><thead><tr class="h-9 bg-[#E9E2D3] border-b border-[#D6CFC2] text-[11px] font-bold uppercase tracking-wider text-[#66605C]">
<th class="px-3 text-left">Screen</th><th class="px-3 text-left">File</th><th class="px-3 text-right">Status</th></tr></thead><tbody>{rows}</tbody></table>
</main></body></html>'''
    open(os.path.join(HERE, 'screens.html'), 'w', encoding='utf-8').write(html)


if __name__ == '__main__':
    for out, (src, _, _) in PAGES.items():
        build_page(out, src)
    build_index()
    print('built', len(PAGES), 'pages + screens.html')
