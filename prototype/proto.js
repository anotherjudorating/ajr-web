// Prototype router: wires the static Stitch screens together.
// Real hrefs ("/rankings", "/tournaments/...") are mapped to local files,
// and clickable rows without a target get one based on their section heading.
(function () {
  var PAGE = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';

  function mapPath(href) {
    if (!href || href.charAt(0) !== '/') return null;
    var hi = href.indexOf('#');  // keep the hash: "/records#medals" -> "records.html#medals"
    if (hi > 0) { var m = mapPath(href.slice(0, hi)); return m ? m + href.slice(hi) : null; }
    var p = href.split('?')[0].replace(/\/+$/, '');
    if (p === '') return 'index.html';
    if (p === '/rankings') return 'rankings.html';
    if (p === '/tournaments') return 'tournaments.html';
    // upcoming tournaments: Tokyo has its draw, the later ones do not yet
    if (/^\/tournaments\/tokyo-2026\/(men|women)-/.test(p)) return 'upcoming_weight.html';
    if (/^\/tournaments\/tokyo-2026/.test(p)) return 'upcoming.html';
    if (/^\/tournaments\/(odivelas|paris)-2027/.test(p)) return 'upcoming.html#nodraw';
    if (/^\/tournaments\/[^/]+\/contests/.test(p)) return 'contests.html';
    if (/^\/tournaments\/[^/]+\/(men|women)-/.test(p)) return 'weight.html';
    if (/^\/tournaments\//.test(p)) return 'tournament.html';
    if (/^\/(head-to-head|h2h)/.test(p)) return 'h2h.html';
    if (/^\/contest/.test(p)) return 'contest.html';
    if (/^\/athletes?\//.test(p)) return 'athlete.html';
    if (p === '/search') return 'athletes.html';
    if (/^\/countries\//.test(p)) return 'country.html';
    if (p === '/records') return 'records.html';
    if (/^\/records\//.test(p)) return 'record.html';
    return '404.html'; // methodology and everything not built yet
  }

  var NAV = {
    'rankings': 'rankings.html',
    'tournaments': 'tournaments.html',
    'explore': 'tournaments.html',
    'head-to-head': 'h2h.html',
    'methodology': '404.html',
    'records': 'records.html',
    'ajr': 'index.html',
    'another judo rating': 'index.html',
    'full men\'s ranking': 'rankings.html',
    'full women\'s ranking': 'rankings.html',
    'all tournaments': 'tournaments.html',
    'all results': 'weight.html',
    'head-to-head ': 'h2h.html'
  };

  // section heading -> target for rows inside it, per page
  var SECTIONS = {
    index: [[/^(men|women|biggest movers)/i, 'athlete.html'], [/upsets/i, 'contest.html'], [/upcoming/i, 'upcoming.html']],
    rankings: [],
    athlete: [[/contests|best wins|toughest losses/i, 'contest.html'], [/frequent opponents/i, 'h2h.html#Heydarov H.|Lombardo M.'], [/next tournaments/i, 'upcoming.html']],
    tournaments: [[/.*/, 'tournament.html']],
    contest: [[/road to the final|leads|level|first meeting/i, 'contest.html']],
    tournament: [[/.*/, 'weight.html']],
    weight: [[/results/i, 'athlete.html'], [/contests|final|semi|quarter|repechage|bronze/i, 'contest.html']],
    search: [[/tournaments/i, 'tournament.html'], [/.*/, 'athlete.html']],
    h2h: [[/leads|level|meetings/i, 'contest.html']]
  };

  function headingFor(el) {
    var n = el;
    while (n && n !== document.body) {
      var prev = n.previousElementSibling;
      while (prev) {
        var h = prev.matches && prev.matches('h2') ? prev : prev.querySelector && prev.querySelector('h2');
        if (h) return h.textContent.trim();
        prev = prev.previousElementSibling;
      }
      n = n.parentElement;
      if (n && n.querySelector) {
        var own = n.querySelector(':scope > h2, :scope > div > h2');
        if (own && own.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) return own.textContent.trim();
      }
    }
    return '';
  }

  function sectionTarget(el) {
    var rules = SECTIONS[PAGE] || [];
    var h = headingFor(el);
    for (var i = 0; i < rules.length; i++) if (rules[i][0].test(h)) return rules[i][1];
    return null;
  }

  window.__protoTarget = sectionTarget;

  // 0. main nav: "Tournaments" section is now "Explore"
  document.querySelectorAll('a').forEach(function (a) {
    if (a.textContent.trim() !== 'Tournaments') return;
    var box = a.parentElement;
    if (box && /Head-to-head/.test(box.textContent) && /Rankings/.test(box.textContent)) a.textContent = 'Explore';
  });
  // main nav: "Methodology" tab is now "Records" (Methodology lives in the footer and "How it works" links)
  document.querySelectorAll('a').forEach(function (a) {
    if (a.textContent.trim() !== 'Methodology') return;
    var box = a.parentElement;
    if (!box || !/Head-to-head/.test(box.textContent) || !/Rankings/.test(box.textContent)) return;
    a.textContent = 'Records'; a.setAttribute('href', '/records');
    if (a.dataset.path) a.dataset.path = 'records';
  });

  // 0b. mobile: the section row under the fixed header (Rankings / Explore / ...) is fixed too
  document.querySelectorAll('nav, div').forEach(function (el) {
    if (!el.classList.contains('md:hidden') || el.closest('header')) return;
    var links = Array.prototype.map.call(el.querySelectorAll(':scope > a'), function (a) { return a.textContent.trim(); });
    if (links.indexOf('Rankings') < 0 || links.indexOf('Head-to-head') < 0) return;
    // fixed (not sticky): a sticky row would leave together with its container at the end of the page
    var spacer = document.createElement('div');
    spacer.className = 'md:hidden';
    spacer.style.height = '36px';
    el.parentNode.insertBefore(spacer, el);
    el.style.position = 'fixed'; el.style.top = '48px'; el.style.left = '0'; el.style.right = '0';
    el.style.width = 'auto'; el.style.margin = '0'; el.style.zIndex = '40'; el.style.background = '#F3EEE3';
    // 36px row, content pulled up towards the logo (gap ≈ 16px instead of 20)
    el.style.height = '36px'; el.style.paddingBottom = '0'; el.style.boxSizing = 'border-box'; el.style.alignItems = 'stretch';
    // tabs left-aligned with a fixed gap (spread across the full width they looked scattered)
    el.style.justifyContent = 'flex-start'; el.style.columnGap = '24px';
    // one active style everywhere: claret text + 2px claret underline (some pages only coloured the text)
    var SECTION = { rankings: 'Rankings', athlete: 'Rankings', h2h: 'Head-to-head', tournaments: 'Explore', tournament: 'Explore',
      weight: 'Explore', contests: 'Explore', contest: 'Explore', athletes: 'Explore', nations: 'Explore', upcoming: 'Explore', upcoming_weight: 'Explore', records: 'Records', record: 'Records', search: '' };
    el.querySelectorAll(':scope > a').forEach(function (a) {
      var t = a.textContent.trim(), on = t === SECTION[PAGE] || (t === 'Tournaments' && SECTION[PAGE] === 'Explore');
      a.style.color = on ? '#990F3D' : '#66605C';
      a.style.borderBottom = '2px solid ' + (on ? '#990F3D' : 'transparent');
      // the link fills the row so the underline sits on the row's bottom rule; text stays pulled up towards the logo
      a.style.display = 'inline-flex'; a.style.alignItems = 'flex-start'; a.style.height = 'auto';
      a.style.paddingTop = '5px'; a.style.paddingBottom = '0'; a.style.marginBottom = '-1px';
    });
    // header and section row read as one bar on mobile: no rule between them
    document.querySelectorAll('header, body > div, body div.fixed').forEach(function (h) {
      if (/Another Judo Rating|AJR/.test(h.textContent) && getComputedStyle(h).position === 'fixed') h.classList.add('max-md:border-b-0');
      h.querySelectorAll('[class*="border-b"]').forEach(function (c) { if (/Another Judo Rating/.test(c.textContent) && c.offsetHeight <= 49) c.classList.add('max-md:border-b-0'); });
    });
  });

  // 1. rewrite real paths and nav links
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    var mapped = mapPath(href);
    if (mapped) { a.setAttribute('href', mapped); return; }
    if (href === '#' || href === '') {
      var t = a.textContent.trim().toLowerCase();
      if (NAV[t]) { a.setAttribute('href', NAV[t]); return; }
      if (a.classList.contains('athlete-link')) { a.setAttribute('href', 'athlete.html'); return; }
      var s = sectionTarget(a);
      if (s) a.setAttribute('href', s);
    }
  });

  // 1b. inline onclick="location.href='/...'" -> local file
  document.querySelectorAll('[onclick*="location.href"]').forEach(function (el) {
    var oc = el.getAttribute('onclick');
    el.setAttribute('onclick', oc.replace(/location\.href='(\/[^']*)'/, function (m, p) { return "location.href='" + mapPath(p) + "'"; }));
  });

  // 2. clickable rows without their own link
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    if (e.target.closest('a[href]:not([href="#"]), button, input, select, label')) return;
    var row = e.target.closest('tr.cursor-pointer, div.cursor-pointer, li.cursor-pointer');
    if (!row) return;
    // rows that expand in place (rankings, month groups, weight results) keep their behaviour
    var oc = row.getAttribute('onclick') || '';
    if (row.hasAttribute('aria-expanded') || row.hasAttribute('data-month-toggle') || (oc && oc.indexOf('location') < 0)) return;
    if (/location\.href='[^#]/.test(oc)) return; // row already navigates to a real page
    var target = sectionTarget(row);
    if (target) location.href = target;
  });

  // 3. header search: instant results (athletes, tournaments, nations, contests) under the box + "Search in Explore"
  document.querySelectorAll('input[placeholder="Filter athletes / country"], input[placeholder="Search athletes or tournaments"]').forEach(function (i) {
    if (i.closest('header') || i.id === 'm-input' || i.id === 'mobile-search-input') i.placeholder = 'Athletes, tournaments, nations';
  });
  (function () {
    var SF = {"UZB": "<rect width=\"16\" height=\"4\" fill=\"#0099B5\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#FFF\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#1EB53A\"/>", "JPN": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><circle cx=\"8\" cy=\"6\" r=\"3.6\" fill=\"#BC002D\"/>", "AZE": "<rect width=\"16\" height=\"4\" fill=\"#00B5E2\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#EF3340\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#509E2F\"/>", "ITA": "<rect width=\"5.33\" height=\"12\" fill=\"#009246\"/><rect x=\"5.33\" width=\"5.34\" height=\"12\" fill=\"#FFF\"/><rect x=\"10.67\" width=\"5.33\" height=\"12\" fill=\"#CE2B37\"/>", "FRA": "<rect width=\"5.33\" height=\"12\" fill=\"#002654\"/><rect x=\"5.33\" width=\"5.34\" height=\"12\" fill=\"#FFF\"/><rect x=\"10.67\" width=\"5.33\" height=\"12\" fill=\"#CE1126\"/>", "GEO": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><rect x=\"7\" width=\"2\" height=\"12\" fill=\"#F00\"/><rect y=\"5\" width=\"16\" height=\"2\" fill=\"#F00\"/>", "MGL": "<rect width=\"16\" height=\"12\" fill=\"#015197\"/><rect width=\"5.33\" height=\"12\" fill=\"#C4272F\"/><rect x=\"10.67\" width=\"5.33\" height=\"12\" fill=\"#C4272F\"/>", "UAE": "<rect width=\"16\" height=\"4\" fill=\"#00732F\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#FFF\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#000\"/><rect width=\"4\" height=\"12\" fill=\"#FF0000\"/>", "CAN": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><rect width=\"4\" height=\"12\" fill=\"#D80621\"/><rect x=\"12\" width=\"4\" height=\"12\" fill=\"#D80621\"/><circle cx=\"8\" cy=\"6\" r=\"2\" fill=\"#D80621\"/>", "KOS": "<rect width=\"16\" height=\"12\" fill=\"#244AA5\"/><path d=\"M5 5h6l-1 3H6z\" fill=\"#D0A650\"/>", "KOR": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><circle cx=\"8\" cy=\"6\" r=\"2.6\" fill=\"#CD2E3A\"/><path d=\"M5.4 6a2.6 2.6 0 0 0 5.2 0z\" fill=\"#0047A0\"/>", "BRA": "<rect width=\"16\" height=\"12\" fill=\"#009C3B\"/><path d=\"M8 1.5 14.5 6 8 10.5 1.5 6z\" fill=\"#FFDF00\"/><circle cx=\"8\" cy=\"6\" r=\"2.4\" fill=\"#002776\"/>", "GER": "<rect width=\"16\" height=\"4\" fill=\"#000\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#DD0000\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#FFCE00\"/>", "ESP": "<rect width=\"16\" height=\"12\" fill=\"#AA151B\"/><rect y=\"3\" width=\"16\" height=\"6\" fill=\"#F1BF00\"/>", "CRO": "<rect width=\"16\" height=\"4\" fill=\"#F00\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#FFF\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#171796\"/>", "SWE": "<rect width=\"16\" height=\"12\" fill=\"#006AA7\"/><rect x=\"5\" width=\"2\" height=\"12\" fill=\"#FECC00\"/><rect y=\"5\" width=\"16\" height=\"2\" fill=\"#FECC00\"/>", "TJK": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><rect width=\"16\" height=\"3.4\" fill=\"#CC0000\"/><rect y=\"8.6\" width=\"16\" height=\"3.4\" fill=\"#006600\"/>", "MDA": "<rect width=\"5.33\" height=\"12\" fill=\"#0046AE\"/><rect x=\"5.33\" width=\"5.34\" height=\"12\" fill=\"#FFD200\"/><rect x=\"10.67\" width=\"5.33\" height=\"12\" fill=\"#CC092F\"/>", "ISR": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><rect y=\"1.5\" width=\"16\" height=\"1.6\" fill=\"#0038B8\"/><rect y=\"8.9\" width=\"16\" height=\"1.6\" fill=\"#0038B8\"/>"};
    var fl = function (c) { return SF[c] ? '<svg class="w-4 h-3 shrink-0" viewBox="0 0 16 12">' + SF[c] + '</svg>' : ''; };
    var IDX = {
      athletes: [['Heydarov H.','AZE','Men −73 kg'],['Lombardo M.','ITA','Men −73 kg'],['Ishihara T.','JPN','Men −73 kg'],['Hashimoto S.','JPN','Men −73 kg'],
        ['Abe H.','JPN','Men −66 kg'],['Abe U.','JPN','Women −52 kg'],['Agbegnenou C.','FRA','Women −63 kg'],['Bekauri L.','GEO','Men −90 kg'],
        ['Grigalashvili T.','GEO','Men −81 kg'],['Tsend-Ochir T.','MGL','Men −73 kg'],['Krasniqi D.','KOS','Women −52 kg'],['Deguchi C.','CAN','Women −57 kg'],
        ['Tsunoda N.','JPN','Women −48 kg'],['Riner T.','FRA','Men +100 kg'],['Nagase T.','JPN','Men −81 kg'],['Kotsoiev Z.','AZE','Men −100 kg']],
      tournaments: [['Abu Dhabi Grand Slam 2026','UAE','24–26 Oct 2026'],['Baku World Championships 2026','AZE','4–10 Oct 2026'],['Tashkent Grand Slam 2026','UZB','3–5 Mar 2026'],
        ['Paris Grand Slam 2026','FRA','7–8 Feb 2026'],['Tokyo Grand Slam 2026','JPN','7–8 Dec 2026'],['Zagreb Grand Prix 2026','CRO','12–14 Jul 2026']],
      nations: [['JPN','Japan'],['AZE','Azerbaijan'],['ITA','Italy'],['FRA','France'],['GEO','Georgia'],['MGL','Mongolia'],['KOR','South Korea'],['BRA','Brazil'],['CAN','Canada'],['GER','Germany']],
      contests: [['Lombardo M.','ITA','Heydarov H.','AZE','Abu Dhabi GS 2026 · Final'],['Ishihara T.','JPN','Lombardo M.','ITA','Abu Dhabi GS 2026 · SF'],
        ['Heydarov H.','AZE','Tsend-Ochir T.','MGL','Abu Dhabi GS 2026 · SF'],['Gauthier-Drapeau F.','CAN','Grigalashvili T.','GEO','Abu Dhabi GS 2026 · Final'],
        ['Lombardo M.','ITA','Heydarov H.','AZE','Tashkent GS 2025 · QF']]
    };
    var norm = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
    var hit = function (q) { return function (s) { return norm(s).indexOf(q) >= 0; }; };
    var panel = document.createElement('div');
    panel.id = 'hs-panel';
    panel.style.cssText = 'position:fixed;z-index:60;display:none;background:#F3EEE3;border:1px solid #33302E;box-shadow:0 8px 24px rgba(51,48,46,.12);font-family:"IBM Plex Sans",sans-serif;max-height:70vh;overflow:auto';
    document.body.appendChild(panel);
    var cur = null;
    var head = function (t) { return '<div style="padding:8px 12px 2px" class="text-[10px] font-bold uppercase tracking-wider text-[#66605C]">' + t + '</div>'; };
    var item = function (href, left, right) {
      return '<a href="' + href + '" class="hs-item flex items-center justify-between gap-3 px-3 h-8 text-[13px] text-[#33302E] hover:bg-[#E9E2D3]">' +
        '<span class="flex items-center gap-1.5 min-w-0">' + left + '</span><span class="shrink-0 text-[12px] text-[#66605C]">' + right + '</span></a>';
    };
    var name = function (n, c) { return fl(c) + '<span class="truncate font-medium">' + n + '</span>'; };
    function render(raw) {
      var q = norm(raw.trim());
      if (!q) { panel.style.display = 'none'; return; }
      var h = hit(q), html = '', n = 0;
      var a = IDX.athletes.filter(function (r) { return h(r[0]); }).slice(0, 5);  // max 5 athletes, 3 tournaments, 3 nations; empty groups are not shown
      var t = IDX.tournaments.filter(function (r) { return h(r[0]); }).slice(0, 3);
      var na = IDX.nations.filter(function (r) { return h(r[1]) || h(r[0]); }).slice(0, 3);
      var c = [];  // contests are not searched: they are reached from the athlete, the tournament or Head-to-head
      if (a.length) { html += head('Athletes') + a.map(function (r) { return item('athlete.html', name(r[0], r[1]), r[2]); }).join(''); n += a.length; }
      if (t.length) { html += head('Tournaments') + t.map(function (r) { return item('tournament.html', name(r[0], r[1]), r[2]); }).join(''); n += t.length; }
      if (na.length) { html += head('Nations') + na.map(function (r) { return item('country.html', name(r[1], r[0]), r[0]); }).join(''); n += na.length; }
      if (c.length) { html += head('Contests') + c.map(function (r) {
        // two lines: the pair, then tournament · round
        return '<a href="contest.html" class="hs-item block px-3 py-1.5 text-[13px] text-[#33302E] hover:bg-[#E9E2D3]">' +
          '<span class="flex items-center gap-1.5 whitespace-nowrap">' + fl(r[1]) + '<span class="font-medium">' + r[0] + '</span><span class="text-[#66605C]">vs</span>' + fl(r[3]) + '<span class="font-medium">' + r[2] + '</span></span>' +
          '<span class="block text-[12px] text-[#66605C]">' + r[4] + '</span></a>'; }).join(''); n += c.length; }
      if (!n) html = '<div class="px-3 py-3 text-[13px] text-[#66605C]">No quick matches.</div>';
      html += '<a href="athletes.html#q=' + encodeURIComponent(raw.trim()) + '" class="flex items-center justify-between px-3 h-10 mt-1 border-t border-[#D6CFC2] text-[14px] font-semibold text-[#990F3D] hover:bg-[#E9E2D3]" style="font-family:\'Source Serif 4\',Georgia,serif">' +
        'Search in Explore<span class="material-symbols-outlined text-[18px]">arrow_forward</span></a>';
      panel.innerHTML = html;
      place();
      panel.style.display = 'block';
    }
    function place() {
      if (!cur) return;
      var r = cur.getBoundingClientRect();
      // tall enough to show every group without scrolling where the screen allows
      panel.style.maxHeight = Math.max(240, innerHeight - r.bottom - 16) + 'px';
      if (innerWidth < 768) { panel.style.left = '0'; panel.style.right = '0'; panel.style.width = 'auto'; panel.style.top = (r.bottom + 8) + 'px'; panel.style.borderLeft = panel.style.borderRight = '0'; }
      else { var w = Math.max(r.width, 360); panel.style.width = w + 'px'; panel.style.left = Math.min(r.left, innerWidth - w - 16) + 'px'; panel.style.right = 'auto'; panel.style.top = (r.bottom + 4) + 'px'; }
    }
    document.querySelectorAll('header input[type="text"], #m-input, #mobile-search-input').forEach(function (inp) {
      if (inp.closest('section, main form')) return;
      inp.setAttribute('autocomplete', 'off');
      inp.addEventListener('input', function () { cur = inp; render(inp.value); });
      inp.addEventListener('focus', function () { cur = inp; if (inp.value) render(inp.value); });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { panel.style.display = 'none'; inp.blur(); }
        if (e.key === 'Enter') { var f = panel.querySelector('.hs-item') || panel.querySelector('a'); if (f) location.href = f.getAttribute('href'); }
      });
    });
    document.addEventListener('mousedown', function (e) { if (!panel.contains(e.target) && e.target !== cur) panel.style.display = 'none'; });
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
  })();

  // 5. rankings: P4P view (the Stitch export has the table but no rows/switching)
  if (PAGE === 'rankings') {
    var P4P = {
      'p4p-men': [['Grigalashvili T.','GEO','−81 kg',52,'58%',2361],['Ishihara T.','JPN','−73 kg',47,'57%',2298],['Bekauri L.','GEO','−90 kg',41,'56%',2312],['Abe H.','JPN','−66 kg',38,'55%',2240],['Tasoev I.','RUS','+100 kg',33,'55%',2305],['Nagase T.','JPN','−81 kg',29,'54%',2318],['Yang Y.','TPE','−60 kg',26,'54%',2201],['Kotsoiev Z.','AZE','−100 kg',22,'53%',2287]],
      'p4p-women': [['Abe U.','JPN','−52 kg',61,'59%',2289],['Deguchi C.','CAN','−57 kg',44,'56%',2247],['Agbegnenou C.','FRA','−63 kg',40,'56%',2266],['Tsunoda N.','JPN','−48 kg',37,'55%',2219],['Malonga M.','FRA','−78 kg',31,'54%',2251],['Dicko R.','FRA','+78 kg',28,'54%',2238],['Takaichi M.','JPN','−63 kg',24,'53%',2230],['Perez Box A.','ESP','−70 kg',21,'53%',2196]]
    };
    var TD = 'px-2 py-2 sm:px-3 sm:py-2.5';
    var TH = 'px-2 py-2 sm:px-3 sm:py-2.5 font-label-caps text-[10px] sm:text-[11px] text-text-secondary uppercase tracking-wider font-semibold';
    var F = {
      GEO: '<rect width="16" height="12" fill="#FFF"/><rect x="7" width="2" height="12" fill="#F00"/><rect y="5" width="16" height="2" fill="#F00"/>',
      JPN: '<rect width="16" height="12" fill="#FFF"/><circle cx="8" cy="6" r="3.6" fill="#BC002D"/>',
      RUS: '<rect width="16" height="4" fill="#FFF"/><rect y="4" width="16" height="4" fill="#0039A6"/><rect y="8" width="16" height="4" fill="#D52B1E"/>',
      TPE: '<rect width="16" height="12" fill="#FE0000"/><rect width="8" height="6" fill="#000095"/><circle cx="4" cy="3" r="1.6" fill="#FFF"/>',
      AZE: '<rect width="16" height="4" fill="#00B5E2"/><rect y="4" width="16" height="4" fill="#EF3340"/><rect y="8" width="16" height="4" fill="#509E2F"/>',
      CAN: '<rect width="16" height="12" fill="#FFF"/><rect width="4" height="12" fill="#D80621"/><rect x="12" width="4" height="12" fill="#D80621"/><circle cx="8" cy="6" r="2" fill="#D80621"/>',
      FRA: '<rect width="5.33" height="12" fill="#002654"/><rect x="5.33" width="5.34" height="12" fill="#FFF"/><rect x="10.67" width="5.33" height="12" fill="#CE1126"/>',
      ESP: '<rect width="16" height="12" fill="#AA151B"/><rect y="3" width="16" height="6" fill="#F1BF00"/>',
      ITA: '<rect width="5.33" height="12" fill="#009246"/><rect x="5.33" width="5.34" height="12" fill="#FFF"/><rect x="10.67" width="5.33" height="12" fill="#CE2B37"/>',
      KOR: '<rect width="16" height="12" fill="#FFF"/><circle cx="8" cy="6" r="2.6" fill="#CD2E3A"/><path d="M5.4 6a2.6 2.6 0 0 0 5.2 0z" fill="#0047A0"/>',
      GER: '<rect width="16" height="4" fill="#000"/><rect y="4" width="16" height="4" fill="#DD0000"/><rect y="8" width="16" height="4" fill="#FFCE00"/>',
      BRA: '<rect width="16" height="12" fill="#009C3B"/><path d="M8 1.5 14.5 6 8 10.5 1.5 6z" fill="#FFDF00"/><circle cx="8" cy="6" r="2.4" fill="#002776"/>',
      ISR: '<rect width="16" height="12" fill="#FFF"/><rect y="1.5" width="16" height="1.6" fill="#0038B8"/><rect y="8.9" width="16" height="1.6" fill="#0038B8"/>',
      MGL: '<rect width="16" height="12" fill="#015197"/><rect width="5.33" height="12" fill="#C4272F"/><rect x="10.67" width="5.33" height="12" fill="#C4272F"/>',
      NED: '<rect width="16" height="4" fill="#AE1C28"/><rect y="4" width="16" height="4" fill="#FFF"/><rect y="8" width="16" height="4" fill="#21468B"/>',
      UZB: '<rect width="16" height="4" fill="#0099B5"/><rect y="4" width="16" height="4" fill="#FFF"/><rect y="8" width="16" height="4" fill="#1EB53A"/>',
      KOS: '<rect width="16" height="12" fill="#244AA5"/><path d="M5 5h6l-1 3H6z" fill="#D0A650"/>'
    };
    // nations: best rating per weight (men −60…+100, women −48…+78), 0 = no rated athlete
    var NATIONS = [
      ['JPN','Japan',[2228,2240,2298,2318,2266,2201,2215],[2219,2289,2210,2230,2190,2205,2236]],
      ['FRA','France',[2120,2135,2221,2190,2180,2160,2305],[2180,2170,2205,2266,2188,2251,2238]],
      ['GEO','Georgia',[2160,2190,2244,2361,2312,2248,2230],[0,2010,0,2040,0,0,2020]],
      ['AZE','Azerbaijan',[2150,2170,2275,2210,2190,2287,2120],[2040,2060,0,2050,0,2030,0]],
      ['ITA','Italy',[2100,2130,2284,2140,2120,2110,2090],[2150,2160,2140,2120,2130,2150,2080]],
      ['KOR','South Korea',[2180,2150,2160,2170,2150,2140,2190],[2110,2120,2150,2130,2100,2090,2160]],
      ['MGL','Mongolia',[2170,2180,2252,2150,2140,2120,2110],[2130,2120,2110,2100,2090,2060,2080]],
      ['UZB','Uzbekistan',[2190,2150,2140,2180,2170,2160,2150],[2020,2090,2030,2010,0,2020,2040]],
      ['GER','Germany',[2080,2090,2110,2130,2150,2120,2100],[2110,2120,2130,2140,2150,2160,2120]],
      ['BRA','Brazil',[2070,2110,2100,2120,2130,2140,2110],[2130,2120,2170,2140,2110,2150,2130]],
      ['CAN','Canada',[2040,2060,2080,2126,2050,2070,2060],[2060,2080,2247,2140,2090,2100,2070]],
      ['ISR','Israel',[2120,2080,2100,2110,2090,2150,2070],[2100,2090,2080,2110,2120,2060,0]],
      ['ESP','Spain',[2070,2090,2080,2100,2190,2070,2060],[2080,2090,2100,2110,2196,2090,2070]],
      ['NED','Netherlands',[2030,2050,2060,2090,2120,2110,2100],[2090,2080,2100,2110,2150,2140,2120]],
      ['KOS','Kosovo',[0,2010,2030,0,2040,0,0],[2120,2180,2050,2163,2060,0,0]]
    ];
    var EMPTY = 1900;
    var teamRows = function (key) {
      var pick = function (n) { return key === 'teams-men' ? n[2] : key === 'teams-women' ? n[3] : n[2].concat(n[3]); };
      // place of each nation's best athlete in every weight (among the nations in the mock)
      var places = NATIONS.map(function () { return []; });
      pick(NATIONS[0]).forEach(function (_, wi) {
        var col = NATIONS.map(function (n, ni) { return [pick(n)[wi] || 0, ni]; }).sort(function (a, b) { return b[0] - a[0]; });
        col.forEach(function (c, place) { if (c[0]) places[c[1]].push(place + 1); });
      });
      return NATIONS.map(function (n, ni) {
        var w = pick(n), sum = 0;
        w.forEach(function (v) { sum += v || EMPTY; });
        var top1 = places[ni].filter(function (p) { return p === 1; }).length, top8 = places[ni].filter(function (p) { return p <= 8; }).length;
        return [n[0], n[1], Math.round(sum / w.length), top1, top8];
      }).sort(function (a, b) { return b[2] - a[2]; });
    };
    var flag = function (c, cls) { return '<svg class="' + cls + ' w-4 h-3 shrink-0" viewBox="0 0 16 12">' + F[c] + '</svg>'; };
    var std = document.getElementById('standard-table-container'), p4p = document.getElementById('p4p-table-container'), body = document.getElementById('p4p-table-body');
    var showP4P = function (key) {
      var teams = /^teams-/.test(key), rows = teams ? teamRows(key) : P4P[key];
      var pag = document.getElementById('pagination-container');
      if (pag) {
        pag.classList.toggle('hidden', !!rows && !teams);
        var cnt = pag.querySelector('.font-body-sm');
        if (cnt) { if (!cnt.dataset.orig) cnt.dataset.orig = cnt.textContent; cnt.textContent = teams ? '1–15 of 64 nations' : cnt.dataset.orig; }
      }
      document.querySelectorAll('.weight-tab').forEach(function (t) {
        var on = rows ? t.dataset.weight === key : t.getAttribute('href') === location.hash;
        t.classList.toggle('font-bold', on); t.classList.toggle('text-text-primary', on); t.classList.toggle('border-b-2', on); t.classList.toggle('border-accent-claret', on); t.classList.toggle('text-text-secondary', !on);
      });
      if (!rows || !std || !p4p || !body) { if (std) std.classList.remove('hidden'); if (p4p) p4p.classList.add('hidden'); return; }
      if (teams) {
        p4p.querySelector('thead').innerHTML = '<tr class="bg-panel-secondary border-b border-hairline-rule">' +
          '<th class="w-9 sm:w-12 ' + TH + ' text-right">#</th><th class="' + TH + ' text-left">Nation</th>' +
          '<th class="hidden sm:table-cell sm:w-20 whitespace-nowrap ' + TH + ' text-right" title="Weights where the nation has the No. 1 athlete">Top 1</th>' +
          '<th class="w-12 sm:w-20 whitespace-nowrap ' + TH + ' text-right" title="Weights where the nation has an athlete in the top 8">Top 8</th>' +
          '<th class="w-24 sm:w-40 whitespace-nowrap ' + TH + ' text-right" title="Average rating of the best athlete in each weight. A weight with no rated athlete counts as ' + EMPTY + '."><span class="sm:hidden">Leaders avg</span><span class="hidden sm:inline">Leaders rating avg</span></th>' +
          '<th class="w-6 sm:w-8"></th></tr>';
        body.innerHTML = rows.map(function (r, i) {
          return '<tr class="border-b border-hairline-rule hover:bg-panel-secondary/60 cursor-pointer" onclick="location.href=\'country.html\'">' +
            '<td class="' + TD + ' text-right tabular-nums font-medium">' + (i + 1) + '</td>' +
            '<td class="' + TD + ' font-medium"><div class="flex items-center gap-1.5 min-w-0">' + flag(r[0], 'inline-block') + '<span class="truncate">' + r[1] + '</span></div></td>' +
            '<td class="hidden sm:table-cell ' + TD + ' text-right tabular-nums">' + r[3] + '</td>' +
            '<td class="' + TD + ' text-right tabular-nums">' + r[4] + '</td>' +
            '<td class="' + TD + ' text-right tabular-nums font-bold">' + r[2] + '</td>' +
            '<td class="pl-1 pr-2 sm:pr-3 py-2 text-right text-text-secondary"><span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td></tr>';
        }).join('');
        std.classList.add('hidden'); p4p.classList.remove('hidden');
        return;
      }
      p4p.querySelector('thead').innerHTML = '<tr class="bg-panel-secondary border-b border-hairline-rule">' +
        '<th class="w-9 sm:w-12 ' + TH + ' text-right">#</th><th class="' + TH + ' text-left">Athlete</th>' +
        '<th class="hidden sm:table-cell sm:w-28 ' + TH + ' text-left">Country</th><th class="hidden sm:table-cell sm:w-24 ' + TH + ' text-left">Weight</th>' +
        '<th class="w-14 sm:w-24 ' + TH + ' text-right" title="Points ahead of the average of #2–#4 in own weight">Lead</th>' +
        '<th class="w-14 sm:w-20 ' + TH + ' text-right">Rating</th><th class="hidden sm:table-cell w-8"></th></tr>';
      body.innerHTML = rows.map(function (r, i) {
        return '<tr class="border-b border-hairline-rule hover:bg-panel-secondary/60 cursor-pointer" onclick="location.href=\'athlete.html\'">' +
          '<td class="' + TD + ' text-right tabular-nums font-medium">' + (i + 1) + '</td>' +
          '<td class="' + TD + ' font-medium truncate">' + flag(r[1], 'sm:hidden inline-block mr-1.5 align-middle') + '<a class="hover:underline" href="athlete.html">' + r[0] + '</a></td>' +
          '<td class="hidden sm:table-cell ' + TD + ' text-[13px]"><span class="inline-flex items-center gap-1.5">' + flag(r[1], 'inline-block') + r[1] + '</span></td>' +
          '<td class="hidden sm:table-cell ' + TD + ' text-[13px] text-text-secondary">' + r[2] + '</td>' +
          '<td class="' + TD + ' text-right tabular-nums text-gain-teal font-medium">+' + r[3] + '</td>' +
          '<td class="' + TD + ' text-right tabular-nums font-bold">' + r[5] + '</td>' +
          '<td class="hidden sm:table-cell ' + TD + ' text-right text-text-secondary"><span class="material-symbols-outlined text-[18px] align-middle">chevron_right</span></td></tr>';
      }).join('');
      std.classList.add('hidden'); p4p.classList.remove('hidden');
    };
    var route = function () { showP4P(location.hash.slice(1)); };
    window.addEventListener('hashchange', route);
    document.querySelectorAll('.weight-tab').forEach(function (t) {
      t.addEventListener('click', function () { setTimeout(route, 0); });
    });
    if (location.hash) route();
  }

  // 6. home: Men / Women panels — 7 rows: "All weights" = leader of each weight, a weight = its top 7
  if (PAGE === 'index') {
    var LEAD = {
      men: [['Yang Y.','−60 kg','–',12,2201],['Abe H.','−66 kg','–',8,2240],['Ishihara T.','−73 kg','↑1',21,2298],['Grigalashvili T.','−81 kg','–',15,2361],['Bekauri L.','−90 kg','–',-6,2312],['Kotsoiev Z.','−100 kg','↑1',4,2287],['Tasoev I.','+100 kg','–',0,2305]],
      women: [['Tsunoda N.','−48 kg','–',9,2219],['Abe U.','−52 kg','–',5,2289],['Deguchi C.','−57 kg','–',-3,2247],['Agbegnenou C.','−63 kg','↑1',11,2266],['Perez Box A.','−70 kg','–',7,2196],['Malonga M.','−78 kg','–',-8,2251],['Dicko R.','+78 kg','–',2,2238]]
    };
    var TOP = {
      '−73 kg': [['Ishihara T.','↑1',21,2298],['Lombardo M.','↓1',-14,2284],['Heydarov H.','↑2',18,2275],['Tsend-Ochir T.','–',8,2252],['Shavdatuashvili L.','↓2',-19,2244],['Hashimoto S.','–',-3,2235],['Gaba J. B.','↑3',24,2221]]
    };
    var POOL = {
      men: ['Mollaei S.','Ungvari A.','Cargnin D.','Shmailov B.','Lkhagvasuren S.','Margvelashvili V.','Smetov Y.','Kuczera P.','Esposito A.','Gjakova A.','Ciric N.','Basile F.','Trippel E.','Turoboyev U.'],
      women: ['Bilodid D.','Krasniqi D.','Silva R.','Pareto P.','Giuffrida O.','Kelmendi M.','Beauchemin-Pinard C.','Cysique S.','Polling K.','Van Dijke S.','Bellandi A.','Wagner A.','Aguiar M.','Kalanina Y.']
    };
    var topFor = function (g, w, leader) {
      if (TOP[w]) return TOP[w];
      var base = leader[4], seed = w.length + base, out = [[leader[0], leader[2], leader[3], base]];
      for (var i = 1; i < 7; i++) {
        var n = POOL[g][(seed + i * 5) % POOL[g].length], d = ((seed * (i + 3)) % 31) - 15;
        out.push([n, d > 6 ? '↑' + (i % 3 + 1) : d < -6 ? '↓' + (i % 2 + 1) : '–', d, base - i * 12 - (seed % 9)]);
      }
      return out;
    };
    var HNAT = {"Yang Y.": "TPE", "Abe H.": "JPN", "Ishihara T.": "JPN", "Grigalashvili T.": "GEO", "Bekauri L.": "GEO", "Kotsoiev Z.": "AZE", "Tasoev I.": "RUS", "Tsunoda N.": "JPN", "Abe U.": "JPN", "Deguchi C.": "CAN", "Agbegnenou C.": "FRA", "Perez Box A.": "ESP", "Malonga M.": "FRA", "Dicko R.": "FRA", "Lombardo M.": "ITA", "Heydarov H.": "AZE", "Tsend-Ochir T.": "MGL", "Shavdatuashvili L.": "GEO", "Hashimoto S.": "JPN", "Gaba J. B.": "FRA", "Mollaei S.": "MGL", "Ungvari A.": "HUN", "Cargnin D.": "BRA", "Shmailov B.": "ISR", "Lkhagvasuren S.": "MGL", "Margvelashvili V.": "GEO", "Smetov Y.": "KAZ", "Kuczera P.": "POL", "Esposito A.": "ITA", "Gjakova A.": "KOS", "Ciric N.": "SRB", "Basile F.": "ITA", "Trippel E.": "GER", "Turoboyev U.": "UZB", "Bilodid D.": "UKR", "Krasniqi D.": "KOS", "Silva R.": "BRA", "Pareto P.": "ARG", "Giuffrida O.": "ITA", "Kelmendi M.": "KOS", "Beauchemin-Pinard C.": "CAN", "Cysique S.": "FRA", "Polling K.": "NED", "Van Dijke S.": "NED", "Bellandi A.": "ITA", "Wagner A.": "GER", "Aguiar M.": "BRA", "Kalanina Y.": "UKR"}, HFLAG = {"GER": "<rect width=\"16\" height=\"4\" fill=\"#000\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#DD0000\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#FFCE00\"/>", "ARG": "<rect width=\"16\" height=\"12\" fill=\"#74ACDF\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#FFF\"/>", "ESP": "<rect width=\"16\" height=\"12\" fill=\"#AA151B\"/><rect y=\"3\" width=\"16\" height=\"6\" fill=\"#F1BF00\"/>", "KAZ": "<rect width=\"16\" height=\"12\" fill=\"#00AFCA\"/><circle cx=\"8\" cy=\"6\" r=\"2\" fill=\"#FEC50C\"/>", "NED": "<rect width=\"16\" height=\"4\" fill=\"#AE1C28\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#FFF\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#21468B\"/>", "FRA": "<rect width=\"5.33\" height=\"12\" fill=\"#002654\"/><rect x=\"5.33\" width=\"5.34\" height=\"12\" fill=\"#FFF\"/><rect x=\"10.67\" width=\"5.33\" height=\"12\" fill=\"#CE1126\"/>", "BRA": "<rect width=\"16\" height=\"12\" fill=\"#009C3B\"/><path d=\"M8 1.5 14.5 6 8 10.5 1.5 6z\" fill=\"#FFDF00\"/><circle cx=\"8\" cy=\"6\" r=\"2.4\" fill=\"#002776\"/>", "SRB": "<rect width=\"16\" height=\"4\" fill=\"#C6363C\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#0C4076\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#FFF\"/>", "UZB": "<rect width=\"16\" height=\"4\" fill=\"#0099B5\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#FFF\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#1EB53A\"/>", "JPN": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><circle cx=\"8\" cy=\"6\" r=\"3.6\" fill=\"#BC002D\"/>", "CAN": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><rect width=\"4\" height=\"12\" fill=\"#D80621\"/><rect x=\"12\" width=\"4\" height=\"12\" fill=\"#D80621\"/><circle cx=\"8\" cy=\"6\" r=\"2\" fill=\"#D80621\"/>", "HUN": "<rect width=\"16\" height=\"4\" fill=\"#CD2A3E\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#FFF\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#436F4D\"/>", "TPE": "<rect width=\"16\" height=\"12\" fill=\"#FE0000\"/><rect width=\"8\" height=\"6\" fill=\"#000095\"/><circle cx=\"4\" cy=\"3\" r=\"1.6\" fill=\"#FFF\"/>", "ISR": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><rect y=\"1.5\" width=\"16\" height=\"1.6\" fill=\"#0038B8\"/><rect y=\"8.9\" width=\"16\" height=\"1.6\" fill=\"#0038B8\"/>", "MGL": "<rect width=\"16\" height=\"12\" fill=\"#015197\"/><rect width=\"5.33\" height=\"12\" fill=\"#C4272F\"/><rect x=\"10.67\" width=\"5.33\" height=\"12\" fill=\"#C4272F\"/>", "UKR": "<rect width=\"16\" height=\"6\" fill=\"#0057B7\"/><rect y=\"6\" width=\"16\" height=\"6\" fill=\"#FFD700\"/>", "KOS": "<rect width=\"16\" height=\"12\" fill=\"#244AA5\"/><path d=\"M5 5h6l-1 3H6z\" fill=\"#D0A650\"/>", "RUS": "<rect width=\"16\" height=\"4\" fill=\"#FFF\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#0039A6\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#D52B1E\"/>", "POL": "<rect width=\"16\" height=\"6\" fill=\"#FFF\"/><rect y=\"6\" width=\"16\" height=\"6\" fill=\"#DC143C\"/>", "ITA": "<rect width=\"5.33\" height=\"12\" fill=\"#009246\"/><rect x=\"5.33\" width=\"5.34\" height=\"12\" fill=\"#FFF\"/><rect x=\"10.67\" width=\"5.33\" height=\"12\" fill=\"#CE2B37\"/>", "GEO": "<rect width=\"16\" height=\"12\" fill=\"#FFF\"/><rect x=\"7\" width=\"2\" height=\"12\" fill=\"#F00\"/><rect y=\"5\" width=\"16\" height=\"2\" fill=\"#F00\"/>", "AZE": "<rect width=\"16\" height=\"4\" fill=\"#00B5E2\"/><rect y=\"4\" width=\"16\" height=\"4\" fill=\"#EF3340\"/><rect y=\"8\" width=\"16\" height=\"4\" fill=\"#509E2F\"/>"};
    // mobile: flag before the name; desktop: separate Nat column (flag + code), like Rankings
    var hflag = function (n) { var c = HNAT[n]; return c ? '<svg class="sm:hidden w-4 h-3 shrink-0 mr-1.5 self-center" viewBox="0 0 16 12">' + HFLAG[c] + '</svg>' : ''; };
    var hnat = function (n) { var c = HNAT[n]; return c ? '<span class="hidden sm:inline-flex w-16 items-center gap-1.5 text-[13px] text-text-primary font-normal"><svg class="w-4 h-3 shrink-0" viewBox="0 0 16 12">' + HFLAG[c] + '</svg><span>' + c + '</span></span>' : '<span class="hidden sm:inline-flex w-16"></span>'; };
    var col = function (v) { return v > 0 ? 'text-gain-teal' : v < 0 ? 'text-[#CC0000]' : 'text-text-secondary'; };
    var row = function (lead, name, rk, d, rating) {
      var rkc = rk.charAt(0) === '↑' ? 'text-gain-teal' : rk.charAt(0) === '↓' ? 'text-[#CC0000]' : 'text-text-secondary';
      var ds = d > 0 ? '+' + d : d < 0 ? '−' + Math.abs(d) : '–';
      return '<div onclick="location.href=\'athlete.html\'" role="link" class="h-10 sm:h-11 py-0 border-b border-[#D6CFC2] flex items-center justify-between text-body-md hover:bg-panel-secondary/30 transition-colors px-1 cursor-pointer athlete-row group">' +
        '<div class="min-w-0 pr-2 flex items-baseline"><span class="w-12 shrink-0 tabular-nums text-text-secondary text-[13px]">' + lead + '</span>' + hflag(name) + '<span class="font-medium text-text-primary truncate group-hover:underline">' + name + '</span></div>' +
        '<div class="flex items-center gap-2 sm:gap-3 shrink-0 tabular-nums font-tabular-data-md text-tabular-data-md">' + hnat(name) +
        '<span class="' + rkc + ' text-xs w-6 text-right font-medium">' + rk + '</span>' +
        '<span class="' + col(d) + ' font-medium w-12 text-right">' + ds + '</span>' +
        '<span class="text-text-primary font-normal w-12 text-right">' + rating + '</span>' +
        '<span class="material-symbols-outlined text-[18px] text-[#66605C] align-middle shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform">chevron_right</span></div></div>';
    };
    ['men', 'women'].forEach(function (g) {
      var sel = document.getElementById('select-' + g + '-weight');
      if (!sel) return;
      var panel = sel.closest('.flex.flex-col.w-full'), view = panel && panel.querySelector('.desktop-table-view');
      if (!view) return;
      var draw = function () {
        var v = sel.value;
        if (v === 'Leaders') { view.innerHTML = LEAD[g].map(function (r) { return row(r[1].replace(' kg', ''), r[0], r[2], r[3], r[4]); }).join(''); return; }
        var leader = LEAD[g].filter(function (r) { return r[1] === v; })[0];
        view.innerHTML = topFor(g, v, leader).map(function (r, i) { return row(String(i + 1), r[0], r[1], r[2], r[3]); }).join('');
      };
      sel.addEventListener('change', draw);
      draw();
    });
  }

  // 7. same gap on every page between the top bar and the first line of content: 24px mobile, 32px desktop
  //    (Stitch pages each had their own top padding). In the Next.js app this lives in one layout.
  var alignTop = function () {
    var main = document.querySelector('main'); if (!main) return;
    var bar = 0;
    document.querySelectorAll('header, nav, div').forEach(function (e) {
      var r = e.getBoundingClientRect();
      if (getComputedStyle(e).position === 'fixed' && e.offsetHeight && e.offsetHeight < 100 && r.top < 60 && !/Prototype/.test(e.textContent)) bar = Math.max(bar, r.bottom);
    });
    var w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT), n, top = null;
    while ((n = w.nextNode())) {
      var el = n.parentElement;
      if (!n.textContent.trim() || el.offsetHeight < 2 || el.closest('[style*="position: fixed"]')) continue;
      var rg = document.createRange(); rg.selectNodeContents(n); var b = rg.getBoundingClientRect();
      if (b.height && b.top + scrollY >= bar - 1) { top = b.top + scrollY; break; }
    }
    if (top === null) return;
    var want = bar + (innerWidth < 640 ? 24 : 32);
    var pt = parseFloat(getComputedStyle(main).paddingTop) || 0;
    main.style.transition = 'none';
    main.style.paddingTop = Math.max(0, pt + want - top) + 'px';
  };
  if (document.readyState === 'complete') alignTop(); else window.addEventListener('load', function () { setTimeout(alignTop, 50); });

  // 8. sorting for the Stitch tables (Tournaments results, Rankings)
  var num = function (t) { t = (t || '').replace('−', '-').replace('%', '').trim(); return t === '–' || t === '' ? 0 : parseFloat(t) || 0; };
  if (PAGE === 'tournaments') {
    var ts = document.getElementById('t-sort'), tb = document.querySelector('#view-results tbody');
    if (ts && tb) {
      var orig = Array.prototype.slice.call(tb.children);
      // newest first: reverse the month groups and the rows inside each group
      var regroupDesc = function (rows) {
        var groups = [];
        rows.forEach(function (tr) { if (tr.hasAttribute('data-month-toggle')) groups.push([tr]); else groups[groups.length - 1].push(tr); });
        return groups.reverse().reduce(function (acc, g) { return acc.concat([g[0]], g.slice(1).reverse()); }, []);
      };
      ts.addEventListener('change', function () {
        var by = ts.value.split('-')[0], dir = /-asc$/.test(ts.value) ? 1 : -1;
        if (by === 'date') { (dir > 0 ? orig : regroupDesc(orig)).forEach(function (tr) { tr.classList.remove('hidden'); tb.appendChild(tr); }); return; }
        var col = by === 'accuracy' ? 3 : 4;
        orig.forEach(function (tr) { if (tr.hasAttribute('data-month-toggle')) tr.classList.add('hidden'); });
        orig.filter(function (tr) { return tr.hasAttribute('data-month'); })
          .sort(function (a, b) {
            // upcoming tournaments have no accuracy / upsets yet ("–"): always at the end
            var x = a.children[col].textContent.trim(), y = b.children[col].textContent.trim();
            if (x === '–' || y === '–') return (x === '–') - (y === '–');
            return dir * (num(x) - num(y));
          })
          .forEach(function (tr) { tr.classList.remove('hidden'); tb.appendChild(tr); });
      });
    }
  }
  if (PAGE === 'rankings') {
    var rs = document.getElementById('rk-sort'), rt = document.querySelector('#standard-table-container tbody');
    if (rs && rt) {
      var heads = Array.prototype.map.call(document.querySelectorAll('#standard-table-container thead th'), function (th) { return th.textContent.replace(/\s+/g, ' ').trim(); });
      var c30 = heads.findIndex(function (h) { return /^\+\/-/.test(h) && !/6m/i.test(h); }), c6 = heads.findIndex(function (h) { return /^\+\/- ?6m/i.test(h); });
      var pairs = Array.prototype.filter.call(rt.children, function (tr) { return tr.classList.contains('athlete-row'); })
        .map(function (tr) { return [tr, tr.nextElementSibling && tr.nextElementSibling.classList.contains('athlete-panel') ? tr.nextElementSibling : null]; });
      rs.addEventListener('change', function () {
        var key = rs.value.split('-')[0], dir = /-asc$/.test(rs.value) ? 1 : -1;
        var col = key === 'd90' ? c30 : key === 'd6m' ? c6 : -1;
        pairs.slice().sort(function (a, b) {
          // rating ↓ = rank order (#1 first)
          return col < 0 ? -dir * (num(a[0].children[0].textContent) - num(b[0].children[0].textContent))
                         : dir * (num(a[0].children[col].textContent) - num(b[0].children[col].textContent));
        }).forEach(function (p) { rt.appendChild(p[0]); if (p[1]) rt.appendChild(p[1]); });
      });
    }
  }

  // 9. athlete: Contests table — year / result filters, search, sort (flat list when not sorted by date)
  if (PAGE === 'athlete') {
    var tbl = document.getElementById('main-contests-table');
    var $a = function (id) { return document.getElementById(id); };
    if (tbl && $a('ac-sort')) {
      var tb2 = tbl.querySelector('tbody'), all = Array.prototype.slice.call(tb2.children);
      var short = function (t) { return t.replace('Grand Slam', 'GS').replace('Grand Prix', 'GP').replace('World Championships', 'WCH').replace('Olympic Games', 'OG'); };
      all.forEach(function (tr) {
        if (!tr.classList.contains('contest-entry-row')) return;
        var c = tr.children[0], tag = document.createElement('div');
        tag.className = 'ac-tour hidden text-[11px] leading-[14px] text-[#66605C] whitespace-nowrap';
        tag.textContent = short(tr.getAttribute('data-tournament') || '');
        c.appendChild(tag);
      });
      var cell = function (tr, i) { return tr.children[i] ? tr.children[i].textContent.trim() : ''; };
      var draw = function () {
        var q = $a('ac-q').value.trim().toLowerCase(), y = $a('ac-year').value, res = $a('ac-res').value, sv = $a('ac-sort').value;
        var key = sv.split('-')[0], dir = /-asc$/.test(sv) ? 1 : -1, flat = key !== 'date';
        var rows = all.filter(function (tr) {
          if (!tr.classList.contains('contest-entry-row')) return false;
          var t = tr.getAttribute('data-tournament') || '', w = tr.getAttribute('data-res') === 'W', up = /upset/i.test(tr.textContent);
          if (y && t.slice(-4) !== y) return false;
          if (q && (tr.textContent + ' ' + t).toLowerCase().indexOf(q) < 0) return false;
          return !res || (res === 'w' && w) || (res === 'l' && !w) || (res === 'uw' && w && up) || (res === 'ul' && !w && up);
        });
        var show = new Set(rows);
        if (flat) {
          var v = function (tr) { return key === 'chance' ? num(cell(tr, 3).replace(/upset/i, '')) : num(cell(tr, 5)); };
          rows.sort(function (a, b) { return dir * (v(a) - v(b)); });
          all.forEach(function (tr) { tr.classList.add('hidden'); });
          rows.forEach(function (tr) { tr.classList.remove('hidden'); tb2.appendChild(tr); });
        } else {
          var seq = dir < 0 ? all.slice() : (function () { // oldest first: reverse tournaments and rows inside them
            var g = []; all.forEach(function (tr) { if (tr.classList.contains('tournament-row')) g.push([tr]); else if (g.length) g[g.length - 1].push(tr); });
            return g.reverse().reduce(function (acc, x) { return acc.concat([x[0]], x.slice(1).reverse()); }, []);
          })();
          seq.forEach(function (tr) {
            var keep = tr.classList.contains('tournament-row') ? rows.some(function (r) { return r.getAttribute('data-tournament') === tr.getAttribute('data-tournament'); }) : show.has(tr);
            tr.classList.toggle('hidden', !keep); tb2.appendChild(tr);
          });
        }
        tbl.querySelectorAll('.ac-tour').forEach(function (d) { d.classList.toggle('hidden', !flat); });
      };
      ['ac-q', 'ac-year', 'ac-res', 'ac-sort'].forEach(function (id) { $a(id).addEventListener(id === 'ac-q' ? 'input' : 'change', draw); });
    }
  }

  // 10. every flag (and the country code / name right next to it) opens the country page
  var isFlag = function (svg) {
    if (!svg || svg.tagName.toLowerCase() !== 'svg') return false;
    var hd = svg.closest('header');  // the site header is fixed; the athlete profile is a <header> inside main
    if (hd && getComputedStyle(hd).position === 'fixed') return false;
    // inside a link or a row that opens a contest (upsets, contest tables) the whole thing is one link
    if (svg.closest('a[href]')) return false;
    if (svg.closest('.row-only')) return false;  // the row is the only link (tournament medallists -> weight page)
    var row = svg.closest('tr, .athlete-row, [role="link"]');
    if (row && (/contest/.test(row.getAttribute('onclick') || '') || row.classList.contains('contest-entry-row') || row.closest('#c-body'))) return false;
    var vb = (svg.getAttribute('viewBox') || '').trim(), r = svg.getBoundingClientRect();
    if (!((vb === '0 0 16 12' || vb === '0 0 30 20' || vb === '0 0 32 24') && r.width <= 40 && r.height <= 30)) return false;
    var next = svg.nextElementSibling, label = next ? next.textContent.trim() : '';
    // a host flag before a tournament name ("Masters Budapest", "Paris Grand Slam") is not a country label
    if (/(grand slam|grand prix|masters|championships|olympic games|\b(gs|gp|wch)\b)/i.test(label)) return false;
    return /^[A-Z]{3}$/.test(label) || /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(label);
  };
  var flagOf = function (el) {
    var svg = el.closest('svg');
    if (isFlag(svg)) return svg;
    // country code / name text directly after a flag ("JPN", "Azerbaijan")
    var prev = el.previousElementSibling;
    if (el.tagName === 'SPAN' && prev && isFlag(prev) && /^[A-Z][A-Za-z ]{2,30}$/.test(el.textContent.trim())) return prev;
    return null;
  };
  document.querySelectorAll('svg').forEach(function (svg) {
    if (!isFlag(svg)) return;
    svg.style.cursor = 'pointer';
    var next = svg.nextElementSibling;
    if (next && next.tagName === 'SPAN' && /^[A-Z][A-Za-z ]{2,30}$/.test(next.textContent.trim())) { next.style.cursor = 'pointer'; next.classList.add('hover:underline'); }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var f = flagOf(e.target.closest('svg') || e.target);
    if (!f) return;
    e.preventDefault(); e.stopPropagation();
    location.href = 'country.html';
  }, true);

  // 11. inside tables: athlete names open the athlete, tournament names open the tournament (not the row's own target)
  var NAME_RE = /^[A-Z][A-Za-z'\-]+(?: [A-Z][A-Za-z'\-]+)? [A-Z]\.(?: [A-Z]\.)?$/;
  var TOUR_RE = /(grand slam|grand prix|\bgs\b|\bgp\b|\bwch\b|masters|world championships|olympic games)( \d{4})?$/i;
  // rows that open a contest stay one link: a click anywhere in them goes to the contest, not to a person
  var contestRow = function (el) {
    var row = el.closest('tr, .athlete-row, [role="link"]');
    if (!row) return false;
    if (/contest/.test(row.getAttribute('onclick') || '') || row.classList.contains('contest-entry-row') || row.closest('#c-body')) return true;
    return sectionTarget(row) === 'contest.html';
  };
  var ownText = function (el) { return Array.prototype.filter.call(el.childNodes, function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent; }).join('').trim(); };
  var PRINCIPALS = ['Lombardo M.', 'Heydarov H.'];  // the two athletes of the Contest screen
  var linkTarget = function (el) {
    if (!el || el.closest('header, nav, h1, h2, h3, a, select, button')) return null;
    if (contestRow(el)) return null;
    if (el.closest('.row-only')) return null;
    if (el.closest('.panel-contest') && window.innerWidth < 640) return null;  // mobile: panel row = one tap target (the contest)
    // Contest screen: the two athletes of this contest link to their pages wherever they appear
    // (scoreboard, rating change, road to the final headings); everybody else stays part of a contest row
    if (PAGE === 'contest') return PRINCIPALS.indexOf(ownText(el)) >= 0 ? 'athlete.html' : null;
    if (el.closest('th') || !el.closest('td, .athlete-row, [role="link"]')) return null;
    if (el.children.length) return null;
    var t = el.textContent.trim();
    if (NAME_RE.test(t)) return 'athlete.html';
    if (TOUR_RE.test(t) && t.length < 40) return 'tournament.html';
    return null;
  };
  document.querySelectorAll('main span, main div, main td').forEach(function (el) {
    if (linkTarget(el)) { el.style.cursor = 'pointer'; el.classList.add('hover:underline'); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.nodeType === 1 ? linkTarget(e.target) : null;
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    location.href = t;
  }, true);

  // 12. expandable rows (Rankings, tournament weight results): the chevron cell opens the panel, the rest of the row opens the athlete
  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('tr.athlete-row, tr.res-row');
    if (!row || e.defaultPrevented || e.target.closest('a')) return;  // flag / name links handled above
    var last = row.lastElementChild;
    if (last && last.contains(e.target)) return;           // chevron: let the page toggle the panel
    e.preventDefault(); e.stopPropagation();
    // Rankings "Last" cell (last tournament): opens that tournament's weight page (only Abu Dhabi −73 is built)
    var lastT = e.target.closest('td.rk-last');
    if (lastT) { location.href = /GS ABU/.test(lastT.textContent) ? 'weight.html' : 'tournament.html'; return; }
    location.href = 'athlete.html';
  }, true);
  // Rankings: columns hidden on narrower screens must not stay in the colspan of the expanded panel row
  // (a colspan wider than the visible columns adds a phantom column and shifts the header)
  var fitSpans = function () {
    document.querySelectorAll('#standard-table-container > table, #p4p-table-container table').forEach(function (t) {
      var n = [].filter.call(t.querySelectorAll(':scope > thead > tr > th'), function (th) { return getComputedStyle(th).display !== 'none'; }).length;
      t.querySelectorAll(':scope > tbody > tr > td[colspan]').forEach(function (td) { if (+td.getAttribute('colspan') > 3) td.setAttribute('colspan', n); });
    });
  };
  fitSpans(); window.addEventListener('resize', fitSpans); document.addEventListener('click', function () { setTimeout(fitSpans, 0); });

  // mark the Rankings "Last" cells as links of their own
  document.querySelectorAll('#standard-table-container > table > tbody > tr.athlete-row').forEach(function (r) {
    var c = r.children[12];
    if (!c) return;
    c.classList.add('rk-last'); c.title = 'Open the weight at this tournament';
    var t = c.querySelector('span > span'); if (t) t.classList.add('hover:underline');
    c.addEventListener('mouseenter', function () { c.querySelectorAll('span > span').forEach(function (x) { x.style.textDecoration = 'underline'; }); });
    c.addEventListener('mouseleave', function () { c.querySelectorAll('span > span').forEach(function (x) { x.style.textDecoration = ''; }); });
  });

  // footer: "Data: IJF judobase" links to the source
  document.querySelectorAll('footer span').forEach(function (sp) {
    if (sp.children.length || sp.textContent.trim() !== 'Data: IJF judobase') return;
    sp.innerHTML = 'Data: <a href="https://judobase.ijf.org/#/dashboard" target="_blank" rel="noopener" class="hover:text-[#33302E] hover:underline">IJF judobase</a>';
  });

  // collapsible round groups in contests tables (tournament weight pages): a round row hides/shows the rows under it
  document.querySelectorAll('tr.round-row').forEach(function (r) {
    var toggle = function () {
      var open = r.getAttribute('aria-expanded') !== 'true';
      r.setAttribute('aria-expanded', open);
      var ic = r.querySelectorAll('.round-icon'); ic.forEach(function (i) { i.style.transform = open ? '' : 'rotate(-90deg)'; });
      for (var n = r.nextElementSibling; n && !n.classList.contains('round-row'); n = n.nextElementSibling) n.style.display = open ? '' : 'none';
    };
    r.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  // 4. prototype badge
  var b = document.createElement('a');
  b.href = 'screens.html';
  b.textContent = 'Prototype · all screens';
  b.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999;background:#33302E;color:#F3EEE3;font:500 12px/1 "IBM Plex Sans",sans-serif;padding:8px 10px;text-decoration:none;opacity:.85';
  document.body.appendChild(b);
})();
