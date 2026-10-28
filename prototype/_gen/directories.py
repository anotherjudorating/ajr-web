#!/usr/bin/env python3
"""Explore › Athletes and Explore › Nations: searchable directories (not rankings)
-> ../_stitch/athletes.html, ../_stitch/nations.html"""
import json
import os

import chrome
from chrome import TD, TH, THEAD_TR, explore_tabs, footer, head, header, pagination
from contests import N  # athlete -> nation (also registers the extra flags)

HERE = os.path.dirname(os.path.abspath(__file__))

NAMES = {'JPN': 'Japan', 'FRA': 'France', 'GEO': 'Georgia', 'AZE': 'Azerbaijan', 'ITA': 'Italy', 'KOR': 'South Korea',
         'MGL': 'Mongolia', 'GER': 'Germany', 'BRA': 'Brazil', 'CAN': 'Canada', 'ISR': 'Israel', 'ESP': 'Spain',
         'NED': 'Netherlands', 'KOS': 'Kosovo', 'MDA': 'Moldova', 'SUI': 'Switzerland', 'TJK': 'Tajikistan',
         'GBR': 'Great Britain', 'TPE': 'Chinese Taipei', 'SWE': 'Sweden', 'SLO': 'Slovenia', 'CRO': 'Croatia',
         'UAE': 'United Arab Emirates', 'ARM': 'Armenia', 'AIN': 'Individual Neutral Athletes'}

# athlete, weight, rating, last contest, active
ATHLETES = [
    ('Abe H.', 'M −66', 2240, 'Abu Dhabi GS 2026', 1), ('Agbegnenou C.', 'W −63', 2266, 'Abu Dhabi GS 2026', 1),
    ('Babulfath T.', 'W −48', 2212, 'Abu Dhabi GS 2026', 1), ('Bekauri L.', 'M −90', 2312, 'Abu Dhabi GS 2026', 1),
    ('Bellandi A.', 'W −78', 2214, 'Abu Dhabi GS 2026', 1), ('Butbul T.', 'M −73', 2130, 'Zagreb GP 2026', 1),
    ('Cargnin D.', 'M −73', 2208, 'Abu Dhabi GS 2026', 1), ('Case A.', 'M −73', 2142, 'Abu Dhabi GS 2026', 1),
    ('Deguchi C.', 'W −57', 2247, 'Abu Dhabi GS 2026', 1), ('Dicko R.', 'W +78', 2238, 'Abu Dhabi GS 2026', 1),
    ('Gaba J. B.', 'M −73', 2221, 'Abu Dhabi GS 2026', 1), ('Gauthier-Drapeau F.', 'M −81', 2126, 'Abu Dhabi GS 2026', 1),
    ('Gomboc A.', 'M −73', 2010, 'Paris GS 2026', 0), ('Grigalashvili T.', 'M −81', 2361, 'Abu Dhabi GS 2026', 1),
    ('Hashimoto S.', 'M −73', 2235, 'Paris GS 2026', 1), ('Heydarov H.', 'M −73', 2275, 'Abu Dhabi GS 2026', 1),
    ('Hojazoda B.', 'M −73', 2174, 'Abu Dhabi GS 2026', 1), ('Ishihara T.', 'M −73', 2298, 'Abu Dhabi GS 2026', 1),
    ('Kotsoiev Z.', 'M −100', 2287, 'Abu Dhabi GS 2026', 1), ('Krasniqi D.', 'W −52', 2180, 'Abu Dhabi GS 2026', 1),
    ('Lombardo M.', 'M −73', 2284, 'Abu Dhabi GS 2026', 1), ('Makhmadbekov M.', 'M −73', 2196, 'Baku GS 2025', 0),
    ('Pelivan P.', 'M −73', 2185, 'Abu Dhabi GS 2026', 1), ('Riner T.', 'M +100', 2305, 'Abu Dhabi GS 2026', 1),
    ('Shavdatuashvili L.', 'M −73', 2244, 'Abu Dhabi GS 2026', 1), ('Stump N.', 'M −73', 2155, 'Abu Dhabi GS 2026', 1),
    ('Tsend-Ochir T.', 'M −73', 2252, 'Abu Dhabi GS 2026', 1), ('Tsunoda N.', 'W −48', 2219, 'Abu Dhabi GS 2026', 1),
]
# nation, rated athletes, athletes in a world top 10, leaders rating (mixed)
NATIONS = [('JPN', 64, 21, 2239), ('FRA', 58, 12, 2201), ('KOR', 41, 6, 2143), ('ITA', 39, 5, 2136), ('MGL', 33, 4, 2129),
           ('BRA', 44, 5, 2124), ('GER', 47, 3, 2122), ('GEO', 36, 9, 2101), ('ESP', 31, 2, 2100), ('NED', 29, 2, 2096),
           ('AZE', 27, 5, 2092), ('CAN', 22, 3, 2091), ('ISR', 25, 2, 2084), ('KOS', 9, 3, 2004), ('MDA', 14, 1, 1996),
           ('SUI', 12, 0, 1978), ('TJK', 15, 1, 1990), ('SWE', 13, 1, 1972), ('SLO', 11, 1, 1981), ('CRO', 16, 1, 1999)]

