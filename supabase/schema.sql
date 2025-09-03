
-- Drop the public.feedback table if it exists
DROP TABLE IF EXISTS public.feedback;

-- Create the "batches" table
CREATE TABLE
  public.batches (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    farmer_id uuid NULL,
    produce_name text NULL,
    origin text NULL,
    planting_date date NULL,
    harvest_date date NULL,
    items_in_lot integer NULL,
    status text NULL,
    history jsonb NULL,
    CONSTRAINT batches_pkey PRIMARY KEY (id)
  );

-- Set up Row Level Security (RLS)
-- Assumes you have a 'profiles' table with user roles.
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all rows.
-- Consumers who are not logged in need to be able to trace lots.
CREATE POLICY "Allow public read access" ON public.batches
  FOR SELECT USING (true);

-- Allow users to insert new batches for themselves.
-- This policy assumes the farmer_id is being set to the currently authenticated user's ID.
CREATE POLICY "Allow authenticated users to insert for themselves" ON public.batches
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

-- Allow users to update their own batches.
CREATE POLICY "Allow owner to update their own batches" ON public.batches
  FOR UPDATE USING (auth.uid() = farmer_id);
