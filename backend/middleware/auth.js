const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'User account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

// Middleware to check if user is a doctor
const isDoctor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Check if user has doctor role (you might need to add a role field to User model)
    // For now, we'll check if the user exists in the Doctor collection
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ email: req.user.email });
    
    if (!doctor) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Doctor privileges required.'
      });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error('Doctor auth error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authorization failed'
    });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Add admin role check here when you implement roles
    // For now, we'll use a simple check
    if (req.user.email !== 'admin@healthcare.com') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authorization failed'
    });
  }
};

// Middleware to check if user owns the resource or is a doctor
const authorizeResource = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const resourceId = req.params.id || req.params.patientId || req.params.userId;
    
    if (!resourceId) {
      return next(); // No resource to authorize
    }

    // Check if user is accessing their own resource
    if (resourceId === req.user._id.toString()) {
      return next();
    }

    // Check if user is a doctor accessing patient data
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ email: req.user.email });
    
    if (doctor) {
      req.doctor = doctor;
      return next();
    }

    // Check if user is admin
    if (req.user.email === 'admin@healthcare.com') {
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: 'Access denied. You can only access your own data.'
    });
  } catch (error) {
    console.error('Resource authorization error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authorization failed'
    });
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Verify JWT token without middleware
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  isDoctor,
  isAdmin,
  authorizeResource,
  generateToken,
  verifyToken
}; 