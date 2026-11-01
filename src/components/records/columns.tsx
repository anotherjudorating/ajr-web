import type { ReactNode } from "react";

import { Flag } from "@/components/Flag";
import type { RecordRow } from "@/lib/api";
import { monthYear, shortCompetition, shortName, signed } from "@/lib/format";
import type { RecordInfo } from "@/lib/records";
import { WEIGHTS } from "@/lib/weights";

// The columns of a record's table, between the place and the chevron. The same
// columns serve the top 5 on /records and the full list (`full`), which adds the
// nation and always shows the weight, as in the prototypes.
export type Column = {
  label: string; // the header text, also in the CSV
  header?: ReactNode; // when the header is not just the label
  title?: string;
  th: string; // alignment, width, visibility
  td: string;
  cell: (row: RecordRow) => ReactNode;
  csv: (row: RecordRow) => string | number;
  tall?: boolean; // two lines in the cell: its own vertical padding instead of the row height
};

export const TH = "h-9 py-0 align-middle px-2 sm:px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted";
export const TD = "h-10 sm:h-11 py-0 align-middle px-2 sm:px-3";

const int = (value: number) => Math.round(value);
const percent = (share: number, digits = 0) => `${(share * 100).toFixed(digits)}%`;
const year = (day: string | null | undefined) => (day ? new Date(day).getUTCFullYear() : "");
const month = (day: string | null) => (day ? monthYear(day) : "");

function weightName(row: RecordRow, short = false): string {
  const weight = WEIGHTS.find(
    (w) => w.api === row.weight && w.gender === (row.gender === "female" ? "women" : "men"),
  );
  if (!weight) return row.weight ?? "";
  return short ? weight.label : `${weight.gender === "men" ? "Men" : "Women"} ${weight.label}`;
}

function period(row: RecordRow): string {
  const from = year(row.detail?.from as string | undefined);
  const to = year(row.day);
  return from === to ? String(to) : `${from}–${to}`;
}

const medal = (row: RecordRow, kind: string) => Number(row.detail?.[kind] ?? 0);

export function Medal({ kind }: { kind: "gold" | "silver" | "bronze" }) {
  const [fill, ring] = { gold: ["#D4AF37", "#8A6A00"], silver: ["#B4BCC2", "#5F6B73"], bronze: ["#C2834F", "#8A4F2A"] }[kind];
  return (
    <svg className="w-4 h-5 shrink-0" viewBox="0 0 16 20" role="img" aria-label={kind}>
      <path d="M3 0h4l2 7H5z" fill="#990F3D" />
      <path d="M9 0h4l-2 7H7z" fill="#0F5499" />
      <circle cx="8" cy="13" r="6" fill={fill} />
      <circle cx="8" cy="13" r="4" fill="none" stroke={ring} strokeWidth="1" />
    </svg>
  );
}

function Name({ ioc, name, muted = false, flag = "" }: { ioc: string | null; name: string; muted?: boolean; flag?: string }) {
  return (
    <div className={`flex items-center gap-1.5 min-w-0 ${muted ? "text-muted" : ""}`}>
      <span className={`flex ${flag}`}>
        <Flag ioc={ioc} />
      </span>
      <span className={`${muted ? "" : "font-medium "}truncate`}>{name}</span>
    </div>
  );
}

const athleteName = (r: RecordRow) => shortName(r.family_name, r.given_name);
const opponentName = (r: RecordRow) => shortName(r.opponent_family_name, r.opponent_given_name);

// --- building blocks ---

function athlete(full: boolean): Column[] {
  const name: Column = {
    label: "Athlete",
    th: "text-left",
    td: "",
    // the full list shows the flag in its own column from sm
    cell: (r) => <Name ioc={r.country} name={athleteName(r)} flag={full ? "sm:hidden" : ""} />,
    csv: (r) => `${r.family_name ?? ""} ${r.given_name ?? ""}`.trim(),
  };
  if (!full) return [name];
  return [name, nat()];
}

function nat(): Column {
  return {
    label: "Nat",
    th: "text-left w-24 hidden sm:table-cell",
    td: "hidden sm:table-cell",
    cell: (r) => (
      <div className="flex items-center gap-1.5">
        <Flag ioc={r.country} />
        <span className="text-[13px]">{r.country}</span>
      </div>
    ),
    csv: (r) => r.country ?? "",
  };
}

function weight(full: boolean): Column {
  return full
    ? {
        label: "Weight",
        th: "text-left w-20 sm:w-32",
        td: "text-muted whitespace-nowrap",
        cell: (r) => (
          <>
            <span className="sm:hidden">{weightName(r, true)}</span>
            <span className="hidden sm:inline">{weightName(r)}</span>
          </>
        ),
        csv: (r) => weightName(r),
      }
    : {
        label: "Weight",
        th: "text-left hidden sm:table-cell w-32",
        td: "text-muted whitespace-nowrap hidden sm:table-cell",
        cell: (r) => weightName(r),
        csv: (r) => weightName(r),
      };
}

