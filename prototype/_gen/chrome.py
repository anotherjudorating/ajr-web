"""Shared page chrome for hand-built screens: <head>, header (desktop + mobile), footer, flags, table classes."""

NAV = [('Rankings', '/rankings'), ('Explore', '/tournaments'), ('Head-to-head', '/head-to-head'), ('Records', '/records')]

# flat 16x12 flags, no border
FLAG_SVG = {
    'JPN': '<rect width="16" height="12" fill="#FFF"/><circle cx="8" cy="6" r="3.6" fill="#BC002D"/>',
    'GEO': '<rect width="16" height="12" fill="#FFF"/><rect x="7" width="2" height="12" fill="#F00"/><rect y="5" width="16" height="2" fill="#F00"/>',
    'TPE': '<rect width="16" height="12" fill="#FE0000"/><rect width="8" height="6" fill="#000095"/><circle cx="4" cy="3" r="1.6" fill="#FFF"/>',
    'ISR': '<rect width="16" height="12" fill="#FFF"/><rect y="1.5" width="16" height="1.6" fill="#0038B8"/><rect y="8.9" width="16" height="1.6" fill="#0038B8"/>',
    'MDA': '<rect width="5.33" height="12" fill="#0046AE"/><rect x="5.33" width="5.34" height="12" fill="#FFD200"/><rect x="10.67" width="5.33" height="12" fill="#CC092F"/>',
    'BRA': '<rect width="16" height="12" fill="#009C3B"/><path d="M8 1.5 14.5 6 8 10.5 1.5 6z" fill="#FFDF00"/><circle cx="8" cy="6" r="2.4" fill="#002776"/>',
    'AZE': '<rect width="16" height="4" fill="#00B5E2"/><rect y="4" width="16" height="4" fill="#EF3340"/><rect y="8" width="16" height="4" fill="#509E2F"/>',
    'ITA': '<rect width="5.33" height="12" fill="#009246"/><rect x="5.33" width="5.34" height="12" fill="#FFF"/><rect x="10.67" width="5.33" height="12" fill="#CE2B37"/>',
    'MGL': '<rect width="16" height="12" fill="#015197"/><rect width="5.33" height="12" fill="#C4272F"/><rect x="10.67" width="5.33" height="12" fill="#C4272F"/>',
    'CAN': '<rect width="16" height="12" fill="#FFF"/><rect width="4" height="12" fill="#D80621"/><rect x="12" width="4" height="12" fill="#D80621"/><circle cx="8" cy="6" r="2" fill="#D80621"/>',
    'KOR': '<rect width="16" height="12" fill="#FFF"/><circle cx="8" cy="6" r="2.6" fill="#CD2E3A"/><path d="M5.4 6a2.6 2.6 0 0 0 5.2 0z" fill="#0047A0"/>',
    'ESP': '<rect width="16" height="12" fill="#AA151B"/><rect y="3" width="16" height="6" fill="#F1BF00"/>',
    'GER': '<rect width="16" height="4" fill="#000"/><rect y="4" width="16" height="4" fill="#DD0000"/><rect y="8" width="16" height="4" fill="#FFCE00"/>',
    'TJK': '<rect width="16" height="12" fill="#FFF"/><rect width="16" height="3.4" fill="#CC0000"/><rect y="8.6" width="16" height="3.4" fill="#006600"/>',
    'FRA': '<rect width="5.33" height="12" fill="#002654"/><rect x="5.33" width="5.34" height="12" fill="#FFF"/><rect x="10.67" width="5.33" height="12" fill="#CE1126"/>',
    'AIN': '<rect width="16" height="12" fill="#FFF" stroke="#66605C" stroke-width="1"/><text x="8" y="8.6" font-size="5" font-family="sans-serif" text-anchor="middle" fill="#66605C">AIN</text>',
    'SWE': '<rect width="16" height="12" fill="#006AA7"/><rect x="5" width="2" height="12" fill="#FECC00"/><rect y="5" width="16" height="2" fill="#FECC00"/>',
    'KOS': '<rect width="16" height="12" fill="#244AA5"/><path d="M5 5h6l-1 3H6z" fill="#D0A650"/>',
    'SLO': '<rect width="16" height="4" fill="#FFF"/><rect y="4" width="16" height="4" fill="#0000FF"/><rect y="8" width="16" height="4" fill="#F00"/>',
    'CRO': '<rect width="16" height="4" fill="#F00"/><rect y="4" width="16" height="4" fill="#FFF"/><rect y="8" width="16" height="4" fill="#171796"/>',
    'NED': '<rect width="16" height="4" fill="#AE1C28"/><rect y="4" width="16" height="4" fill="#FFF"/><rect y="8" width="16" height="4" fill="#21468B"/>',
    'UAE': '<rect width="16" height="4" fill="#00732F"/><rect y="4" width="16" height="4" fill="#FFF"/><rect y="8" width="16" height="4" fill="#000"/><rect width="4" height="12" fill="#FF0000"/>',
}


