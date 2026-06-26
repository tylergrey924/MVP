import { StatusPill } from "@/components/status-pill";
import type { DataSource } from "@/lib/types";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  source?: DataSource;
};

export function PageHeader({ eyebrow, title, description, source }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-summit-teal">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold text-summit-ink md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
      </div>
      {source ? <StatusPill source={source} /> : null}
    </header>
  );
}
