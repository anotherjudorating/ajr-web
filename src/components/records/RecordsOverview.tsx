"use client";

import Link from "@/components/Link";
import { useState, useSyncExternalStore } from "react";

import { recordColumns } from "@/components/records/columns";
import { RecordTable } from "@/components/records/RecordTable";
import { recordText } from "@/components/records/text";
import { ViewSwitch } from "@/components/records/ViewSwitch";
import { useI18n } from "@/i18n/client";
import type { RecordRow } from "@/lib/api";
import { GROUPS, type Group, places, RECORDS, type RecordInfo, recordView } from "@/lib/records";

const SHOW = 5;
const ACTIVE = "font-bold text-ink border-claret";
const INACTIVE = "text-muted hover:text-ink border-transparent";
// as the weight switcher's, wide enough for "Athletes"
const LABEL = "w-[72px] shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted";

// The group tab lives in the URL's hash (#medals), as in the prototype.
function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
function useGroup(): Group {
  const hash = useSyncExternalStore(subscribe, () => location.hash.slice(1), () => "");
  return (GROUPS as readonly string[]).includes(hash) ? (hash as Group) : "ratings";
}

type Gender = "" | "male" | "female";

// /records: the group tabs, the Men/Women filter and the top 5 of each record.
export function RecordsOverview({ rows }: { rows: Record<Gender, RecordRow[]> }) {
  const group = useGroup();
  const { d } = useI18n();
  const [gender, setGender] = useState<Gender>("");
  const shown = rows[gender];

  return (
    <>
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* a label before each row of tabs, as in the weight switcher; the six groups
            wrap after the label on a phone (one line is wider than the screen) */}
        <div className="flex items-start lg:items-center">
          <span className={`${LABEL} pt-2.5 lg:pt-0`}>{d.records.overview.label}</span>
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0" aria-label={d.records.overview.groupsLabel}>
            {GROUPS.map((g) => (
              <a
                key={g}
                href={`#${g}`}
                className={`px-1 py-1.5 sm:px-2 whitespace-nowrap text-[13px] sm:text-[15px] border-b-2 ${g === group ? ACTIVE : INACTIVE}`}
              >
                {d.records.groups[g]}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center text-[13px] sm:text-[14px]">
          <span className={LABEL}>{d.records.overview.athletes}</span>
          <div className="flex items-center gap-3">
            {(
              [
                ["", d.records.overview.all],
                ["male", d.common.gender.men],
                ["female", d.common.gender.women],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setGender(value)}
                className={`px-1 pb-0.5 border-b-2 cursor-pointer ${value === gender ? ACTIVE : INACTIVE}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-y-16 lg:gap-x-24 items-start">
        {RECORDS.filter((r) => r.group === group).map((info) => (
          <TopList key={info.name} info={info} rows={shown} />
        ))}
      </div>
    </>
  );
}

function RecordTitle({ info }: { info: RecordInfo }) {
  const { d } = useI18n();
  const { title, breakAfter } = recordText(d, info);
  if (!breakAfter) return <>{title}</>;
  return (
    <>
      {breakAfter} <br className="min-[480px]:hidden" />
      {title.slice(breakAfter.length + 1)}
    </>
  );
}

function TopList({ info, rows }: { info: RecordInfo; rows: RecordRow[] }) {
  const { d, f } = useI18n();
  const [key, setKey] = useState(recordView(info).key);
  const view = recordView(info, key);
  const top = rows.filter((r) => r.record === view.name).slice(0, SHOW);
  return (
    <section>
      <div className="flex items-end justify-between gap-3 border-b-2 border-ink pb-2">
        <h2 className="font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight">
          <RecordTitle info={info} />
        </h2>
        {/* the views (Total, In a row…) along the rule, before Full list */}
        <div className="flex shrink-0 items-end gap-4">
          <ViewSwitch info={info} current={key} onPick={setKey} />
          <Link
            href={`/records/${info.slug}${info.views && key !== info.views[0].key ? `?view=${key}` : ""}`}
            className="font-serif whitespace-nowrap text-[14px] font-semibold text-claret hover:underline"
          >
            {d.records.overview.fullList}
          </Link>
        </div>
      </div>
      <RecordTable rows={top} ranks={places(top)} columns={recordColumns({ d, f }, info, false, view.name)} />
    </section>
  );
}
