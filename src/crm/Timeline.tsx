import { useMemo, useState } from "react";
import { useStore, addNote } from "../data/store";
import { kindIcon } from "./bits";
import { Button, Select, inputCls, toast } from "./ui";
import { fmtDate } from "../data/match";
import type { Note } from "../data/extra";

type Filter = { candidateId?: string; clientId?: string; jobId?: string };

export function Timeline(filter: Filter) {
  const notes = useStore((s) => s.notes);
  const activities = useStore((s) => s.activities);
  const [kind, setKind] = useState<Note["kind"]>("note");
  const [text, setText] = useState("");

  const match = (x: Filter) =>
    (filter.candidateId && x.candidateId === filter.candidateId) || (filter.clientId && x.clientId === filter.clientId) || (filter.jobId && x.jobId === filter.jobId);

  const items = useMemo(() => {
    const n = notes.filter(match).map((x) => ({ id: x.id, when: fmtDate(x.at, { weekday: "short", day: "numeric", month: "short" }), who: x.who, kind: x.kind, text: x.text }));
    const a = activities.filter(match).map((x) => ({ id: x.id, when: /^\d/.test(x.at) ? `Today ${x.at}` : x.at, who: x.who === "System" ? "Automation" : x.who, kind: x.kind, text: x.text }));
    return [...a, ...n];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, activities, filter.candidateId, filter.clientId, filter.jobId]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          addNote({ who: "Sam", kind, text: text.trim(), ...filter });
          setText("");
          toast(kind === "note" ? "Note saved" : `${kind[0].toUpperCase() + kind.slice(1)} logged`);
        }}
        className="mb-5 rounded-lg border border-gborder p-3"
      >
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="Add a note, or log a call or meeting" className={`${inputCls} h-auto resize-y py-2`} />
        <div className="mt-2 flex items-center justify-between gap-2">
          <Select value={kind} onChange={(v) => setKind(v as Note["kind"])} options={[["note", "Note"], ["call", "Call"], ["email", "Email"], ["meeting", "Meeting"]]} className="w-auto" />
          <Button type="submit" variant="primary" size="sm" disabled={!text.trim()}>Save</Button>
        </div>
      </form>
      {items.length ? (
        <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-px before:bg-gborder">
          {items.map((i) => (
            <li key={i.id} className="relative flex gap-3">
              <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gborder bg-white text-gmuted">{kindIcon(i.kind)}</span>
              <div className="min-w-0 pt-0.5 text-[13px]">
                <p className="text-[12px] text-gmuted">{i.who}, {i.when}</p>
                <p className="mt-0.5 leading-[1.5]">{i.text}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-6 text-center text-[13px] text-gmuted">Nothing logged yet.</p>
      )}
    </div>
  );
}
