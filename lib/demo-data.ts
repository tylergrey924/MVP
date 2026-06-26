import {
  mockCustomerMessages,
  mockCustomers,
  mockEmployees,
  mockInvoices,
  mockKnowledgeArticles,
  mockMaintenancePlans,
  mockPartsInventory,
  mockPayments,
  mockProperties,
  mockReviews,
  mockSeedRun,
  mockWorkOrders
} from "@/data/mock-data";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import type {
  BreakdownPoint,
  CustomerMessage,
  DashboardData,
  DataSource,
  DispatchData,
  Employee,
  ExecutiveDashboardData,
  Invoice,
  KnowledgeArticle,
  KnowledgeData,
  PartInventory,
  Review,
  SeedStatus,
  TableCount,
  TechnicianWorkload,
  TrendPoint,
  WorkOrder
} from "@/lib/types";

const tableNames = [
  "customers",
  "properties",
  "employees",
  "work_orders",
  "appointments",
  "invoices",
  "payments",
  "maintenance_plans",
  "parts_inventory",
  "vendors",
  "customer_messages",
  "reviews",
  "knowledge_articles",
  "seed_runs"
];

type DemoDataset = {
  source: DataSource;
  workOrders: WorkOrder[];
  invoices: Invoice[];
  employees: Employee[];
  parts: PartInventory[];
  messages: CustomerMessage[];
  reviews: Review[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const dataset = await getDataset();
  return { executive: buildExecutiveDashboard(dataset) };
}

export async function getDispatchData(): Promise<DispatchData> {
  const dataset = await getDataset();
  return {
    source: dataset.source,
    urgentWorkOrders: dataset.workOrders
      .filter((order) => order.priority === "Emergency" || order.status === "Delayed")
      .slice(0, 6),
    messages: dataset.messages.slice(0, 6),
    lowStockParts: dataset.parts.filter((part) => part.quantityOnHand <= part.reorderPoint),
    technicians: dataset.employees.filter((employee) => employee.isTechnician)
  };
}

export async function getKnowledgeData(): Promise<KnowledgeData> {
  if (!isSupabaseConfigured()) {
    return { source: "mock", articles: mockKnowledgeArticles };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) return { source: "mock", articles: mockKnowledgeArticles };

  try {
    const { data, error } = await withTimeout(
      supabase.from("knowledge_articles").select("*").order("updated_at", { ascending: false }).limit(20),
      1500
    );
    if (error || !data?.length) return { source: "mock", articles: mockKnowledgeArticles };
    return { source: "supabase", articles: data.map(mapKnowledgeArticle) };
  } catch {
    return { source: "mock", articles: mockKnowledgeArticles };
  }
}

export async function getSeedStatus(): Promise<SeedStatus> {
  if (!isSupabaseConfigured()) {
    const counts = mockTableCounts();
    return {
      mode: "mock",
      supabaseConfigured: false,
      syntheticRecords: counts.reduce((sum, item) => sum + (item.count ?? 0), 0),
      lastSeededAt: mockSeedRun.createdAt,
      tableCounts: counts
    };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return {
      mode: "mock",
      supabaseConfigured: false,
      syntheticRecords: 0,
      lastSeededAt: null,
      tableCounts: tableNames.map((table) => ({ table, count: null }))
    };
  }

  try {
    const counts = await Promise.all(
      tableNames.map(async (table) => {
        const { count, error } = await withTimeout(
          supabase.from(table).select("*", { count: "exact", head: true }),
          1500
        );
        return { table, count: error ? null : count ?? 0 };
      })
    );

    const { data } = await withTimeout(
      supabase.from("seed_runs").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      1500
    );

    return {
      mode: "supabase",
      supabaseConfigured: true,
      syntheticRecords: counts.reduce((sum, item) => sum + (item.count ?? 0), 0),
      lastSeededAt: data?.created_at ?? null,
      tableCounts: counts
    };
  } catch {
    const counts = mockTableCounts();
    return {
      mode: "mock",
      supabaseConfigured: true,
      syntheticRecords: counts.reduce((sum, item) => sum + (item.count ?? 0), 0),
      lastSeededAt: mockSeedRun.createdAt,
      tableCounts: counts
    };
  }
}

async function getDataset(): Promise<DemoDataset> {
  if (!isSupabaseConfigured()) return mockDataset();

  const supabase = createSupabaseServerClient();
  if (!supabase) return mockDataset();

  try {
    const [workOrders, invoices, employees, parts, messages, reviews] = await Promise.all([
      withTimeout(supabase.from("work_orders").select("*").limit(1000), 1800),
      withTimeout(supabase.from("invoices").select("*").limit(1000), 1800),
      withTimeout(supabase.from("employees").select("*").limit(100), 1800),
      withTimeout(supabase.from("parts_inventory").select("*").limit(200), 1800),
      withTimeout(supabase.from("customer_messages").select("*").order("created_at", { ascending: false }).limit(100), 1800),
      withTimeout(supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(200), 1800)
    ]);

    if (workOrders.error || !workOrders.data?.length) return mockDataset();

    return {
      source: "supabase",
      workOrders: workOrders.data.map(mapWorkOrder),
      invoices: (invoices.data ?? []).map(mapInvoice),
      employees: (employees.data ?? []).map(mapEmployee),
      parts: (parts.data ?? []).map(mapPart),
      messages: (messages.data ?? []).map(mapMessage),
      reviews: (reviews.data ?? []).map(mapReview)
    };
  } catch {
    return mockDataset();
  }
}

function mockDataset(): DemoDataset {
  return {
    source: "mock",
    workOrders: mockWorkOrders,
    invoices: mockInvoices,
    employees: mockEmployees,
    parts: mockPartsInventory,
    messages: mockCustomerMessages,
    reviews: mockReviews
  };
}

function buildExecutiveDashboard(dataset: DemoDataset): ExecutiveDashboardData {
  const completed = dataset.workOrders.filter((order) => order.status === "Completed" || order.status === "Invoiced");
  const paidRevenue = dataset.invoices.reduce((sum, invoice) => sum + Math.max(0, invoice.total - invoice.balance), 0);
  const overdueBalance = dataset.invoices
    .filter((invoice) => invoice.status === "Overdue" || invoice.balance > 0)
    .reduce((sum, invoice) => sum + invoice.balance, 0);
  const averageTicket = completed.length
    ? completed.reduce((sum, order) => sum + order.estimatedRevenue, 0) / completed.length
    : 0;
  const averageMargin = completed.length
    ? completed.reduce((sum, order) => sum + order.estimatedMargin, 0) / completed.length
    : 0;
  const activePlans = mockMaintenancePlans.filter((plan) => plan.status === "Active").length;
  const averageRating = dataset.reviews.length
    ? dataset.reviews.reduce((sum, review) => sum + review.rating, 0) / dataset.reviews.length
    : 0;
  const technicianWorkload = buildTechnicianWorkload(dataset);
  const utilization = technicianWorkload.length
    ? technicianWorkload.reduce((sum, tech) => sum + tech.utilization, 0) / technicianWorkload.length
    : 0;

  return {
    source: dataset.source,
    status: dataset.workOrders.length ? "ready" : "empty",
    message: dataset.workOrders.length ? undefined : "No operating data was found. Mock fallback data is available.",
    kpis: [
      { label: "Monthly revenue", value: currency(paidRevenue), delta: "+8.4% vs prior month", helper: "Paid invoice revenue in the current demo period", tone: "good" },
      { label: "Jobs completed", value: completed.length.toLocaleString("en-US"), delta: "Field throughput", helper: "Completed and invoiced work orders", tone: "neutral" },
      { label: "Average ticket size", value: currency(averageTicket), delta: "Mixed service revenue", helper: "Average estimated revenue per completed job", tone: "good" },
      { label: "Gross margin estimate", value: percent(averageMargin), delta: "Portfolio estimate", helper: "Synthetic gross margin from service mix", tone: "neutral" },
      { label: "Technician utilization", value: percent(utilization / 100), delta: "Balancing opportunity", helper: "Average workload across active technicians", tone: utilization > 85 ? "warn" : "good" },
      { label: "Overdue invoice balance", value: currency(overdueBalance), delta: overdueBalance > 0 ? "Collection follow-up needed" : "No overdue balance", helper: "Open balances past due or unpaid", tone: overdueBalance > 0 ? "warn" : "good" },
      { label: "Active maintenance plans", value: activePlans.toString(), delta: "Recurring revenue base", helper: "Plan customers drive repeat work", tone: "good" },
      { label: "Average customer rating", value: averageRating ? averageRating.toFixed(1) : "n/a", delta: "Review quality", helper: "Average rating across completed jobs", tone: averageRating < 4 ? "warn" : "good" }
    ],
    revenueByMonth: monthlyRevenue(dataset.invoices),
    jobsByServiceCategory: countBy(dataset.workOrders, "serviceCategory"),
    workOrderStatusBreakdown: countBy(dataset.workOrders, "status"),
    technicianWorkload,
    overdueInvoicesByAge: overdueBuckets(dataset.invoices),
    averageRatingTrend: ratingTrend(dataset.reviews),
    insights: [
      "Revenue is currently driven by higher-value HVAC and commercial electrical jobs.",
      "Overdue balances are concentrated in larger invoices, making cash collection a near-term opportunity.",
      "Maintenance plan customers create repeat work that can smooth seasonality.",
      "Delayed jobs and negative messages tend to cluster around parts availability and communication gaps.",
      "Technician workload is uneven, suggesting dispatch balancing opportunities."
    ],
    recommendedActions: [
      "Follow up on overdue invoices with a same-day office workflow.",
      "Promote maintenance plans to repeat residential and light-commercial customers.",
      "Rebalance dispatch load across technicians before urgent calls stack up.",
      "Reorder parts that are below their reorder point before they delay jobs.",
      "Review delayed appointments with lower ratings to improve customer communication."
    ],
    talkTrack: [
      "Owner visibility: one operating view replaces scattered spreadsheets and inbox checks.",
      "Cash collection: overdue balances are surfaced before they become hidden working-capital drag.",
      "Technician productivity: workload and utilization make dispatch balancing easier.",
      "Service profitability: ticket size and margin estimates highlight better work mix decisions.",
      "Customer experience: reviews, delays, and messages reveal where follow-up matters."
    ]
  };
}

function buildTechnicianWorkload(dataset: DemoDataset): TechnicianWorkload[] {
  return dataset.employees
    .filter((employee) => employee.isTechnician)
    .map((employee) => {
      const jobs = dataset.workOrders.filter((order) => order.technicianId === employee.id);
      const completed = jobs.filter((order) => order.status === "Completed" || order.status === "Invoiced");
      const revenue = completed.reduce((sum, order) => sum + order.estimatedRevenue, 0);
      return {
        name: employee.name,
        jobsCompleted: completed.length,
        utilization: Math.min(98, Math.round((jobs.length / Math.max(1, dataset.workOrders.length)) * 100 + 55)),
        averageTicket: completed.length ? revenue / completed.length : 0
      };
    });
}

function monthlyRevenue(invoices: Invoice[]): TrendPoint[] {
  const totals = new Map<string, number>();
  for (const invoice of invoices) {
    const date = invoice.paidAt ?? invoice.issuedAt;
    const label = new Date(date).toLocaleString("en-US", { month: "short" });
    totals.set(label, (totals.get(label) ?? 0) + Math.max(0, invoice.total - invoice.balance));
  }
  return Array.from(totals, ([label, value]) => ({ label, value }));
}

function ratingTrend(reviews: Review[]): TrendPoint[] {
  const groups = new Map<string, number[]>();
  for (const review of reviews) {
    const label = new Date(review.createdAt).toLocaleString("en-US", { month: "short" });
    groups.set(label, [...(groups.get(label) ?? []), review.rating]);
  }
  return Array.from(groups, ([label, ratings]) => ({
    label,
    value: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  }));
}

function overdueBuckets(invoices: Invoice[]): BreakdownPoint[] {
  const today = new Date("2026-06-25T00:00:00Z");
  const buckets = new Map([
    ["0-15 days", 0],
    ["16-30 days", 0],
    ["31+ days", 0]
  ]);

  for (const invoice of invoices.filter((item) => item.balance > 0)) {
    const age = Math.floor((today.getTime() - new Date(invoice.dueAt).getTime()) / 86400000);
    const bucket = age <= 15 ? "0-15 days" : age <= 30 ? "16-30 days" : "31+ days";
    buckets.set(bucket, (buckets.get(bucket) ?? 0) + invoice.balance);
  }

  return Array.from(buckets, ([label, value]) => ({ label, value }));
}

function countBy<T extends Record<string, unknown>>(items: T[], key: keyof T): BreakdownPoint[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const label = String(item[key]);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts, ([label, value]) => ({ label, value }));
}