SEL = 'h-8 px-2.5 bg-[#F3EEE3] border border-[#D6CFC2] text-[12px] text-[#33302E] focus:outline-none focus:border-[#33302E] cursor-pointer min-w-0'
SEARCH = ('<div class="relative flex-1 lg:flex-initial lg:w-56"><span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#66605C] pointer-events-none">search</span>'
          '<input id="f-q" type="text" placeholder="{ph}" class="w-full h-8 pl-8 pr-2.5 bg-[#F3EEE3] border border-[#D6CFC2] text-[12px] placeholder:text-[#66605C] focus:outline-none focus:border-[#33302E]"></div>')
FLAG_JS = 'function fl(c){return \'<svg class="w-4 h-3 shrink-0" viewBox="0 0 16 12">\'+FLAGS[c]+\'</svg>\';}'
CHEV = '<td class="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-[#66605C]"><span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td>'


def top(active, title, sub):
    return (f'{explore_tabs(active)}\n<h1 class="serif mt-6 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">{title}</h1>'
            f'<p class="mt-1.5 text-[14px] text-[#66605C]">{sub}</p><section>')


def athletes_page():
    nats = sorted({N[a] for a, *_ in ATHLETES})
    weights = ['M −60', 'M −66', 'M −73', 'M −81', 'M −90', 'M −100', 'M +100', 'W −48', 'W −52', 'W −57', 'W −63', 'W −70', 'W −78', 'W +78']
    bar = chrome.toolbar('f-q', 'Search athlete', [
        chrome.select('f-n', [('', 'All countries')] + [(n, NAMES[n]) for n in nats]),
        chrome.select('f-w', [('', 'All weights'), ('M', 'Men, all weights'), ('W', 'Women, all weights')] + [(w, w.replace('M ', 'Men ').replace('W ', 'Women ') + ' kg') for w in weights]),
        chrome.select('f-s', chrome.sort_options([('name', 'name', 'asc'), ('age', 'age', 'asc')])),
    ])
    table = (f'<table class="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum"><thead><tr class="{THEAD_TR}">'
             f'<th class="{TH} text-left">Athlete</th><th class="{TH} text-left w-24 hidden sm:table-cell">Nat</th>'
             f'<th class="{TH} text-left w-16 sm:w-24">Weight</th><th class="{TH} text-right w-12 sm:w-20">Age</th>'
             f'<th class="{TH} text-left w-48 hidden lg:table-cell">Last contest</th><th class="w-6 h-9 py-0 pl-1 pr-0"></th></tr></thead>'
             '<tbody id="d-body"></tbody></table><p id="d-empty" class="hidden py-6 text-[14px] text-[#66605C]">No athletes match these filters.</p>')
    # mock ages, stable per athlete
    data = [{'a': a, 'n': N[a], 'w': w, 'age': 21 + (sum(map(ord, a)) % 13), 'l': l, 'act': act} for a, w, r, l, act in ATHLETES]
    script = f'''<script>
var D={json.dumps(data, ensure_ascii=False)}, FLAGS={json.dumps(chrome.FLAG_SVG, ensure_ascii=False)}, NAMES={json.dumps(NAMES)};
{FLAG_JS}
var $=function(id){{return document.getElementById(id);}}, TD='{TD}';
function draw(){{
  var q=$('f-q').value.trim().toLowerCase(), n=$('f-n').value, w=$('f-w').value, s=$('f-s').value;
  var rows=D.filter(function(x){{return (!q||x.a.toLowerCase().indexOf(q)>=0)&&(!n||x.n===n)&&(!w||x.w===w||x.w[0]===w);}});
  var dir=/-asc$/.test(s)?1:-1;
  rows.sort(function(x,y){{return dir*(/^age/.test(s)?x.age-y.age:x.a.localeCompare(y.a));}});
  $('d-body').innerHTML=rows.map(function(x){{
    return '<tr class="border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40 cursor-pointer" onclick="location.href=\\'athlete.html\\'">'+
      '<td class="'+TD+'"><div class="flex items-center gap-1.5 min-w-0"><span class="sm:hidden flex">'+fl(x.n)+'</span><span class="font-medium truncate">'+x.a+'</span>'+(x.act?'':'<span class="ml-1 shrink-0 text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#66605C] text-[#66605C]">Inactive</span>')+'</div></td>'+
      '<td class="'+TD+' hidden sm:table-cell"><div class="flex items-center gap-1.5">'+fl(x.n)+'<span class="text-[13px]">'+x.n+'</span></div></td>'+
      '<td class="'+TD+' text-[#66605C] whitespace-nowrap">'+x.w.slice(2)+'</td>'+
      '<td class="'+TD+' text-right">'+x.age+'</td>'+
      '<td class="'+TD+' hidden lg:table-cell text-[#66605C] truncate">'+x.l+'</td>{CHEV}</tr>';
  }}).join('');
  $('d-empty').classList.toggle('hidden',rows.length>0);
  $('d-count').textContent=rows.length?'1–'+rows.length+' of 2,184 athletes':'0 athletes';
}}
['f-q','f-n','f-w','f-s'].forEach(function(id){{$(id).addEventListener(id==='f-q'?'input':'change',draw);}});
// preset filters from the hash, e.g. #n=JPN&w=M (links from a country page)
location.hash.slice(1).split('&').forEach(function(kv){{var p=kv.split('=');if((p[0]==='n'||p[0]==='w'||p[0]==='q')&&$('f-'+p[0]))$('f-'+p[0]).value=decodeURIComponent(p[1]||'');}});
draw();
</script>'''
    pag = pagination('<span id="d-count"></span>', active='50', pages=('1', '2', '…', '44')).replace('<span class="tnum"><span id="d-count"></span></span>', '<span class="tnum" id="d-count"></span>')
    return (head('Athletes', 'Every athlete with a rating: search by name, country and weight.') + header('Explore')
            + top('Athletes', 'Athletes', 'Every athlete with a rating, active or not.') + bar + table + pag + '</section>'
            + footer().replace('</body>', script + '</body>'))


