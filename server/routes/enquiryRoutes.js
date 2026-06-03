const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { verifyToken } = require('../middleware/auth');

// ── PUBLIC: GET all enquiries not exposed publicly ─────────────────────────
// ── PROTECTED: GET all (admin) ───────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    const enquiriesWithDateTime = result.rows.map(e => {
      const date = new Date(e.created_at);
      return {
        ...e,
        created_date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        created_time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    });
    res.json(enquiriesWithDateTime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

// ── PUBLIC: POST — submit enquiry (public users) ─────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message, city, business_type, status = 'new' } = req.body;

    // Basic validation
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!phone || !phone.trim()) return res.status(400).json({ error: 'Phone is required' });

    const result = await db.query(
      `INSERT INTO enquiries (name, email, phone, service, message, city, business_type, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [
        name.trim(),
        (email || '').trim(),
        phone.trim(),
        (service || '').trim(),
        (message || '').trim(),
        (city || '').trim(),
        (business_type || '').trim(),
        status
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create enquiry', details: err.message });
  }
});

// ── PROTECTED: PUT — update enquiry (admin) ──────────────────────────────────
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { status, name, email, phone, service, message, notes, assigned_to } = req.body;

    const result = await db.query(
      `UPDATE enquiries SET
       status = COALESCE($1, status),
       name = COALESCE($2, name),
       email = COALESCE($3, email),
       phone = COALESCE($4, phone),
       service = COALESCE($5, service),
       message = COALESCE($6, message),
       notes = COALESCE($7, notes),
       assigned_to = COALESCE($8, assigned_to)
       WHERE id = $9 RETURNING *`,
      [status, name, email, phone, service, message, notes, assigned_to, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update enquiry', details: err.message });
  }
});

// ── PROTECTED: DELETE ────────────────────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM enquiries WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

module.exports = router;
