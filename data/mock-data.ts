import type {
  Appointment,
  Customer,
  CustomerMessage,
  Employee,
  Invoice,
  KnowledgeArticle,
  MaintenancePlan,
  PartInventory,
  Payment,
  Property,
  Review,
  WorkOrder
} from "@/lib/types";

export const mockCustomers: Customer[] = [
  { id: "cust-1", name: "Maya Bennett", email: "maya@example.com", phone: "555-0101", customerType: "Residential" },
  { id: "cust-2", name: "Pine Ridge Dental", email: "ops@pineridge.example", phone: "555-0102", customerType: "Light Commercial" },
  { id: "cust-3", name: "Jordan Ellis", email: "jordan@example.com", phone: "555-0103", customerType: "Residential" },
  { id: "cust-4", name: "Oakline Studio", email: "hello@oakline.example", phone: "555-0104", customerType: "Light Commercial" }
];

export const mockProperties: Property[] = [
  { id: "prop-1", customerId: "cust-1", address: "1840 Cedar Lake Dr", city: "Franklin", propertyType: "Single Family" },
  { id: "prop-2", customerId: "cust-2", address: "220 Market Square", city: "Franklin", propertyType: "Light Commercial" },
  { id: "prop-3", customerId: "cust-3", address: "77 Ridgeview Ln", city: "Nashville", propertyType: "Townhome" },
  { id: "prop-4", customerId: "cust-4", address: "410 Main St", city: "Brentwood", propertyType: "Light Commercial" }
];

export const mockEmployees: Employee[] = [
  { id: "emp-1", name: "Avery Stone", role: "Owner / General Manager", department: "Leadership", isTechnician: false },
  { id: "emp-2", name: "Riley Chen", role: "Dispatcher", department: "Operations", isTechnician: false },
  { id: "emp-3", name: "Morgan Hayes", role: "Dispatcher", department: "Operations", isTechnician: false },
  { id: "emp-4", name: "Sam Rivera", role: "HVAC Technician", department: "Field", isTechnician: true },
  { id: "emp-5", name: "Devin Brooks", role: "Plumbing Technician", department: "Field", isTechnician: true },
  { id: "emp-6", name: "Taylor Grant", role: "Electrical Technician", department: "Field", isTechnician: true },
  { id: "emp-7", name: "Casey Patel", role: "HVAC Technician", department: "Field", isTechnician: true }
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: "wo-1",
    customerId: "cust-1",
    propertyId: "prop-1",
    technicianId: "emp-4",
    serviceCategory: "HVAC",
    status: "Completed",
    priority: "Emergency",
    summary: "AC not cooling during heat advisory",
    scheduledDate: "2026-06-02",
    completedDate: "2026-06-02",
    estimatedRevenue: 1420,
    estimatedMargin: 0.42
  },
  {
    id: "wo-2",
    customerId: "cust-2",
    propertyId: "prop-2",
    technicianId: "emp-6",
    serviceCategory: "Electrical",
    status: "Invoiced",
    priority: "High",
    summary: "Panel troubleshooting and dedicated circuit repair",
    scheduledDate: "2026-06-05",
    completedDate: "2026-06-06",
    estimatedRevenue: 2850,
    estimatedMargin: 0.36
  },
  {
    id: "wo-3",
    customerId: "cust-3",
    propertyId: "prop-3",
    technicianId: "emp-5",
    serviceCategory: "Plumbing",
    status: "Delayed",
    priority: "Emergency",
    summary: "Water heater leak; waiting on replacement valve",
    scheduledDate: "2026-06-07",
    completedDate: null,
    estimatedRevenue: 980,
    estimatedMargin: 0.33
  },
  {
    id: "wo-4",
    customerId: "cust-4",
    propertyId: "prop-4",
    technicianId: "emp-7",
    serviceCategory: "HVAC",
    status: "Scheduled",
    priority: "Normal",
    summary: "Quarterly rooftop unit maintenance",
    scheduledDate: "2026-06-10",
    completedDate: null,
    estimatedRevenue: 760,
    estimatedMargin: 0.47
  }
];

export const mockAppointments: Appointment[] = [
  { id: "appt-1", workOrderId: "wo-1", technicianId: "emp-4", scheduledStart: "2026-06-02T13:00:00Z", scheduledEnd: "2026-06-02T15:00:00Z", status: "Completed" },
  { id: "appt-2", workOrderId: "wo-2", technicianId: "emp-6", scheduledStart: "2026-06-05T15:00:00Z", scheduledEnd: "2026-06-05T17:00:00Z", status: "Completed" },
  { id: "appt-3", workOrderId: "wo-3", technicianId: "emp-5", scheduledStart: "2026-06-07T18:00:00Z", scheduledEnd: "2026-06-07T20:00:00Z", status: "Delayed" },
  { id: "appt-4", workOrderId: "wo-4", technicianId: "emp-7", scheduledStart: "2026-06-10T14:00:00Z", scheduledEnd: "2026-06-10T16:00:00Z", status: "Scheduled" }
];