def flag(code, extra=''):
    return f'<svg class="w-4 h-3 shrink-0 {extra}" viewBox="0 0 16 12" role="img" aria-label="{code}">{FLAG_SVG[code]}</svg>'


TH = 'h-9 py-0 align-middle px-2 sm:px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#66605C]'
TD = 'h-10 sm:h-11 py-0 align-middle px-2 sm:px-3'
ROW = 'border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40 cursor-pointer'
THEAD_TR = 'bg-[#E9E2D3] border-b border-[#D6CFC2]'
CHEV_TD = '<td class="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-[#66605C]"><span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td>'
CHEV_TH = '<th class="w-6 h-9 py-0 pl-1 pr-0"></th>'
H2ROW = 'flex items-baseline justify-between gap-3 border-b-2 border-[#33302E] pb-2'
H2 = 'serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight'
LINK = 'serif shrink-0 whitespace-nowrap text-[14px] font-semibold text-[#990F3D] hover:underline'
TABLE = 'w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum'


def name(code, n, cls='font-medium'):
    return f'<div class="flex items-center gap-1.5 min-w-0">{flag(code)}<span class="{cls} truncate">{n}</span></div>'


def head(title, description):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | Another Judo Rating</title>
<meta name="description" content="{description}">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<style>.serif{{font-family:'Source Serif 4',Georgia,serif}}.tnum{{font-variant-numeric:tabular-nums}}</style>
</head>
<body class="bg-[#F3EEE3] text-[#33302E] antialiased min-h-screen flex flex-col" style="font-family:'IBM Plex Sans',sans-serif;">
'''


def header(active):
    d = ''.join(
        f'<a href="{href}" class="h-full inline-flex items-center text-[15px] border-b-2 -mb-px '
        + ('text-[#990F3D] border-[#990F3D]' if t == active else 'text-[#66605C] hover:text-[#33302E] border-transparent') + f'">{t}</a>'
        for t, href in NAV)
    m = ''.join(f'<a href="{href}" class="' + ('text-[#990F3D]' if t == active else 'text-[#66605C]') + f'">{t}</a>' for t, href in NAV)
    return f'''<header class="fixed top-0 left-0 right-0 z-50 bg-[#F3EEE3] border-b border-[#D6CFC2]">
