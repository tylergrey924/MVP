import { CheckCircle2, Database, FileCode2, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getSeedStatus } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function SeedStatusPage() {
  const status = await getSeedStatus();
  const isSupabaseMode = status.mode === "supabase";
  const Icon = isSupabaseMode ? CheckCircle2 : TriangleAlert;

  return (
    <div>
      <PageHeader
        eyebrow="Synthetic Data Admin"
        title="Backend readiness and seed status"
        description="A practical admin surface for showing how the demo can be reset, seeded, and validated in Vercel-connected environments."
      />

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <Icon
              size={24}
              className={status.supabaseConfigured ? "text-emerald-700" : "text-amber-700"}
              aria-hidden="true"
            />
            <div>
              <h2 className="text-lg font-semibold text-summit-ink">
                {isSupabaseMode ? "Supabase seed data detected" : "Mock mode active"}
              </h2>
              <p className="text-sm text-slate-600">
                {status.supabaseConfigured
                  ? "Environment variables are present. Counts below come from hosted Supabase when tables are available."
                  : "Add Supabase env vars in Vercel or .env.local to connect the backend. The app still renders with fallback data."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <StatusTile
              label="Detected records"
              value={status.syntheticRecords.toLocaleString("en-US")}
            />
            <StatusTile label="Last seeded" value={status.lastSeededAt ?? "Not recorded"} />
          </div>
        </div>

        <div className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-summit-teal" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-summit-ink">Demo table counts</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {status.tableCounts.map((item) => (
              <div
                key={item.table}
                className="flex items-center justify-between gap-3 rounded-md border border-summit-line p-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileCode2 size={17} className="shrink-0 text-summit-teal" aria-hidden="true" />
                  <span className="truncate font-mono text-sm text-slate-700">{item.table}</span>
                </div>
                <span className="rounded-md bg-summit-cloud px-2 py-1 font-mono text-xs font-semibold text-summit-ink">
                  {item.count === null ? "n/a" : item.count.toLocaleString("en-US")}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Run <span className="font-mono text-summit-pine">npm run seed</span> after applying{" "}
            <span className="font-mono text-summit-pine">supabase/schema.sql</span> and setting{" "}
            <span className="font-mono text-summit-pine">SUPABASE_SERVICE_ROLE_KEY</span>.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-summit-line bg-summit-cloud p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-summit-ink">{value}</p>
    </div>
  );
}
