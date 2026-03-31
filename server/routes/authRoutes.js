const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin credentials (in production, this should be in a database)
const ADMIN_USER = {
  id: 1,
  email: process.env.ADMIN_EMAIL || 'admin@wealthora.com',
  password: process.env.ADMIN_PASSWORD || '$2a$10$K7VmJvLHVl4R1ggHfVLqwuVlPLjQaYL1cYKptN9TktI2K7IkK4y8O', // Hash of 'password123'
  name: 'Admin'
};

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if email matches
    if (email !== ADMIN_USER.email) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // For demo purposes, accept both hashed and plain password
    let isPasswordValid = false;

    // Check if it's the demo plain password
    if (password === 'password123') {
      isPasswordValid = true;
    } else {
      // Check against bcrypt hash
      isPasswordValid = await bcrypt.compare(password, ADMIN_USER.password);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token (valid for 24 hours)
    const token = jwt.sign(
      { id: ADMIN_USER.id, email: ADMIN_USER.email, name: ADMIN_USER.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: ADMIN_USER.id,
        email: ADMIN_USER.email,
        name: ADMIN_USER.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
