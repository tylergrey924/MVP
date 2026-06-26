import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  CheckCircle2,
  ClipboardList,
  Gauge,
  MessageSquareText,
  Route,
  Search,
  Sparkles,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getRuntimeModeLabel } from "@/lib/runtime";

const modules = [
  {
    title: "Executive Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    problem: "Owners are making decisions from Excel exports, late invoices, and scattered job notes.",
    solution: "A single operating view for revenue, jobs, cash collection, technician workload, and ratings.",
    outcome: "Faster weekly decisions without building a full analytics team."
  },
  {
    title: "Dispatch Assistant",
    href: "/dispatch",
    icon: Route,
    problem: "Dispatchers manually classify requests, judge urgency, and write repetitive customer replies.",
    solution: "Deterministic AI-style intake that classifies jobs, suggests parts, and drafts next-step notes.",
    outcome: "Less admin time and more consistent handling of urgent service requests."
  },
  {
    title: "Knowledge Assistant",
    href: "/knowledge",
    icon: BookOpenText,
    problem: "SOPs, policies, and training guidance live in shared folders, memory, and paper binders.",
    solution: "A searchable internal assistant with cited SOP excerpts and recommended next steps.",
    outcome: "Faster employee answers while keeping source documents visible."
  }
];

const walkthrough = [
  {
    step: "Step 1",
    title: "Review business performance",
    description: "Open the Executive Dashboard to see cash, workload, jobs, ratings, and recommended actions.",
    href: "/dashboard"
  },
  {
    step: "Step 2",
    title: "Process a customer request",
    description: "Use Dispatch Assistant to classify an inbound request and create a draft work order.",
    href: "/dispatch"
  },
  {
    step: "Step 3",
    title: "Search internal SOPs",
    description: "Ask Knowledge Assistant how Summit should handle policies, job notes, parts, or escalation.",
    href: "/knowledge"
  }
];

const offers = [
  {
    title: "AI Workflow Audit",
    description: "Map repetitive admin work, identify automation candidates, and prioritize low-risk wins."
  },
  {
    title: "Executive Dashboard Sprint",
    description: "Turn operational data into owner-ready KPIs, trends, and weekly decision views."
  },
  {
    title: "Dispatch Automation Prototype",
    description: "Prototype intake classification, response drafting, and draft work order workflows."
  },
  {
    title: "Internal Knowledge Assistant Sprint",
    description: "Organize SOPs into a searchable employee assistant with citations and confidence cues."
  }
];

const talkTrack = [
  "Introduce Summit Home Services as a fictional 18-person HVAC, plumbing, and electrical company using Outlook, Excel, QuickBooks, paper forms, and shared folders.",
  "Show how the dashboard gives the owner one place to understand revenue, overdue invoices, technician utilization, and customer experience.",
  "Move to dispatch and demonstrate how intake classification can reduce repetitive office work while keeping a human dispatcher in control.",
  "Search the knowledge assistant to show how scattered SOPs can become fast, cited employee guidance.",
  "Close by framing practical consulting offers: start with an audit, then ship one focused prototype tied to measurable admin time savings."
];

const valueProps = [
  { label: "Owner visibility", icon: Gauge },
  { label: "Cash collection", icon: ClipboardList },
  { label: "Admin automation", icon: Sparkles },
  { label: "Field consistency", icon: Wrench }
];

