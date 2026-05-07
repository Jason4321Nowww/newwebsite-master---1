const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated', code: 'NO_TOKEN' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found', code: 'USER_NOT_FOUND' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please sign in again.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided', code: 'NO_TOKEN' });
    }

    if (!process.env.JWT_ADMIN_SECRET) {
      throw new Error('JWT_ADMIN_SECRET not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found', code: 'USER_NOT_FOUND' });
    }
    if (!admin.isActive) {
      return res.status(403).json({ error: 'Account not activated.', code: 'ACCOUNT_INACTIVE' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please sign in again.', code: 'TOKEN_EXPIRED' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    console.error('Admin Auth Error:', error.message);
    return res.status(401).json({ error: 'Authentication failed', code: 'AUTH_FAILED' });
  }
};

// Does not reject if no token — sets req.user = null for unauthenticated requests
const optionalAuthMiddleware = async (req, _res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) { req.user = null; return next(); }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

module.exports = { authMiddleware, adminMiddleware, optionalAuthMiddleware };
