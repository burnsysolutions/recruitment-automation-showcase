import type { Automation, Group, GroupId } from "./types";
import { avolonCandidates, avolonFinance } from "./data/avolon";
import { gloSales } from "./data/glo";
import { careers } from "./data/careers";

export const GROUPS: Group[] = [
  {
    id: "finance",
    kicker: "Avolon Group, construction recruitment",
    title: "Timesheets to invoices",
    intro:
      "The weekly money, from the timesheet arriving by email to the invoice the client pays. Built alongside Bullhorn for a construction labour agency.",
  },
  {
    id: "candidates",
    kicker: "Avolon Group, construction recruitment",
    title: "Candidates and Bullhorn",
    intro:
      "Keeping the database current and the right people in front of every vacancy, without a consultant doing it by hand.",
  },
  {
    id: "sales",
    kicker: "Glo Business Solutions",
    title: "Sales and site intelligence",
    intro:
      "Finding clients who need help, answering them fast, and knowing which sites are about to start.",
  },
  {
    id: "careers",
    kicker: "Glo Career Services and executive search",
    title: "CVs and headhunting",
    intro:
      "CV writing at a set standard, and an executive search desk that finds and ranks candidates for a consultant to approve.",
  },
];

export const AUTOMATIONS: Automation[] = [
  ...avolonFinance,
  ...avolonCandidates,
  ...gloSales,
  ...careers,
].sort((a, b) => a.n - b.n);

export const byGroup = (g: GroupId) => AUTOMATIONS.filter((a) => a.group === g);
export const bySlug = (slug: string) =>
  AUTOMATIONS.find((a) => a.slug === slug);
export const groupOf = (g: GroupId) => GROUPS.find((x) => x.id === g)!;
