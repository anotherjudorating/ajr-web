#!/usr/bin/env python3
"""Country page (Japan) -> ../_stitch/country.html"""
import os

import chrome
from chrome import CHEV_TD, CHEV_TH, H2, H2ROW, LINK, ROW, TABLE, TD, TH, THEAD_TR, flag, footer, head, header

HERE = os.path.dirname(os.path.abspath(__file__))

# best athlete per weight: weight, athlete, world rank in the weight, rating
MEN = [('−60', 'Nagayama R.', 2, 2228), ('−66', 'Abe H.', 1, 2240), ('−73', 'Ishihara T.', 1, 2298), ('−81', 'Nagase T.', 3, 2318),
       ('−90', 'Murao S.', 4, 2266), ('−100', 'Iida K.', 6, 2201), ('+100', 'Saito T.', 3, 2215)]
WOMEN = [('−48', 'Tsunoda N.', 1, 2219), ('−52', 'Abe U.', 1, 2289), ('−57', 'Funakubo H.', 4, 2210), ('−63', 'Takaichi M.', 2, 2230),
         ('−70', 'Niizoe S.', 3, 2190), ('−78', 'Hamada S.', 4, 2205), ('+78', 'Sone A.', 2, 2236)]
# recent tournaments: name, date, gold, silver, bronze
TOURS = [('Abu Dhabi GS 2026', '24 Oct', 3, 0, 8), ('Baku WCH 2026', '4 Oct', 2, 3, 2), ('Qingdao GP 2026', '18 Sep', 4, 2, 3),
         ('Tashkent GS 2026', '5 Sep', 1, 1, 2), ('Zagreb GP 2026', '21 Aug', 0, 1, 2)]


def leaders(title, g, rows):
    body = ''.join(
        f'<tr class="{ROW}" onclick="location.href=\'/athletes/x\'"><td class="{TD} text-[#66605C] tnum">{w}</td>'
        f'<td class="{TD}"><span class="font-medium truncate block">{n}</span></td>'
        f'<td class="{TD} text-right {"font-semibold" if rk == 1 else "text-[#66605C]"}">#{rk}</td>'
        f'<td class="{TD} text-right font-bold">{r}</td>{CHEV_TD}</tr>'
        for w, n, rk, r in rows)
    return (f'<section><div class="{H2ROW}"><h2 class="{H2}">{title}</h2><a href="athletes.html#n=JPN&w={g}" class="{LINK}">All athletes</a></div>'
            f'<table class="{TABLE}"><thead><tr class="{THEAD_TR}"><th class="{TH} text-left w-14 sm:w-16">Weight</th>'
            f'<th class="{TH} text-left">Athlete</th><th class="{TH} text-right w-16" title="World rank in the weight">Rank</th>'
            f'<th class="{TH} text-right w-16 sm:w-20">Rating</th>{CHEV_TH}</tr></thead><tbody>{body}</tbody></table></section>')


# leaders rating avg, every 6 months (Nov 2022 .. Oct 2026)
HIST = [('Nov 2022', 2188), ('May 2023', 2196), ('Nov 2023', 2205), ('May 2024', 2224), ('Nov 2024', 2215),
        ('May 2025', 2212), ('Nov 2025', 2220), ('May 2026', 2230), ('Oct 2026', 2239)]


def svg(w, h, fs, left, right, every):
    lo, hi, top, bot = 2150, 2250, 20, h - 34
    y = lambda v: bot - (v - lo) / (hi - lo) * (bot - top)
    xs = [left + i * (w - left - right) / (len(HIST) - 1) for i in range(len(HIST))]
    font = f"font-family=\"'IBM Plex Sans', sans-serif\" font-size=\"{fs}\""
    grid = ''.join(f'<line x1="{left}" x2="{w - right}" y1="{y(v):.0f}" y2="{y(v):.0f}"/>' for v in range(lo, hi + 1, 25))
    ylab = ''.join(f'<text x="{left - 8}" y="{y(v) + fs / 3:.0f}">{v}</text>' for v in range(lo, hi + 1, 25))
    pts = ' '.join(f'{x:.0f},{y(v):.0f}' for x, (_, v) in zip(xs, HIST))
    dots = ''.join(f'<circle cx="{x:.0f}" cy="{y(v):.0f}" r="4"/>' for x, (_, v) in zip(xs[:-1], HIST[:-1]))
    xlab = ''.join(f'<text x="{x:.0f}" y="{h - 10}">{d}</text>' for i, (x, (d, _)) in enumerate(zip(xs, HIST)) if i % every == 0 or i == len(HIST) - 1)
    ex, ey = xs[-1], y(HIST[-1][1])
    return (f'<svg class="w-full h-auto overflow-visible block" viewBox="0 0 {w} {h}" role="img" aria-label="Leaders rating average, Nov 2022 to Oct 2026: 2188 to 2239">'
            f'<g stroke="#D6CFC2" stroke-width="0.8">{grid}</g><g fill="#66605C" {font} text-anchor="end">{ylab}</g>'
            f'<polyline fill="none" points="{pts}" stroke="#33302E" stroke-width="2.5"/><g fill="#33302E">{dots}</g>'
            f'<circle cx="{ex:.0f}" cy="{ey:.0f}" fill="#990F3D" r="4"/>'
            f'<text x="{ex + 12:.0f}" y="{ey + fs / 3:.0f}" fill="#33302E" font-weight="700" {font}>2239</text>'
            f'<g fill="#66605C" {font} text-anchor="middle">{xlab}</g></svg>')


