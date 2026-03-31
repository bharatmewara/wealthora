const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { singleImageUpload } = require('../middleware/upload.js');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM hero_slides ORDER BY slide_order ASC');
    const slidesWithPaths = result.rows.map(s => ({
      ...s,
      image: s.image ? `/uploads/${s.image}` : null
    }));
    res.json(slidesWithPaths);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.post('/', (req, res) => {
  singleImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { heading, subheading, slide_order } = req.body;
      const image = req.file ? req.file.filename : null;
      const result = await db.query(
        `INSERT INTO hero_slides (heading, subheading, slide_order, image) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [heading, subheading, slide_order, image]
      );
      res.status(201).json({
        ...result.rows[0],
        image: image ? `/uploads/${image}` : null
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create hero slide' });
    }
  });
});

router.put('/:id', (req, res) => {
  singleImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { heading, subheading, slide_order } = req.body;
      const updates = { heading, subheading, slide_order };
      if (req.file) updates.image = req.file.filename;
      if (!req.file && (req.body.remove_image === 'true' || req.body.remove_image === true || req.body.remove_image === '1')) {
        updates.image = null;
      }
      
      const fields = Object.keys(updates).map((key, i) => `${key} = $${i+1}`).join(', ');
      const values = [...Object.values(updates), req.params.id];
      
      const result = await db.query(
        `UPDATE hero_slides SET ${fields} WHERE id = $${Object.keys(updates).length + 1} RETURNING *`,
        values
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Hero slide not found' });
      }
      res.json({
        ...result.rows[0],
        image: result.rows[0].image ? `/uploads/${result.rows[0].image}` : null
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update hero slide' });
    }
  });
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM hero_slides WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete hero slide' });
  }
});

module.exports = router;
