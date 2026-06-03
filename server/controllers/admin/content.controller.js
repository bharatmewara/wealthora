const db = require('../../db');

// --- BLOGS ---
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM ent_blogs WHERE deleted_at IS NULL';
    const params = [];
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, content, author_name, featured_image, status } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ent_blogs (title, slug, content, author_name, featured_image, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, slug, content, author_name, featured_image, status || 'draft']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, slug, content, author_name, featured_image, status } = req.body;
    const { rows } = await db.query(
      `UPDATE ent_blogs SET title=$1, slug=$2, content=$3, author_name=$4, featured_image=$5, status=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
      [title, slug, content, author_name, featured_image, status, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await db.query('UPDATE ent_blogs SET deleted_at = NOW() WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

// --- TESTIMONIALS ---
exports.getAllTestimonials = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM ent_testimonials WHERE deleted_at IS NULL ORDER BY sort_order, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, company, testimonial, rating, avatar_image, status } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ent_testimonials (name, role, company, testimonial, rating, avatar_image, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, role, company, testimonial, rating, avatar_image, status || 'published']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { name, role, company, testimonial, rating, avatar_image, status } = req.body;
    const { rows } = await db.query(
      `UPDATE ent_testimonials SET name=$1, role=$2, company=$3, testimonial=$4, rating=$5, avatar_image=$6, status=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
      [name, role, company, testimonial, rating, avatar_image, status, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await db.query('UPDATE ent_testimonials SET deleted_at = NOW() WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
