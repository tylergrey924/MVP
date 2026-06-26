import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
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
  mockWorkOrders
} from "../data/mock-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const ids = new Map<string, string>();

function uuid(id: string | null) {
  if (!id) return null;
  const existing = ids.get(id);
  if (existing) return existing;
  const next = randomUUID();
  ids.set(id, next);
  return next;
}

async function insert(table: string, rows: Record<string, unknown>[]) {
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
  return rows.length;
}

async function main() {
  let records = 0;

  records += await insert(
    "customers",
    mockCustomers.map((row) => ({
      id: uuid(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone,
      customer_type: row.customerType
    }))
  );
  records += await insert(
    "properties",
    mockProperties.map((row) => ({
      id: uuid(row.id),
      customer_id: uuid(row.customerId),
      address: row.address,
      city: row.city,
      property_type: row.propertyType
    }))
  );
  records += await insert(
    "employees",
    mockEmployees.map((row) => ({
      id: uuid(row.id),
      name: row.name,
      role: row.role,
      department: row.department,
      is_technician: row.isTechnician
    }))
  );
  records += await insert(
    "work_orders",
    mockWorkOrders.map((row) => ({
      id: uuid(row.id),
      customer_id: uuid(row.customerId),
      property_id: uuid(row.propertyId),
      technician_id: uuid(row.technicianId),
      service_category: row.serviceCategory,
      status: row.status,
      priority: row.priority,
      summary: row.summary,
      scheduled_date: row.scheduledDate,
      completed_date: row.completedDate,
      estimated_revenue: row.estimatedRevenue,
      estimated_margin: row.estimatedMargin
    }))
  );
  records += await insert(
    "invoices",
    mockInvoices.map((row) => ({
      id: uuid(row.id),
      work_order_id: uuid(row.workOrderId),
      customer_id: uuid(row.customerId),
      invoice_number: row.invoiceNumber,
      status: row.status,
      issued_at: row.issuedAt,
      due_at: row.dueAt,
      paid_at: row.paidAt,
      subtotal: row.subtotal,
      tax: row.tax,
      total: row.total,
      balance: row.balance
    }))
  );
  records += await insert(
    "payments",
    mockPayments.map((row) => ({
      id: uuid(row.id),
      invoice_id: uuid(row.invoiceId),
      amount: row.amount,
      paid_at: row.paidAt,
      method: row.method
    }))
  );
  records += await insert(
    "maintenance_plans",
    mockMaintenancePlans.map((row) => ({
      id: uuid(row.id),
      customer_id: uuid(row.customerId),
      property_id: uuid(row.propertyId),
      plan_name: row.planName,
      status: row.status,
      monthly_price: row.monthlyPrice
    }))
  );
  records += await insert(
    "parts_inventory",
    mockPartsInventory.map((row) => ({
      id: uuid(row.id),
      sku: row.sku,
      name: row.name,
      category: row.category,
      quantity_on_hand: row.quantityOnHand,
      reorder_point: row.reorderPoint
    }))
  );
  records += await insert(
    "customer_messages",
    mockCustomerMessages.map((row) => ({
      id: uuid(row.id),
      customer_id: uuid(row.customerId),
      work_order_id: uuid(row.workOrderId),
      channel: row.channel,
      sentiment: row.sentiment,
      body: row.body,
      created_at: row.createdAt
    }))
  );
  records += await insert(
    "reviews",
    mockReviews.map((row) => ({
      id: uuid(row.id),
      customer_id: uuid(row.customerId),
      work_order_id: uuid(row.workOrderId),
      rating: row.rating,
      comment: row.comment,
      created_at: row.createdAt
    }))
  );
  records += await insert(
    "knowledge_articles",
    mockKnowledgeArticles.map((row) => ({
      id: uuid(row.id),
      title: row.title,
      category: row.category,
      summary: row.summary,
      content: row.summary,
      updated_at: row.updatedAt
    }))
  );

  records += await insert("seed_runs", [{ label: "summit-mvp-seed", records_created: records }]);

  console.log(`Seeded ${records} Summit Home Services demo records.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
