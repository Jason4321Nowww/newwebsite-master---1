/**
 * security.js — Rate limiting, IP blocking, and bot detection
 */
const rateLimit = require('express-rate-limit');

// ── In-memory stores ──────────────────────────────────────────────────────────
// violations: ip → { count, firstSeen }
// blockedIPs: ip → blockExpiry (timestamp)
const violations = new Map();
const blockedIPs = new Map();

const VIOLATION_THRESHOLD = 20;            // rate-limit hits before IP block
const VIOLATION_WINDOW_MS  = 15 * 60 * 1000; // 15-min sliding window
const BLOCK_DURATION_MS    = 30 * 60 * 1000; // 30-min block

// Clean up expired blocks every 10 min to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, expiry] of blockedIPs) {
    if (now >= expiry) { blockedIPs.delete(ip); violations.delete(ip); }
  }
}, 10 * 60 * 1000);

// ── Shared rate-limit handler ──────────────────────────────────────────────────
function onLimitReached(req, res, options) {
  const ip = req.ip;
  const now = Date.now();
  const v   = violations.get(ip) || { count: 0, firstSeen: now };

  if (now - v.firstSeen > VIOLATION_WINDOW_MS) { v.count = 0; v.firstSeen = now; }
  v.count++;
  violations.set(ip, v);

  if (v.count >= VIOLATION_THRESHOLD) {
    blockedIPs.set(ip, now + BLOCK_DURATION_MS);
    console.warn(`[SECURITY] IP blocked: ${ip} — ${v.count} violations`);
  }

  return res.status(429).json({
    error: 'Too many requests. Please slow down.',
    code: 'RATE_LIMITED',
    retryAfter: Math.ceil(options.windowMs / 60000),
  });
}

// ── Rate limiters ─────────────────────────────────────────────────────────────

/** Auth: signin / signup — max 10 per 15 min */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});

/** OTP actions — max 5 per 15 min */
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});

/** Contact form — max 5 per hour */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});

/** Order creation — max 15 per 15 min */
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});

/** Email / press send — max 20 per hour */
const emailSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});

/** General API — max 1000 per 15 min (admin panel routes skipped in server.js) */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/api/admin') || req.path.startsWith('/api/actions'),
  handler: onLimitReached,
});

// ── IP blocker middleware ──────────────────────────────────────────────────────
const ipBlocker = (req, res, next) => {
  const ip = req.ip;
  const expiry = blockedIPs.get(ip);
  if (expiry) {
    if (Date.now() < expiry) {
      const minutesLeft = Math.ceil((expiry - Date.now()) / 60000);
      return res.status(403).json({
        error: `Access temporarily blocked due to suspicious activity. Try again in ${minutesLeft} minute(s).`,
        code: 'IP_BLOCKED',
      });
    }
    blockedIPs.delete(ip);
    violations.delete(ip);
  }
  next();
};

// ── Bot / scanner detection ───────────────────────────────────────────────────
const SCANNER_UA = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
  /dirbuster/i, /dirsearch/i, /gobuster/i, /wfuzz/i,
  /havij/i, /acunetix/i, /nessus/i, /openvas/i, /burpsuite/i,
  /nuclei/i, /zap\//i, /w3af/i,
];

const botDetection = (req, res, next) => {
  const ua = req.headers['user-agent'] || '';
  if (SCANNER_UA.some(p => p.test(ua))) {
    const ip = req.ip;
    blockedIPs.set(ip, Date.now() + BLOCK_DURATION_MS);
    console.warn(`[SECURITY] Scanner blocked immediately: ${ip} UA="${ua}"`);
    return res.status(403).json({ error: 'Forbidden', code: 'SCANNER_DETECTED' });
  }
  next();
};

// ── Sanitise MongoDB operators from request body/query ────────────────────────
// Prevents NoSQL injection: { "$gt": "" } style attacks
const mongoSanitize = (req, res, next) => {
  const strip = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        strip(obj[key]);
      }
    }
  };
  strip(req.body);
  strip(req.query);
  strip(req.params);
  next();
};

module.exports = {
  ipBlocker,
  botDetection,
  mongoSanitize,
  authLimiter,
  otpLimiter,
  contactLimiter,
  orderLimiter,
  emailSendLimiter,
  apiLimiter,
};
