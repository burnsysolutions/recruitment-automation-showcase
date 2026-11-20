import { Link } from "react-router-dom";
import { useState } from "react";
import { useStore, setState, CONSULTANTS, clientById, fullName } from "../data/store";
import { Page, Panel, Button, Badge, inputBase, Select, Tabs, Empty, toast } from "./ui";
import { fmtDate } from "../data/match";
import { TODAY } from "../data/seed";
import type { Task } from "../data/seed";

const today = TODAY.toISOString().slice(0, 10);

function dueTone(t: Task) {
  if (t.done) return "grey";
  if (t.due < today) return "red";
  if (t.due === today) return "amber";
  return "grey";
}
function dueLabel(t: Task) {
  if (t.due < today) return `Overdue, ${fmtDate(t.due)}`;
  if (t.due === today) return "Today";
  return fmtDate(t.due, { weekday: "short", day: "numeric", month: "short" });
}

function TaskForm({ link }: { link: Partial<Task> }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState(today);
  const [owner, setOwner] = useState<string>("Sam");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setState((s) => ({ ...s, tasks: [{ id: `tk${Date.now()}`, title: title.trim(), due, owner, done: false, ...link }, ...s.tasks] }));
        setTitle("");
        toast("Task added");
      }}
      className="flex flex-wrap gap-2"
    >
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" className={`${inputBase} min-w-[220px] flex-1`} />
      <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={`${inputBase} w-auto`} />
      <Select value={owner} onChange={setOwner} options={[...CONSULTANTS]} className="w-auto" />
      <Button type="submit" variant="primary" disabled={!title.trim()}>Add</Button>
    </form>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  const candidates = useStore((s) => s.candidates);
  if (!tasks.length) return <Empty title="Nothing to do here" body="Add a task above and it will show on the Desk on the day it is due." />;
  return (
    <ul className="divide-y divide-gborder">
      {tasks.map((t) => {
        const cand = t.candidateId ? candidates.find((c) => c.id === t.candidateId) : undefined;
        return (
          <li key={t.id} className="flex items-start gap-3 px-5 py-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#002149]"
              checked={t.done}
              aria-label={`Mark ${t.title} done`}
              onChange={() => {
                setState((s) => ({ ...s, tasks: s.tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) }));
                if (!t.done) toast("Task done");
              }}
            />
            <div className="min-w-0 flex-1 text-[13px]">
              <p className={t.done ? "text-gmuted line-through" : "font-medium"}>{t.title}</p>
              <p className="text-[12px] text-gmuted">
                {t.owner}
                {t.clientId ? <>{", "}<Link className="hover:underline" to={`/crm/clients/${t.clientId}`}>{clientById(t.clientId).name}</Link></> : null}
                {cand ? <>{", "}<Link className="hover:underline" to={`/crm/candidates/${cand.id}`}>{fullName(cand)}</Link></> : null}
              </p>
            </div>
            <Badge tone={dueTone(t)}>{t.done ? "Done" : dueLabel(t)}</Badge>
          </li>
        );
      })}
    </ul>
  );
}

export function TasksPanel(link: Partial<Task>) {
  const tasks = useStore((s) => s.tasks).filter((t) => (link.candidateId && t.candidateId === link.candidateId) || (link.clientId && t.clientId === link.clientId) || (link.jobId && t.jobId === link.jobId));
  return (
    <div className="space-y-4">
      <TaskForm link={link} />
      <div className="rounded-lg border border-gborder">
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}

export function TasksPage() {
  const tasks = useStore((s) => s.tasks);
  const [tab, setTab] = useState("mine");
  const open = tasks.filter((t) => !t.done);
  const list = (tab === "mine" ? open.filter((t) => t.owner === "Sam") : tab === "all" ? open : tasks.filter((t) => t.done)).sort((a, b) => a.due.localeCompare(b.due));
  return (
    <Page title="Tasks" context={`${open.filter((t) => t.due <= today).length} due today or overdue`}>
      <Panel>
        <div className="border-b border-gborder p-4">
          <TaskForm link={{}} />
        </div>
        <div className="px-5 pt-3">
          <Tabs value={tab} onChange={setTab} tabs={[["mine", "Mine", open.filter((t) => t.owner === "Sam").length], ["all", "Everyone", open.length], ["done", "Done", tasks.filter((t) => t.done).length]]} />
        </div>
        <TaskList tasks={list} />
      </Panel>
    </Page>
  );
}