function mockTableCounts(): TableCount[] {
  const counts: Record<string, number> = {
    customers: mockCustomers.length,
    properties: mockProperties.length,
    employees: mockEmployees.length,
    work_orders: mockWorkOrders.length,
    appointments: mockWorkOrders.length,
    invoices: mockInvoices.length,
    payments: mockPayments.length,
    maintenance_plans: mockMaintenancePlans.length,
    parts_inventory: mockPartsInventory.length,
    vendors: 0,
    customer_messages: mockCustomerMessages.length,
    reviews: mockReviews.length,
    knowledge_articles: mockKnowledgeArticles.length,
    seed_runs: 1
  };
  return tableNames.map((table) => ({ table, count: counts[table] ?? 0 }));
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function percent(value: number) {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 }).format(value);
}

function withTimeout<T>(request: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(request),
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Supabase request timed out")), ms);
    })
  ]);
}

function mapEmployee(row: Record<string, unknown>): Employee {
  return {
    id: String(row.id),
    name: String(row.name),
    role: String(row.role),
    department: String(row.department ?? "Operations"),
    isTechnician: Boolean(row.is_technician ?? row.isTechnician)
  };
}

function mapWorkOrder(row: Record<string, unknown>): WorkOrder {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    propertyId: String(row.property_id),
    technicianId: row.technician_id ? String(row.technician_id) : null,
    serviceCategory: String(row.service_category) as WorkOrder["serviceCategory"],
    status: String(row.status) as WorkOrder["status"],
    priority: String(row.priority) as WorkOrder["priority"],
    summary: String(row.summary ?? row.description ?? "Service work order"),
    scheduledDate: String(row.scheduled_date ?? row.created_at),
    completedDate: row.completed_date ? String(row.completed_date) : null,
    estimatedRevenue: Number(row.estimated_revenue ?? row.invoice_amount ?? 0),
    estimatedMargin: Number(row.estimated_margin ?? 0.38)
  };
}

