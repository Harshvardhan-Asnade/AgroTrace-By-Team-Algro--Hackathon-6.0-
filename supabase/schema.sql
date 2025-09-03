
-- Create Produce Batches Table
CREATE TABLE
  produce_batches (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone ('utc'::TEXT, NOW()) NOT NULL,
    farmer_id UUID REFERENCES auth.users (id) NOT NULL,
    produce_name TEXT NOT NULL,
    origin TEXT,
    planting_date DATE,
    harvest_date DATE,
    items_in_lot INT NOT NULL,
    status TEXT DEFAULT 'Registered', -- To track current state
    history JSONB -- To store array of state change events
  );

-- Enable RLS
ALTER TABLE produce_batches ENABLE ROW LEVEL SECURITY;

-- Policies for produce_batches
CREATE POLICY "Allow public read access" ON produce_batches FOR
SELECT
  USING (TRUE);

CREATE POLICY "Allow authenticated users to insert" ON produce_batches FOR INSERT
TO authenticated
WITH
  CHECK (TRUE);

CREATE POLICY "Allow users to update their own batches" ON produce_batches FOR
UPDATE
  USING (auth.uid () = farmer_id);

-- Grant usage on the public schema to the postgres user
GRANT USAGE ON SCHEMA public TO postgres;
-- Grant execute permission on the pgrst_watch function to the authenticated role
GRANT EXECUTE ON FUNCTION public.pgrst_watch() TO authenticated;