<div class="hidden md:flex h-16 max-w-[1440px] mx-auto px-8 lg:px-10 items-center justify-between">
<div class="flex items-center h-full"><a href="/" class="serif text-[22px] leading-[28px] font-bold tracking-tight whitespace-nowrap">Another Judo Rating</a>
<nav class="flex items-center gap-6 lg:gap-8 h-full ml-8 lg:ml-12">{d}</nav></div>
<button type="button" aria-label="Search" class="lg:hidden w-10 h-10 -mr-2 flex items-center justify-center text-[#66605C]"><span class="material-symbols-outlined text-[22px]">search</span></button><div class="hidden lg:block relative w-[240px]"><span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#66605C] pointer-events-none">search</span><input type="text" placeholder="Search athletes or tournaments" class="w-full h-8 pl-8 pr-2.5 bg-[#F3EEE3] border border-[#D6CFC2] text-[12px] placeholder:text-[#66605C] focus:outline-none focus:border-[#33302E]"></div>
</div>
<div class="md:hidden h-12 px-4 flex items-center justify-between">
<div id="m-title" class="flex items-center justify-between w-full"><a href="/" class="serif text-[20px] leading-[28px] font-bold tracking-tight">Another Judo Rating</a><button type="button" aria-label="Search" onclick="mSearch(true)" class="w-10 h-10 -mr-2 flex items-center justify-center text-[#66605C]"><span class="material-symbols-outlined text-[22px]">search</span></button></div>
<div id="m-search" class="hidden items-center gap-2 w-full"><div class="relative flex-1"><span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#66605C]">search</span><input id="m-input" type="text" placeholder="Search athletes or tournaments" class="w-full h-8 pl-8 pr-2.5 bg-[#F3EEE3] border border-[#33302E] text-[12px] placeholder:text-[#66605C] focus:outline-none"></div><button type="button" aria-label="Close search" onclick="mSearch(false)" class="w-10 h-10 -mr-2 flex items-center justify-center text-[#66605C]"><span class="material-symbols-outlined text-[22px]">close</span></button></div>
</div>
</header>
<main class="flex-1 w-full pt-12 md:pt-16">
<nav class="md:hidden h-10 px-4 border-b border-[#D6CFC2] flex items-center justify-between text-[13px]" aria-label="Sections">{m}</nav>
<div class="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-6 sm:pt-8">
'''


def footer():
    return '''</div>
