import type {
  CustomerMessage,
  Employee,
  IntakeClassification,
  IntakeDraftInput,
  PartInventory,
  WorkOrder
} from "@/lib/types";

export function classifyIntake(
  intake: IntakeDraftInput,
  technicians: Employee[],
  parts: PartInventory[]
): IntakeClassification {
  const text = `${intake.message} ${intake.address}`.toLowerCase();
  const serviceCategory = inferServiceCategory(text);
  const urgency = inferUrgency(text);
  const sentiment = inferSentiment(text);
  const likelyParts = inferLikelyParts(text, serviceCategory, parts);
  const recommendedTechnician = recommendTechnician(technicians, serviceCategory);
  const confidence = Math.min(
    96,
    62 +
      (text.includes(serviceCategory.toLowerCase()) ? 10 : 0) +
      (urgency === "Emergency" ? 12 : urgency === "High" ? 8 : 4) +
      (likelyParts.length ? 8 : 0)
  );

  return {
    serviceCategory,
    urgency,
    sentiment,
    likelyParts,
    recommendedTechnicianId: recommendedTechnician?.id ?? null,
    recommendedTechnicianName: recommendedTechnician?.name ?? "Next available qualified technician",
    confidence,
    draftCustomerResponse: buildCustomerResponse(intake, serviceCategory, urgency),
    draftDispatcherNotes: buildDispatcherNotes(intake, serviceCategory, urgency, sentiment, likelyParts, recommendedTechnician)
  };
}

function inferServiceCategory(text: string): WorkOrder["serviceCategory"] {
  const plumbingTerms = ["leak", "water", "drain", "toilet", "sink", "pipe", "heater", "sewer", "faucet"];
  const electricalTerms = ["breaker", "outlet", "spark", "panel", "power", "light", "electrical", "circuit", "burning"];
  const hvacTerms = ["ac", "a/c", "air", "heat", "furnace", "cooling", "thermostat", "hvac", "unit"];

  if (plumbingTerms.some((term) => text.includes(term))) return "Plumbing";
  if (electricalTerms.some((term) => text.includes(term))) return "Electrical";
  if (hvacTerms.some((term) => text.includes(term))) return "HVAC";
  return "HVAC";
}

function inferUrgency(text: string): WorkOrder["priority"] {
  const emergencyTerms = ["emergency", "flood", "sparking", "smoke", "burning", "no heat", "no ac", "no cooling", "leaking everywhere"];
  const highTerms = ["today", "urgent", "asap", "not working", "stopped", "leak", "no power", "very hot", "very cold"];

  if (emergencyTerms.some((term) => text.includes(term))) return "Emergency";
  if (highTerms.some((term) => text.includes(term))) return "High";
  return "Normal";
}

function inferSentiment(text: string): CustomerMessage["sentiment"] {
  const negativeTerms = ["angry", "frustrated", "upset", "again", "still", "waiting", "terrible", "emergency"];
  const positiveTerms = ["thanks", "thank you", "appreciate", "great", "please"];

  if (negativeTerms.some((term) => text.includes(term))) return "Negative";
  if (positiveTerms.some((term) => text.includes(term))) return "Positive";
  return "Neutral";
}

function inferLikelyParts(text: string, category: WorkOrder["serviceCategory"], parts: PartInventory[]) {
  const fallbackParts: Record<WorkOrder["serviceCategory"], string[]> = {
    HVAC: ["Capacitor", "Contactor", "Thermostat"],
    Plumbing: ["Shutoff valve", "Supply line", "Water heater valve"],
    Electrical: ["GFCI breaker", "Outlet", "Panel breaker"]
  };
  const matched = parts
    .filter((part) => part.category === category || text.includes(part.name.toLowerCase()))
    .map((part) => `${part.name}${part.quantityOnHand <= part.reorderPoint ? " (low stock)" : ""}`);

  return matched.length ? matched.slice(0, 3) : fallbackParts[category];
}

function recommendTechnician(technicians: Employee[], category: WorkOrder["serviceCategory"]) {
  const categoryMatch = technicians.find((employee) => employee.role.toLowerCase().includes(category.toLowerCase()));
  return categoryMatch ?? technicians.find((employee) => employee.isTechnician) ?? null;
}

function buildCustomerResponse(
  intake: IntakeDraftInput,
  category: WorkOrder["serviceCategory"],
  urgency: WorkOrder["priority"]
) {
  const timing = urgency === "Emergency" ? "as a priority dispatch request" : urgency === "High" ? "for the next available opening" : "for a standard service appointment";
  const firstName = intake.customerName.trim().split(/\s+/)[0] || "there";

  return `Hi ${firstName}, thanks for contacting Summit Home Services. We have your ${category.toLowerCase()} request and are routing it ${timing}. A dispatcher will confirm the arrival window, access details, and any safety steps before the technician heads out.`;
}

function buildDispatcherNotes(
  intake: IntakeDraftInput,
  category: WorkOrder["serviceCategory"],
  urgency: WorkOrder["priority"],
  sentiment: CustomerMessage["sentiment"],
  likelyParts: string[],
  technician: Employee | null
) {
  return [
    `${urgency} ${category} intake for ${intake.customerName || "new customer"}.`,
    `Customer sentiment: ${sentiment}.`,
    `Likely parts/tools: ${likelyParts.join(", ")}.`,
    `Recommended technician: ${technician?.name ?? "next available qualified technician"}.`,
    `Confirm address, photos, shutoff/safety status, and preferred contact method before booking.`
  ].join(" ");
}