def nations_page():
    rows = ''.join(
        f'<tr class="border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40 cursor-pointer" data-q="{NAMES[n].lower()} {n.lower()}" data-name="{NAMES[n]}" data-count="{c}" onclick="location.href=\'/countries/{n.lower()}\'">'
        f'<td class="{TD}"><div class="flex items-center gap-1.5 min-w-0">{chrome.flag(n)}<span class="font-medium truncate">{NAMES[n]}</span></div></td>'
        f'<td class="{TD} text-right">{c}</td>{CHEV}</tr>'
        for n, c, t10, lr in sorted(NATIONS, key=lambda r: NAMES[r[0]]))
    bar = chrome.toolbar('f-q', 'Search nation', [chrome.select('f-s', chrome.sort_options([('name', 'name', 'asc'), ('athletes', 'athletes', 'desc')]))])
    table = (f'<table class="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum"><thead><tr class="{THEAD_TR}">'
             f'<th class="{TH} text-left">Nation</th><th class="{TH} text-right w-20 sm:w-28">Athletes</th>'
             f'<th class="w-6 h-9 py-0 pl-1 pr-0"></th></tr></thead><tbody id="d-body">{rows}</tbody></table>')
    script = '''<script>
document.getElementById('f-q').addEventListener('input',function(){var q=this.value.trim().toLowerCase();
  document.querySelectorAll('#d-body tr').forEach(function(tr){tr.classList.toggle('hidden',q&&tr.dataset.q.indexOf(q)<0);});});
document.getElementById('f-s').addEventListener('change',function(){var b=document.getElementById('d-body'),by=this.value;
  Array.prototype.slice.call(b.children).sort(function(x,y){var d=/-asc$/.test(by)?1:-1;return d*(/^athletes/.test(by)?x.dataset.count-y.dataset.count:x.dataset.name.localeCompare(y.dataset.name));}).forEach(function(tr){b.appendChild(tr);});});
</script>'''
    pag = pagination(f'1–{len(NATIONS)} of 128 nations', active='50', pages=('1', '2', '3'))
    return (head('Nations', 'Every nation with rated athletes.') + header('Explore')
            + top('Nations', 'Nations', 'Every nation with rated athletes.') + bar + table + pag + '</section>'
            + footer().replace('</body>', script + '</body>'))


if __name__ == '__main__':
    for name, html in (('athletes.html', athletes_page()), ('nations.html', nations_page())):
        open(os.path.join(HERE, '..', '_stitch', name), 'w', encoding='utf-8').write(html)
        print('written', name)
