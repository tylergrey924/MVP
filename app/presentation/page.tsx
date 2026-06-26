import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  ClipboardCheck,
  Clock3,
  Gauge,
  MessageSquareText,
  Presentation,
  ReceiptText,
  RotateCcw,
  Route,
  Sparkles,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getRuntimeModeLabel } from "@/lib/runtime";

const steps = [
  {
    number: "01",
    title: "Business context",
    label: "Set the scene",
    icon: UsersRound,
    clientFacing:
      "Summit Home Services is a fictional 18-person HVAC, plumbing, and electrical firm. The company is large enough to feel operational complexity, but not large enough to justify a dedicated analytics or automation team.",
    presenterNotes:
      "Frame this as a familiar small-business operating picture: Outlook, Excel, QuickBooks, paper forms, shared folders, and a lot of knowledge living in people heads.",
    nextClick: "Move into the owner view and show where the business stands on Monday morning.",
    highlights: [
      "Manual dispatching makes urgent work harder to triage.",
      "Scattered SOPs slow down training and consistent service.",
      "Weak KPI visibility makes it hard to spot cash and capacity issues.",
      "Late invoices and inconsistent technician notes create office follow-up work."
    ]
  },
  {
    number: "02",
    title: "Monday Morning Owner View",
    label: "Show the operating cockpit",
    icon: BarChart3,
    href: "/dashboard",
    cta: "Open Executive Dashboard",
    clientFacing:
      "The dashboard turns scattered operational data into a single owner-ready view of revenue, overdue invoices, open jobs, technician workload, customer rating, and recommended actions.",
    presenterNotes:
      "Tell the story like an owner starting the week: What cash is at risk? Which jobs are still open? Is the team balanced? Are customers happy enough to keep referring us?",
    nextClick: "Open the dashboard, point to KPI cards first, then use recommendations as the bridge into action.",
    highlights: [
      "Revenue and completed jobs show whether the month is on track.",
      "Overdue invoice balance makes cash collection visible.",
      "Technician workload shows dispatch balancing opportunities.",
      "Open jobs and average rating connect operations to customer experience."
    ]
  },
  {
    number: "03",
    title: "Emergency Service Intake",
    label: "Process a high-pressure request",
    icon: Route,
    href: "/dispatch",
    cta: "Open Dispatch Assistant",
    scenario: "My AC stopped working and it is 89 degrees inside. We have an elderly parent in the home.",
    clientFacing:
      "The Dispatch Assistant demonstrates how intake can be classified, prioritized, and drafted consistently while keeping the dispatcher in control.",
    presenterNotes:
      "Use the prewritten AC scenario to show how practical AI can reduce repetitive typing and triage work without replacing the dispatcher judgment.",
    nextClick: "Open Dispatch Assistant, paste or type the scenario, run classification, then show the draft customer response and internal notes.",
    highlights: [
      "Classifies the request as urgent HVAC service.",
      "Identifies likely parts and technician fit.",
      "Drafts a customer response for faster communication.",
      "Creates a draft work order when Supabase is connected."
    ]
  },
  {
    number: "04",
    title: "Technician SOP Lookup",
    label: "Find company knowledge",
    icon: BookOpenText,
    href: "/knowledge",
    cta: "Open Knowledge Assistant",
    scenario: "What should I do for an emergency no-cool call?",
    clientFacing:
      "The Knowledge Assistant shows how scattered SOPs, policies, and training notes can become searchable employee guidance with source citations.",
    presenterNotes:
      "Emphasize that this is deterministic demo retrieval today: no paid AI API, no embeddings, and no black-box answer without citations.",
    nextClick: "Open Knowledge Assistant, use the sample SOP question, then call out the cited source and recommended next step.",
    highlights: [
      "Searches seeded SOP articles and fallback mock knowledge.",
      "Returns a cited answer with relevant excerpt.",
      "Suggests an operational next step.",
      "Reduces tribal knowledge while keeping policy verification visible."
    ]
  },
  {
    number: "05",
    title: "Closing and consulting offer",
    label: "Turn demo into next steps",
    icon: BriefcaseBusiness,
    clientFacing:
      "This demo shows how a small business can start with practical AI systems before investing in larger-scale automation.",
    presenterNotes:
      "Close with a low-risk next step. The best first engagement is usually a workflow audit or one focused prototype tied to a measurable admin burden.",
    nextClick: "Restart the presentation or return to the overview page for module cards and offer framing.",
    highlights: [
      "AI Workflow Audit",
      "Executive Dashboard Sprint",
      "Dispatch Automation Prototype",
      "Internal Knowledge Assistant Sprint"
    ]
  }
];

const storyMetrics = [
  { label: "Demo length", value: "5-7 min", icon: Clock3 },
  { label: "Audience", value: "Owner/operator", icon: UsersRound },
  { label: "Data mode", value: "Supabase or mock", icon: Gauge },
  { label: "Goal", value: "Practical next step", icon: ClipboardCheck }
];

