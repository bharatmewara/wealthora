require('dotenv').config();
const db = require('./db');

async function migrate() {
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
  ];

  for (const sql of columns) {
    await db.query(sql);
  }

  // Backfill slugs for rows that have none — clean slug without id suffix
  const { rows } = await db.query(`SELECT id, title FROM services WHERE slug IS NULL OR slug = '' ORDER BY id`);
  const used = new Set();

  // Collect existing slugs to avoid collisions
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

  // Unique index — idempotent
  await db.query(`CREATE UNIQUE INDEX IF NOT EXISTS services_slug_uidx ON services (slug)`);

  console.log('✓ DB migration complete');
}

module.exports = migrate;
