const db = require('../../db');

const ALLOWED_FIELDS = [
  'service_id', 'name', 'phone', 'email', 'message', 'status', 'assigned_to',
  'source', 'city', 'business_type'
];

function parsePayload(body) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }
  return data;
}

// GET all enquiries with pagination and filtering
exports.getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM ent_enquiries WHERE deleted_at IS NULL';
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length})`;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const { rows } = await db.query(query, params);
    
    // Total count
    let countQuery = 'SELECT COUNT(*) FROM ent_enquiries WHERE deleted_at IS NULL';
    const countParams = [];
    if (status) {
      countParams.push(status);
      countQuery += ` AND status = $${countParams.length}`;
    }
    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND (name ILIKE $${countParams.length} OR email ILIKE $${countParams.length} OR phone ILIKE $${countParams.length})`;
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
    console.error('getAllEnquiries error:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

// GET single enquiry
exports.getEnquiryById = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM ent_enquiries WHERE id = $1 AND deleted_at IS NULL', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getEnquiryById error:', err);
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
};

// POST create enquiry (useful if admin manually adds a lead)
exports.createEnquiry = async (req, res) => {
  try {
    const data = parsePayload(req.body);
    const cols = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

    const { rows } = await db.query(
      `INSERT INTO ent_enquiries (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      vals
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createEnquiry error:', err);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
};

// PUT update enquiry status or info
exports.updateEnquiry = async (req, res) => {
  try {
    const data = parsePayload(req.body);
    data.updated_at = new Date();

    const cols = Object.keys(data);
    const vals = Object.values(data);
    const setClause = cols.map((col, i) => `${col} = $${i + 1}`).join(', ');

    const { rows } = await db.query(
      `UPDATE ent_enquiries SET ${setClause} WHERE id = $${cols.length + 1} RETURNING *`,
      [...vals, req.params.id]
    );
    
    if (rows.length === 0) return res.status(404).json({ error: 'Enquiry not found' });

    // If status changed, log it in lead_activities
    if (data.status) {
      // We would ideally fetch the user id from req.user, assuming req.user.id exists from verifyToken middleware
      const userId = req.user?.id || null; 
      await db.query(
        `INSERT INTO lead_activities (enquiry_id, user_id, activity_type, description) VALUES ($1, $2, $3, $4)`,
        [req.params.id, userId, 'status_change', `Status changed to ${data.status}`]
      );
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('updateEnquiry error:', err);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
};

// DELETE soft delete enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'UPDATE ent_enquiries SET deleted_at = NOW() WHERE id = $1',
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err) {
    console.error('deleteEnquiry error:', err);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
};
