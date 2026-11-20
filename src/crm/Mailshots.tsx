import { asset } from "../lib/asset";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useStore, setState, siteById, logActivity } from "../data/store";
import { Page, Panel, Button, inputCls, Select, Field, Dialog, Th, Td, toast } from "./ui";
import { payText } from "../site/pay";
import { cardState } from "./bits";

const SEGMENTS: [string, string][] = [
  ["available", "Everyone available now or soon"],
  ["groundworks", "Groundworks and civils trades"],
  ["fitout", "Fit-out trades"],
  ["expiring", "Cards expiring in 90 days"],
];

export function Mailshots() {
  const candidates = useStore((s) => s.candidates);
  const jobs = useStore((s) => s.jobs);
  const history = useStore((s) => s.mailshots);
  const [params] = useSearchParams();
  const ids = params.get("ids")?.split(",").filter(Boolean) ?? [];
  const [segment, setSegment] = useState(ids.length ? "picked" : "available");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("Hi {{first_name}},\n\n");
  const [jobId, setJobId] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState<number | null>(null);

  const recipients = useMemo(() => {
    const soon = new Date("2027-01-10");
    switch (segment) {
      case "picked":
        return candidates.filter((c) => ids.includes(c.id));
      case "groundworks":
        return candidates.filter((c) => c.sector === "Groundworks & civils" && c.status !== "Not looking");
      case "fitout":
        return candidates.filter((c) => c.sector === "Fit-out & refurbishment" && c.status !== "Not looking");
      case "expiring":
        return candidates.filter((c) => cardState(c).tone !== "green" || c.cards.some((k) => new Date(k.expires) < soon));
      default:
        return candidates.filter((c) => c.status === "Available" || c.status === "Available from");
    }
  }, [segment, candidates, ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const insertJob = (id: string) => {
    setJobId(id);
    const j = jobs.find((x) => x.id === id);
    if (!j) return;
    if (!subject) setSubject(`${j.publicTitle} wanted, ${siteById(j.siteId).town}, starts ${j.start}`);
    setBody((b) => `${b.trimEnd()}\n\nWe have work for ${j.headcount} ${j.publicTitle.toLowerCase()} in ${siteById(j.siteId).town}, ${payText(j)}, starting ${j.start}. ${j.summary}\n\nReply to this email or call Sam on 07700 900123 if you want it.\n`);
  };

  const preview = (recipients[0]?.first ?? "Jamie");
  const send = () => {
    setConfirm(false);
    const total = recipients.length;
    let done = 0;
    setSending(0);
    const step = () => {
      done = Math.min(total, done + 25);
      setSending(done);
      if (done < total) setTimeout(step, 380);
      else {
        setTimeout(() => {
          setState((s) => ({
            ...s,
            mailshots: [
              { id: `m${Date.now()}`, subject, body, audience: segment === "picked" ? `${total} picked people` : SEGMENTS.find((x) => x[0] === segment)![1], recipients: total, sentAt: "Today, just now", opened: 0, clicked: 0, by: "Sam" },
              ...s.mailshots,
            ],
          }));
          logActivity({ who: "Sam", kind: "email", text: `Mailshot sent to ${total} candidates: ${subject}` });
          toast(`Sent to ${total} people`);
          setSending(null);
          setSubject("");
          setBody("Hi {{first_name}},\n\n");
          setJobId("");
        }, 400);
      }
    };
    setTimeout(step, 300);
  };

  return (
    <Page title="Mailshots" context="Email groups of candidates, with unsubscribe handled for you">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title="New mailshot" pad>
          <div className="space-y-4">
            <Field label="Send to" hint={`${recipients.length} people. Anyone who has unsubscribed is left out.`}>
              <Select value={segment} onChange={setSegment} options={[...(ids.length ? [["picked", `${ids.length} people you picked`] as [string, string]] : []), ...SEGMENTS]} />
            </Field>
            <Field label="Include a job (optional)">
              <Select value={jobId} onChange={insertJob} options={[["", "No job"], ...jobs.filter((j) => j.stage !== "Filled").map((j) => [j.id, `${j.publicTitle}, ${siteById(j.siteId).town}`] as [string, string])]} />
            </Field>
            <Field label="Subject"><input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} /></Field>
            <Field label="Message">
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className={`${inputCls} h-auto resize-y py-2 leading-[1.55]`} />
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button size="sm" variant="ghost" onClick={() => setBody((b) => b + "{{first_name}}")}>Insert first name</Button>
              <Button variant="primary" disabled={!subject.trim() || !recipients.length || sending !== null} onClick={() => setConfirm(true)}>Review and send</Button>
            </div>
            {sending !== null ? (
              <div className="rounded-lg bg-action-tint p-3 text-[13px]">
                <p className="font-medium text-navy tabular">Sending {sending} of {recipients.length}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full bg-action transition-[width]" style={{ width: `${(sending / Math.max(1, recipients.length)) * 100}%` }} /></div>
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel title="Preview" meta={`As ${preview} will see it`}>
          <div className="bg-gbg p-5">
            <div className="mx-auto max-w-[520px] rounded-lg border border-gborder bg-white text-[14px] leading-[1.6] text-[#222]">
              <div className="border-b border-gborder px-5 py-3 text-[12.5px] text-gmuted">
                <p><span className="text-gfg">From</span> Sam, Demo Recruitment Co</p>
                <p><span className="text-gfg">Subject</span> {subject || "No subject yet"}</p>
              </div>
              <div className="whitespace-pre-wrap px-5 py-4">{body.replace(/\{\{first_name\}\}/g, preview)}</div>
              <div className="flex items-center gap-3 border-t border-gborder px-5 py-4">
                <img src={asset("/brand/agency-logo.svg")} alt="Demo Recruitment Co" className="h-7 w-auto" />
                <div className="text-[12px] leading-[1.45] text-gmuted">
                  Sam, Demo Recruitment Co Ltd<br />07700 900123, sam@demo-recruitment.example
                </div>
              </div>
              <p className="border-t border-gborder px-5 py-3 text-[11.5px] text-gmuted">You are getting this because you registered for work with Demo Recruitment Co. <span className="underline">Unsubscribe</span></p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Sent" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead><tr className="border-b border-gborder"><Th>Subject</Th><Th>Sent to</Th><Th>When</Th><Th className="text-right">Opened</Th><Th className="text-right">Clicked</Th></tr></thead>
            <tbody className="divide-y divide-gborder">
              {history.map((m) => (
                <tr key={m.id}>
                  <Td><p className="font-medium">{m.subject}</p><p className="text-gmuted">{m.by}</p></Td>
                  <Td className="text-gmuted">{m.audience}, {m.recipients}</Td>
                  <Td className="text-gmuted">{m.sentAt}</Td>
                  <Td className="text-right tabular">{m.recipients ? `${Math.round((m.opened / m.recipients) * 100)}%` : "–"}</Td>
                  <Td className="text-right tabular">{m.recipients ? `${Math.round((m.clicked / m.recipients) * 100)}%` : "–"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Send this mailshot?"
        footer={<><Button onClick={() => setConfirm(false)}>Cancel</Button><Button variant="primary" onClick={send}>Send to {recipients.length}</Button></>}
      >
        <p className="text-[13.5px]">“{subject}” will go to <strong>{recipients.length}</strong> people, sent in batches of 25. Replies come back to Sam’s inbox.</p>
        <p className="mt-2 text-[12.5px] text-gmuted">Demo mode: nothing leaves this browser.</p>
      </Dialog>
    </Page>
  );
}
