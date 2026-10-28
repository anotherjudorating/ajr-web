#!/usr/bin/env python3
"""Explore › Contests: every contest, filtered by tournament, weight, round, chance, athlete -> ../_stitch/contests.html

Filters can be preset from the URL hash, e.g. contests.html#t=adgs&c=30&s=chance (tournament page "All 38 upsets").
"""
import json
import os

import chrome
from chrome import CONTEST_HEAD, TD, TH, THEAD_TR, footer, head, header, pagination
from weight_contests import EXTRA_FLAGS

HERE = os.path.dirname(os.path.abspath(__file__))
chrome.FLAG_SVG.update(EXTRA_FLAGS)
chrome.FLAG_SVG.update({
    'POR': '<rect width="16" height="12" fill="#FF0000"/><rect width="6.4" height="12" fill="#006600"/>',
    'HUN': '<rect width="16" height="4" fill="#CD2A3E"/><rect y="4" width="16" height="4" fill="#FFF"/><rect y="8" width="16" height="4" fill="#436F4D"/>',
    'SRB': '<rect width="16" height="4" fill="#C6363C"/><rect y="4" width="16" height="4" fill="#0C4076"/><rect y="8" width="16" height="4" fill="#FFF"/>',
})

N = {  # athlete -> nation
    'Heydarov H.': 'AZE', 'Lombardo M.': 'ITA', 'Ishihara T.': 'JPN', 'Tsend-Ochir T.': 'MGL', 'Pelivan P.': 'MDA',
    'Shavdatuashvili L.': 'GEO', 'Stump N.': 'SUI', 'Cargnin D.': 'BRA', 'Hojazoda B.': 'TJK', 'Gaba J. B.': 'FRA',
    'Sanchez E.': 'ESP', 'Karapetian F.': 'ARM', 'Butbul T.': 'ISR', 'Case A.': 'GBR',
    'Nagayama R.': 'JPN', 'Sardalashvili G.': 'GEO', 'Yang Y.': 'TPE', 'Harim L.': 'ISR',
    'Abe H.': 'JPN', 'Vieru D.': 'MDA', 'Maruyama J.': 'JPN', 'Lima W.': 'BRA',
    'Gauthier-Drapeau F.': 'CAN', 'Grigalashvili T.': 'GEO', 'Lee J.': 'KOR', 'Nagase T.': 'JPN',
    'Bekauri L.': 'GEO', 'Mosakhlishvili T.': 'ESP', 'Murao S.': 'JPN', 'Trippel E.': 'GER',
    'Kotsoiev Z.': 'AZE', 'Sulamanidze V.': 'GEO', 'Paltchik P.': 'ISR', 'Rakhimov T.': 'TJK',
    'Riner T.': 'FRA', 'Kim M.': 'KOR', 'Saito T.': 'JPN', 'Bashaev T.': 'AIN',
    'Tsunoda N.': 'JPN', 'Babulfath T.': 'SWE', 'Boukli S.': 'FRA', 'Scutto A.': 'ITA',
    'Krasniqi D.': 'KOS', 'Giuffrida O.': 'ITA', 'Pimenta L.': 'BRA', 'Buchard A.': 'FRA',
    'Deguchi C.': 'CAN', 'Huh M.': 'KOR', 'Cysique S.': 'FRA', 'Klimkait J.': 'CAN',
    'Agbegnenou C.': 'FRA', 'Leski A.': 'SLO', 'Fazliu L.': 'KOS', 'Horikawa M.': 'JPN',
    'Matic B.': 'CRO', 'Butkereit M.': 'GER', 'van Dijke S.': 'NED', 'Niizoe S.': 'JPN',
    'Bellandi A.': 'ITA', 'Wagner A.': 'GER', 'Lanir I.': 'ISR', 'Malonga M.': 'FRA',
    'Dicko R.': 'FRA', 'Souza B.': 'BRA', 'Kim H.': 'KOR', 'Sone A.': 'JPN',
    'Gomboc A.': 'SLO', 'Hashimoto S.': 'JPN', 'Makhmadbekov M.': 'UAE',
}
TOURNAMENTS = [('adgs', 'Abu Dhabi GS', '24 Oct 2026'), ('zgp', 'Zagreb GP', '12 Jul 2026'), ('tgs', 'Tashkent GS', '3 Mar 2026'),
               ('pgs', 'Paris GS', '8 Feb 2026'), ('bgs', 'Baku GS', '9 Nov 2025')]
