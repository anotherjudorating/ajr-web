// A record's text in the page's language: lib/records.ts has the records (slugs,
// kinds, views), i18n/en/records.ts their words by the slug.

import type { Dict } from "@/i18n/en";
import type { RecordText } from "@/i18n/en/records";
import type { RecordInfo, RecordView } from "@/lib/records";

export function recordText(d: Dict, info: RecordInfo): RecordText {
  const text = (d.records.list as Record<string, RecordText | undefined>)[info.slug];
  // every record has its text; a slug without one would show up as the slug
  return text ?? { title: info.slug, description: "", noun: "", sortLabel: "" };
}

// The switch's label and the description of one view; the first view, the record
// itself, has the record's description.
export function viewText(d: Dict, info: RecordInfo, view: RecordView): { label: string; description: string } {
  const text = recordText(d, info);
  const own = text.views?.[view.key];
  return { label: own?.label ?? "", description: own?.description ?? text.description };
}
