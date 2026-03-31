const express = require('express');
const router = express.Router();

const db = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM founders ORDER BY display_order ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, role, bio, initials, avatar_color, display_order } = req.body;
    const result = await db.query(
      `INSERT INTO founders (name, role, bio, initials, avatar_color, display_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, role, bio, initials, avatar_color, display_order || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create founder' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, role, bio, initials, avatar_color, display_order } = req.body;
    const result = await db.query(
      `UPDATE founders
       SET name = $1, role = $2, bio = $3, initials = $4, avatar_color = $5, display_order = $6
       WHERE id = $7
       RETURNING *`,
      [name, role, bio, initials, avatar_color, display_order || 1, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Founder not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update founder' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM founders WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete founder' });
  }
});

module.exports = router;