# host country + level, for the compact mobile label (flag + "GS")
TOUR_HOST = {'adgs': ('UAE', 'GS'), 'zgp': ('CRO', 'GP'), 'tgs': ('UZB', 'GS'), 'pgs': ('FRA', 'GS'), 'bgs': ('AZE', 'GS')}
ROUND_ORDER = ['Final', 'Bronze', 'SF', 'Rep.', 'QF', 'R16', 'R32']

# weight, round, winner, loser, winner's chance %, winner's rating change
C = [
    # Men −73 (same as weight page / contest / athlete)
    ('M −73', 'Final', 'Heydarov H.', 'Lombardo M.', 47, 9),
    ('M −73', 'Bronze', 'Ishihara T.', 'Pelivan P.', 76, 3), ('M −73', 'Bronze', 'Tsend-Ochir T.', 'Shavdatuashvili L.', 52, 5),
    ('M −73', 'SF', 'Heydarov H.', 'Tsend-Ochir T.', 58, 7), ('M −73', 'SF', 'Lombardo M.', 'Ishihara T.', 25, 11),
    ('M −73', 'QF', 'Heydarov H.', 'Shavdatuashvili L.', 61, 5), ('M −73', 'QF', 'Lombardo M.', 'Pelivan P.', 68, 4),
    ('M −73', 'R16', 'Heydarov H.', 'Hojazoda B.', 66, 5), ('M −73', 'R16', 'Lombardo M.', 'Gaba J. B.', 59, 6),
    ('M −73', 'R32', 'Heydarov H.', 'Case A.', 70, 4), ('M −73', 'R32', 'Lombardo M.', 'Butbul T.', 74, 3),
    # finals of the other weights
    ('M −60', 'Final', 'Nagayama R.', 'Sardalashvili G.', 63, 6), ('M −66', 'Final', 'Abe H.', 'Vieru D.', 81, 3),
    ('M −81', 'Final', 'Gauthier-Drapeau F.', 'Grigalashvili T.', 14, 28), ('M −90', 'Final', 'Bekauri L.', 'Mosakhlishvili T.', 72, 4),
    ('M −100', 'Final', 'Kotsoiev Z.', 'Sulamanidze V.', 58, 8), ('M +100', 'Final', 'Riner T.', 'Kim M.', 69, 5),
    ('W −48', 'Final', 'Tsunoda N.', 'Babulfath T.', 64, 5), ('W −52', 'Final', 'Krasniqi D.', 'Giuffrida O.', 55, 7),
    ('W −57', 'Final', 'Deguchi C.', 'Huh M.', 71, 4), ('W −63', 'Final', 'Agbegnenou C.', 'Leski A.', 57, 6),
    ('W −70', 'Final', 'Matic B.', 'Butkereit M.', 48, 9), ('W −78', 'Final', 'Bellandi A.', 'Wagner A.', 62, 5),
    ('W +78', 'Final', 'Dicko R.', 'Souza B.', 74, 3),
    # biggest upsets (tournament page)
    ('W −48', 'SF', 'Babulfath T.', 'Boukli S.', 20, 14), ('M −90', 'QF', 'Mosakhlishvili T.', 'Murao S.', 27, 12),
    ('W −63', 'R16', 'Fazliu L.', 'Horikawa M.', 29, 12),
    # other upsets and notable contests
    ('M −81', 'SF', 'Gauthier-Drapeau F.', 'Nagase T.', 31, 13), ('M −60', 'SF', 'Sardalashvili G.', 'Yang Y.', 38, 10),
    ('M −100', 'SF', 'Sulamanidze V.', 'Paltchik P.', 41, 9), ('W −70', 'SF', 'Butkereit M.', 'van Dijke S.', 44, 8),
    ('W −52', 'SF', 'Giuffrida O.', 'Pimenta L.', 46, 8), ('M +100', 'Bronze', 'Bashaev T.', 'Saito T.', 33, 11),
    ('W −78', 'Bronze', 'Malonga M.', 'Lanir I.', 66, 4), ('M −66', 'SF', 'Abe H.', 'Maruyama J.', 77, 3),
    ('W −57', 'SF', 'Deguchi C.', 'Cysique S.', 69, 4), ('M −90', 'SF', 'Bekauri L.', 'Trippel E.', 75, 3),
]