function mapInvoice(row: Record<string, unknown>): Invoice {
  return {
    id: String(row.id),
    workOrderId: String(row.work_order_id),
    customerId: String(row.customer_id),
    invoiceNumber: String(row.invoice_number),
    status: String(row.status) as Invoice["status"],
    issuedAt: String(row.issued_at),
    dueAt: String(row.due_at),
    paidAt: row.paid_at ? String(row.paid_at) : null,
    subtotal: Number(row.subtotal ?? 0),
    tax: Number(row.tax ?? 0),
    total: Number(row.total ?? 0),
    balance: Number(row.balance ?? 0)
  };
}

function mapPart(row: Record<string, unknown>): PartInventory {
  return {
    id: String(row.id),
    sku: String(row.sku),
    name: String(row.name),
    category: String(row.category),
    quantityOnHand: Number(row.quantity_on_hand ?? 0),
    reorderPoint: Number(row.reorder_point ?? 0)
  };
}

function mapMessage(row: Record<string, unknown>): CustomerMessage {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    workOrderId: row.work_order_id ? String(row.work_order_id) : null,
    channel: String(row.channel) as CustomerMessage["channel"],
    sentiment: String(row.sentiment ?? "Neutral") as CustomerMessage["sentiment"],
    body: String(row.body ?? row.message ?? ""),
    createdAt: String(row.created_at)
  };
}

function mapReview(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    workOrderId: String(row.work_order_id),
    rating: Number(row.rating ?? 0),
    comment: String(row.comment ?? ""),
    createdAt: String(row.created_at)
  };
}

function mapKnowledgeArticle(row: Record<string, unknown>): KnowledgeArticle {
  return {
    id: String(row.id),
    title: String(row.title),
    category: String(row.category),
    summary: String(row.summary ?? row.content ?? ""),
    updatedAt: String(row.updated_at ?? row.created_at)
  };
}
