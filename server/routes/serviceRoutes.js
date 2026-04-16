const express = require('express');
const router = express.Router();
const db = require('../db.js');

const JSONB_FIELDS = new Set(['benefits', 'process_steps', 'documents', 'faqs', 'pricing_plans']);

const ALLOWED_FIELDS = [
  'title', 'category', 'description', 'price', 'icon', 'featured',
  'slug', 'long_description', 'hero_tagline',
  'benefits', 'process_steps', 'documents', 'faqs', 'pricing_plans',
  'cta_text', 'cta_phone'
];

function safeJsonArray(val) {
  if (val === null || val === undefined || val === '') return '[]';
  if (Array.isArray(val)) return JSON.stringify(val);
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); return JSON.stringify(Array.isArray(p) ? p : []); }
    catch { return '[]'; }
  }
  return '[]';
}

// Normalize pricing_plans so features is always an array
function normalizePricingPlans(val) {
  const arr = JSON.parse(safeJsonArray(val));
  return JSON.stringify(arr.map((plan) => ({
    ...plan,
    features: Array.isArray(plan.features)
      ? plan.features
      : typeof plan.features === 'string' && plan.features.trim()
        ? plan.features.split('\n').map((f) => f.trim()).filter(Boolean)
        : []
  })));
}

function parsePayload(body) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    const val = body[field];
    if (val === undefined) continue;

    if (JSONB_FIELDS.has(field)) {
      data[field] = field === 'pricing_plans' ? normalizePricingPlans(val) : safeJsonArray(val);
      continue;
    }

    if (field === 'featured') {
      data[field] = val === true || val === 'true';
      continue;
    }

    // skip empty optional strings
    if (val === '' && !['title', 'category', 'description'].includes(field)) continue;

    data[field] = val;
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

async function uniqueSlug(base, excludeId = null) {
  let slug = base;
  let n = 1;
  while (true) {
    const q = excludeId
      ? 'SELECT id FROM services WHERE slug = $1 AND id != $2'
      : 'SELECT id FROM services WHERE slug = $1';
    const params = excludeId ? [slug, excludeId] : [slug];
    const { rows } = await db.query(q, params);
    if (rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
}

// GET all
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /services:', err.message);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// GET by slug — must come before /:id
router.get('/by-slug/:slug', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /services/by-slug:', err.message);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /services/:id:', err.message);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const data = parsePayload(req.body);

    const base = data.slug ? data.slug : generateSlug(data.title || 'service');
    data.slug = await uniqueSlug(base);

    const cols = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

    console.log('POST /services — inserting fields:', cols.join(', '));

    const result = await db.query(
      `INSERT INTO services (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      vals
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /services error:', err.message);
    console.error('Body received:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ error: 'Failed to create service', details: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const data = parsePayload(req.body);

    if (!data.slug && data.title) {
      const base = generateSlug(data.title);
      data.slug = await uniqueSlug(base, req.params.id);
    } else if (data.slug) {
      const { rows } = await db.query(
        'SELECT id FROM services WHERE slug = $1 AND id != $2',
        [data.slug, req.params.id]
      );
      if (rows.length > 0) {
        data.slug = await uniqueSlug(data.slug, req.params.id);
      }
    }

    const cols = Object.keys(data);
    const vals = Object.values(data);
    const setClause = cols.map((col, i) => `${col} = $${i + 1}`).join(', ');

    console.log('PUT /services/:id — updating fields:', cols.join(', '));

console.log('PUT update - id:', req.params.id);
console.log('data keys:', Object.keys(data));
console.log('slug handling:', data.slug ? 'provided' : 'generate');
console.log('data sample:', JSON.stringify({benefits: data.benefits, process_steps: data.process_steps}, null, 2).slice(0, 500));

const result = await db.query(
      `UPDATE services SET ${setClause} WHERE id = $${cols.length + 1} RETURNING *`,
      [...vals, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /services/:id error:', err.message);
    console.error('Body received:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ error: 'Failed to update service', details: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /services error:', err.message);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