// The record's own number, in bold.
function value(label: string, width: string, show: (r: RecordRow) => ReactNode, td = ""): Column {
  return {
    label,
    th: `text-right ${width}`,
    td: `text-right font-bold ${td}`,
    cell: show,
    csv: (r) => String(show(r)),
  };
}

// A muted text column on the right, hidden on phones (dates, periods).
function side(label: string, width: string, show: (r: RecordRow) => string, left = false): Column {
  return {
    label,
    th: `${left ? "text-left" : "text-right"} hidden sm:table-cell ${width}`,
    td: `${left ? "" : "text-right"} text-muted whitespace-nowrap hidden sm:table-cell`,
    cell: (r) => <div className="truncate">{show(r)}</div>,
    csv: show,
  };
}

const competition = (r: RecordRow) => (r.competition ? shortCompetition(r.competition) : "");

function tournament(): Column {
  return {
    label: "Tournament",
    th: "text-left",
    td: "",
    cell: (r) => (
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="font-medium truncate" title={r.competition ?? undefined}>
          {competition(r)}
        </span>
      </div>
    ),
    csv: (r) => r.competition ?? "",
  };
}

function nation(width = ""): Column {
  return {
    label: "Nation",
    th: `text-left ${width}`,
    td: "",
    cell: (r) => <Name ioc={r.country} name={r.country ?? "—"} />,
    csv: (r) => r.country ?? "",
  };
}

function medals(nations: boolean): Column[] {
  // athletes: silver and bronze from sm; nations: all three always (narrower)
  return (["gold", "silver", "bronze"] as const).map((kind) => {
    const hide = !nations && kind !== "gold" ? " hidden sm:table-cell" : "";
    return {
      label: kind[0].toUpperCase() + kind.slice(1),
      header: (
        <span className="inline-flex justify-center w-full">
          <Medal kind={kind} />
        </span>
      ),
      title: kind[0].toUpperCase() + kind.slice(1),
      th: `text-center ${nations ? "w-9 sm:w-11" : "w-10 sm:w-12"}${hide}`,
      td: `text-center${hide}`,
      cell: (r) => medal(r, kind),
      csv: (r) => medal(r, kind),
    };
  });
}

function upsets(): Column[] {
  const lost = (r: RecordRow) => Math.round(Number(r.detail?.contests ?? 0) * (1 - Number(r.detail?.favourites_won ?? 0)));
  return [
    {
      label: "Upsets",
      title: "Contests the rating favourite lost",
      th: "text-right hidden sm:table-cell w-20",
      td: "text-right text-muted hidden sm:table-cell",
      cell: lost,
      csv: lost,
    },
    {
      ...value("Fav. won", "w-20 sm:w-24 whitespace-nowrap", (r) => percent(Number(r.detail?.favourites_won ?? 0), 1)),
      title: "Contests won by the rating favourite",
    },
  ];
}

// --- the columns of each record ---

