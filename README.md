# Summit Home Services MVP

A cloud-first consulting portfolio demo for a fictional 18-person HVAC, plumbing, and electrical services company.

The app is designed to deploy early and often to Vercel. It can run with hosted Supabase data, or in mock fallback mode when Supabase is not configured.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase for hosted database/backend
- Vercel-ready mock fallback mode

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_VERSION=0.1.0
```

Required for deployed mock mode:

- None. The app renders with fallback synthetic data.

Required for deployed Supabase mode:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Required only for trusted seeding:

- `SUPABASE_SERVICE_ROLE_KEY`

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code. Do not commit `.env.local`, `.env`, or service-role credentials.

## Supabase Setup

1. Create a hosted Supabase project.
2. Open the Supabase SQL editor.
3. Run `supabase/schema.sql`.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` local or in a trusted one-off seed environment.

The schema enables public read policies and explicit `select` grants for synthetic demo data. It does not add authentication yet.

## Seeding

After applying the schema and setting env vars:

```bash
npm run seed
```

The current seed script inserts the compact deterministic dataset from `data/mock-data.ts`. It is intentionally small for the first cloud deployment pass. Larger synthetic volumes can be added in a later seed-system phase.

## Mock Fallback Mode

If Supabase env vars are missing or Supabase is slow/unavailable, the app still renders using `data/mock-data.ts`. The UI indicates either `Running in Mock Mode` or `Connected to Supabase`.

## Deploying to Vercel

### Step 1: Create GitHub repository

Create a new GitHub repository for the project. Keep it private until the portfolio demo is ready to share.

If Git is not initialized:

```bash
git init
git add .
git commit -m "Initial Summit Home Services MVP"
```

If `git status` reports that the folder is not a repository even though a `.git` directory exists, the local Git metadata is damaged. The simplest repair is to move or remove the damaged `.git` folder, then run the initialization commands above.

### Step 2: Push project

```bash
git branch -M main
git remote add origin https://github.com/YOUR_ORG_OR_USER/YOUR_REPO.git
git push -u origin main
```

### Step 3: Import into Vercel

In Vercel, choose **Add New Project**, import the GitHub repository, and keep the detected framework as Next.js.

Use:

- Build command: `npm run build`
- Install command: `npm install`
- Output settings: Vercel default for Next.js

### Step 4: Configure environment variables

For an immediate mock-mode deployment, no Supabase variables are required.

For Supabase-connected mode, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Optional: `NEXT_PUBLIC_APP_VERSION`

Do not add `SUPABASE_SERVICE_ROLE_KEY` unless you are using a trusted seed job or one-off controlled environment.

### Step 5: Deploy

Trigger the first deployment from Vercel. The app should build and render even without Supabase.

### Step 6: Verify mock mode

Open:

```text
/health
/dashboard
```

Confirm the UI shows `Running in Mock Mode` and that dashboard cards render.

### Step 7: Connect Supabase

Apply `supabase/schema.sql` in the hosted Supabase SQL editor, then add the public Supabase env vars to Vercel and redeploy.

### Step 8: Run seed

Run the seed script from a trusted local machine or controlled environment with `SUPABASE_SERVICE_ROLE_KEY` set:

```bash
npm run seed
```

### Step 9: Verify dashboard

Open:

```text
/health
/admin/seed-status
/dashboard
```

Confirm the UI shows `Connected to Supabase`, Supabase connectivity succeeds, seed counts are visible, and the dashboard renders quickly.

## Deployment Troubleshooting

- Build fails on missing env vars: the app should not require Supabase env vars to build. Check for accidental direct `process.env.X!` usage outside guarded Supabase helpers.
- Dashboard loads slowly: Supabase requests have a short timeout and fall back to mock data. Check `/health` for connectivity status.
- Seed status shows zero records: run `supabase/schema.sql`, then run `npm run seed` with `SUPABASE_SERVICE_ROLE_KEY`.
- Vercel shows mock mode after env vars were added: redeploy after saving environment variables.
- Service role key accidentally added to Vercel: remove it unless needed for a trusted seed job and rotate the key in Supabase.
- Local dev server hangs with Turbopack: this project uses `next dev --webpack` for local reliability.

## Useful Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run seed
```
