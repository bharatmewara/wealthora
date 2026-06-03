const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { verifyToken } = require('../middleware/auth');

// ── PUBLIC: GET active FAQs ──────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM faqs WHERE active = true ORDER BY category, sort_order ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// ── PROTECTED: GET all FAQs including inactive (admin) ───────────────────────
router.get('/all', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM faqs ORDER BY category, sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// ── PROTECTED: POST create ───────────────────────────────────────────────────
router.post('/', verifyToken, async (req, res) => {
  try {
    const { question, answer, category = 'General', sort_order = 1, active = true } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' });
    const result = await db.query(
      `INSERT INTO faqs (question, answer, category, sort_order, active, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [question.trim(), answer.trim(), category.trim(), sort_order, active !== false && active !== 'false']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

// ── PROTECTED: PUT update ────────────────────────────────────────────────────
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { question, answer, category, sort_order, active } = req.body;
    const updates = {};
    if (question !== undefined) updates.question = question.trim();
    if (answer !== undefined) updates.answer = answer.trim();
    if (category !== undefined) updates.category = category.trim();
    if (sort_order !== undefined) updates.sort_order = sort_order;
    if (active !== undefined) updates.active = active !== false && active !== 'false';

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });

    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), req.params.id];

    const result = await db.query(
      `UPDATE faqs SET ${fields} WHERE id = $${Object.keys(updates).length + 1} RETURNING *`,
      values
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'FAQ not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// ── PROTECTED: DELETE ────────────────────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM faqs WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

module.exports = router;
