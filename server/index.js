require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const migrate = require('./migrate');

const app = express();

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to allow inline styles / CDN resources
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173'];

const isLocalDevOrigin = (origin) =>
  process.env.NODE_ENV !== 'production' &&
  /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // max 10 enquiries per hour per IP
  message: { error: 'Too many enquiry submissions, please try again later.' }
});

app.use(generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static uploads ────────────────────────────────────────────────────────────
const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');
fs.mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));

// ── Legacy Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const blogRoutes = require('./routes/blogRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const heroRoutes = require('./routes/heroRoutes');
const founderRoutes = require('./routes/founderRoutes');
const contentRoutes = require('./routes/contentRoutes');
const faqRoutes = require('./routes/faqRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/enquiries', enquiryLimiter, enquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/founders', founderRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/faqs', faqRoutes);

// ── V2 Enterprise Admin Routes ───────────────────────────────────────────────────
const adminServiceRoutes = require('./routes/admin/services.routes');
const adminEnquiryRoutes = require('./routes/admin/enquiries.routes');
const adminUploadRoutes = require('./routes/admin/upload.routes');

app.use('/api/admin/services', adminServiceRoutes);
app.use('/api/admin/enquiries', adminEnquiryRoutes);
app.use('/api/admin/upload', adminUploadRoutes);

// ── Serve frontend build in production ───────────────────────────────────────
const clientBuildPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

migrate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Migration failed, server not started:', err.message);
    process.exit(1);
  });
