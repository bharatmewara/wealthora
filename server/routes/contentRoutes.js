const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { verifyToken } = require('../middleware/auth');

// ── PUBLIC: GET all (for public pages) ──────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM content_sections ORDER BY section_key ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// ── PUBLIC: GET by section key ───────────────────────────────────────────────
router.get('/:sectionKey', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM content_sections WHERE section_key = $1 LIMIT 1',
      [req.params.sectionKey]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Section not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch section' });
  }
});

// ── PROTECTED: PUT upsert section (admin) ────────────────────────────────────
router.put('/:sectionKey', verifyToken, async (req, res) => {
  try {
    const { section_key: _, ...updates } = req.body;

    if (!req.params.sectionKey) return res.status(400).json({ error: 'sectionKey required' });

    const columns = ['section_key', ...Object.keys(updates)];
    const placeholders = columns.map((_, i) => `$${i + 1}`);
    const values = [req.params.sectionKey, ...Object.values(updates)];
    const setClause = Object.keys(updates).map(field => `${field} = EXCLUDED.${field}`).join(', ');

    const query = `
      INSERT INTO content_sections (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      ON CONFLICT (section_key)
      DO UPDATE SET ${setClause}, updated_at = NOW()
      RETURNING *
    `;

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Content upsert error for section:', req.params.sectionKey, err.message);
    res.status(500).json({ error: 'Failed to upsert section', details: err.message });
  }
});

module.exports = router;
