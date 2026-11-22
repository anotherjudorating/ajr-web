"use client";

import Link from "@/components/Link";
import { useState } from "react";

import { CHEVRON_CELL, RowChevron } from "@/components/Icon";
import { RowLink } from "@/components/RowLink";
import { H2, HEAD, HEAD_CELL, LINK, ROW_CELL } from "@/components/tournament/styles";
import { useI18n } from "@/i18n/client";
import type { CountryLeader } from "@/lib/api";
import { shortName } from "@/lib/format";
import type { Weight } from "@/lib/weights";

// The nation's best athlete in every weight of a gender and their place in the
// weight, or, with a weight picked (as the home page's leaders), its best five there.
// api.country_leaders gives the best five of every weight, best first.
export function Leaders({ title, weights, leaders, href }: { title: string; weights: Weight[]; leaders: CountryLeader[]; href: string }) {
  const { d, t } = useI18n();
  const words = d.country.leaders;
  const [picked, setPicked] = useState("");
  const present = weights.filter((w) => leaders.some((l) => l.weight === w.api));
  if (present.length === 0) return null;
  const weight = present.find((w) => w.slug === picked);
  const rows = weight
    ? leaders.filter((l) => l.weight === weight.api).map((leader, i) => ({ key: leader.athlete_id, lead: String(i + 1), leader }))
    : present.map((w) => ({ key: w.slug, lead: w.label, leader: leaders.find((l) => l.weight === w.api)! }));
  return (
    <section>
      <div className={HEAD}>
        <div className="flex items-center gap-3 min-w-0">
          <h2 className={H2}>{title}</h2>
          <select
            value={picked}
            onChange={(e) => setPicked(e.target.value)}
            aria-label={t(words.weightPicker, { title })}
            className="w-28 sm:w-36 border border-rule bg-paper text-ink text-xs py-1 px-2 focus:outline-none focus:border-ink cursor-pointer"
          >
            <option value="">{words.allWeights}</option>
            {present.map((w) => (
              <option key={w.slug} value={w.slug}>
                {t(d.country.kg, { label: w.label })}
              </option>
            ))}
          </select>
        </div>
        <Link href={href} className={LINK}>
          {words.allAthletes}
        </Link>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left w-14 sm:w-16`}>{weight ? "#" : words.weight}</th>
            <th className={`${HEAD_CELL} text-left`}>{words.athlete}</th>
            <th className={`${HEAD_CELL} text-right w-16`} title={words.worldRank}>
              {words.rank}
            </th>
            <th className={`${HEAD_CELL} text-right w-16 sm:w-20`}>{words.rating}</th>
            <th className="w-8 sm:w-10 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, lead, leader }) => (
            <RowLink key={key} href={`/athletes/${leader.athlete_id}`} className="border-b border-rule hover:bg-panel/40">
              <td className={`${ROW_CELL} text-muted`}>{lead}</td>
              <td className={ROW_CELL}>
                <span className="font-medium truncate block">{shortName(leader.family_name, leader.given_name)}</span>
              </td>
              <td className={`${ROW_CELL} text-right ${leader.place === 1 ? "font-semibold" : "text-muted"}`}>#{leader.place}</td>
              <td className={`${ROW_CELL} text-right font-bold`}>{leader.score}</td>
              <td className={`${CHEVRON_CELL}`}>
                <RowChevron />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
    </section>
  );
}
