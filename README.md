# TECSAA 3D Platform

A SuperSplat-style platform for uploading, exploring, and viewing 3D Gaussian Splat real estate listings.

## Tech Stack

- **Next.js 15** — React framework with App Router
- **Clerk** — Authentication (sign-in, sign-up, user management)
- **Supabase** — Database (properties table) + Storage (PLY file hosting)
- **Tailwind CSS v4** — Styling
- **TypeScript** — Type safety

## Pages

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/explore` |
| `/sign-in` | Clerk sign-in page |
| `/sign-up` | Clerk sign-up page |
| `/explore` | Public gallery — browse all 3D splats |
| `/dashboard` | My Properties — your uploaded listings |
| `/upload` | Upload a new 3D PLY/splat file |
| `/editor` | 3D Editor shell (links to viewer engine) |
| `/settings` | Profile & integration settings |

## Setup

### 1. Clone & install

```bash
git clone https://github.com/YOUR_ORG/tecsaa-platform
cd tecsaa-platform
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

- **Clerk**: Create a project at [clerk.com](https://clerk.com) → copy Publishable Key & Secret Key
- **Supabase**: Create a project at [supabase.com](https://supabase.com) → Settings → API

### 3. Supabase setup

Run this SQL in your Supabase SQL editor:

```sql
-- Properties table
create table properties (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  description text,
  price numeric,
  location text,
  ply_url text,
  thumbnail_url text,
  tags text[] default '{}',
  likes integer default 0,
  views integer default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table properties enable row level security;

-- Policy: anyone can read
create policy "Public read" on properties for select using (true);

-- Policy: authenticated users can insert their own
create policy "Authenticated insert" on properties for insert
  with check (auth.uid()::text = user_id);

-- Policy: owner can update/delete
create policy "Owner update" on properties for update
  using (auth.uid()::text = user_id);

create policy "Owner delete" on properties for delete
  using (auth.uid()::text = user_id);
```

Create a storage bucket called `ply-files` and set it to **Public**.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy!

## License

MIT
