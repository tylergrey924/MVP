create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  customer_type text not null default 'Residential',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  address text not null,
  city text not null,
  property_type text not null default 'Single Family',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  department text not null,
  is_technician boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  property_id uuid references public.properties(id),
  technician_id uuid references public.employees(id),
  service_category text not null,
  status text not null,
  priority text not null,
  summary text not null,
  scheduled_date date,
  completed_date date,
  estimated_revenue numeric(12,2) not null default 0,
  estimated_margin numeric(6,4) not null default 0.38,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid references public.work_orders(id),
  technician_id uuid references public.employees(id),
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid references public.work_orders(id),
  customer_id uuid references public.customers(id),
  invoice_number text not null unique,
  status text not null,
  issued_at date not null,
  due_at date not null,
  paid_at date,
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id),
  amount numeric(12,2) not null,
  paid_at date not null,
  method text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.maintenance_plans (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  property_id uuid references public.properties(id),
  plan_name text not null,
  status text not null,
  monthly_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parts_inventory (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text not null,
  quantity_on_hand integer not null default 0,
  reorder_point integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_messages (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  work_order_id uuid references public.work_orders(id),
  channel text not null,
  sentiment text not null default 'Neutral',
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  work_order_id uuid references public.work_orders(id),
  rating integer not null,
  comment text,
  created_at date not null default current_date
);

create table if not exists public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  summary text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seed_runs (
  id uuid primary key default gen_random_uuid(),
  label text not null default 'summit-mvp-seed',
  records_created integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;
alter table public.properties enable row level security;
alter table public.employees enable row level security;
alter table public.work_orders enable row level security;
alter table public.appointments enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.maintenance_plans enable row level security;
alter table public.parts_inventory enable row level security;
alter table public.vendors enable row level security;
alter table public.customer_messages enable row level security;
alter table public.reviews enable row level security;
alter table public.knowledge_articles enable row level security;
alter table public.seed_runs enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'customers','properties','employees','work_orders','appointments','invoices','payments',
    'maintenance_plans','parts_inventory','vendors','customer_messages','reviews','knowledge_articles','seed_runs'
  ]
  loop
    execute format('drop policy if exists "public read demo data" on public.%I', table_name);
    execute format('create policy "public read demo data" on public.%I for select using (true)', table_name);
    execute format('grant select on public.%I to anon, authenticated', table_name);
  end loop;
end $$;
