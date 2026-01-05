// controllers/adminController.js
const Admin = require('../models/Admin');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

// Register Admin
const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Admin already exists' });
const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
    const admin = new Admin({ name, email, password:hashedPassword });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

// Login Admin
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await argon2.verify(admin.password, password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  
    await admin.save();

    if (!process.env.JWT_ADMIN_SECRET) {
      throw new Error('JWT_ADMIN_SECRET is not defined');
    }

    const adminToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: '5d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      adminToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};


// Protected Route Middleware - extracted for reusability
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!process.env.JWT_ADMIN_SECRET) {
      throw new Error('JWT secret not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};
// Protected Route Example
const protectedRoute = (req, res) => {
  res.json({
    success: true,
    message: 'Protected route accessed',
    admin: {
      id: req.admin._id,
      email: req.admin.email,
    },
  });
};

module.exports = {
  adminRegister,
  adminLogin,
  protectedRoute,
  authenticateToken
};
