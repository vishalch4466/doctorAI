/*
  # Chat System Schema

  1. New Tables
    - `chats`: Stores chat sessions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `specialist` (text)
      - `created_at` (timestamptz)
    
    - `messages`: Stores chat messages
      - `id` (uuid, primary key)
      - `chat_id` (uuid, references chats)
      - `content` (text)
      - `is_user` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
*/

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  specialist text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats NOT NULL,
  content text NOT NULL,
  is_user boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can create their own chats" ON chats;
    DROP POLICY IF EXISTS "Users can view their own chats" ON chats;
    DROP POLICY IF EXISTS "Users can insert messages in their chats" ON messages;
    DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create policies for chats
CREATE POLICY "Users can create their own chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for messages
CREATE POLICY "Users can insert messages in their chats"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view messages in their chats"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );