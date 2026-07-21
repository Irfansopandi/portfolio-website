require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const projectRoutes = require('./routes/project.routes');
const educationRoutes = require('./routes/education.routes');
const skillRoutes = require('./routes/skill.routes');
const certificateRoutes = require('./routes/certificate.routes');
const messageRoutes = require('./routes/message.routes');
const socialRoutes = require('./routes/social.routes');
const visitorRoutes = require('./routes/visitor.routes');
const uploadRoutes = require('./routes/upload.routes');
const experienceRoutes = require('./routes/experience.routes');

const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isDev) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));

// Rate limiting
const isDev = process.env.NODE_ENV === 'development';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 100000 : 100,
  message: { error: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' },
});
app.use('/api/', limiter);

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 5,
  message: { error: 'Terlalu banyak percobaan masuk, silakan coba lagi nanti.' },
});
app.use('/api/auth/login', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Irfan Sopandi Portfolio API',
    health: '/api/health',
    status: 'online'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Portfolio CMS berjalan dengan baik',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/experiences', experienceRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Rute ${req.originalUrl} tidak ditemukan` });
});

// Error handler
app.use(errorHandler);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
