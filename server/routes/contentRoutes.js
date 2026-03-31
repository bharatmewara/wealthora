const express = require('express');
const router = express.Router();

const db = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM content_sections ORDER BY section_key ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/:sectionKey', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM content_sections WHERE section_key = $1 LIMIT 1',
      [req.params.sectionKey]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch section' });
  }
});

router.put('/:sectionKey', async (req, res) => {
  try {
    const { title, subtitle, body, cta_text, cta_url, data } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO content_sections (section_key, title, subtitle, body, cta_text, cta_url, data)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (section_key)
         DO UPDATE SET
           title = EXCLUDED.title,
           subtitle = EXCLUDED.subtitle,
           body = EXCLUDED.body,
           cta_text = EXCLUDED.cta_text,
           cta_url = EXCLUDED.cta_url,
           data = COALESCE(EXCLUDED.data, content_sections.data),
           updated_at = NOW()
         RETURNING *`,
        [req.params.sectionKey, title, subtitle, body, cta_text, cta_url, data ?? null]
      );

      return res.json(result.rows[0]);
    } catch (err) {
      if (err?.code !== '42703' && !/column\\s+\"data\"/i.test(err?.message || '')) {
        throw err;
      }

      const result = await db.query(
        `INSERT INTO content_sections (section_key, title, subtitle, body, cta_text, cta_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (section_key)
         DO UPDATE SET
           title = EXCLUDED.title,
           subtitle = EXCLUDED.subtitle,
           body = EXCLUDED.body,
           cta_text = EXCLUDED.cta_text,
           cta_url = EXCLUDED.cta_url,
           updated_at = NOW()
         RETURNING *`,
        [req.params.sectionKey, title, subtitle, body, cta_text, cta_url]
      );

      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upsert section' });
  }
});

module.exports = router;
