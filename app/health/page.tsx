import { Activity, CheckCircle2, Clock, Database, GitCommit, Server, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getSeedStatus } from "@/lib/demo-data";
import {
  checkSupabaseConnectivity,
  getBuildVersion,
  getEnvironmentName,
  getRuntimeMode,
  getRuntimeModeLabel
} from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function HealthPage() {
  const [connectivity, seedStatus] = await Promise.all([checkSupabaseConnectivity(), getSeedStatus()]);
  const mode = getRuntimeMode();
  const now = new Date().toISOString();

  return (
    <div>
      <PageHeader
        eyebrow="Deployment Health"
        title="Vercel readiness check"
        description="A lightweight page for verifying environment, data mode, Supabase connectivity, seed status, and build metadata after each deployment."
        source={mode}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <HealthTile icon={GitCommit} label="Build version" value={getBuildVersion()} />
        <HealthTile icon={Server} label="Environment" value={getEnvironmentName()} />
        <HealthTile icon={Activity} label="Data mode" value={getRuntimeModeLabel()} />
        <HealthTile
          icon={connectivity.ok ? CheckCircle2 : TriangleAlert}
          label="Supabase connectivity"
          value={connectivity.ok ? "Connected" : connectivity.configured ? "Configured, not reachable" : "Not configured"}
          helper={connectivity.message}
        />
        <HealthTile
          icon={Database}
          label="Seed status"
          value={`${seedStatus.syntheticRecords.toLocaleString("en-US")} records visible`}
          helper={seedStatus.lastSeededAt ? `Last seeded: ${seedStatus.lastSeededAt}` : "No seed run recorded"}
        />
        <HealthTile icon={Clock} label="Current timestamp" value={now} />
      </section>
    </div>
  );
}

function HealthTile({
  icon: Icon,
  label,
  value,
  helper
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <article className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-summit-cloud text-summit-pine">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 break-words font-semibold text-summit-ink">{value}</p>
        </div>
      </div>
      {helper ? <p className="mt-4 text-sm leading-6 text-slate-600">{helper}</p> : null}
    </article>
  );
}
