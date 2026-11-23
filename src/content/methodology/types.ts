// The methodology's prose, one file a language (en.tsx, ru.tsx), typed so that every
// language has the same paragraphs. A paragraph is a function of the facts: the numbers
// come from src/data/methodology.json and components/methodology/facts.ts, formatted in
// the page's language, and the text puts them in its own sentence.

import type { ReactNode } from "react";

import type { Format } from "@/i18n/format";

export type Score = { "log loss": number; Brier: number; accuracy: number };
export type Model = "coin" | "ijf" | "elo" | "glicko2" | "ours";
// A slice of the test: the five models' scores and the contests in it.
export type Slice = Record<Model, Score> & { n: number };

export type Facts = {
  f: Format;
  pct: (value: number, digits?: number) => string; // 0.6944 -> "69.4%" (ru "69,4%")
  dec: (value: number, digits: number) => string; // 0.5736 -> "0.574" (ru "0,574")
  test: number; // the contests of the test
  all: Slice;
  medalRounds: Slice;
  zero: { accuracy: number }; // skill alone (n = 0 RDs taken off)
  top: { n: number; won: number }; // the 95% to 100% band of the calibration
  disagreements: { n: number; ours_right: number; p: number };
  k: number;
  brier: string; // "Coin 0.250, IJF 0.226, …" in the language
  parisLead: number; // Abe's points over the next athlete on the eve
  abeChance: number; // as a whole percentage
};

export type P = (x: Facts) => ReactNode;

export type Prose = {
  meta: { title: string; description: string };
  title: string;
  lead: P;
  why: {
    intro: P;
    paris1: P;
    paris2: P;
    paris3: P;
    paris4: P;
    paris5: P;
    paris6: P;
    afterParisDraw: P;
    afterDraw: P;
    afterNumberOne: P;
    newcomers1: P;
    newcomers2: P;
    newcomers3: P;
    afterPoints: P;
    goldWorth: P;
    afterTwoGolds: P;
    losses: P;
  };
  number: {
    intro: P;
    skill1: P;
    skill2: P;
    formula: P;
    formulaNote: P;
    calculator1: P;
    calculator2: P;
    career: P;
    afterRiner: P;
    medals1: P;
    medals2: P;
    weights1: P;
    weights2: P;
    afterTableRule: P;
    weightMovesTitle: string;
    p4p: P;
    teams: P;
  };
  works: {
    intro: P;
    test: P;
    allFive: P;
    afterTable: P;
    notes: P;
    notesFormula: P;
    calibration: P;
    afterCalibration: P;
    beatTitle: string;
    oneRd1: P;
    oneRd2: P;
    limits: string[];
    footer: P;
  };
};
