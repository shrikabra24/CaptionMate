/*
  # Add Multiple Categories Support

  ## Changes
  1. Modified Tables
    - `captions` table:
      - Change `category` column to `categories` (text array) to support multiple categories
      - Keep existing data by converting single category to array
  
  ## Important Notes
    - Existing data will be migrated from single category to array format
    - All existing captions will maintain their current category in the new array format
*/

-- Add new categories column as array
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'captions' AND column_name = 'categories'
  ) THEN
    ALTER TABLE captions ADD COLUMN categories text[];
    
    -- Migrate existing data: convert single category to array
    UPDATE captions SET categories = ARRAY[category] WHERE categories IS NULL;
    
    -- Make categories not null
    ALTER TABLE captions ALTER COLUMN categories SET NOT NULL;
  END IF;
END $$;

-- Create index for array search performance
CREATE INDEX IF NOT EXISTS idx_captions_categories ON captions USING GIN (categories);
