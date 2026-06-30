# Service Saja

Service Saja is a mobile-first Next.js app for tracking motorcycle and car service records. It includes a clean MVP interface, mock data for local use, and a Supabase SQL schema for real auth and database storage.

## Features

- Landing / login screen
- Dashboard with My Vehicles, Next Service, Add Service, History, and Total Cost
- Add vehicle form
- Vehicle detail view
- Add service record form
- Service history with filters
- Reminders by status
- Cost summary by month
- Settings / profile page
- PWA-ready manifest

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test User

```text
Email: admin@servicesaja.test
Password: ServiceSaja123
```

Create this account once on the signup form, then login with the same details.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Copy `.env.example` to `.env.local`.
5. Add your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The current MVP uses mock data first. The Supabase client is ready in `lib/supabase.ts` for connecting real CRUD actions next.
