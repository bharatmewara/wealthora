-- Wealthora DB migration + demo data (PostgreSQL)
BEGIN;

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price VARCHAR(100),
  icon VARCHAR(20),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  blog_author VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  blog_content TEXT NOT NULL,
  blog_image_color VARCHAR(30),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(100),
  service TEXT,
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS phone VARCHAR(100);
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS service TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='enquiry_name') THEN
    EXECUTE 'UPDATE enquiries SET name = COALESCE(name, enquiry_name)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='enquiry_email') THEN
    EXECUTE 'UPDATE enquiries SET email = COALESCE(email, enquiry_email)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='enquiry_phone') THEN
    EXECUTE 'UPDATE enquiries SET phone = COALESCE(phone, enquiry_phone)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='enquiry_service') THEN
    EXECUTE 'UPDATE enquiries SET service = COALESCE(service, enquiry_service)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='enquiry_message') THEN
    EXECUTE 'UPDATE enquiries SET message = COALESCE(message, enquiry_message)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='enquiry_status') THEN
    EXECUTE 'UPDATE enquiries SET status = COALESCE(status, enquiry_status)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='enquiry_date') THEN
    EXECUTE 'UPDATE enquiries SET created_at = COALESCE(created_at, enquiry_date)';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  heading VARCHAR(255) NOT NULL,
  subheading TEXT,
  bg_color VARCHAR(30) DEFAULT '#0ea5e9',
  slide_order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS heading VARCHAR(255);
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS subheading TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS bg_color VARCHAR(30) DEFAULT '#0ea5e9';
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS slide_order INTEGER DEFAULT 1;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hero_slides' AND column_name='title') THEN
    EXECUTE 'UPDATE hero_slides SET heading = COALESCE(heading, title)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hero_slides' AND column_name='subtitle') THEN
    EXECUTE 'UPDATE hero_slides SET subheading = COALESCE(subheading, subtitle)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hero_slides' AND column_name='order') THEN
    EXECUTE 'UPDATE hero_slides SET slide_order = COALESCE(slide_order, "order")';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS founders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  initials VARCHAR(8),
  avatar_color VARCHAR(30) DEFAULT '#0ea5e9',
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_sections (
  id SERIAL PRIMARY KEY,
  section_key VARCHAR(120) UNIQUE NOT NULL,
  title VARCHAR(255),
  subtitle TEXT,
  body TEXT,
  cta_text VARCHAR(120),
  cta_url VARCHAR(255),
  data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (title, category, description, price, icon, featured)
SELECT * FROM (VALUES
  ('Private Limited Registration', 'Registration', 'Complete registration support for private limited companies.', 'INR 6999', '??', true),
  ('GST Registration', 'Tax & Compliance', 'Fast GST registration and filing guidance.', 'INR 1999', '??', true),
  ('Trademark Filing', 'Legal', 'Trademark filing, objection handling and advisory.', 'INR 4999', '???', false)
) AS v(title, category, description, price, icon, featured)
WHERE NOT EXISTS (SELECT 1 FROM services);

INSERT INTO blogs (title, blog_author, category, blog_content, blog_image_color, published)
SELECT * FROM (VALUES
  ('How to Register a Startup in India', 'Team Wealthora', 'Startup', 'A practical checklist for startup incorporation and compliance.', '#0ea5e9', true),
  ('GST Basics for Small Businesses', 'Anita Mehra', 'Tax', 'Understand GST returns, timelines and common mistakes.', '#f97316', true),
  ('Draft Example Blog', 'Editorial Team', 'General', 'This is a draft blog. Keep unpublished until review.', '#64748b', false)
) AS v(title, blog_author, category, blog_content, blog_image_color, published)
WHERE NOT EXISTS (SELECT 1 FROM blogs);

INSERT INTO testimonials (name, role, text, rating)
SELECT * FROM (VALUES
  ('Rahul Sharma', 'Founder, TechNova', 'Very smooth onboarding and quick filings.', 5),
  ('Priya Nair', 'Director, Blueleaf Foods', 'Clear communication and dependable support.', 5),
  ('Aman Verma', 'Owner, AV Retail', 'Good response time and practical advice.', 4),
  ('Neha Kapoor', 'Co-founder, Growthly', 'Excellent support for compliance setup.', 5)
) AS v(name, role, text, rating)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

INSERT INTO enquiries (name, email, phone, service, message, status)
SELECT * FROM (VALUES
  ('Karan Malhotra', 'karan@example.com', '+91-9876543210', 'GST Registration', 'Need GST for a new e-commerce business.', 'new'),
  ('Sneha Gupta', 'sneha@example.com', '+91-9988776655', 'Trademark Filing', 'Want to file trademark for my brand name.', 'contacted')
) AS v(name, email, phone, service, message, status)
WHERE NOT EXISTS (SELECT 1 FROM enquiries);

INSERT INTO hero_slides (heading, subheading, slide_order)
SELECT * FROM (VALUES
  ('Launch Your Business With Confidence', 'Company registration, tax and compliance under one roof.', 1),
  ('Scale Faster, Stay Compliant', 'Expert advisory for founders and growth teams.', 2)
) AS v(heading, subheading, slide_order)
WHERE NOT EXISTS (SELECT 1 FROM hero_slides);

INSERT INTO founders (name, role, bio, initials, avatar_color, display_order)
SELECT * FROM (VALUES
  ('Amit Kumar', 'Founder & CEO', 'Leads business strategy and regulatory advisory.', 'AK', '#f97316', 1),
  ('Riya Sharma', 'Head of Operations', 'Manages delivery operations and compliance workflows.', 'RS', '#10b981', 2),
  ('Vikram Singh', 'Technical Lead', 'Builds and scales internal automation systems.', 'VS', '#0ea5e9', 3)
) AS v(name, role, bio, initials, avatar_color, display_order)
WHERE NOT EXISTS (SELECT 1 FROM founders);

INSERT INTO content_sections (section_key, title, subtitle, body, cta_text, cta_url)
VALUES (
  'home_about',
  'About Wealthora',
  'We simplify compliance and growth for modern businesses.',
  'From registration to recurring filings, Wealthora helps founders run compliant and scalable businesses with expert guidance.',
  'Learn more',
  '/about'
)
ON CONFLICT (section_key) DO NOTHING;

COMMIT;
