const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    // Parse date/time for frontend
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

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message, status = 'new' } = req.body;
    const result = await db.query(
      `INSERT INTO enquiries (name, email, phone, service, message, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [name || '', email || '', phone || '', service || '', message || '', status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create enquiry', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, name, email, phone, service, message } = req.body;
    const result = await db.query(
      `UPDATE enquiries SET 
       status = $1,
       name = COALESCE($2, name),
       email = COALESCE($3, email),
       phone = COALESCE($4, phone),
       service = COALESCE($5, service),
       message = COALESCE($6, message)
       WHERE id = $7 RETURNING *`,
      [status, name, email, phone, service, message, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update enquiry', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM enquiries WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

module.exports = router;
