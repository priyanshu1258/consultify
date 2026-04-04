const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    // ── Hardcoded admin bypass token ──────────────────────────────────────
    if (token === 'admin-static-token') {
      req.user = { _id: 'admin', name: 'System Admin', email: 'admin@consultify.com', role: 'admin' };
      return next();
    }
    // ─────────────────────────────────────────────────────────────────────

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const expertOnly = (req, res, next) => {
  if (req.user && req.user.role === 'expert') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an expert' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, expertOnly, adminOnly };
