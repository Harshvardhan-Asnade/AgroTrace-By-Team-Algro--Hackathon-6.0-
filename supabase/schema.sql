
-- Drop tables if they exist to ensure a clean slate
drop table if exists public.feedback;
drop table if exists public.produce_lots;

-- Create ProduceLots Table
create table if not exists public.produce_lots (
  id text primary key,
  name text not null,
  origin text not null,
  "plantingDate" text not null,
  "harvestDate" text not null,
  "itemCount" integer not null,
  farmer jsonb not null,
  certificates jsonb[],
  history jsonb[] not null,
  "created_at" timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.produce_lots enable row level security;

-- Policies for produce_lots
-- Allow public read access to everyone
create policy "Allow public read access" on public.produce_lots
  for select using (true);

-- Allow authenticated users to create new lots
create policy "Allow insert for authenticated users" on public.produce_lots
  for insert to authenticated with check (true);

-- Allow authenticated users to update lots
create policy "Allow update for authenticated users" on public.produce_lots
  for update to authenticated using (true);
  
-- Grant pgrst_watch role to the anon and authenticated roles
-- This is necessary to allow the app to call the schema cache refresh function
grant pgrst_watch to anon;
grant pgrst_watch to authenticated;

