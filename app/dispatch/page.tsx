import { AlertTriangle, MessageSquareText, Package, Route, UserRoundCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DispatchAssistant } from "@/app/dispatch/dispatch-assistant";
import { getDispatchData } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function DispatchPage() {
  const data = await getDispatchData();

  return (
    <div>
      <PageHeader
        eyebrow="Dispatch / Work Order Assistant"
        title="Prioritize the work before the schedule gets noisy"
        description="A demo dispatch workspace for urgent jobs, customer follow-ups, technician capacity, and parts risks."
        source={data.source}
      />

      <DispatchAssistant source={data.source} technicians={data.technicians} parts={data.partsInventory} />

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Priority work orders" icon={Route}>
          {data.urgentWorkOrders.length ? (
            <div className="divide-y divide-summit-line">
              {data.urgentWorkOrders.map((order) => (
                <article key={order.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-summit-cloud px-2 py-1 text-xs font-semibold text-summit-pine">
                      {order.serviceCategory}
                    </span>
                    <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                      {order.priority}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {order.status}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-summit-ink">{order.summary}</h3>
                  <p className="mt-1 text-sm text-slate-600">Scheduled {order.scheduledDate}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyPanelText>No emergency or delayed work orders are currently visible.</EmptyPanelText>
          )}
        </Panel>

        <Panel title="Parts risk" icon={Package}>
          {data.lowStockParts.length ? (
            <div className="space-y-3">
              {data.lowStockParts.map((part) => (
                <div key={part.id} className="rounded-md border border-summit-line p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-summit-ink">{part.name}</p>
                      <p className="text-xs font-medium text-slate-500">{part.sku}</p>
                    </div>
                    <AlertTriangle size={18} className="text-amber-700" aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {part.quantityOnHand} on hand; reorder point is {part.reorderPoint}.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPanelText>No low-stock parts are visible in the current dataset.</EmptyPanelText>
          )}
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Technician availability" icon={UserRoundCheck}>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.technicians.map((tech) => (
              <div key={tech.id} className="rounded-md border border-summit-line p-3">
                <p className="font-semibold text-summit-ink">{tech.name}</p>
                <p className="text-sm text-slate-600">{tech.role}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent customer messages" icon={MessageSquareText}>
          <div className="space-y-3">
            {data.messages.map((message) => (
              <div key={message.id} className="rounded-md border border-summit-line bg-summit-cloud p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-summit-pine">{message.channel}</span>
                  <span className="text-xs text-slate-500">{message.sentiment}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{message.body}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={20} className="text-summit-teal" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-summit-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptyPanelText({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-summit-line bg-summit-cloud p-4 text-sm leading-6 text-slate-600">
      {children}
    </div>
  );
}
