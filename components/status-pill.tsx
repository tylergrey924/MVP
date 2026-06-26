import type { DataSource } from "@/lib/types";

export function StatusPill({ source }: { source: DataSource }) {
  const label = source === "supabase" ? "Connected to Supabase" : "Running in Mock Mode";
  const classes =
    source === "supabase"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <span className={`inline-flex w-fit items-center rounded-md border px-3 py-1 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}
