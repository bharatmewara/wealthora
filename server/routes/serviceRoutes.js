const express = require('express');
const router = express.Router();

const db = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, category, description, price, icon, featured } = req.body;
    const result = await db.query(
      'INSERT INTO services (title, category, description, price, icon, featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, category, description, price, icon, featured || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, category, description, price, icon, featured } = req.body;
    const result = await db.query(
      'UPDATE services SET title = $1, category = $2, description = $3, price = $4, icon = $5, featured = $6 WHERE id = $7 RETURNING *',
      [title, category, description, price, icon, featured, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update service', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});


module.exports = router;