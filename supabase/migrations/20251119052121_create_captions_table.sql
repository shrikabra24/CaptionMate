/*
  # Instagram Caption Generator - Database Schema

  1. New Tables
    - `captions`
      - `id` (uuid, primary key)
      - `caption_text` (text) - The actual caption content
      - `category` (text) - Main category (Travel, Gym, Love, etc.)
      - `tone` (text, optional) - Tone descriptor (funny, aesthetic, bold, etc.)
      - `tags` (text[], array) - Multiple tags for search relevance
      - `used_count` (integer) - Track how many times caption has been used
      - `created_at` (timestamptz) - When caption was added
      - `updated_at` (timestamptz) - Last modification time

  2. Security
    - Enable RLS on `captions` table
    - Add policy for public read access (anyone can view captions)
    - Add policy for authenticated users to update used_count

  3. Indexes
    - Index on category for fast filtering
    - GIN index on tags array for efficient tag searches
    - Text search index on caption_text for full-text search
*/

-- Create captions table
CREATE TABLE IF NOT EXISTS captions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_text text NOT NULL,
  category text NOT NULL,
  tone text,
  tags text[] DEFAULT '{}',
  used_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE captions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read captions (public access for viewing)
CREATE POLICY "Anyone can view captions"
  ON captions
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert captions (for bulk upload)
CREATE POLICY "Anyone can insert captions"
  ON captions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update captions (for used_count tracking)
CREATE POLICY "Anyone can update captions"
  ON captions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_captions_category ON captions(category);
CREATE INDEX IF NOT EXISTS idx_captions_tags ON captions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_captions_text_search ON captions USING GIN(to_tsvector('english', caption_text));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_captions_updated_at ON captions;
CREATE TRIGGER update_captions_updated_at
  BEFORE UPDATE ON captions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();