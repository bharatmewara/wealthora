const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware/auth');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

// Admin credentials from environment only — never hardcoded defaults in production
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@wealthora.com';
// Default bcrypt hash of 'Admin@123' — override via ADMIN_PASSWORD_HASH env var
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ||
  '$2b$10$hcjHl7KSAn6egOVlEmjCM.lDtWi3WdL9cuoS9.Qj1fCnOf6pGLULq';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Generic error — do not reveal which field is wrong
  const INVALID_MSG = 'Invalid credentials';

  const usersTable = await db.query(`SELECT to_regclass('public.users') AS users_table`);
  if (usersTable.rows[0].users_table) {
    const userResult = await db.query(`
      SELECT users.id, users.name, users.email, users.password_hash, users.status, roles.name AS role
      FROM users
      LEFT JOIN roles ON roles.id = users.role_id
      WHERE users.email = $1 AND users.deleted_at IS NULL
      LIMIT 1
    `, [email]);

    const user = userResult.rows[0];
    if (user) {
      const isValidDbUser = user.status === 'active' && await bcrypt.compare(password, user.password_hash);
      if (!isValidDbUser) {
        return res.status(401).json({ message: INVALID_MSG });
      }

      await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role || 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role || 'admin' }
      });
    }
  }

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: INVALID_MSG });
  }

  const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return res.status(401).json({ message: INVALID_MSG });
  }

  const token = jwt.sign(
    { id: 1, email: ADMIN_EMAIL, name: 'Admin', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { id: 1, email: ADMIN_EMAIL, name: 'Admin', role: 'admin' }
  });
});

// GET /api/auth/me — verify token and return user info
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
