#!/usr/bin/env python3
"""One record, full list (template for every record; example: Highest rating) -> ../_stitch/record.html"""
import json
import os

import chrome
from chrome import TD, TH, THEAD_TR, footer, head, header, pagination
import records  # noqa: F401  (registers extra flags)
from records import PEAK

HERE = os.path.dirname(os.path.abspath(__file__))

# more athletes below the top of the card, peak ratings going down
MORE = [('Grigalashvili T.', 'GEO', 'M −81'), ('Bilodid D.', 'UKR', 'W −48'), ('Abe H.', 'JPN', 'M −66'), ('Kotsoiev Z.', 'AZE', 'M −100'),
        ('Deguchi C.', 'CAN', 'W −57'), ('Tsunoda N.', 'JPN', 'W −48'), ('Ishihara T.', 'JPN', 'M −73'), ('Krasniqi D.', 'KOS', 'W −52'),
        ('Lombardo M.', 'ITA', 'M −73'), ('Bellandi A.', 'ITA', 'W −78'), ('Heydarov H.', 'AZE', 'M −73'), ('Dicko R.', 'FRA', 'W +78'),
        ('Nagase T.', 'JPN', 'M −81'), ('Matic B.', 'CRO', 'W −70'), ('Trippel E.', 'GER', 'M −90'), ('Huh M.', 'KOR', 'W −57'),
        ('Sulamanidze V.', 'GEO', 'M −100'), ('Babulfath T.', 'SWE', 'W −48'), ('Gauthier-Drapeau F.', 'CAN', 'M −81'),
        ('Giuffrida O.', 'ITA', 'W −52'), ('Yusupov D.', 'UZB', 'M −100'), ('Wagner A.', 'GER', 'W −78'),
        ('Maruyama J.', 'JPN', 'M −66'), ('Boukli S.', 'FRA', 'W −48'), ('Kim M.', 'KOR', 'M +100'), ('Cysique S.', 'FRA', 'W −57'),
        ('Murao S.', 'JPN', 'M −90'), ('Leski A.', 'SLO', 'W −63'), ('Tsend-Ochir T.', 'MGL', 'M −73'), ('Butkereit M.', 'GER', 'W −70')]
MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

def rows():
    out = [dict(a=n, n=c, w=w, v=v, d=d) for n, c, w, v, d in PEAK[:5]]
    v = out[-1]['v']
    for i, (n, c, w) in enumerate(MORE):
        v -= 3 + (i * 7) % 5
        out.append(dict(a=n, n=c, w=w, v=v, d=f'{MONTHS[(i * 5) % 12]} {2014 + (i * 3) % 12}'))
    return out