export const mockInvoices: Invoice[] = [
  { id: "inv-1", workOrderId: "wo-1", customerId: "cust-1", invoiceNumber: "SHS-1001", status: "Paid", issuedAt: "2026-06-02", dueAt: "2026-06-16", paidAt: "2026-06-08", subtotal: 1420, tax: 131, total: 1551, balance: 0 },
  { id: "inv-2", workOrderId: "wo-2", customerId: "cust-2", invoiceNumber: "SHS-1002", status: "Overdue", issuedAt: "2026-05-20", dueAt: "2026-06-03", paidAt: null, subtotal: 2850, tax: 264, total: 3114, balance: 3114 },
  { id: "inv-3", workOrderId: "wo-4", customerId: "cust-4", invoiceNumber: "SHS-1003", status: "Sent", issuedAt: "2026-06-10", dueAt: "2026-06-24", paidAt: null, subtotal: 760, tax: 70, total: 830, balance: 830 }
];

export const mockPayments: Payment[] = [
  { id: "pay-1", invoiceId: "inv-1", amount: 1551, paidAt: "2026-06-08", method: "ACH" }
];

export const mockMaintenancePlans: MaintenancePlan[] = [
  { id: "plan-1", customerId: "cust-1", propertyId: "prop-1", planName: "Comfort Club", status: "Active", monthlyPrice: 24 },
  { id: "plan-2", customerId: "cust-4", propertyId: "prop-4", planName: "Commercial Care", status: "Active", monthlyPrice: 89 }
];

export const mockPartsInventory: PartInventory[] = [
  { id: "part-1", sku: "CAP-45-440", name: "45/5 MFD Dual Run Capacitor", category: "HVAC", quantityOnHand: 4, reorderPoint: 6 },
  { id: "part-2", sku: "WH-VALVE-34", name: "3/4 in Water Heater Shutoff Valve", category: "Plumbing", quantityOnHand: 1, reorderPoint: 5 },
  { id: "part-3", sku: "BRK-20A-GFCI", name: "20A GFCI Breaker", category: "Electrical", quantityOnHand: 7, reorderPoint: 4 }
];

export const mockCustomerMessages: CustomerMessage[] = [
  { id: "msg-1", customerId: "cust-3", workOrderId: "wo-3", channel: "SMS", sentiment: "Negative", body: "Water is still leaking and we need an update on arrival time.", createdAt: "2026-06-07T19:10:00Z" },
  { id: "msg-2", customerId: "cust-1", workOrderId: "wo-1", channel: "Email", sentiment: "Positive", body: "Sam was fast, clear, and got the AC running again.", createdAt: "2026-06-03T15:30:00Z" },
  { id: "msg-3", customerId: "cust-2", workOrderId: "wo-2", channel: "Phone", sentiment: "Neutral", body: "Please resend the invoice to our office manager.", createdAt: "2026-06-09T14:00:00Z" }
];

export const mockReviews: Review[] = [
  { id: "rev-1", customerId: "cust-1", workOrderId: "wo-1", rating: 5, comment: "Excellent emergency response.", createdAt: "2026-06-03" },
  { id: "rev-2", customerId: "cust-2", workOrderId: "wo-2", rating: 4, comment: "Good work, invoice follow-up was slow.", createdAt: "2026-06-08" },
  { id: "rev-3", customerId: "cust-3", workOrderId: "wo-3", rating: 3, comment: "Delay was frustrating, communication helped.", createdAt: "2026-06-09" }
];

export const mockKnowledgeArticles: KnowledgeArticle[] = [
  { id: "ka-1", title: "Emergency HVAC triage checklist", category: "Dispatch", summary: "Prioritize no-cooling calls during heat advisories, capture system age, symptoms, and vulnerable occupants.", updatedAt: "2026-05-20" },
  { id: "ka-2", title: "Water heater leak intake", category: "Plumbing", summary: "Confirm active leak, shutoff status, photos, access constraints, and whether same-day replacement may be needed.", updatedAt: "2026-05-14" },
  { id: "ka-3", title: "Electrical safety escalation", category: "Electrical", summary: "Escalate burning smells, repeated breaker trips, panel heat, and exposed conductors as same-day safety calls.", updatedAt: "2026-04-28" },
  { id: "ka-4", title: "Invoice follow-up cadence", category: "Office", summary: "Send reminders at 7, 14, and 30 days with commercial balances routed to the office manager.", updatedAt: "2026-04-10" }
];

export const mockSeedRun = {
  id: "seed-mock",
  createdAt: "Mock fallback",
  recordsCreated: 42
};
