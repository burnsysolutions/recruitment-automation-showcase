import type { Job } from "../data/seed";

export const salary = (j: Job) => Math.round((j.payRate * 1560) / 1000) * 1000;

export function PayValue({ j, unitClass = "text-[14px] font-normal text-steel" }: { j: Job; unitClass?: string }) {
  if (j.type === "Permanent")
    return (
      <>
        £{salary(j).toLocaleString("en-GB")}
        <span className={unitClass}> a year</span>
      </>
    );
  return (
    <>
      £{j.payRate.toFixed(2)}
      <span className={unitClass}>/hr</span>
    </>
  );
}

export const payText = (j: Job) => (j.type === "Permanent" ? `£${salary(j).toLocaleString("en-GB")} a year` : `£${j.payRate.toFixed(2)}/hr`);
