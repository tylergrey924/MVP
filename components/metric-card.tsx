import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <article className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-summit-ink">{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-summit-cloud text-summit-pine">
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-500">{helper}</p>
    </article>
  );
}
