import type { Status } from "./types";

export function StatusPill({ status }: { status: Status }) {
  const cls =
    status === "Live"
      ? "bg-[#e8f4ee] text-gsuccess"
      : status === "Built"
        ? "bg-action-tint text-action"
        : "bg-gsecondary text-gmuted";
  const label =
    status === "Live"
      ? "In use"
      : status === "Built"
        ? "Built"
        : "Built, not switched on";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11.5px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