export default function HomePage() {
  const modeLabel = getRuntimeModeLabel();

  return (
    <div className="space-y-8">
      <section className="rounded-md border border-summit-line bg-white p-6 shadow-panel lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-summit-cloud px-3 py-1 text-xs font-semibold uppercase tracking-wide text-summit-teal">
                Consulting portfolio demo
              </span>
              <span className="rounded-md border border-summit-line bg-white px-3 py-1 text-xs font-semibold text-summit-pine">
                {modeLabel}
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-summit-ink md:text-5xl">
              Practical AI, analytics, and automation for a small home services company.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
              Summit Home Services is a fictional residential and light-commercial HVAC, plumbing,
              and electrical company. This MVP shows how a small business can reduce administrative
              work, organize knowledge, and make better operating decisions with a focused set of
              cloud-deployable tools.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-summit-pine px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-summit-teal"
              >
                Start walkthrough
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="#client-talk-track"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-summit-line bg-white px-4 py-2.5 text-sm font-semibold text-summit-pine transition hover:bg-summit-cloud"
              >
                View talk track
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-summit-line bg-summit-cloud p-5">
            <h2 className="text-lg font-semibold text-summit-ink">Business problems modeled</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Manual dispatching and slow customer response",
                "Late invoices and weak cash visibility",
                "Scattered SOPs and inconsistent job notes",
                "Limited insight into technician workload"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-md bg-white p-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-summit-teal" aria-hidden="true" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {valueProps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-md border border-summit-line bg-white p-4 shadow-panel">
              <Icon size={22} className="text-summit-teal" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-summit-ink">{item.label}</p>
            </div>
          );
        })}
      </section>

      <section>
        <SectionHeading
          eyebrow="Core Modules"
          title="Three connected demo workflows"
          description="Each module maps a real small-business pain point to a practical prototype that can be deployed on Vercel and backed by hosted Supabase."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.title} module={module} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Demo Walkthrough"
          title="A simple guided flow"
          description="Use this sequence when presenting the MVP to a prospective client or business owner."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {walkthrough.map((item) => (
            <Link
              key={item.step}
              href={item.href}
              className="group rounded-md border border-summit-line bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-summit-teal"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-summit-teal">{item.step}</p>
              <h3 className="mt-2 text-lg font-semibold text-summit-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-summit-pine">
                Open module
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="client-talk-track" className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="rounded-md border border-summit-line bg-white p-6 shadow-panel">
          <SectionHeading
            eyebrow="Client Talk Track"
            title="How to present this in five minutes"
            description="Keep the story grounded in operations: show the problem, the workflow, and the measurable next step."
            compact
          />
          <div className="mt-5 space-y-3">
            {talkTrack.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-md border border-summit-line bg-summit-cloud p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-sm font-bold text-summit-pine">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-summit-line bg-white p-6 shadow-panel">
          <SectionHeading
            eyebrow="Offer Framing"
            title="Productized consulting entry points"
            description="Small, clear engagements that turn the demo into a practical sales conversation."
            compact
          />
          <div className="mt-5 space-y-3">
            {offers.map((offer) => (
              <div key={offer.title} className="rounded-md border border-summit-line p-4">
                <h3 className="font-semibold text-summit-ink">{offer.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({
  module
}: {
  module: {
    title: string;
    href: string;
    icon: LucideIcon;
    problem: string;
    solution: string;
    outcome: string;
  };
}) {
  const Icon = module.icon;

  return (
    <article className="flex h-full flex-col rounded-md border border-summit-line bg-white p-5 shadow-panel">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-summit-pine text-white">
          <Icon size={22} aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold text-summit-ink">{module.title}</h3>
      </div>
      <div className="mt-5 space-y-4">
        <ModuleDetail label="Business problem" text={module.problem} icon={Search} />
        <ModuleDetail label="Solution" text={module.solution} icon={Sparkles} />
        <ModuleDetail label="Expected outcome" text={module.outcome} icon={MessageSquareText} />
      </div>
      <Link
        href={module.href}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border border-summit-line px-4 py-2.5 text-sm font-semibold text-summit-pine transition hover:bg-summit-cloud"
      >
        Open {module.title}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

function ModuleDetail({ label, text, icon: Icon }: { label: string; text: string; icon: LucideIcon }) {
  return (
    <div className="flex gap-3">
      <Icon size={17} className="mt-1 shrink-0 text-summit-teal" aria-hidden="true" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">{text}</p>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  compact = false
}: {
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "mb-5"}>
      <p className="text-sm font-semibold uppercase tracking-wide text-summit-teal">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-summit-ink md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}
