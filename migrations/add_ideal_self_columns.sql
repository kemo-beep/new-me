-- Add new columns to ideal_self table for expanded onboarding data
ALTER TABLE ideal_self 
ADD COLUMN IF NOT EXISTS priority_areas JSONB,
ADD COLUMN IF NOT EXISTS financial_vision TEXT,
ADD COLUMN IF NOT EXISTS health_vision TEXT,
ADD COLUMN IF NOT EXISTS signature_habits JSONB,
ADD COLUMN IF NOT EXISTS constraints TEXT;