def chart():
    tabs = ('<div class="flex items-center gap-4 text-[14px] shrink-0"><span class="text-[#66605C] hover:text-[#33302E]">1Y</span>'
            '<span class="font-bold text-[#990F3D] border-b-2 border-[#990F3D] pb-0.5">4Y</span><span class="text-[#66605C] hover:text-[#33302E]">All</span></div>')
    return (f'<section class="mt-14 lg:mt-16"><div class="{H2ROW}"><h2 class="{H2}">Leaders rating avg</h2>{tabs}</div>'
            f'<div class="py-2 hidden sm:block">{svg(1000, 260, 11, 50, 60, 1)}</div>'
            f'<div class="py-2 sm:hidden">{svg(500, 300, 14, 52, 56, 4)}</div></section>')



def tournaments():
    body = ''.join(
        f'<tr class="{ROW}" onclick="location.href=\'/tournaments/abu-dhabi-2026\'"><td class="{TD}"><span class="font-medium truncate block">{t}</span></td>'
        f'<td class="{TD} text-[#66605C] whitespace-nowrap hidden sm:table-cell">{dt}</td>'
        f'<td class="{TD} text-center">{g}</td><td class="{TD} text-center">{s}</td><td class="{TD} text-center">{b}</td>{CHEV_TD}</tr>'
        for t, dt, g, s, b in TOURS)
    medal_th = ''.join(f'<th class="{TH} text-center w-11 sm:w-14" title="{chrome.MEDAL_NAME[k]}"><span class="inline-flex justify-center w-full">{chrome.medal(k, "w-4 h-5")}</span></th>' for k in (1, 2, 3))
    return (f'<section><div class="{H2ROW}"><h2 class="{H2}">Recent tournaments</h2><a href="tournaments.html" class="{LINK}">All tournaments</a></div>'
            f'<table class="{TABLE}"><thead><tr class="{THEAD_TR}"><th class="{TH} text-left">Tournament</th>'
            f'<th class="{TH} text-left w-20 hidden sm:table-cell">Date</th>{medal_th}{CHEV_TH}</tr></thead><tbody>{body}</tbody></table></section>')


def stat(label, val, title):
    return (f'<div class="flex flex-col" title="{title}"><span class="text-[12px] uppercase tracking-wider text-[#66605C] font-semibold">{label}</span>'
            f'<span class="serif mt-1 text-[28px] leading-tight font-bold tnum">{val}</span></div>')


def page():
    meta = '<span class="inline-block w-px h-3 bg-[#D6CFC2] mx-3 align-middle"></span>'
    top = f'''<nav class="flex flex-wrap items-center gap-1.5 text-[12px] text-[#66605C]" aria-label="Breadcrumb"><a href="tournaments.html" class="hover:text-[#33302E]">Explore</a><span class="text-[#D6CFC2]">›</span><a href="nations.html" class="hover:text-[#33302E]">Nations</a><span class="text-[#D6CFC2]">›</span><span class="text-[#33302E]">Japan</span></nav>
<header class="mt-3 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-6"><div class="flex flex-col">
<h1 class="serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em] flex items-center gap-3">{flag('JPN', '!w-8 !h-6')}Japan</h1>
<div class="mt-1.5 flex items-center text-[14px] text-[#66605C]"><span>Asia</span>{meta}<a href="athletes.html" class="hover:text-[#33302E] hover:underline">64 rated athletes</a></div></div>
<div class="w-full md:w-[460px] max-w-[460px] md:ml-auto self-start">
<div class="flex justify-between items-start gap-2 sm:gap-4">{stat('Rank', '#1', 'Nations ranking, mixed')}{stat('Men', '#2', 'Nations ranking, men')}{stat('Women', '#1', 'Nations ranking, women')}</div>
<div class="mt-5 flex justify-between items-end gap-4"><div class="flex flex-col"><div class="serif text-[56px] leading-none font-bold tnum">2239</div><span class="text-[12px] uppercase tracking-wider text-[#66605C] font-semibold mt-2">Leaders rating avg</span></div>
<div class="tnum text-[12px] pb-1"><div class="grid grid-cols-3 gap-4 pb-1 text-[11px] uppercase tracking-wider text-[#66605C] font-semibold text-right"><span class="text-left">Change</span><span>Rating</span><span>Rank</span></div>
<div class="grid grid-cols-3 gap-4 py-0.5 items-center text-right"><span class="text-[#66605C] text-left">90 days</span><span class="font-bold text-[#0D7680] text-[14px]">+9</span><span class="font-medium text-[#66605C] text-[14px]">–</span></div>
<div class="grid grid-cols-3 gap-4 py-0.5 items-center text-right"><span class="text-[#66605C] text-left">6 months</span><span class="font-bold text-[#0D7680] text-[14px]">+21</span><span class="font-medium text-[#0D7680] text-[14px]">↑1</span></div></div></div>
<div class="mt-4 pt-3 border-t border-[#D6CFC2] flex flex-wrap justify-between items-center text-[12px] gap-2"><div class="inline-flex items-center gap-1.5 text-[#66605C]"><span>Top 1</span><span class="tnum font-semibold text-[#33302E]">2318</span>{meta}<span>Top 8 avg</span><span class="tnum font-semibold text-[#33302E]">2271</span></div>
<a href="rankings.html#teams-mixed" class="serif text-[14px] font-semibold text-[#990F3D] hover:underline">Nations ranking</a></div></div></header>'''
    blocks = (chart() + f'<div class="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24">{leaders("Men leaders", "M", MEN)}{leaders("Women leaders", "W", WOMEN)}</div>'
              f'<div class="mt-14 lg:mt-16">{tournaments()}</div>')
    return head('Japan', 'Japan: rating history, best athlete in every weight and recent medals.') + header('Explore') + top + blocks + footer()


if __name__ == '__main__':
    out = os.path.join(HERE, '..', '_stitch', 'country.html')
    open(out, 'w', encoding='utf-8').write(page())
    print('written', os.path.normpath(out))
