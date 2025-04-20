-- Create medicines table if it doesn't exist
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  dosage text,
  side_effects text,
  warnings text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own medicine entries" ON medicines;
DROP POLICY IF EXISTS "Users can view their own medicine entries" ON medicines;
DROP POLICY IF EXISTS "Users can update their own medicine entries" ON medicines;

-- Create policies
CREATE POLICY "Users can create their own medicine entries"
  ON medicines
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own medicine entries"
  ON medicines
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own medicine entries"
  ON medicines
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);