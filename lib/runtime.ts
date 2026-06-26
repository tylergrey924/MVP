import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export type RuntimeMode = "mock" | "supabase";

export function getRuntimeMode(): RuntimeMode {
  return isSupabaseConfigured() ? "supabase" : "mock";
}

export function getRuntimeModeLabel() {
  return getRuntimeMode() === "supabase" ? "Connected to Supabase" : "Running in Mock Mode";
}

export function getEnvironmentName() {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
}

export function getBuildVersion() {
  return process.env.NEXT_PUBLIC_APP_VERSION || process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "0.1.0";
}

export async function checkSupabaseConnectivity() {
  if (!isSupabaseConfigured()) {
    return { configured: false, ok: false, message: "Supabase environment variables are not configured." };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { configured: false, ok: false, message: "Supabase client could not be created." };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1200);

  try {
    const { error } = await supabase.from("seed_runs").select("id", { count: "exact", head: true }).abortSignal(controller.signal);
    clearTimeout(timeout);
    return {
      configured: true,
      ok: !error,
      message: error ? error.message : "Supabase responded successfully."
    };
  } catch (error) {
    clearTimeout(timeout);
    return {
      configured: true,
      ok: false,
      message: error instanceof Error ? error.message : "Supabase request failed."
    };
  }
}
