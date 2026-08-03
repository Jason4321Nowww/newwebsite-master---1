// server.js
require('dotenv').config();
const express     = require('express');
const helmet      = require('helmet');
const cors        = require('cors');
const morgan      = require('morgan');
const cookieParser = require('cookie-parser');
const path        = require('path');

const connectDB      = require('./config/db');
const seedLocations  = require('./seeders/seedLocations');

const {
  ipBlocker, botDetection, mongoSanitize,
  authLimiter, otpLimiter, contactLimiter,
  orderLimiter, emailSendLimiter, apiLimiter,
} = require('./middlewares/security');

// Routes
const authRoutes    = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const shopRoutes    = require('./routes/shop');
const orderRoutes   = require('./routes/order');
const bannerRoutes  = require('./routes/infobanner');
const eventRoutes   = require('./routes/events');
const videoRoutes   = require('./routes/videos');
const pressRoutes   = require('./routes/press');
const actionRoutes  = require('./routes/actions');
const contactRoutes = require('./routes/contact');
const adminRoutes   = require('./routes/admin');
const emailRoutes   = require('./routes/email');
const locationRoutes = require('./routes/location');

const app = express();
connectDB().then(() => seedLocations());

// ── Allowed origins ────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200')
  .split(',').map(o => o.trim());

const IS_DEV = process.env.NODE_ENV !== 'production';

// Matches any private/LAN IP on port 4200 (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
const LOCAL_NETWORK_REGEX = /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):4200$/;

const isOriginAllowed = (origin) => {
  if (!origin) return true;                          // same-origin / Postman
  if (ALLOWED_ORIGINS.includes(origin)) return true; // explicit list
  if (IS_DEV && LOCAL_NETWORK_REGEX.test(origin)) return true; // any LAN IP in dev
  return false;
};

// ── Security headers (Helmet) ──────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,   // managed by Angular for now
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

// ── CORS ───────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    if (isOriginAllowed(origin)) return cb(null, true);
    cb(new Error(`CORS: origin "${origin}" not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-visitor-id'],
}));

// ── Body parsing (tight limits) ────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// ── Logging ────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// ── Global security middleware (order matters) ─────────────────────────────────
app.use(ipBlocker);       // block flagged IPs immediately
app.use(botDetection);    // drop known scanner user-agents
app.use(mongoSanitize);   // strip $-prefixed keys (NoSQL injection)
app.use(apiLimiter);      // global fallback: 300 req / 15 min

// ── Static uploads ─────────────────────────────────────────────────────────────
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// ── Routes with targeted rate limiters ────────────────────────────────────────

// Auth — tight limits on every endpoint; OTP endpoints even tighter
app.use('/api/auth/signin',           authLimiter);
app.use('/api/auth/signup',           authLimiter);
app.use('/api/auth/verify-email-otp', otpLimiter);
app.use('/api/auth/resend-email-otp', otpLimiter);
app.use('/api/auth',                  authRoutes);

app.use('/api/admin',                 adminRoutes);

// Press email send
app.use('/api/press-release/send',    emailSendLimiter);
app.use('/api/press-release',         pressRoutes);

// Contact form
app.use('/api/contacts',              contactRoutes);

// Orders — rate-limit creation
app.use('/api/orders',                orderLimiter, orderRoutes);

// Standard routes
app.use('/api/articles',   articleRoutes);
app.use('/api/products',   shopRoutes);
app.use('/api/banner',     bannerRoutes);
app.use('/api/events',     eventRoutes);
app.use('/api/videos',     videoRoutes);
app.use('/api/emails',     emailRoutes);
app.use('/api/actions',    actionRoutes);
app.use('/api/locations',  locationRoutes);

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // CORS errors
  if (err.message?.startsWith('CORS:')) {
    return res.status(403).json({ error: err.message });
  }
  console.error('[ERROR]', err.message);
  const status  = err.status || err.statusCode || 500;
  const message = err.code ? `Upload error: ${err.code}` : (err.message || 'Internal server error');
  res.status(status).json({ error: message });
});

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown — close DB connection before process exits
// Prevents stale connection pools from accumulating on restarts
const shutdown = async (signal) => {
  console.log(`[${signal}] Shutting down gracefully…`);
  server.close(async () => {
    try {
      await require('mongoose').disconnect();
      console.log('[DB] MongoDB disconnected cleanly');
    } catch (e) {
      console.error('[DB] Error during disconnect:', e.message);
    }
    process.exit(0);
  });
  // Force exit if shutdown takes too long
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