# earlier tournaments: Heydarov's contests, same as the Athlete screen
OTHER = [
    ('zgp', 'M −73', 'Final', 'Heydarov H.', 'Shavdatuashvili L.', 52, 7), ('zgp', 'M −73', 'SF', 'Heydarov H.', 'Lombardo M.', 52, 6),
    ('zgp', 'M −73', 'QF', 'Heydarov H.', 'Stump N.', 68, 5), ('zgp', 'M −73', 'R16', 'Heydarov H.', 'Case A.', 71, 4),
    ('zgp', 'M −73', 'R32', 'Heydarov H.', 'Butbul T.', 75, 2),
    ('tgs', 'M −73', 'Bronze', 'Tsend-Ochir T.', 'Heydarov H.', 43, 10), ('tgs', 'M −73', 'Rep.', 'Heydarov H.', 'Cargnin D.', 61, 5),
    ('tgs', 'M −73', 'QF', 'Lombardo M.', 'Heydarov H.', 51, 8), ('tgs', 'M −73', 'R16', 'Heydarov H.', 'Pelivan P.', 66, 4),
    ('tgs', 'M −73', 'R32', 'Heydarov H.', 'Hojazoda B.', 67, 3),
    ('pgs', 'M −73', 'R16', 'Gomboc A.', 'Heydarov H.', 14, 19), ('pgs', 'M −73', 'R32', 'Heydarov H.', 'Hashimoto S.', 41, 10),
    ('bgs', 'M −73', 'QF', 'Cargnin D.', 'Heydarov H.', 31, 13), ('bgs', 'M −73', 'R16', 'Heydarov H.', 'Lombardo M.', 51, 7),
    ('bgs', 'M −73', 'R32', 'Heydarov H.', 'Makhmadbekov M.', 64, 4),
]
ROWS = ([{'t': 'adgs', 'w': w, 'r': r, 'a': a, 'an': N[a], 'b': b, 'bn': N[b], 'ch': ch, 'd': d} for w, r, a, b, ch, d in C]
        + [{'t': t, 'w': w, 'r': r, 'a': a, 'an': N[a], 'b': b, 'bn': N[b], 'ch': ch, 'd': d} for t, w, r, a, b, ch, d in OTHER])
WEIGHTS = ['M −60', 'M −66', 'M −73', 'M −81', 'M −90', 'M −100', 'M +100', 'W −48', 'W −52', 'W −57', 'W −63', 'W −70', 'W −78', 'W +78']

SEL = 'h-8 px-2.5 bg-[#F3EEE3] border border-[#D6CFC2] text-[12px] text-[#33302E] focus:outline-none focus:border-[#33302E] cursor-pointer'


def toolbar():
    sel = chrome.select
    return chrome.toolbar('f-q', 'Search athlete', [
        sel('f-t', [('', 'All tournaments')] + [(k, f'{n} {d[-4:]}') for k, n, d in TOURNAMENTS]),
        sel('f-y', [('', 'All years'), ('2026', '2026'), ('2025', '2025')]),
        sel('f-w', [('', 'All weights')] + [(w, w.replace('M ', 'Men ').replace('W ', 'Women ') + ' kg') for w in WEIGHTS]),
        sel('f-res', [('', 'All contests'), ('w', 'Wins'), ('l', 'Losses'), ('uw', 'Upset wins'), ('ul', 'Upset losses')], 'Wins and losses of the searched athlete; upset = winner had under 30%'),
        sel('f-s', chrome.sort_options([('date', 'date', 'desc'), ('chance', 'chance', 'asc'), ('gain', 'rating change', 'desc')])),
    ], bp='xl')


