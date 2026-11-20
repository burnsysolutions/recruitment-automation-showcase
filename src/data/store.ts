import { useSyncExternalStore } from "react";
import * as seed from "./seed";
import * as extra from "./extra";
import type { Activity, Candidate, Job, Task, Timesheet } from "./seed";
import type { AvailabilityMsg, Invoice, Mailshot, Note, PayrollRun, Placement } from "./extra";

export type ShortlistState = "Texted" | "Available" | "Unavailable" | "Booked" | "No reply";

export interface Settings {
  autoShortlist: boolean;
  availabilityCheck: boolean;
  smsEnabled: boolean;
  complianceReminders: boolean;
  invoiceSending: boolean;
  prospectAlerts: boolean;
  weights: { history: number; distance: number; recent: number; availability: number; contact: number };
  radius: number;
}

export interface State {
  candidates: Candidate[];
  jobs: Job[];
  timesheets: Timesheet[];
  activities: Activity[];
  tasks: Task[];
  notes: Note[];
  placements: Placement[];
  runs: PayrollRun[];
  invoices: Invoice[];
  mailshots: Mailshot[];
  availability: AvailabilityMsg[];
  shortlist: Record<string, Record<string, ShortlistState>>;
  chased: Record<string, string>;
  renewals: Record<string, string>;
  newCandidates: string[];
  settings: Settings;
}

const KEY = "showcase-demo-state-v1";

function initial(): State {
  return {
    candidates: seed.candidates,
    jobs: seed.jobs,
    timesheets: seed.timesheets,
    activities: seed.activities,
    tasks: seed.tasks,
    notes: extra.initialNotes,
    placements: extra.initialPlacements,
    runs: extra.initialRuns,
    invoices: extra.initialInvoices,
    mailshots: extra.initialMailshots,
    availability: extra.initialAvailability,
    shortlist: {},
    chased: {},
    renewals: {},
    newCandidates: ["c900"],
    settings: {
      autoShortlist: true,
      availabilityCheck: true,
      smsEnabled: true,
      complianceReminders: true,
      invoiceSending: true,
      prospectAlerts: true,
      weights: { history: 40, distance: 25, recent: 15, availability: 12, contact: 8 },
      radius: 35,
    },
  };
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable: run on seed data */
  }
  return initial();
}

let state: State = load();
const listeners = new Set<() => void>();

export function getState() {
  return state;
}

export function setState(fn: (s: State) => State) {
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function resetDemo() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  state = initial();
  listeners.forEach((l) => l());
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => select(state),
  );
}

export const nowHM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export function logActivity(a: Omit<Activity, "id" | "at"> & { at?: string }) {
  setState((s) => ({ ...s, activities: [{ id: `ac${Date.now()}${Math.random()}`, at: a.at ?? nowHM(), ...a }, ...s.activities] }));
}

export function addNote(n: Omit<Note, "id" | "at">) {
  setState((s) => ({ ...s, notes: [{ id: `n${Date.now()}`, at: seed.TODAY.toISOString().slice(0, 10), ...n }, ...s.notes] }));
}

export function updateCandidate(id: string, patch: Partial<Candidate>) {
  setState((s) => ({ ...s, candidates: s.candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
}

export function updateJob(id: string, patch: Partial<Job>) {
  setState((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) }));
}

export function updateTimesheet(id: string, fn: (t: Timesheet) => Timesheet) {
  setState((s) => ({ ...s, timesheets: s.timesheets.map((t) => (t.id === id ? fn(t) : t)) }));
}

export const { clients, sites, assignments, prospects, CONSULTANTS, TRADES } = seed;
export const { contacts, USERS } = extra;
export const clientById = (id: string) => seed.clients.find((c) => c.id === id)!;
export const siteById = (id: string) => seed.sites.find((s) => s.id === id)!;
export const fullName = (c: { first: string; last: string }) => `${c.first} ${c.last}`;
