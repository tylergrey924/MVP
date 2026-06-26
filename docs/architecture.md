# Summit Home Services Architecture

Summit Home Services is a cloud-first portfolio demo for a fictional 18-person HVAC, plumbing, and electrical services company. The app is designed to run on Vercel, use hosted Supabase when configured, and fall back to deterministic mock data when Supabase environment variables are absent.

## Goals

- Show how AI-focused consulting can reduce administrative work for a small services company.
- Give an owner/operator useful visibility into revenue, dispatch, cash collection, utilization, and customer experience.
- Keep the MVP deployable without local database assumptions.
- Avoid paid AI, authentication, and embeddings until later phases.

## Application Structure

```text
app/
  layout.tsx
  page.tsx
  dashboard/page.tsx
  dashboard/loading.tsx
  dispatch/page.tsx
  knowledge/page.tsx
  admin/seed-status/page.tsx
  health/page.tsx
components/
  app-shell.tsx
  metric-card.tsx
  page-header.tsx
  status-pill.tsx
data/
  mock-data.ts
lib/
  demo-data.ts
  runtime.ts
  supabase.ts
  types.ts
scripts/
  seed.ts
supabase/
  schema.sql
```

## Routes

- `/dashboard`: Executive dashboard with KPIs, trends, deterministic insights, and recommended actions.
- `/dispatch`: Dispatch and work order assistant demo.
- `/knowledge`: Internal knowledge assistant demo using synthetic SOPs.
- `/admin/seed-status`: Read-only seed status and table count page.
- `/health`: Deployment verification page for environment, data mode, Supabase connectivity, seed status, and build version.

## Data Layer

The data layer is intentionally simple:

- `lib/supabase.ts` creates a browser-safe Supabase client only when public Supabase variables are present.
- `lib/demo-data.ts` provides route-ready data access helpers and falls back to `data/mock-data.ts` if Supabase is unavailable or empty.
- `lib/runtime.ts` centralizes environment detection, build version display, runtime mode labels, and lightweight Supabase connectivity checks.
- `scripts/seed.ts` uses the Supabase service role key for server-side seeding only. Service role keys must never be exposed to browser code.

## Database Tables

Current MVP tables:

- `customers`
- `properties`
- `employees`
- `work_orders`
- `appointments`
- `invoices`
- `payments`
- `maintenance_plans`
- `parts_inventory`
- `vendors`
- `customer_messages`
- `reviews`
- `knowledge_articles`
- `seed_runs`

## Deployment Model

The target deployment path is GitHub plus Vercel:

1. Develop locally when useful.
2. Keep every route safe when Supabase variables are missing.
3. Push to GitHub.
4. Import the repository into Vercel.
5. Verify `/health` and `/dashboard` in mock mode.
6. Add hosted Supabase variables.
7. Run the seed script against Supabase.
8. Verify `/health`, `/admin/seed-status`, and `/dashboard` against Supabase data.

## Environment Modes

- Mock mode: no Supabase public URL/key are configured. The app renders synthetic fallback data.
- Supabase mode: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured. Pages query hosted Supabase and still degrade gracefully if data is empty or unreachable.
- Seed mode: `SUPABASE_SERVICE_ROLE_KEY` is available only in local shell or secure server-side seeding contexts.

## Assumptions

- No authentication is required for the MVP.
- Synthetic demo data is public-read.
- Vercel is the production hosting target.
- Supabase is hosted, not local-only.
- Future work should be verified against the deployed Vercel URL as well as local development.