def table():
    return (f'<table class="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum"><thead><tr class="{THEAD_TR}">'
            + CONTEST_HEAD.replace('<th class="' + TH + ' text-left">Athletes</th>', '<th class="' + TH + ' text-left">Athletes</th>'
                                   f'<th id="th-t" class="{TH} text-left w-36 hidden sm:table-cell">Tournament</th><th class="{TH} text-left w-16 hidden sm:table-cell">Weight</th><th class="{TH} text-left w-16 sm:w-20">Round</th>')
            + '</tr></thead><tbody id="c-body"></tbody></table>'
            '<p id="c-empty" class="hidden py-6 text-[14px] text-[#66605C]">No contests match these filters.</p>')


SCRIPT = '''<script>
var ROWS=__ROWS__, FLAGS=__FLAGS__, ORDER=__ORDER__, TOURS=__TOURS__, UPSET=30; // upset: winner had under 30%
var TD='__TD__';
function fl(c){return '<svg class="w-4 h-3 shrink-0" viewBox="0 0 16 12">'+FLAGS[c]+'</svg>';}
function who(n,c,cls){return '<div class="flex items-center gap-1.5 min-w-0">'+fl(c)+'<span class="'+cls+' truncate">'+n+'</span></div>';}
var $=function(id){return document.getElementById(id);};
function draw(){
  var q=$('f-q').value.trim().toLowerCase(), t=$('f-t').value, y=$('f-y').value, w=$('f-w').value, res=$('f-res').value, s=$('f-s').value;
  // result is seen from the searched athlete; without one, wins/losses = every contest, upset wins/losses = every upset
  var rows=ROWS.filter(function(x){
    if((t&&x.t!==t)||(y&&TOURS[x.t].d.slice(-4)!==y)||(w&&x.w!==w))return false;
    var inA=q&&x.a.toLowerCase().indexOf(q)>=0, inB=q&&x.b.toLowerCase().indexOf(q)>=0;
    if(q&&!inA&&!inB)return false;
    var won=q?inA:true, lost=q?inB:true, up=x.ch<UPSET;
    return !res||(res==='w'&&won)||(res==='l'&&lost)||(res==='uw'&&won&&up)||(res==='ul'&&lost&&up);});
  var key=s.split('-')[0], dir=/-asc$/.test(s)?1:-1;
  // ascending comparators; desc flips them (date: TOURS index 0 is the newest, so it is inverted)
  var cmp=key==='chance'?function(a,b){return a.ch-b.ch;}:key==='gain'?function(a,b){return a.d-b.d;}:function(a,b){return (TOURS[b.t].i-TOURS[a.t].i)||(ORDER.indexOf(b.r)-ORDER.indexOf(a.r))||a.w.localeCompare(b.w);};
  rows.sort(function(a,b){return dir*cmp(a,b);});
  $('c-body').innerHTML=rows.map(function(x,i){
    var wf=i%2===1, up=x.ch<UPSET, td='px-2 sm:px-3 py-2 align-middle';
    var L=[[wf?x.a:x.b, wf?x.an:x.bn, wf?x.ch:100-x.ch, wf,'bg-[#F3EEE3]'],[wf?x.b:x.a, wf?x.bn:x.an, wf?100-x.ch:x.ch, !wf,'bg-[#0F5499]']];
    var names='',chs='',rs='',ds='',chips='';
    L.forEach(function(l){var won=l[3];
      names+='<div class="h-6 flex items-center gap-1.5 min-w-0"><span class="hidden sm:inline-block w-[6px] h-4 shrink-0 '+l[4]+' border border-[#33302E]"></span>'+fl(l[1])+'<span class="truncate '+(won?'font-semibold text-[#33302E]':'text-[#66605C]')+'">'+l[0]+'</span></div>';
      // mobile: upset = winner's chance green, loser's red; otherwise plain. Desktop: grey + UPSET chip
      var mob=up?(won?'text-[#0D7680] font-semibold':'text-[#CC0000] font-semibold'):'text-[#33302E]';

      chs+='<div class="h-6 flex items-center justify-end"><span class="'+mob+(up?'':' sm:text-[#66605C]')+'">'+l[2]+'%</span></div>';
      rs+=won?'<div class="h-6 flex items-center justify-center font-bold text-[#0D7680]">W</div>':'<div class="h-6 flex items-center justify-center font-bold text-[#CC0000]">L</div>';
      ds+=won?'<div class="h-6 flex items-center justify-end font-bold text-[#0D7680]">+'+x.d+'</div>':'<div class="h-6 flex items-center justify-end font-semibold text-[#CC0000]">−'+x.d+'</div>';});
    return '<tr class="border-b border-[#D6CFC2] hover:bg-[#E9E2D3]/40 cursor-pointer" onclick="location.href=\\'contest.html\\'">'+
      '<td class="'+td+'">'+names+'</td>'+
      (t?'':'<td class="'+td+' hidden sm:table-cell whitespace-nowrap"><div class="h-6 flex items-center text-[#33302E]">'+TOURS[x.t].n+'</div><div class="h-6 flex items-center text-[12px] text-[#66605C]">'+TOURS[x.t].d+'</div></td>')+
      '<td class="'+td+' hidden sm:table-cell whitespace-nowrap text-[#66605C]">'+x.w.slice(2)+'</td>'+
      '<td class="'+td+' text-[#66605C]">'+(t?x.r:'<div class="sm:hidden h-6 flex items-center gap-1.5 text-[12px] whitespace-nowrap" title="'+TOURS[x.t].n+'">'+fl(TOURS[x.t].c)+TOURS[x.t].lv+'</div><div class="h-6 flex items-center">'+x.r+'</div>')+'</td><td class="'+td+' hidden sm:table-cell text-right">'+(up?'<span class="text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-[#0D7680] text-[#0D7680]">Upset</span>':'')+'</td><td class="'+td+' whitespace-nowrap">'+chs+'</td><td class="'+td+'">'+rs+'</td><td class="'+td+'">'+ds+'</td>'+
      '<td class="w-6 py-2 align-middle pl-1 pr-0 text-right text-[#66605C]"><span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td></tr>';
  }).join('');
  $('th-t').classList.toggle('sm:table-cell',!t);
  $('c-empty').classList.toggle('hidden',rows.length>0);
  $('c-count').textContent=rows.length?('1–'+rows.length+' of '+rows.length+' contests'):'0 contests';
}
['f-q','f-t','f-y','f-w','f-res','f-s'].forEach(function(id){$(id).addEventListener(id==='f-q'?'input':'change',draw);});
(function(){ // presets from the hash: #t=adgs&w=M −73&r=Final&c=30&s=chance&q=heydarov
  location.hash.slice(1).split('&').forEach(function(kv){var p=kv.split('='),el=$('f-'+p[0]);if(el&&p[1]!==undefined){var v=decodeURIComponent(p[1]);
    if(p[0]==='s'&&v.indexOf('-')<0)v+=(v==='chance'?'-asc':'-desc');el.value=v;}});
  draw();})();
</script>'''


