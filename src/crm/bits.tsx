import { BadgeCheck, Mail, MessageSquareText, Phone, Radar, UserPlus, StickyNote, Users } from "lucide-react";
import type { Candidate } from "../data/seed";
import { TODAY } from "../data/seed";
import { Badge } from "./ui";
import { fmtDate } from "../data/match";

export const PART_COLOURS: Record<string, string> = {
  history: "#1b2a41",
  distance: "#3d5a80",
  recent: "#6b7f9e",
  availability: "#98a8bf",
  contact: "#c4cedb",
};

export function ScoreBar({ parts, weights }: { parts: { key: string; label: string; value: number; detail: string }[]; weights: Record<string, number> }) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex h-2 overflow-hidden rounded-full bg-gsecondary" title={parts.map((p) => `${p.label}: ${p.detail}`).join("\n")}>
      {parts.map((p) => (
        <span key={p.key} style={{ width: `${(p.value * weights[p.key] * 100) / total}%`, background: PART_COLOURS[p.key] }} />
      ))}
    </div>
  );
}

export function cardState(c: Candidate): { tone: string; label: string; worst?: string } {
  const soon = new Date(TODAY);
  soon.setDate(soon.getDate() + 30);
  const exp = c.cards.map((k) => new Date(k.expires)).sort((a, b) => +a - +b)[0];
  if (exp < TODAY) return { tone: "red", label: "Expired", worst: fmtDate(exp.toISOString()) };
  if (exp < soon) return { tone: "amber", label: `Expires ${fmtDate(exp.toISOString())}`, worst: fmtDate(exp.toISOString()) };
  return { tone: "green", label: "In date" };
}

export function CardBadge({ c }: { c: Candidate }) {
  const s = cardState(c);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function kindIcon(kind: string, cls = "h-3.5 w-3.5") {
  switch (kind) {
    case "sms":
      return <MessageSquareText className={cls} />;
    case "call":
      return <Phone className={cls} />;
    case "registration":
      return <UserPlus className={cls} />;
    case "email":
      return <Mail className={cls} />;
    case "placement":
      return <BadgeCheck className={cls} />;
    case "note":
      return <StickyNote className={cls} />;
    case "meeting":
      return <Users className={cls} />;
    default:
      return <Radar className={cls} />;
  }
}

export const shortDay = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
