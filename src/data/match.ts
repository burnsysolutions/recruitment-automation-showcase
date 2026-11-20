import type { Candidate, Job, Site } from "./seed";
import { TODAY } from "./seed";

export const miles = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

// Weights mirror the engine built for live use: history with us, recency,
// distance, last contact, availability. Each signal scores 0..1.
export const WEIGHTS = { history: 40, recent: 15, distance: 25, contact: 8, availability: 12 };
export const RADIUS = 35;

export interface Scored {
  candidate: Candidate;
  score: number;
  distance: number;
  parts: { key: keyof typeof WEIGHTS; label: string; value: number; detail: string }[];
}

const daysSince = (iso?: string) => (iso ? (TODAY.getTime() - new Date(iso).getTime()) / 86400000 : Infinity);

export function cardInDate(c: Candidate) {
  return c.cards.every((k) => new Date(k.expires) > TODAY);
}

export function shortlist(job: Job, site: Site, pool: Candidate[], opts?: { weights?: typeof WEIGHTS; radius?: number }): Scored[] {
  const W = opts?.weights ?? WEIGHTS;
  const R = opts?.radius ?? RADIUS;
  return pool
    .filter((c) => c.trade === job.trade && c.status !== "Not looking" && c.status !== "On assignment" && cardInDate(c) && c.rtw === "Verified")
    .map((c) => {
      const d = miles(c, site);
      const history = Math.min(1, c.shiftsWorked / 120);
      const rec = daysSince(c.lastWorked);
      const recent = rec < 30 ? 1 : rec < 90 ? 0.6 : rec < 180 ? 0.25 : 0;
      const distance = d > R ? 0 : 1 - d / R;
      const con = daysSince(c.lastContact);
      const contact = con < 14 ? 1 : con < 60 ? 0.5 : 0.1;
      const availability = c.status === "Available" ? 1 : 0.4;
      const parts: Scored["parts"] = [
        { key: "history", label: "Worked for us", value: history, detail: c.shiftsWorked ? `${c.shiftsWorked} shifts` : "Not yet" },
        { key: "distance", label: "Distance to site", value: distance, detail: `${d.toFixed(1)} miles` },
        { key: "recent", label: "Recent work", value: recent, detail: c.lastWorked ? `${Math.round(rec)} days ago` : "None on record" },
        { key: "availability", label: "Availability", value: availability, detail: c.status === "Available" ? "Available now" : `From ${fmtDate(c.availableFrom)}` },
        { key: "contact", label: "Last contact", value: contact, detail: `${Math.round(con)} days ago` },
      ];
      const total = Object.values(W).reduce((a, b) => a + b, 0) || 1;
      const score = Math.round((parts.reduce((t, p) => t + p.value * W[p.key], 0) / total) * 100);
      return { candidate: c, score, distance: d, parts };
    })
    .filter((x) => x.distance <= R)
    .sort((a, b) => b.score - a.score);
}

export function fmtDate(iso?: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", opts);
}

export const gbp = (n: number, dp = 0) =>
  n.toLocaleString("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: dp, maximumFractionDigits: dp });