def page():
    top = f'''{chrome.explore_tabs('Contests')}
<h1 class="serif mt-6 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">Contests</h1>
<p class="mt-1.5 text-[14px] text-[#66605C]">Every rated contest with win chances and rating changes.</p>
<section>'''
    pag = pagination('<span id="c-count"></span>', active='50', pages=('1', '2', '…', '12')).replace('<span class="tnum"><span id="c-count"></span></span>', '<span class="tnum" id="c-count"></span>')
    script = (SCRIPT.replace('__ROWS__', json.dumps(ROWS, ensure_ascii=False)).replace('__FLAGS__', json.dumps(chrome.FLAG_SVG, ensure_ascii=False))
              .replace('__ORDER__', json.dumps(ROUND_ORDER)).replace('__TD__', TD)
              .replace('__TOURS__', json.dumps({k: {'n': n, 'd': d, 'i': i, 'c': TOUR_HOST[k][0], 'lv': TOUR_HOST[k][1]} for i, (k, n, d) in enumerate(TOURNAMENTS)})))
    return (head('Contests', 'Every rated judo contest: win chances, upsets and rating changes.')
            + header('Explore') + top + toolbar() + table() + pag + '</section>'
            + footer().replace('</body>', script + '</body>'))


if __name__ == '__main__':
    out = os.path.join(HERE, '..', '_stitch', 'contests.html')
    open(out, 'w', encoding='utf-8').write(page())
    print('written', os.path.normpath(out), len(ROWS), 'contests')
