const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { multipleUploads } = require('../middleware/upload.js');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    // Prepend public/ to image paths for frontend
    const testimonialsWithPaths = result.rows.map(t => ({
      ...t,
      avatar_image: t.avatar_image ? `/uploads/${t.avatar_image}` : null,
      banner_image: t.banner_image ? `/uploads/${t.banner_image}` : null
    }));
    res.json(testimonialsWithPaths);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.post('/', (req, res) => {
  multipleUploads(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { name, role, text, rating } = req.body;
      const avatar_image = req.files?.avatar_image?.[0]?.filename || null;
      const banner_image = req.files?.banner_image?.[0]?.filename || null;
      const result = await db.query(
        `INSERT INTO testimonials (name, role, text, rating, avatar_image, banner_image, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
        [name, role, text, rating, avatar_image, banner_image]
      );
      const created = result.rows[0];
      res.status(201).json({
        ...created,
        avatar_image: created.avatar_image ? `/uploads/${created.avatar_image}` : null,
        banner_image: created.banner_image ? `/uploads/${created.banner_image}` : null
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create testimonial' });
    }
  });
});

router.put('/:id', (req, res) => {
  multipleUploads(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { name, role, text, rating } = req.body;
      const updates = { name, role, text, rating };
      if (req.files?.avatar_image?.[0]) updates.avatar_image = req.files.avatar_image[0].filename;
      if (req.files?.banner_image?.[0]) updates.banner_image = req.files.banner_image[0].filename;
      if (
        !req.files?.avatar_image?.[0] &&
        (req.body.remove_avatar_image === 'true' || req.body.remove_avatar_image === true || req.body.remove_avatar_image === '1')
      ) {
        updates.avatar_image = null;
      }
      if (
        !req.files?.banner_image?.[0] &&
        (req.body.remove_banner_image === 'true' || req.body.remove_banner_image === true || req.body.remove_banner_image === '1')
      ) {
        updates.banner_image = null;
      }
      
      const fields = Object.keys(updates).map((key, i) => `${key} = $${i+1}`).join(', ');
      const values = Object.values(updates).concat(req.params.id);
      
      const result = await db.query(
        `UPDATE testimonials SET ${fields} WHERE id = $${Object.keys(updates).length + 1} RETURNING *`,
        values
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      const updated = result.rows[0];
      res.json({
        ...updated,
        avatar_image: updated.avatar_image ? `/uploads/${updated.avatar_image}` : null,
        banner_image: updated.banner_image ? `/uploads/${updated.banner_image}` : null
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update testimonial' });
    }
  });
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

module.exports = router;
