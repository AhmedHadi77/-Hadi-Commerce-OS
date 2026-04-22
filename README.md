# Hadi Platform

Hadi is a production-style ecommerce and management platform built with Next.js 14, Tailwind CSS, Framer Motion, Recharts, and Supabase-ready authentication/storage patterns.

## What is included

- Customer storefront with a bright premium UI
- Dynamic catalog with 240 generated products
- Real Supabase email/password login when environment variables are configured
- Login, register, forgot-password flow with demo fallback
- Role-aware routing for customer and admin experiences
- Cart, wishlist, fake checkout, order confirmation, and Shopee-style profile settings
- Admin overview with revenue analytics, category charts, top products, inventory tools, promotions, and user moderation
- AI recommendation route and chat assistant route
- English and Arabic toggle
- Currency switcher
- Supabase-ready schema and environment configuration

## Demo accounts

- Admin: `admin@hadi.demo`
- Customer: `sara@hadi.demo`
- In demo mode, any non-empty password works

If Supabase environment variables are added, the app uses Supabase Auth instead of demo auth.
Profile settings can also persist phone, address, delivery notes, and account preferences to the `public.users` table.

## Tech stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Supabase JavaScript client

## Environment variables

Copy `.env.example` into `.env.local` and configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

The app accepts either `NEXT_PUBLIC_*` keys or the plain `SUPABASE_*` names requested in the assignment.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the Supabase environment variables in Vercel.
4. Deploy.

## Supabase setup

Run [supabase/schema.sql](./supabase/schema.sql) in the Supabase SQL editor.

Optional sample inserts live in [supabase/seed.sql](./supabase/seed.sql).

Recommended extras:

- Create a `product-images` storage bucket
- Enable email/password auth
- Add an admin user and set their role to `admin` in `public.users`

## Assignment screenshots

Suggested captures:

- `/auth/login`
- `/dashboard`
- `/admin`
- `/products`
- `/orders/<generated-order-id>`

You can save those screenshots into `public/screenshots/` after running the app locally.

## Project structure

```text
app/
  auth/
  dashboard/
  products/
  cart/
  admin/
  api/
components/
hooks/
lib/
styles/
supabase/
```
