import Link from "next/link";
import { Activity, BarChart3, BookOpenText, DatabaseZap, Home, Mountain, Presentation, Route } from "lucide-react";
import { getRuntimeModeLabel } from "@/lib/runtime";

const navigation = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/presentation", label: "Presentation", icon: Presentation },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dispatch", label: "Dispatch", icon: Route },
  { href: "/knowledge", label: "Knowledge", icon: BookOpenText },
  { href: "/admin/seed-status", label: "Seed Status", icon: DatabaseZap },
  { href: "/health", label: "Health", icon: Activity }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const modeLabel = getRuntimeModeLabel();

  return (
    <div className="min-h-screen bg-summit-cloud">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-summit-line bg-white px-5 py-6 lg:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-summit-pine text-white">
            <Mountain size={24} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-wide text-summit-teal">
              Summit
            </span>
            <span className="block text-lg font-bold text-summit-ink">Home Services</span>
          </span>
        </Link>

        <nav className="mt-10 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-summit-cloud hover:text-summit-pine"
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 rounded-md border border-summit-line bg-summit-cloud p-4 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-summit-ink">Portfolio demo</p>
            <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-summit-pine">
              {modeLabel}
            </span>
          </div>
          <p className="mt-1 leading-5">
            AI operations workspace for an 18-person HVAC, plumbing, and electrical company.
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-summit-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-summit-pine text-white">
              <Mountain size={21} aria-hidden="true" />
            </span>
            <span className="font-bold text-summit-ink">Summit Home Services</span>
          </div>
          <nav className="mt-3 grid grid-cols-3 gap-1 sm:grid-cols-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium text-slate-600 hover:bg-summit-cloud"
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <footer className="border-t border-summit-line bg-white px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-summit-ink">Summit Home Services</p>
              <p>Fictional Company · Portfolio Demonstration · Synthetic Data Only</p>
            </div>
            <span className="w-fit rounded-md border border-summit-line bg-summit-cloud px-3 py-1 text-xs font-semibold text-summit-pine">
              {modeLabel}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
