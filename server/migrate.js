require('dotenv').config();
const db = require('./db');

async function migrate() {
  // ── Phase 1: Original service column migrations ──────────────────────────
  const columns = [
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(255)`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS long_description TEXT`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS hero_tagline VARCHAR(255)`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS process_steps JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing_plans JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS cta_text VARCHAR(255)`,
    `ALTER TABLE services ADD COLUMN IF NOT EXISTS cta_phone VARCHAR(50)`,

    // ── Phase 2: Hero slides — new fields ───────────────────────────────────
    `ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS cta_text VARCHAR(120)`,
    `ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS cta_url VARCHAR(255)`,
    `ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true`,
    `ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS badge_text VARCHAR(120)`,
    `ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS image VARCHAR(500)`,

    // ── Phase 2: Enquiries — new fields ─────────────────────────────────────
    `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS city VARCHAR(100)`,
    `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS business_type VARCHAR(100)`,
    `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS notes TEXT`,
    `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(100)`,

    // ── Phase 2: Testimonials — image columns ────────────────────────────────
    `ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS avatar_image VARCHAR(500)`,
    `ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS banner_image VARCHAR(500)`,

    // ── Phase 2: Blogs — image column ────────────────────────────────────────
    `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS blog_image VARCHAR(500)`,
  ];

  for (const sql of columns) {
    try {
      await db.query(sql);
    } catch (err) {
      console.error('Column migration warning:', err.message);
    }
  }

  // ── Phase 2: Create FAQs table ───────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS faqs (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      sort_order INTEGER DEFAULT 1,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ── Seed global FAQs if empty ────────────────────────────────────────────
  const faqCount = await db.query('SELECT COUNT(*) FROM faqs');
  if (parseInt(faqCount.rows[0].count) === 0) {
    await db.query(`
      INSERT INTO faqs (question, answer, category, sort_order) VALUES
      ('What documents are needed to register a company?', 'You need PAN card, Aadhaar card, address proof, and passport-sized photos of all directors.', 'Company Registration', 1),
      ('How long does GST registration take?', 'GST registration is typically completed within 7-10 working days after submission of documents.', 'GST', 1),
      ('What is the difference between Private Limited and LLP?', 'A Private Limited company has shareholders and directors, while an LLP has partners. Both offer limited liability but differ in compliance requirements and taxation.', 'Company Registration', 2),
      ('Do I need a physical office for company registration?', 'A registered office address is required, but it can be a residential address in most states.', 'Company Registration', 3),
      ('How much does trademark registration cost?', 'Trademark registration typically starts from INR 4,999 for one class, including government fees.', 'Trademark', 1),
      ('What is the annual compliance for a Private Limited company?', 'Annual compliance includes filing annual returns with MCA, audited financial statements, and income tax returns.', 'Compliance', 1)
    `);
  }

  // ── Seed default content_sections for CMS policies if missing ───────────────
  await db.query(`
    INSERT INTO content_sections (section_key, title, subtitle, body, data)
    VALUES
      ('privacy_policy', 'Privacy Policy', NULL, NULL, '{}'::jsonb),
      ('terms_conditions', 'Terms & Conditions', NULL, NULL, '{}'::jsonb),
      ('refund_policy', 'Refund Policy', NULL, NULL, '{}'::jsonb),
      ('website_settings', 'Website Settings', NULL, NULL,
        '{"phone": "+91 98765 43210", "whatsapp": "919876543210", "email": "hello@wealthora.com", "address": ""}'::jsonb)
    ON CONFLICT (section_key) DO NOTHING
  `);

  const enterpriseTables = await db.query(`
    SELECT
      to_regclass('public.roles') AS roles_table,
      to_regclass('public.users') AS users_table
  `);

  if (enterpriseTables.rows[0].roles_table && enterpriseTables.rows[0].users_table) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wealthora.com';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH ||
      '$2b$10$hcjHl7KSAn6egOVlEmjCM.lDtWi3WdL9cuoS9.Qj1fCnOf6pGLULq';

    const roleResult = await db.query(`
      INSERT INTO roles (name, description)
      VALUES ('admin', 'Administrator')
      ON CONFLICT (name) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `);

    await db.query(`
      INSERT INTO users (role_id, name, email, password_hash, status)
      VALUES ($1, 'Admin', $2, $3, 'active')
      ON CONFLICT (email) DO NOTHING
    `, [roleResult.rows[0].id, adminEmail, adminPasswordHash]);
  }

  // ── Backfill service slugs ───────────────────────────────────────────────
  const { rows } = await db.query(`SELECT id, title FROM services WHERE slug IS NULL OR slug = '' ORDER BY id`);
  const used = new Set();
  const existing = await db.query(`SELECT slug FROM services WHERE slug IS NOT NULL AND slug != ''`);
  existing.rows.forEach(r => used.add(r.slug));

  for (const row of rows) {
    const base = row.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    let slug = base;
    let n = 1;
    while (used.has(slug)) slug = `${base}-${n++}`;
    used.add(slug);
    await db.query(`UPDATE services SET slug = $1 WHERE id = $2`, [slug, row.id]);
  }

  // Unique index for slugs — idempotent
  await db.query(`CREATE UNIQUE INDEX IF NOT EXISTS services_slug_uidx ON services (slug)`);

  console.log('✓ DB migration complete');
}

module.exports = migrate;
