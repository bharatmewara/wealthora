const express = require('express');
const router = express.Router();

const db = require('../db.js');
const { singleImageUpload } = require('../middleware/upload.js');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM blogs ORDER BY created_at DESC');
    const blogsWithPaths = result.rows.map(b => ({
      ...b,
      blog_image: b.blog_image ? `/uploads/${b.blog_image}` : null
    }));
    res.json(blogsWithPaths);
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
      const {
        title,
        blog_author,
        category,
        blog_content,
        blog_image_color,
        published = true
      } = req.body;
      const blog_image = req.file ? req.file.filename : null;
      const result = await db.query(
        `INSERT INTO blogs (title, blog_author, category, blog_content, blog_image_color, blog_image, published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING *`,
        [title, blog_author, category, blog_content, blog_image_color, blog_image, published]
      );
      res.status(201).json({
        ...result.rows[0],
        blog_image: blog_image ? `/uploads/${blog_image}` : null
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create blog' });
    }
  });
});

router.put('/:id', (req, res) => {
  singleImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { title, blog_author, category, blog_content, blog_image_color, published } = req.body;
      const updates = { title, blog_author, category, blog_content, blog_image_color, published };
      if (req.file) updates.blog_image = req.file.filename;
      if (!req.file && (req.body.remove_image === 'true' || req.body.remove_image === true || req.body.remove_image === '1')) {
        updates.blog_image = null;
      }
      
      const fields = Object.keys(updates).map((key, i) => `${key} = $${i+1}`).join(',\n');
      const values = [...Object.values(updates), req.params.id];
      
      const result = await db.query(
        `UPDATE blogs SET ${fields}
         WHERE id = $${Object.keys(updates).length + 1}
         RETURNING *`,
        values
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.json({
        ...result.rows[0],
        blog_image: result.rows[0].blog_image ? `/uploads/${result.rows[0].blog_image}` : null
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update blog' });
    }
  });
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM blogs WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    const blog = result.rows[0];
    res.json({
      ...blog,
      blog_image: blog.blog_image ? `/uploads/${blog.blog_image}` : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;
