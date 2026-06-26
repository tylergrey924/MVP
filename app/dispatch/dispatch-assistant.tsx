"use client";

import { useMemo, useState } from "react";
import { Bot, ClipboardCheck, ClipboardList, MessageSquareReply, Save, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { classifyIntake } from "@/lib/dispatch-assistant";
import type { DataSource, Employee, IntakeDraftInput, PartInventory } from "@/lib/types";

type DispatchAssistantProps = {
  source: DataSource;
  technicians: Employee[];
  parts: PartInventory[];
};

type DraftSave = {
  id: string;
  persisted: boolean;
  message: string;
};

const initialIntake: IntakeDraftInput = {
  customerName: "Chris Morgan",
  phone: "555-0198",
  email: "chris@example.com",
  address: "1220 Hillcrest Ave, Franklin, TN",
  message: "Our AC stopped cooling this afternoon and the house is getting very hot. Please send someone today if possible."
};

export function DispatchAssistant({ source, technicians, parts }: DispatchAssistantProps) {
  const [intake, setIntake] = useState<IntakeDraftInput>(initialIntake);
  const [drafts, setDrafts] = useState<DraftSave[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const classification = useMemo(
    () => classifyIntake(intake, technicians, parts),
    [intake, technicians, parts]
  );

  async function createDraftWorkOrder() {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/work-orders/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, technicians, parts })
      });
      const result = await response.json();
      const draftId = result.id ?? `local-${Date.now()}`;

      setDrafts((current) => [
        {
          id: draftId,
          persisted: Boolean(result.persisted),
          message: result.message ?? "Draft created for this demo session."
        },
        ...current
      ]);
      setSaveMessage(result.message ?? "Draft created for this demo session.");
    } catch {
      const draftId = `local-${Date.now()}`;
      setDrafts((current) => [
        {
          id: draftId,
          persisted: false,
          message: "Saved as a local demo draft because the request could not reach the server."
        },
        ...current
      ]);
      setSaveMessage("Saved as a local demo draft because the request could not reach the server.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-md border border-summit-line bg-white p-5 shadow-panel">
        <div className="mb-5 flex items-center gap-2">
          <ClipboardList size={20} className="text-summit-teal" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-summit-ink">Customer intake</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Customer"
            value={intake.customerName}
            onChange={(value) => setIntake((current) => ({ ...current, customerName: value }))}
          />
          <Field
            label="Phone"
            value={intake.phone}
            onChange={(value) => setIntake((current) => ({ ...current, phone: value }))}
          />
          <Field
            label="Email"
            value={intake.email}
            onChange={(value) => setIntake((current) => ({ ...current, email: value }))}
          />
          <Field
            label="Service address"
            value={intake.address}
            onChange={(value) => setIntake((current) => ({ ...current, address: value }))}
          />
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-600">Customer message</span>
          <textarea
            value={intake.message}
            onChange={(event) => setIntake((current) => ({ ...current, message: event.target.value }))}
            rows={6}
            className="mt-2 w-full resize-none rounded-md border border-summit-line px-3 py-2 text-sm text-summit-ink outline-none transition focus:border-summit-teal focus:ring-2 focus:ring-summit-teal/20"
          />
        </label>

        <button
          type="button"
          onClick={createDraftWorkOrder}
          disabled={isSaving || !intake.message.trim()}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-summit-pine px-4 py-2 text-sm font-semibold text-white transition hover:bg-summit-teal disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} aria-hidden="true" />
          {isSaving ? "Creating draft..." : "Create draft work order"}
        </button>

        {saveMessage ? (
          <p className="mt-3 rounded-md border border-summit-line bg-summit-cloud px-3 py-2 text-sm text-slate-700">
            {saveMessage}
          </p>
        ) : null}
      </div>

      <div className="rounded-md border border-summit-line bg-white shadow-panel">
        <div className="border-b border-summit-line px-5 py-4">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-summit-teal" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-summit-ink">AI-style dispatch classification</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Deterministic rules, no paid AI API calls. Current data mode: {source}.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <ClassificationTile label="Service category" value={classification.serviceCategory} />
          <ClassificationTile label="Urgency" value={classification.urgency} />
          <ClassificationTile label="Sentiment" value={classification.sentiment} />
          <ClassificationTile label="Confidence" value={`${classification.confidence}%`} />
          <ClassificationTile label="Recommended technician" value={classification.recommendedTechnicianName} wide />
          <ClassificationTile label="Likely parts" value={classification.likelyParts.join(", ")} wide />
        </div>

        <div className="grid gap-4 border-t border-summit-line p-5 lg:grid-cols-2">
          <DraftPanel icon={MessageSquareReply} title="Draft customer response" text={classification.draftCustomerResponse} />
          <DraftPanel icon={ClipboardCheck} title="Draft dispatcher notes" text={classification.draftDispatcherNotes} />
        </div>

        {drafts.length ? (
          <div className="border-t border-summit-line px-5 py-4">
            <p className="mb-3 text-sm font-semibold text-summit-ink">Created drafts this session</p>
            <div className="space-y-2">
              {drafts.slice(0, 3).map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 rounded-md bg-summit-cloud px-3 py-2 text-sm">
                  <span className="font-mono text-xs text-slate-600">{draft.id}</span>
                  <span className={draft.persisted ? "font-semibold text-emerald-700" : "font-semibold text-amber-800"}>
                    {draft.persisted ? "Supabase" : "Local demo"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-md border border-summit-line bg-white p-5 shadow-panel xl:col-span-2">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-summit-gold" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-summit-ink">Demo talk track</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Turns raw calls, emails, and texts into structured dispatch decisions.",
            "Reduces office-manager typing by drafting customer replies and internal notes.",
            "Surfaces urgency, sentiment, likely parts, and technician fit before scheduling.",
            "Creates a draft work order path while preserving mock fallback for demos."
          ].map((item) => (
            <p key={item} className="rounded-md border border-summit-line bg-summit-cloud p-3 text-sm leading-6 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-summit-line px-3 text-sm text-summit-ink outline-none transition focus:border-summit-teal focus:ring-2 focus:ring-summit-teal/20"
      />
    </label>
  );
}

function ClassificationTile({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-md border border-summit-line bg-summit-cloud p-3 ${wide ? "md:col-span-2" : ""}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-summit-ink">{value}</p>
    </div>
  );
}

function DraftPanel({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-md border border-summit-line p-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-summit-teal" aria-hidden="true" />
        <p className="font-semibold text-summit-ink">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}
