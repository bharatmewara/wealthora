-- Add slug and rich detail fields to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS hero_tagline VARCHAR(255);
ALTER TABLE services ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS process_steps JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing_plans JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS cta_text VARCHAR(255);
ALTER TABLE services ADD COLUMN IF NOT EXISTS cta_phone VARCHAR(50);

-- Backfill slugs for existing services (lowercase title, spaces to hyphens, strip non-alphanumeric)
UPDATE services
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';
