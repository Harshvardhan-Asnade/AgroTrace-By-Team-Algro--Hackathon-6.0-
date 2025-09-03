
-- Drop existing tables if they exist to ensure a clean slate
drop table if exists public.produce_lots cascade;

-- Create the main table for produce lots
create table public.produce_lots (
  id text primary key,
  name text not null,
  origin text not null,
  plantingDate text not null,
  harvestDate text not null,
  itemCount int not null,
  farmer jsonb not null,
  certificates jsonb,
  history jsonb
);

-- Enable Row Level Security (RLS)
alter table public.produce_lots enable row level security;

-- Create policies for produce_lots table
-- Allow anyone to read the data (for public trace pages)
create policy "Allow public read access" on public.produce_lots for select using (true);
-- Allow only authenticated users to insert/update/delete their own data
create policy "Allow authenticated users to manage their data" on public.produce_lots for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Grant usage on the public schema to the postgres user and anon/authenticated roles
grant usage on schema public to postgres, anon, authenticated;

-- Grant all privileges on the produce_lots table to the postgres user and anon/authenticated roles
grant all on table public.produce_lots to postgres, anon, authenticated;

-- Grant permission to use the pgrst_watch function to the anon role
-- This is necessary for the application to be able to refresh the schema cache
grant execute on function public.pgrst_watch() to anon;
