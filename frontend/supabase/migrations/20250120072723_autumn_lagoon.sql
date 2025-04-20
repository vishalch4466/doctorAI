/*
  # Create medicines table and related functionality

  1. New Tables
    - `medicines`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `dosage` (text)
      - `side_effects` (text)
      - `warnings` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on medicines table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  dosage text,
  side_effects text,
  warnings text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

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