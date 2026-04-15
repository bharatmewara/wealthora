const express = require('express');
const router = express.Router();
const db = require('../db.js');

const SERVICE_FIELDS = [
  'title', 'category', 'description', 'price', 'icon', 'featured',
  'slug', 'long_description', 'hero_tagline',
  'benefits', 'process_steps', 'documents', 'faqs', 'pricing_plans',
  'cta_text', 'cta_phone'
];

const JSONB_FIELDS = new Set(['benefits', 'process_steps', 'documents', 'faqs', 'pricing_plans']);

function parsePayload(body) {
  const data = {};
  for (const field of SERVICE_FIELDS) {
    if (body[field] === undefined) continue;
    if (JSONB_FIELDS.has(field)) {
      data[field] = typeof body[field] === 'string' ? JSON.parse(body[field]) : body[field];
    } else {
      data[field] = body[field];
    }
  }
  return data;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/by-slug/:slug', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = parsePayload(req.body);
    if (!data.slug && data.title) data.slug = generateSlug(data.title);

    const cols = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

    const result = await db.query(
      `INSERT INTO services (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      vals
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = parsePayload(req.body);
    if (!data.slug && data.title) data.slug = generateSlug(data.title);

    const cols = Object.keys(data);
    const vals = Object.values(data);
    const setClause = cols.map((col, i) => `${col} = $${i + 1}`).join(', ');

    const result = await db.query(
      `UPDATE services SET ${setClause} WHERE id = $${cols.length + 1} RETURNING *`,
      [...vals, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
