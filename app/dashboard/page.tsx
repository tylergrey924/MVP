import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Banknote,
  CalendarCheck2,
  ClipboardList,
  DollarSign,
  Gauge,
  Lightbulb,
  PackageCheck,
  ReceiptText,
  Star,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getDashboardData } from "@/lib/demo-data";
import type {
  BreakdownPoint,
  ExecutiveDashboardData,
  ExecutiveKpi,
  TechnicianWorkload,
  TrendPoint
} from "@/lib/types";

export const dynamic = "force-dynamic";

const kpiIcons: LucideIcon[] = [
  DollarSign,
  CalendarCheck2,
  Banknote,
  ReceiptText,
  PackageCheck,
  Star,
  Gauge,
  ClipboardList
];

const summaryIcons: LucideIcon[] = [
  ReceiptText,
  Wrench,
  Star
];

const toneClasses = {
  good: "bg-emerald-50 text-emerald-700",
  warn: "bg-amber-50 text-amber-800",
  neutral: "bg-slate-100 text-slate-700"
};

const toneBorderClasses = {
  good: "border-emerald-200",
  warn: "border-amber-200",
  neutral: "border-summit-line"
};

const toneIconClasses = {
  good: "bg-emerald-50 text-emerald-700",
  warn: "bg-amber-50 text-amber-800",
  neutral: "bg-summit-cloud text-summit-pine"
};

