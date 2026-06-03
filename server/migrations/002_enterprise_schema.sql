-- 002_enterprise_schema.sql
-- Massive DB Architecture Redesign

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. ROLES & USERS
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 2. SERVICES & CATEGORIES
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ent_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES service_categories(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT,
    long_description TEXT,
    pricing VARCHAR(100),
    icon VARCHAR(50),
    banner_image VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'draft',
    seo_title VARCHAR(255),
    meta_description TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    process_steps JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    pricing_plans JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES ent_services(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRM ENQUIRIES & ACTIVITIES
CREATE TABLE IF NOT EXISTS ent_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES ent_services(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(100) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    assigned_to UUID REFERENCES users(id),
    source VARCHAR(100) DEFAULT 'website',
    city VARCHAR(100),
    business_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiry_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID REFERENCES ent_enquiries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID REFERENCES ent_enquiries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    activity_type VARCHAR(100) NOT NULL, -- 'status_change', 'call', 'email', 'note_added'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CONTENT MANAGEMENT (Blogs, Testimonials, Hero, FAQs, Pages)
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ent_blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES blog_categories(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id),
    author_name VARCHAR(255),
    featured_image VARCHAR(500),
    status VARCHAR(50) DEFAULT 'draft',
    seo_title VARCHAR(255),
    meta_description TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ent_testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    company VARCHAR(255),
    testimonial TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    avatar_image VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ent_hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading VARCHAR(255) NOT NULL,
    subheading TEXT,
    cta_text VARCHAR(120),
    cta_url VARCHAR(255),
    badge_text VARCHAR(120),
    bg_image VARCHAR(500),
    bg_color VARCHAR(30) DEFAULT '#0ea5e9',
    sort_order INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ent_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) DEFAULT 'General',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ent_cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    seo_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 5. SETTINGS & SYSTEM LOGS
CREATE TABLE IF NOT EXISTS ent_website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_ent_enquiries_status ON ent_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_ent_enquiries_created_at ON ent_enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_ent_services_slug ON ent_services(slug);
CREATE INDEX IF NOT EXISTS idx_ent_services_status ON ent_services(status);
CREATE INDEX IF NOT EXISTS idx_ent_blogs_slug ON ent_blogs(slug);
CREATE INDEX IF NOT EXISTS idx_ent_blogs_status ON ent_blogs(status);

-- DATA MIGRATION (from old SERIAL tables to new UUID tables)
-- Services
INSERT INTO ent_services (title, category_id, slug, short_description, long_description, pricing, icon, banner_image, featured, status, benefits, process_steps, documents, pricing_plans, created_at)
SELECT 
    title, 
    NULL, -- category_id missing in old schema
    COALESCE(slug, 'slug-' || id::text), 
    description, 
    long_description, 
    price, 
    icon, 
    NULL, 
    featured, 
    'published', 
    benefits, 
    process_steps, 
    documents, 
    pricing_plans, 
    created_at
FROM services
ON CONFLICT (slug) DO NOTHING;

-- Enquiries
INSERT INTO ent_enquiries (name, email, phone, message, status, city, business_type, created_at)
SELECT 
    COALESCE(name, 'Unknown'), 
    email, 
    COALESCE(phone, 'N/A'), 
    message, 
    status, 
    city, 
    business_type, 
    created_at
FROM enquiries;

-- Blogs
INSERT INTO ent_blogs (title, slug, content, author_name, featured_image, status, created_at)
SELECT 
    title, 
    COALESCE(LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g')), 'blog-' || id::text),
    blog_content, 
    blog_author, 
    blog_image, 
    CASE WHEN published = true THEN 'published' ELSE 'draft' END, 
    created_at
FROM blogs
ON CONFLICT (slug) DO NOTHING;

-- Testimonials
INSERT INTO ent_testimonials (name, role, testimonial, rating, avatar_image, status, created_at)
SELECT name, role, text, rating, avatar_image, 'published', created_at
FROM testimonials;

-- Hero Slides
INSERT INTO ent_hero_slides (heading, subheading, cta_text, cta_url, badge_text, bg_image, bg_color, sort_order, active, created_at)
SELECT heading, subheading, cta_text, cta_url, badge_text, image, bg_color, slide_order, active, created_at
FROM hero_slides;

-- FAQs
INSERT INTO ent_faqs (category, question, answer, sort_order, active, created_at)
SELECT category, question, answer, sort_order, active, created_at
FROM faqs;

-- Settings (Migrate content_sections website_settings to JSONB)
INSERT INTO ent_website_settings (setting_key, setting_value)
SELECT section_key, data
FROM content_sections
WHERE section_key IN ('website_settings', 'footer_contact', 'home_about')
ON CONFLICT (setting_key) DO NOTHING;

COMMIT;