export default function PresentationPage() {
  const modeLabel = getRuntimeModeLabel();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-md border border-summit-line bg-white shadow-panel">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md bg-summit-pine px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                <Presentation size={14} aria-hidden="true" />
                Presentation Mode
              </span>
              <span className="rounded-md border border-summit-line bg-summit-cloud px-3 py-1 text-xs font-semibold text-summit-pine">
                {modeLabel}
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-summit-ink md:text-5xl">
              A guided client demo for practical AI operations.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
              Use this walkthrough to present Summit Home Services as a realistic small-business
              operating story: start with pain points, show the owner dashboard, process an urgent
              intake, search internal SOPs, and close with clear consulting offers.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#step-01"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-summit-pine px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-summit-teal"
              >
                Start Demo
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-summit-line bg-white px-4 py-2.5 text-sm font-semibold text-summit-pine transition hover:bg-summit-cloud"
              >
                Back to overview
              </Link>
            </div>
          </div>

          <div className="border-t border-summit-line bg-summit-cloud p-6 lg:border-l lg:border-t-0 lg:p-8">
            <h2 className="text-lg font-semibold text-summit-ink">Progress</h2>
            <div className="mt-5 space-y-3">
              {steps.map((step) => (
                <a
                  key={step.number}
                  href={`#step-${step.number}`}
                  className="flex items-center gap-3 rounded-md bg-white p-3 text-sm transition hover:ring-2 hover:ring-summit-teal/30"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-summit-pine text-xs font-bold text-white">
                    {step.number}
                  </span>
                  <span>
                    <span className="block font-semibold text-summit-ink">{step.title}</span>
                    <span className="block text-xs text-slate-500">{step.label}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {storyMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-md border border-summit-line bg-white p-4 shadow-panel">
              <Icon size={21} className="text-summit-teal" aria-hidden="true" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
              <p className="mt-1 text-lg font-bold text-summit-ink">{metric.value}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-6">
        {steps.map((step, index) => (
          <PresentationStep key={step.number} step={step} nextStepNumber={steps[index + 1]?.number} />
        ))}
      </section>
    </div>
  );
}

function PresentationStep({
  step,
  nextStepNumber
}: {
  step: {
    number: string;
    title: string;
    label: string;
    icon: LucideIcon;
    href?: string;
    cta?: string;
    scenario?: string;
    clientFacing: string;
    presenterNotes: string;
    nextClick: string;
    highlights: string[];
  };
  nextStepNumber?: string;
}) {
  const Icon = step.icon;

  return (
    <article id={`step-${step.number}`} className="scroll-mt-6 rounded-md border border-summit-line bg-white shadow-panel">
      <div className="border-b border-summit-line bg-summit-cloud p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-summit-pine text-white">
              <Icon size={24} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-summit-teal">
                {step.number} · {step.label}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-summit-ink">{step.title}</h2>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {step.href && step.cta ? (
              <Link
                href={step.href}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-summit-pine px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-summit-teal"
              >
                {step.cta}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ) : null}
            {nextStepNumber ? (
              <a
                href={`#step-${nextStepNumber}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-summit-line bg-white px-4 py-2.5 text-sm font-semibold text-summit-pine transition hover:bg-summit-cloud"
              >
                Next step
              </a>
            ) : (
              <a
                href="#step-01"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-summit-line bg-white px-4 py-2.5 text-sm font-semibold text-summit-pine transition hover:bg-summit-cloud"
              >
                <RotateCcw size={16} aria-hidden="true" />
                Restart Demo
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_0.85fr]">
        <div className="space-y-4">
          {step.scenario ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <MessageSquareText size={18} className="text-amber-800" aria-hidden="true" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-900">Scenario</h3>
              </div>
              <p className="text-base font-semibold leading-7 text-amber-950">&ldquo;{step.scenario}&rdquo;</p>
            </div>
          ) : null}

          <ContentBlock title="Client-facing explanation" icon={Sparkles} text={step.clientFacing} />
          <ContentBlock title="Presenter Notes" icon={Presentation} text={step.presenterNotes} />
          <ContentBlock title="What to click next" icon={ArrowRight} text={step.nextClick} />
        </div>

        <div className="rounded-md border border-summit-line bg-summit-cloud p-4">
          <h3 className="flex items-center gap-2 font-semibold text-summit-ink">
            <ReceiptText size={18} className="text-summit-teal" aria-hidden="true" />
            Story beats to call out
          </h3>
          <div className="mt-4 space-y-3">
            {step.highlights.map((highlight) => (
              <div key={highlight} className="rounded-md bg-white p-3">
                <p className="text-sm leading-6 text-slate-700">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function ContentBlock({ title, icon: Icon, text }: { title: string; icon: LucideIcon; text: string }) {
  return (
    <section className="rounded-md border border-summit-line p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={17} className="text-summit-teal" aria-hidden="true" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-700">{text}</p>
    </section>
  );
}
