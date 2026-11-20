// What every automation in the showcase is, and how its demo is drawn.

export type GroupId = "finance" | "candidates" | "sales" | "careers";

export type Status = "Live" | "Built" | "Built, switched off";

/** One thing the demo shows on screen: a table, a message, a document and so on. */
export type View =
  | {
      kind: "table";
      title?: string;
      columns: string[];
      rows: (string | number)[][];
      flag?: number[];
      good?: number[];
    }
  | {
      kind: "message";
      channel: "email" | "sms" | "whatsapp" | "linkedin";
      from: string;
      to: string;
      subject?: string;
      body: string;
    }
  | { kind: "kv"; title?: string; rows: [string, string][] }
  | {
      kind: "list";
      title?: string;
      items: {
        title: string;
        sub?: string;
        tag?: string;
        tone?: "good" | "warn" | "bad" | "info";
      }[];
    }
  | { kind: "doc"; title: string; meta?: string; lines: string[] }
  | {
      kind: "timesheet";
      client: string;
      site: string;
      weekEnding: string;
      po: string;
      rows: { name: string; days: string[]; total: string }[];
      signedBy: string;
    }
  | {
      kind: "bars";
      title?: string;
      unit?: string;
      bars: { label: string; value: number; tone?: "good" | "warn" | "bad" }[];
    }
  | {
      kind: "card";
      scheme: string;
      name: string;
      number: string;
      expires: string;
      level: string;
    }
  | { kind: "transcript"; lines: { who: "AI" | "Person"; text: string }[] }
  | { kind: "views"; views: View[] };

export interface Step {
  label: string;
  /** A short line under the step, said once it has run. */
  detail?: string;
}

export interface Flow {
  inputLabel: string;
  input: View;
  steps: Step[];
  outputLabel: string;
  output: View;
}

export interface Automation {
  n: number;
  slug: string;
  group: GroupId;
  title: string;
  /** One line for the card on the home page. */
  line: string;
  problem: string;
  how: string[];
  /** Only facts that can be stood behind. No invented savings. */
  outcome?: string;
  status: Status;
  tools: string[];
  /** A screen in the demo back office or public pages that shows the same thing in place. */
  seeAlso?: { label: string; to: string }[];
  /** The step-through demo. Omitted when a hand-built demo takes its place. */
  flow?: Flow;
  /** Name of a hand-built interactive demo, drawn instead of (or before) the flow. */
  custom?: "days-and-hours" | "front-desk" | "ats-check" | "shortlist-weights";
}

export interface Group {
  id: GroupId;
  title: string;
  kicker: string;
  intro: string;
}
