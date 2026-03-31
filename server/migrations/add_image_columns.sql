-- Add image columns for testimonials, hero_slides, blogs
-- Run these ALTER TABLE commands in your PostgreSQL database

ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS avatar_image VARCHAR(255),
ADD COLUMN IF NOT EXISTS banner_image VARCHAR(255);

ALTER TABLE hero_slides 
ADD COLUMN IF NOT EXISTS image VARCHAR(255);

ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS blog_image VARCHAR(255);

-- Optional: Add created_date, created_time to enquiries (or parse in CSV)
-- ALTER TABLE enquiries ADD COLUMN created_date DATE, ADD COLUMN created_time TIME;
-- UPDATE enquiries SET created_date = created_at::date, created_time = created_at::time;

-- Verify:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'testimonials';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'hero_slides';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'blogs';

