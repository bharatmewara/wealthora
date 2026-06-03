const db = require('../../db');

const JSONB_FIELDS = new Set(['benefits', 'process_steps', 'documents', 'faqs', 'pricing_plans']);

const ALLOWED_FIELDS = [
  'category_id', 'title', 'slug', 'short_description', 'long_description',
  'pricing', 'icon', 'banner_image', 'featured', 'status', 'seo_title',
  'meta_description', 'benefits', 'process_steps', 'documents', 'pricing_plans'
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

function parsePayload(body) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    const val = body[field];
    if (val === undefined) continue;
    if (JSONB_FIELDS.has(field)) {
      data[field] = safeJsonArray(val);
      continue;
    }
    if (field === 'featured') {
      data[field] = val === true || val === 'true';
      continue;
    }
    if (val === '' && !['title', 'short_description'].includes(field)) continue;
    data[field] = val;
  }
  return data;
}

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

async function uniqueSlug(base, excludeId = null) {
  let slug = base;
  let n = 1;
  while (true) {
    const q = excludeId
      ? 'SELECT id FROM ent_services WHERE slug = $1 AND id != $2'
      : 'SELECT id FROM ent_services WHERE slug = $1';
    const params = excludeId ? [slug, excludeId] : [slug];
    const { rows } = await db.query(q, params);
    if (rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
}

// GET all services with pagination and filtering
exports.getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM ent_services WHERE deleted_at IS NULL';
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const { rows } = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM ent_services WHERE deleted_at IS NULL';
    const countParams = [];
    if (status) {
      countParams.push(status);
      countQuery += ` AND status = $${countParams.length}`;
    }
    const countRes = await db.query(countQuery, countParams);
    const total = parseInt(countRes.rows[0].count);
    
    res.json({
      data: rows,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('getAllServices error:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// GET single service
exports.getServiceById = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM ent_services WHERE id = $1 AND deleted_at IS NULL', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getServiceById error:', err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// POST create new service
exports.createService = async (req, res) => {
  try {
    const data = parsePayload(req.body);
    const base = data.slug ? data.slug : generateSlug(data.title || 'service');
    data.slug = await uniqueSlug(base);

    const cols = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

    const { rows } = await db.query(
      `INSERT INTO ent_services (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      vals
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createService error:', err);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// PUT update service
exports.updateService = async (req, res) => {
  try {
    const data = parsePayload(req.body);
    
    if (!data.slug && data.title) {
      const base = generateSlug(data.title);
      data.slug = await uniqueSlug(base, req.params.id);
    } else if (data.slug) {
      const { rows } = await db.query(
        'SELECT id FROM ent_services WHERE slug = $1 AND id != $2',
        [data.slug, req.params.id]
      );
      if (rows.length > 0) data.slug = await uniqueSlug(data.slug, req.params.id);
    }

    data.updated_at = new Date();

    const cols = Object.keys(data);
    const vals = Object.values(data);
    const setClause = cols.map((col, i) => `${col} = $${i + 1}`).join(', ');

    const { rows } = await db.query(
      `UPDATE ent_services SET ${setClause} WHERE id = $${cols.length + 1} RETURNING *`,
      [...vals, req.params.id]
    );
    
    if (rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('updateService error:', err);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// DELETE soft delete service
exports.deleteService = async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'UPDATE ent_services SET deleted_at = NOW(), status = $1 WHERE id = $2',
      ['archived', req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ success: true, message: 'Service archived successfully' });
  } catch (err) {
    console.error('deleteService error:', err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