</main>
<footer class="w-full bg-[#F3EEE3] border-t border-[#D6CFC2] mt-10 md:mt-12 lg:mt-16">
<div class="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-0 sm:h-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
<a href="/methodology" class="sm:hidden text-[13px] hover:underline">Methodology</a>
<div class="flex items-center text-[12px] text-[#66605C] whitespace-nowrap"><span>Ratings updated 20 Nov 2026</span><span class="inline-block w-px h-3 bg-[#D6CFC2] mx-2 align-middle"></span><span>Data: IJF judobase</span></div>
<a href="/methodology" class="hidden sm:inline-block text-[12px] text-[#66605C] hover:text-[#33302E] hover:underline">Methodology</a>
</div>
</footer>
<script>
function mSearch(on){var t=document.getElementById('m-title'),s=document.getElementById('m-search');t.classList.toggle('hidden',on);t.classList.toggle('flex',!on);s.classList.toggle('hidden',!on);s.classList.toggle('flex',on);if(on)document.getElementById('m-input').focus();}
</script>
</body>
</html>
'''


def pagination(count, shows=('20', '50', '100'), active='20', pages=('1', '2')):
    """Canonical pagination row (same as Rankings): count + Show on the left, pages on the right."""
    P = 'min-w-[32px] h-8 flex items-center justify-center text-sm'
    sb = ''.join(
        f'<button type="button" class="font-bold text-[#33302E] border-b-2 border-[#990F3D] px-1 pb-0.5">{n}</button>' if n == active else
        f'<button type="button" class="text-[#66605C] hover:text-[#33302E] border-b-2 border-transparent px-1 pb-0.5">{n}</button>'
        for n in shows)
    items = [f'<span class="{P} text-[#66605C] opacity-40 select-none">‹</span>']
    for p in pages:
        if p == '…':
            items.append('<span class="h-8 px-1 flex items-center justify-center text-[#66605C] select-none">…</span>')
        elif p == pages[0]:
            items.append(f'<a href="#" class="{P} font-bold text-[#33302E] border-b-2 border-[#990F3D]">{p}</a>')
        else:
            items.append(f'<a href="#" class="{P} text-[#66605C] hover:text-[#33302E]">{p}</a>')
    items.append(f'<a href="#" class="{P} text-[#66605C] hover:text-[#33302E]">›</a>')
    return ('<div class="w-full border-t border-[#D6CFC2] py-4"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full text-[12px] text-[#66605C]">'
            f'<div class="flex items-center justify-between w-full sm:w-auto sm:gap-6"><span class="tnum">{count}</span>'
            f'<div class="flex items-center gap-2"><span>Show</span>{sb}</div></div>'
            '<div class="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 w-full sm:w-auto">' + ''.join(items) + '</div></div></div>')


# ---- contest row: two athletes stacked, like the Contest scoreboard (white on top, blue below) ----
MARK = {'white': 'bg-[#F3EEE3]', 'blue': 'bg-[#0F5499]'}
UPSET_CHIP = '<span class="hidden sm:inline-block text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#0D7680] text-[#0D7680]">Upset</span>'


def contest_cells(white, blue, chance_white, winner_white, delta):
    """white/blue = (name, nation). Returns the athletes / chance / +/- cells of one contest row."""
    win_ch = chance_white if winner_white else 100 - chance_white
    upset = win_ch < 30  # upset: the winner had under 30%
    lines = [(white, chance_white, winner_white, 'white'), (blue, 100 - chance_white, not winner_white, 'blue')]
    names = chances = results = deltas = chips = ''
    for (n, nat), ch, won, col in lines:
        names += (f'<div class="h-6 flex items-center gap-1.5 min-w-0"><span class="hidden sm:inline-block w-[6px] h-4 shrink-0 {MARK[col]} border border-[#33302E]"></span>'
                  f'{flag(nat)}<span class="truncate {"font-semibold text-[#33302E]" if won else "text-[#66605C]"}">{n}</span></div>')
        # mobile: upset = winner's chance green, loser's red; otherwise plain. Desktop: grey + UPSET chip
        mob = ('text-[#0D7680] font-semibold' if won else 'text-[#CC0000] font-semibold') if upset else 'text-[#33302E]'
        chances += f'<div class="h-6 flex items-center justify-end"><span class="{mob if upset else mob + " sm:text-[#66605C]"}">{ch}%</span></div>'
        results += (f'<div class="h-6 flex items-center justify-center font-bold text-[#0D7680]">W</div>' if won
                    else '<div class="h-6 flex items-center justify-center font-bold text-[#CC0000]">L</div>')
        deltas += (f'<div class="h-6 flex items-center justify-end font-bold text-[#0D7680]">+{delta}</div>' if won
                   else f'<div class="h-6 flex items-center justify-end font-semibold text-[#CC0000]">−{delta}</div>')
    td = 'px-2 sm:px-3 py-2 align-middle'
    return (f'<td class="{td}">{names}</td><td class="{td} hidden sm:table-cell text-right">{UPSET_CHIP if upset else ""}</td><td class="{td} whitespace-nowrap">{chances}</td><td class="{td}">{results}</td><td class="{td} tnum">{deltas}</td>'
            '<td class="w-6 py-2 align-middle pl-1 pr-0 text-right text-[#66605C]"><span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td>')


CONTEST_HEAD = (f'<th class="{TH} text-left">Athletes</th>'
                f'<th class="{TH} w-20 hidden sm:table-cell"></th>'  # upset chip column (no header)
                f'<th class="{TH} text-right w-14 sm:w-16" title="Chance to win before the contest">Chance</th>'
                f'<th class="{TH} text-center w-8 sm:w-10" title="Win or loss">W/L</th>'
                f'<th class="{TH} text-right w-12 sm:w-16" title="Rating change">+/−</th>'
                '<th class="w-6 h-9 py-0 pl-1 pr-0"></th>')


def explore_tabs(active):
    """Section switcher of the Explore area, styled like the Rankings weight tabs.
    Mobile: no "Explore" label, tabs left-aligned like the main nav."""
    tabs = [('Tournaments', 'tournaments.html'), ('Contests', 'contests.html'), ('Athletes', 'athletes.html'), ('Nations', 'nations.html')]
    a = ''.join(f'<a href="{h}" class="px-1 py-1.5 sm:px-2 whitespace-nowrap text-[13px] sm:text-[15px] '
                + ('font-bold text-[#33302E] border-b-2 border-[#990F3D]' if t == active else 'text-[#66605C] hover:text-[#33302E]') + f'">{t}</a>'
                for t, h in tabs)
    return (f'<nav class="flex items-center" aria-label="Explore"><span class="hidden sm:inline w-16 shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#66605C]">Explore</span>'
            f'<div class="flex items-center gap-4 sm:gap-2">{a}</div></nav>')


# ---- toolbar: one layout for every data table (Explore tabs, Rankings) ----
# desktop: [search 224px] [filters…] [sort]                 [↓ Export CSV]
# mobile:  search full width / filters 2 per row / Export CSV full width (always labelled, never next to search)
SELECT = 'h-8 py-0 px-2.5 bg-[#F3EEE3] border border-[#D6CFC2] text-[12px] text-[#33302E] focus:outline-none focus:border-[#33302E] cursor-pointer min-w-0'


def select(id_, options, title=''):
    """options: list of (value, label)."""
    t = f' title="{title}"' if title else ''
    return f'<select id="{id_}" class="{SELECT}"{t}>' + ''.join(f'<option value="{v}">{l}</option>' for v, l in options) + '</select>'


def toolbar(search_id, placeholder, controls, bp='lg'):
    """Sort (the control whose id contains "sort" or is f-s) always sits just left of Export, both bottom-right.
    Below `bp` (lg by default; xl for toolbars with many filters) the toolbar stacks:
    phone: search / filters 2 per row / sort + export; tablet (md): search / filters inline / sort + export on the right."""
    import re as _re
    is_sort = lambda c: bool(_re.search(r'id="(f-s|[a-z]+-sort)"', c))
    filters = [c for c in controls if not is_sort(c)]
    sort = ''.join(c for c in controls if is_sort(c))
    exp = (f'<button type="button" class="w-full md:w-auto shrink-0 h-8 px-3 inline-flex items-center justify-center gap-1.5 border border-[#D6CFC2] text-[12px] text-[#33302E] hover:border-[#33302E]">'
           '<span class="material-symbols-outlined text-[16px] text-[#66605C]">download</span>Export CSV</button>')
    filt = f'<div class="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">{"".join(filters)}</div>' if filters else ''
    return (f'<div class="mt-6 border-b-2 border-[#33302E] pb-2 flex flex-col {bp}:flex-row {bp}:items-center gap-2">'
            f'<div class="relative w-full md:w-72 {bp}:w-56 shrink-0"><span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#66605C] pointer-events-none">search</span>'
            f'<input id="{search_id}" type="text" placeholder="{placeholder}" class="w-full h-8 pl-8 pr-2.5 bg-[#F3EEE3] border border-[#D6CFC2] text-[12px] placeholder:text-[#66605C] focus:outline-none focus:border-[#33302E]"></div>'
            f'{filt}<div class="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end {bp}:ml-auto"><div class="min-w-0 grid md:block">{sort}</div>{exp}</div></div>')


def sort_options(items):
    """items: [(key, label, first_dir)]; every key gets both directions ('-desc' ↓ high→low / newest, '-asc' ↑).
    The first option is the default."""
    out = []
    for key, label, first in items:
        dirs = ['desc', 'asc'] if first == 'desc' else ['asc', 'desc']
        out += [(f'{key}-{d}', f'Sort: {label} {"↓" if d == "desc" else "↑"}') for d in dirs]
    return out


# medal colours: text only, readable on the paper background (gold / silver / bronze)
MEDAL = {1: '#8A6A00', 2: '#5F6B73', 3: '#8A4F2A'}


# flat medal icon, same spirit as the flags (no outline effects, no emoji)
MEDAL_FILL = {1: ('#D4AF37', '#8A6A00'), 2: ('#B4BCC2', '#5F6B73'), 3: ('#C2834F', '#8A4F2A')}
MEDAL_NAME = {1: 'Gold', 2: 'Silver', 3: 'Bronze'}


def medal(place, cls='w-4 h-5', outline=False):
    """outline=True: a predicted medal (upcoming tournaments) — contour only, faded ribbon"""
    fill, dark = MEDAL_FILL[place]
    if outline:
        return (f'<svg class="{cls} shrink-0" viewBox="0 0 16 20" role="img" aria-label="Predicted {MEDAL_NAME[place].lower()}">'
                f'<path d="M3 0h4l2 7H5z" fill="#990F3D" opacity=".35"/><path d="M9 0h4l-2 7H7z" fill="#0F5499" opacity=".35"/>'
                f'<circle cx="8" cy="13" r="5.4" fill="none" stroke="{dark}" stroke-width="1.4"/></svg>')
    return (f'<svg class="{cls} shrink-0" viewBox="0 0 16 20" role="img" aria-label="{MEDAL_NAME[place]}">'
            f'<path d="M3 0h4l2 7H5z" fill="#990F3D"/><path d="M9 0h4l-2 7H7z" fill="#0F5499"/>'
            f'<circle cx="8" cy="13" r="6" fill="{fill}"/><circle cx="8" cy="13" r="4" fill="none" stroke="{dark}" stroke-width="1"/></svg>')


def podium_line(place, n, nat, value='', outline=False):
    """one medallist (or predicted medallist) on a tournament overview: medal, flag, name, value right-aligned
    (rating change for a finished weight, chance of a medal for a live or upcoming one)"""
    return (f'<div class="h-6 flex items-center gap-1.5 min-w-0">{medal(place, "w-3.5 h-4 shrink-0", outline=outline)}{flag(nat)}'
            f'<span class="truncate">{n}</span><span class="ml-auto pl-2 shrink-0 tnum">{value}</span></div>')


def delta_html(d):
    return f'<span class="font-semibold text-[#0D7680]">+{d}</span>' if d > 0 else f'<span class="font-semibold text-[#CC0000]">−{abs(d)}</span>'


def mock_delta(n, place):
    """stable mock rating change of a medallist"""
    base = {1: 24, 2: 12, 3: 7}[place]
    return base + sum(map(ord, n)) % 7 - (4 if place == 3 and sum(map(ord, n)) % 3 == 0 else 0)


def podium_rows(weight_html, onclick, lines, hover_group=True):
    """one weight = 4 table rows (gold, silver, bronze, bronze) separated by hairlines like any table;
    the weight cell and the chevron span the 4 rows. lines: [(place, name, nation, value_html, outline)]"""
    out = ''
    for i, (pl, n, nat, val, outline) in enumerate(lines):
        last = i == len(lines) - 1
        border = 'border-b border-[#D6CFC2]' if last else 'border-b border-[#D6CFC2]/50'
        out += f'<tr class="{border} cursor-pointer row-only" onclick="{onclick}" data-group="{weight_html[:40].__hash__()}">'
        if i == 0:
            out += (f'<td rowspan="{len(lines)}" class="h-10 py-2.5 px-2 sm:px-3 w-14 sm:w-16 tnum whitespace-nowrap text-[#66605C] align-top border-b border-[#D6CFC2]">{weight_html}</td>')
        out += (f'<td class="h-9 py-0 px-2 sm:px-3 align-middle"><div class="flex items-center gap-1.5 min-w-0">{medal(pl, "w-3.5 h-4 shrink-0", outline=outline)}{flag(nat)}'
                f'<span class="truncate">{n}</span></div></td><td class="h-9 py-0 px-2 sm:px-3 align-middle text-right tnum whitespace-nowrap w-16">{val}</td>')
        if i == 0:
            out += (f'<td rowspan="{len(lines)}" class="w-6 py-0 align-middle pl-1 pr-0 text-right text-[#66605C] border-b border-[#D6CFC2]">'
                    '<span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td>')
        out += '</tr>'
    return out
