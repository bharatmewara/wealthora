const express = require('express');
const router = express.Router();
const { singleImageUpload } = require('../../middleware/upload');

// POST /api/admin/upload
router.post('/', singleImageUpload, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    // Return the relative URL to the uploaded file
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, error: 'Server error during upload' });
  }
});

module.exports = router;
