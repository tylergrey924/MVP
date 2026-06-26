import { NextResponse } from "next/server";
import { classifyIntake } from "@/lib/dispatch-assistant";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Employee, IntakeDraftInput, PartInventory, WorkOrder } from "@/lib/types";

type DraftRequest = {
  intake: IntakeDraftInput;
  technicians: Employee[];
  parts: PartInventory[];
};

const revenueEstimate: Record<WorkOrder["serviceCategory"], number> = {
  HVAC: 950,
  Plumbing: 725,
  Electrical: 840
};

export async function POST(request: Request) {
  const body = (await request.json()) as DraftRequest;
  const classification = classifyIntake(body.intake, body.technicians ?? [], body.parts ?? []);

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      persisted: false,
      mode: "mock",
      classification,
      message: "Saved as a local demo draft because Supabase is not configured."
    });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({
      persisted: false,
      mode: "mock",
      classification,
      message: "Saved as a local demo draft because the Supabase client could not be created."
    });
  }

  const { data, error } = await supabase
    .from("work_orders")
    .insert({
      technician_id: classification.recommendedTechnicianId,
      service_category: classification.serviceCategory,
      status: "Draft",
      priority: classification.urgency,
      summary: `${body.intake.customerName || "New customer"}: ${body.intake.message.slice(0, 180)}`,
      scheduled_date: new Date().toISOString().slice(0, 10),
      estimated_revenue: revenueEstimate[classification.serviceCategory],
      estimated_margin: 0.38
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({
      persisted: false,
      mode: "local-fallback",
      classification,
      message: `Saved as a local demo draft. Supabase rejected the write: ${error.message}`
    });
  }

  return NextResponse.json({
    persisted: true,
    mode: "supabase",
    id: data.id,
    classification,
    message: "Draft work order created in Supabase."
  });
}