const chartColors = [
  "bg-summit-teal",
  "bg-summit-pine",
  "bg-summit-gold",
  "bg-slate-500",
  "bg-emerald-600",
  "bg-amber-600"
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export default async function DashboardPage() {
  const { executive } = await getDashboardData();

  return (
    <div>
      <PageHeader
        eyebrow="Executive Dashboard"
        title="Summit Home Services operating cockpit"
        description="Owner-ready visibility across revenue, jobs, cash collection, technician productivity, service profitability, and customer experience."
        source={executive.source}
      />

      <DashboardBanner dashboard={executive} />
      <ExecutiveSnapshot dashboard={executive} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {executive.kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} kpi={kpi} icon={kpiIcons[index] ?? BarChart3} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Revenue by month" description="Paid invoice revenue across recent active months">
          <ColumnChart points={executive.revenueByMonth} />
        </Panel>
        <Panel title="AI-style insights" description="Deterministic observations generated from data">
          <StackedList items={executive.insights} icon={Lightbulb} />
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Jobs by service category" description="Volume mix across core service lines">
          <HorizontalBars points={executive.jobsByServiceCategory} />
        </Panel>
        <Panel title="Work order status" description="Operational queue health">
          <HorizontalBars points={executive.workOrderStatusBreakdown} />
        </Panel>
        <Panel title="Overdue invoices" description="Balance by aging bucket">
          <HorizontalBars
            points={executive.overdueInvoicesByAge}
            valueFormatter={(value) => currency.format(value)}
          />
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel title="Technician workload and utilization" description="Dispatch balancing view by field employee">
          <TechnicianTable technicians={executive.technicianWorkload} />
        </Panel>
        <Panel title="Average rating trend" description="Customer experience across recent months">
          <RatingTrend points={executive.averageRatingTrend} />
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Recommended actions" description="Owner and office-manager next steps">
          <NumberedList items={executive.recommendedActions} />
        </Panel>
        <Panel title="Demo talk track" description="How this translates into consulting value">
          <div className="grid gap-3 md:grid-cols-2">
            {executive.talkTrack.map((item) => (
              <div key={item} className="rounded-md border border-summit-line bg-summit-cloud p-3">
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function ExecutiveSnapshot({ dashboard }: { dashboard: ExecutiveDashboardData }) {
  const summary = [
    {
      label: "Cash focus",
      value: getKpiValue(dashboard, "Overdue invoice balance"),
      detail: "What the office should collect or keep current this week."
    },
    {
      label: "Field queue",
      value: getKpiValue(dashboard, "Open work orders"),
      detail: "Jobs that still need dispatch attention or completion."
    },
    {
      label: "Customer pulse",
      value: getKpiValue(dashboard, "Average customer rating"),
      detail: "Visible signal for service quality and follow-up needs."
    }
  ];

  return (
    <section className="mb-6 grid gap-4 lg:grid-cols-3">
      {summary.map((item, index) => {
        const Icon = summaryIcons[index] ?? BarChart3;
        return (
          <article key={item.label} className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-summit-pine text-white">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-summit-teal">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-summit-ink">{item.value}</p>
                <p className="mt-2 text-sm leading-5 text-slate-600">{item.detail}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function getKpiValue(dashboard: ExecutiveDashboardData, label: string) {
  return dashboard.kpis.find((kpi) => kpi.label === label)?.value ?? "n/a";
}

function DashboardBanner({ dashboard }: { dashboard: ExecutiveDashboardData }) {
  const ready = dashboard.status === "ready" && !dashboard.message;

  return (
    <div
      className={`mb-6 flex items-center gap-3 rounded-md border px-4 py-3 text-sm ${
        ready
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      {ready ? <ArrowUpRight size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
      <span>
        {ready
          ? `Dashboard is using ${dashboard.source} data with calculated metrics and trends.`
          : dashboard.message ?? "No seeded operating data was found. Mock fallback remains available."}
      </span>
    </div>
  );
}

function KpiCard({ kpi, icon: Icon }: { kpi: ExecutiveKpi; icon: LucideIcon }) {
  return (
    <article className={`rounded-md border bg-white p-5 shadow-panel ${toneBorderClasses[kpi.tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
          <p className="mt-3 text-3xl font-bold text-summit-ink">{kpi.value}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${toneIconClasses[kpi.tone]}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
      <p className={`mt-4 w-fit rounded-md px-2 py-1 text-xs font-semibold ${toneClasses[kpi.tone]}`}>
        {kpi.delta}
      </p>
      <p className="mt-3 text-sm leading-5 text-slate-500">{kpi.helper}</p>
    </article>
  );
}

function Panel({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-summit-line bg-white shadow-panel">
      <div className="border-b border-summit-line px-5 py-4">
        <h2 className="text-lg font-semibold text-summit-ink">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ColumnChart({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) return <EmptyState />;
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="flex min-h-72 items-end gap-3">
      {points.map((point) => (
        <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex h-56 w-full items-end rounded-md bg-summit-cloud px-2">
            <div
              className="w-full rounded-t-md bg-summit-teal transition-all"
              style={{ height: `${Math.max(8, (point.value / maxValue) * 220)}px` }}
              title={currency.format(point.value)}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-500">{point.label}</p>
            <p className="mt-1 text-xs font-bold text-summit-ink">{currency.format(point.value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function HorizontalBars({
  points,
  valueFormatter = (value) => value.toLocaleString("en-US")
}: {
  points: BreakdownPoint[];
  valueFormatter?: (value: number) => string;
}) {
  if (points.length === 0) return <EmptyState />;
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="space-y-4">
      {points.map((point, index) => (
        <div key={point.label}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-summit-ink">{point.label}</span>
            <span className="font-semibold text-slate-600">{valueFormatter(point.value)}</span>
          </div>
          <div className="h-3 rounded-full bg-summit-cloud">
            <div
              className={`h-3 rounded-full ${chartColors[index % chartColors.length]}`}
              style={{ width: `${Math.max(4, (point.value / maxValue) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TechnicianTable({ technicians: workload }: { technicians: TechnicianWorkload[] }) {
  if (workload.length === 0) return <EmptyState />;

  return (
    <div className="overflow-hidden rounded-md border border-summit-line">
      <div className="grid grid-cols-[1.15fr_0.9fr_0.65fr] bg-summit-cloud px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Technician</span>
        <span>Utilization</span>
        <span className="text-right">Jobs</span>
      </div>
      <div className="divide-y divide-summit-line">
        {workload.map((tech) => (
          <div key={tech.name} className="grid grid-cols-[1.15fr_0.9fr_0.65fr] items-center gap-3 px-4 py-3 text-sm">
            <div>
              <p className="font-semibold text-summit-ink">{tech.name}</p>
              <p className="text-xs text-slate-500">{currency.format(tech.averageTicket)} avg ticket</p>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Load</span>
                <span>{tech.utilization}%</span>
              </div>
              <div className="h-2 rounded-full bg-summit-cloud">
                <div
                  className="h-2 rounded-full bg-summit-pine"
                  style={{ width: `${Math.min(100, Math.max(0, tech.utilization))}%` }}
                />
              </div>
            </div>
            <p className="text-right font-semibold text-summit-ink">{tech.jobsCompleted}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatingTrend({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) return <EmptyState />;
  const maxValue = Math.max(...points.map((point) => point.value), 5);

  return (
    <div className="space-y-4">
      {points.map((point) => (
        <div key={point.label} className="grid grid-cols-[3rem_1fr_4rem] items-center gap-3">
          <span className="text-sm font-semibold text-slate-500">{point.label}</span>
          <div className="h-3 rounded-full bg-summit-cloud">
            <div
              className="h-3 rounded-full bg-summit-gold"
              style={{ width: `${Math.max(4, (point.value / maxValue) * 100)}%` }}
            />
          </div>
          <span className="text-right text-sm font-bold text-summit-ink">{point.value.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

function StackedList({ items, icon: Icon }: { items: string[]; icon: LucideIcon }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex gap-3 rounded-md border border-summit-line bg-summit-cloud p-3">
          <Icon size={18} className="mt-0.5 shrink-0 text-summit-gold" aria-hidden="true" />
          <p className="text-sm leading-6 text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item} className="flex gap-3 rounded-md border border-summit-line p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-summit-pine text-sm font-bold text-white">
            {index + 1}
          </span>
          <p className="text-sm leading-6 text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-summit-line bg-summit-cloud px-4 text-center text-sm text-slate-500">
      No data available yet. Seed Supabase or use mock fallback data for the portfolio demo.
    </div>
  );
}
