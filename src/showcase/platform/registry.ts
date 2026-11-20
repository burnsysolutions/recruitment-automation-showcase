import type { FC } from "react";
import type { Brand } from "./kit";

// Which platform each automation lives in, the screen's address, and the
// chunk that draws it. Avolon's automations are shown in Avolon's own platform;
// everything else in Glo CRM.

type Group = () => Promise<{ screens: Record<string, FC> }>;
const av1: Group = () => import("./screens/av1");
const av2: Group = () => import("./screens/av2");
const av3: Group = () => import("./screens/av3");
const glo1: Group = () => import("./screens/glo1");
const glo2: Group = () => import("./screens/glo2");
const glo3: Group = () => import("./screens/glo3");

export interface PlatformEntry {
  brand: Brand;
  path: string;
  screen: string;
  group: Group;
}

const A = (path: string, screen: string, group: Group): PlatformEntry => ({
  brand: "avolon",
  path,
  screen,
  group,
});
const G = (path: string, screen: string, group: Group): PlatformEntry => ({
  brand: "glo",
  path,
  screen,
  group,
});

export const PLATFORM: Record<string, PlatformEntry> = {
  "timesheet-inbox": A("/admin/inbox", "Timesheet Inbox", av1),
  "timesheet-checks": A("/admin/timesheets/si-208-w18", "Timesheet", av1),
  "mini-plan": A("/admin/chase", "Mini Plan", av1),
  "payroll-engine": A("/admin/runs/42", "Payroll run 42", av1),
  "umbrella-file": A("/admin/runs/42/files", "Umbrella files", av1),
  invoices: A("/admin/invoices/run", "Invoices", av1),
  "run-checks": A("/admin/runs/42/checks", "Checks on run 42", av1),
  ledger: A("/admin/ledger", "Sales ledger", av2),
  "old-invoices": A("/admin/archive/compare", "Invoice archive", av2),
  clients: A("/admin/clients/weald-civils", "Client record", av2),
  "weekly-check": A("/admin/chase/hours-check", "Weekly hours check", av2),
  registrations: A("/admin/registrations", "Registrations", av2),
  shortlists: A("/admin/shortlists/2291", "Shortlist", av2),
  availability: A("/admin/sweep", "Availability sweep", av2),
  "prospect-alerts": A("/admin/prospects", "Prospect sites", av3),
  compliance: A("/admin/compliance", "Cards and tickets", av3),
  "ai-caller": A("/admin/calls", "Calls", av3),
  sms: A("/admin/calls/texts", "Texts", av3),
  "jobs-feed": A("/admin/jobs-feed", "Jobs feed", av3),
  "worker-matching": A("/admin/merge", "Name matching and merges", av3),
  scheduler: A("/admin/jobs", "Scheduled jobs", av3),
  "front-desk": G("/front-desk", "Front Desk", glo1),
  "bd-autopilot": G("/prospecting", "Prospecting", glo1),
  "domain-health": G("/outreach/domains", "Sending domains", glo1),
  "linkedin-queue": G("/outreach/linkedin", "LinkedIn queue", glo1),
  "intent-finder": G("/intelligence/signals", "Buying signals", glo1),
  "site-intelligence": G("/intelligence/sites", "Sites", glo1),
  "tracked-links": G("/tracking/proposals", "Proposal tracking", glo1),
  "portfolio-tracking": G("/tracking/portfolio", "Portfolio tracking", glo1),
  "demand-research": G("/products/research", "Product research", glo2),
  dropshipping: G("/products/store", "Store", glo2),
  connections: G("/admin/connections", "Connections", glo2),
  "cv-pipeline": G("/cv-studio", "CV studio", glo2),
  "gap-analysis": G("/cv-studio/orders/1187", "CV order", glo2),
  "free-cv-review": G("/cv-studio/reviews", "Free reviews", glo2),
  "cv-formatter": G("/cv-formatter", "CV formatter", glo2),
  "ats-check": G("/cv-studio/ats", "ATS check", glo2),
  checkout: G("/orders", "Orders", glo3),
  "whatsapp-ai": G("/messages/whatsapp", "WhatsApp", glo3),
  headhunting: G("/talent-mapping/fit-out-director", "Talent mapping", glo3),
  "zoho-search": G("/search", "Search", glo3),
  ingestion: G("/intelligence/hiring", "Hiring signals", glo3),
  "gmail-ai": G("/messages/email", "Email", glo3),
  "ad-tracking": G("/ads", "Ads", glo3),
  "search-visibility": G("/website/seo", "Website", glo3),
};