def page():
    weights = ['M −60', 'M −66', 'M −73', 'M −81', 'M −90', 'M −100', 'M +100', 'W −48', 'W −52', 'W −57', 'W −63', 'W −70', 'W −78', 'W +78']
    bar = chrome.toolbar('f-q', 'Search athlete', [
        chrome.select('f-g', [('', 'Men and women'), ('M', 'Men'), ('W', 'Women')]),
        chrome.select('f-w', [('', 'All weights')] + [(w, w.replace('M ', 'Men ').replace('W ', 'Women ') + ' kg') for w in weights]),
        chrome.select('f-s', chrome.sort_options([('peak', 'peak', 'desc'), ('date', 'date', 'desc')])),
    ])
    table = (f'<table class="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum"><thead><tr class="{THEAD_TR}">'
             f'<th class="{TH} text-right w-10 sm:w-12">#</th><th class="{TH} text-left">Athlete</th>'
             f'<th class="{TH} text-left w-24 hidden sm:table-cell">Nat</th><th class="{TH} text-left w-20 sm:w-32">Weight</th>'
             f'<th class="{TH} text-right w-16 sm:w-24">Peak</th><th class="{TH} text-right w-24 hidden sm:table-cell">Date</th>'
             '<th class="w-6 h-9 py-0 pl-1 pr-0"></th></tr></thead><tbody id="r-body"></tbody></table>'
             '<p id="r-empty" class="hidden py-6 text-[14px] text-[#66605C]">No athletes match these filters.</p>')
    chev = '<td class="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-[#66605C]"><span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td>'
    script = f'''<script>
var D={json.dumps(rows(), ensure_ascii=False)}, FLAGS={json.dumps(chrome.FLAG_SVG, ensure_ascii=False)}, M={json.dumps(MONTHS)};
var $=function(id){{return document.getElementById(id);}}, TD='{TD}';
function fl(c){{return '<svg class="w-4 h-3 shrink-0" viewBox="0 0 16 12">'+FLAGS[c]+'</svg>';}}
function dkey(d){{var p=d.split(' ');return +p[1]*12+M.indexOf(p[0]);}}
function draw(){{
  var q=$('f-q').value.trim().toLowerCase(), g=$('f-g').value, w=$('f-w').value, s=$('f-s').value;
  var rows=D.filter(function(x){{return (!q||x.a.toLowerCase().indexOf(q)>=0)&&(!g||x.w[0]===g)&&(!w||x.w===w);}});
  var dir=/-asc$/.test(s)?1:-1;
  rows.sort(function(x,y){{return dir*(/^date/.test(s)?dkey(x.d)-dkey(y.d):x.v-y.v);}});
  // rank = place by peak among the filtered athletes, whatever the sort
  var byPeak=rows.slice().sort(function(x,y){{return y.v-x.v;}});
  $('r-body').innerHTML=rows.slice(0,20).map(function(x){{
    return '<tr class="border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40 cursor-pointer" onclick="location.href=\\'athlete.html\\'">'+
      '<td class="'+TD+' text-right text-[#66605C]">'+(byPeak.indexOf(x)+1)+'</td>'+
      '<td class="'+TD+'"><div class="flex items-center gap-1.5 min-w-0"><span class="sm:hidden flex">'+fl(x.n)+'</span><span class="font-medium truncate">'+x.a+'</span></div></td>'+
      '<td class="'+TD+' hidden sm:table-cell"><div class="flex items-center gap-1.5">'+fl(x.n)+'<span class="text-[13px]">'+x.n+'</span></div></td>'+
      '<td class="'+TD+' text-[#66605C] whitespace-nowrap"><span class="sm:hidden">'+x.w.slice(2)+'</span><span class="hidden sm:inline">'+(x.w[0]==='M'?'Men ':'Women ')+x.w.slice(2)+'</span></td>'+
      '<td class="'+TD+' text-right font-bold">'+x.v+'</td>'+
      '<td class="'+TD+' text-right text-[#66605C] whitespace-nowrap hidden sm:table-cell">'+x.d+'</td>{chev}</tr>';
  }}).join('');
  $('r-empty').classList.toggle('hidden',rows.length>0);
  $('r-count').textContent=rows.length?'1–'+Math.min(20,rows.length)+' of '+rows.length+' athletes':'0 athletes';
}}
['f-q','f-g','f-w','f-s'].forEach(function(id){{$(id).addEventListener(id==='f-q'?'input':'change',draw);}});
draw();
</script>'''
    pag = pagination('<span id="r-count"></span>', active='20', pages=('1', '2')).replace('<span class="tnum"><span id="r-count"></span></span>', '<span class="tnum" id="r-count"></span>')
    top = ('<nav class="flex flex-wrap items-center gap-1.5 text-[12px] text-[#66605C]" aria-label="Breadcrumb">'
           '<a href="/records" class="hover:text-[#33302E]">Records</a><span class="text-[#D6CFC2]">›</span>'
           '<a href="/records#ratings" class="hover:text-[#33302E]">Ratings</a><span class="text-[#D6CFC2]">›</span>'
           '<span class="text-[#33302E]">Highest rating</span></nav>'
           '<h1 class="serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">Highest rating</h1>'
           '<p class="mt-1.5 text-[14px] text-[#66605C] max-w-3xl">The highest rating each athlete ever reached, one row per athlete. '
           '<a href="/methodology" class="serif font-semibold text-[#990F3D] hover:underline whitespace-nowrap">How ratings work</a></p>')
    return (head('Highest rating — Records', 'The highest rating each judoka ever reached.') + header('Records')
            + top + '<section>' + bar + table + pag + '</section>' + footer().replace('</body>', script + '</body>'))


if __name__ == '__main__':
    out = os.path.join(HERE, '..', '_stitch', 'record.html')
    open(out, 'w', encoding='utf-8').write(page())
    print('written', os.path.normpath(out))