export function recordColumns(info: RecordInfo, full: boolean): Column[] {
  switch (info.name) {
    case "highest_rating":
      return [...athlete(full), weight(full), value("Peak", full ? "w-16 sm:w-24" : "w-20 sm:w-24", (r) => int(r.value)), side("Date", full ? "w-24" : "w-28", (r) => month(r.day))];
    case "longest_p4p_1":
      return [...athlete(full), value("Weeks", full ? "w-16 sm:w-24" : "w-20 sm:w-24", (r) => int(r.value).toLocaleString("en-US")), side("Until", full ? "w-24" : "w-28", (r) => month(r.day))];
    case "youngest_p4p_1":
      return [...athlete(full), weight(full), value("Age", "w-24 sm:w-28", (r) => <span className="font-semibold">{int(r.value)}</span>), side("Date", full ? "w-24" : "w-28", (r) => month(r.day))];
    case "biggest_p4p_lead":
      return [...athlete(full), weight(full), value("Lead", full ? "w-16 sm:w-24" : "w-20 sm:w-24", (r) => signed(int(r.value))), side("Date", full ? "w-24" : "w-28", (r) => month(r.day))];
    case "longest_at_1":
      return [...athlete(full), weight(full), value("Weeks", full ? "w-16 sm:w-24" : "w-20 sm:w-24", (r) => int(r.value).toLocaleString("en-US")), side("Until", full ? "w-24" : "w-28", (r) => month(r.day))];
    case "youngest_1":
      return [...athlete(full), weight(full), value("Age", "w-24 sm:w-28", (r) => <span className="font-semibold">{int(r.value)}</span>), side("Date", full ? "w-24" : "w-28", (r) => month(r.day))];
    case "biggest_tournament_gain":
      return [
        ...athlete(full),
        ...(full ? [weight(full)] : []),
        side("Tournament", "w-40", competition, true),
        value("+/−", "w-14 sm:w-16", (r) => signed(int(r.value)), "text-gain"),
      ];
    case "most_world_tour_medals":
      return [...athlete(full), ...medals(false), value("Total", "w-14 sm:w-16", (r) => int(r.value))];
    case "most_medals_in_row":
      return [...athlete(full), value("In a row", "w-20 sm:w-24", (r) => int(r.value)), side("Period", "w-28", period)];
    case "youngest_grand_slam_medal":
      return [...athlete(full), weight(full), value("Age", "w-24 sm:w-28", (r) => <span className="font-semibold">{int(r.value)}</span>), side("Tournament", "w-36", competition)];
    case "longest_winning_streak":
      return [...athlete(full), value("Wins", "w-20 sm:w-24", (r) => int(r.value)), side("Period", "w-28", period)];
    case "giant_killer":
      return [...athlete(full), value("Upset wins", "w-24 sm:w-28", (r) => int(r.value))];
    case "biggest_upsets":
      return [
        {
          label: "Winner / loser",
          th: "text-left",
          td: "",
          tall: true,
          cell: (r) => (
            <div className="flex flex-col gap-1">
              <Name ioc={r.country} name={athleteName(r)} />
              <Name ioc={null} name={opponentName(r)} muted />
            </div>
          ),
          csv: (r) => `${athleteName(r)} / ${opponentName(r)}`,
        },
        ...(full ? [weight(full)] : []),
        {
          label: "Tournament",
          th: "text-left hidden sm:table-cell w-40",
          td: "text-muted hidden sm:table-cell",
          cell: (r) => (
            <>
              <div className="truncate">{competition(r)}</div>
              <div className="text-[12px]">{month(r.day)}</div>
            </>
          ),
          csv: (r) => r.competition ?? "",
        },
        value("Chance", "w-16 sm:w-20", (r) => percent(r.value, r.value < 0.01 ? 1 : 0), "text-gain"),
      ];
    case "most_frequent_rivalry":
      return [
        {
          label: "Athletes",
          th: "text-left",
          td: "",
          tall: true,
          cell: (r) => (
            <div className="flex flex-col gap-1">
              <Name ioc={r.country} name={athleteName(r)} />
              <Name ioc={null} name={opponentName(r)} />
            </div>
          ),
          csv: (r) => `${athleteName(r)} / ${opponentName(r)}`,
        },
        {
          label: "Wins",
          th: "text-right w-14 sm:w-16",
          td: "text-right",
          tall: true,
          cell: (r) => (
            <div className="flex flex-col gap-1 font-semibold">
              <span>{medal(r, "wins")}</span>
              <span>{medal(r, "losses")}</span>
            </div>
          ),
          csv: (r) => `${medal(r, "wins")}-${medal(r, "losses")}`,
        },
        value("Contests", "w-20 sm:w-24", (r) => int(r.value)),
      ];
    case "strongest_tournament":
      return [
        tournament(),
        side("Date", "w-24", (r) => month(r.day), true),
        {
          ...value("Avg rating", "w-20 sm:w-28", (r) => int(r.value)),
          header: (
            <>
              <span className="hidden sm:inline">Avg rating</span>
              <span className="sm:hidden">Avg</span>
            </>
          ),
          title: "Average rating of the entrants",
        },
      ];
    case "most_nations_on_podium":
      return [
        tournament(),
        ...(full ? [side("Date", "w-24", (r) => month(r.day))] : []),
        { ...value("Nations", "w-20 sm:w-24", (r) => int(r.value)), title: "Nations with at least one medal" },
      ];
    case "most_unpredictable_tournament":
    case "most_predictable_tournament":
      return [tournament(), ...(full ? [side("Date", "w-24", (r) => month(r.day))] : []), ...upsets()];
    case "highest_team_rating":
      return [
        nation("w-20 sm:w-24"),
        { label: "Date", th: "text-left", td: "text-muted whitespace-nowrap", cell: (r) => <div className="truncate">{month(r.day)}</div>, csv: (r) => month(r.day) },
        value("Rating", "w-20 sm:w-24", (r) => int(r.value)),
      ];
    case "longest_at_1_nation":
      return [
        nation("w-20 sm:w-24"),
        { label: "Until", th: "text-left", td: "text-muted whitespace-nowrap", cell: (r) => <div className="truncate">{month(r.day)}</div>, csv: (r) => month(r.day) },
        value("Weeks", "w-20 sm:w-24", (r) => int(r.value).toLocaleString("en-US")),
      ];
    case "most_medals_nation":
      return [nation(), ...medals(true), value("Total", "w-14 sm:w-16", (r) => int(r.value))];
    case "most_medals_one_tournament":
      return [
        nation("w-20 sm:w-24"),
        { label: "Tournament", th: "text-left", td: "text-muted whitespace-nowrap", cell: (r) => <div className="truncate">{competition(r)}</div>, csv: (r) => r.competition ?? "" },
        value("Medals", "w-20 sm:w-24", (r) => int(r.value)),
      ];
    default:
      return [];
  }
}

// Where a row leads: the athlete's page. Nations and tournaments have no pages yet.
// Where a row leads: a contest of an upset, the head-to-head of a rivalry, else the athlete.
export function rowLink(row: RecordRow): string | null {
  if (row.record === "biggest_upsets" && row.detail?.contest) return `/contests/${row.detail.contest}`;
  if (row.record === "most_frequent_rivalry" && row.athlete_id && row.opponent_id) {
    return `/head-to-head?a=${row.athlete_id}&b=${row.opponent_id}`;
  }
  return row.athlete_id ? `/athletes/${row.athlete_id}` : null;
}
