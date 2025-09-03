-- Create the feedback table
CREATE TABLE feedback (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    lot_id TEXT NOT NULL,
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback
CREATE POLICY "Allow all to insert feedback"
ON feedback
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read feedback
CREATE POLICY "Allow all to read feedback"
ON feedback
FOR SELECT
USING (true);
