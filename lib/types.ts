export type DataSource = "mock" | "supabase";

export type TableCount = {
  table: string;
  count: number | null;
};

export type SeedStatus = {
  mode: DataSource;
  supabaseConfigured: boolean;
  syntheticRecords: number;
  lastSeededAt: string | null;
  tableCounts: TableCount[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerType: "Residential" | "Light Commercial";
};

export type Property = {
  id: string;
  customerId: string;
  address: string;
  city: string;
  propertyType: "Single Family" | "Townhome" | "Condo" | "Light Commercial";
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  isTechnician: boolean;
};

export type WorkOrder = {
  id: string;
  customerId: string;
  propertyId: string;
  technicianId: string | null;
  serviceCategory: "HVAC" | "Plumbing" | "Electrical";
  status: "Draft" | "Scheduled" | "In Progress" | "Completed" | "Delayed" | "Invoiced";
  priority: "Low" | "Normal" | "High" | "Emergency";
  summary: string;
  scheduledDate: string;
  completedDate: string | null;
  estimatedRevenue: number;
  estimatedMargin: number;
};

export type Appointment = {
  id: string;
  workOrderId: string;
  technicianId: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  status: "Scheduled" | "Completed" | "Delayed" | "Canceled";
};

export type Invoice = {
  id: string;
  workOrderId: string;
  customerId: string;
  invoiceNumber: string;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
  subtotal: number;
  tax: number;
  total: number;
  balance: number;
};

export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  paidAt: string;
  method: string;
};

export type MaintenancePlan = {
  id: string;
  customerId: string;
  propertyId: string;
  planName: string;
  status: "Active" | "Paused" | "Canceled";
  monthlyPrice: number;
};

export type PartInventory = {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantityOnHand: number;
  reorderPoint: number;
};

export type CustomerMessage = {
  id: string;
  customerId: string;
  workOrderId: string | null;
  channel: "Email" | "SMS" | "Phone";
  sentiment: "Positive" | "Neutral" | "Negative";
  body: string;
  createdAt: string;
};

export type Review = {
  id: string;
  customerId: string;
  workOrderId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  category: string;
  summary: string;
  content?: string;
  updatedAt: string;
};

export type KnowledgeAnswer = {
  question: string;
  answer: string;
  confidence: number;
  recommendedNextStep: string;
  matchedArticles: Array<{
    id: string;
    title: string;
    category: string;
    excerpt: string;
    score: number;
    updatedAt: string;
  }>;
};

export type BreakdownPoint = {
  label: string;
  value: number;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type ExecutiveKpi = {
  label: string;
  value: string;
  delta: string;
  helper: string;
  tone: "good" | "warn" | "neutral";
};

export type TechnicianWorkload = {
  name: string;
  jobsCompleted: number;
  utilization: number;
  averageTicket: number;
};

export type ExecutiveDashboardData = {
  source: DataSource;
  status: "ready" | "empty";
  message?: string;
  kpis: ExecutiveKpi[];
  revenueByMonth: TrendPoint[];
  jobsByServiceCategory: BreakdownPoint[];
  workOrderStatusBreakdown: BreakdownPoint[];
  technicianWorkload: TechnicianWorkload[];
  overdueInvoicesByAge: BreakdownPoint[];
  averageRatingTrend: TrendPoint[];
  insights: string[];
  recommendedActions: string[];
  talkTrack: string[];
};

export type DashboardData = {
  executive: ExecutiveDashboardData;
};

export type DispatchData = {
  source: DataSource;
  urgentWorkOrders: WorkOrder[];
  messages: CustomerMessage[];
  lowStockParts: PartInventory[];
  partsInventory: PartInventory[];
  technicians: Employee[];
};

export type IntakeClassification = {
  serviceCategory: WorkOrder["serviceCategory"];
  urgency: WorkOrder["priority"];
  sentiment: CustomerMessage["sentiment"];
  likelyParts: string[];
  recommendedTechnicianId: string | null;
  recommendedTechnicianName: string;
  confidence: number;
  draftCustomerResponse: string;
  draftDispatcherNotes: string;
};

export type IntakeDraftInput = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  message: string;
};

export type KnowledgeData = {
  source: DataSource;
  articles: KnowledgeArticle[];
};
