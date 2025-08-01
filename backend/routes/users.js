const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const userProfile = user.getPublicProfile();

    res.status(200).json({
      status: 'success',
      data: {
        user: userProfile
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phoneNumber')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('bloodType')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Valid blood type is required'),
  body('address.street')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.zipCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('emergencyContact.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Emergency contact name is required'),
  body('emergencyContact.relationship')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Emergency contact relationship is required'),
  body('emergencyContact.phoneNumber')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid emergency contact phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      bloodType,
      address,
      emergencyContact,
      medicalHistory,
      insurance,
      preferences
    } = req.body;

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bloodType) user.bloodType = bloodType;
    if (address) user.address = { ...user.address, ...address };
    if (emergencyContact) user.emergencyContact = { ...user.emergencyContact, ...emergencyContact };
    if (medicalHistory) user.medicalHistory = { ...user.medicalHistory, ...medicalHistory };
    if (insurance) user.insurance = { ...user.insurance, ...insurance };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    const userProfile = user.getPublicProfile();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: userProfile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

// @route   POST /api/users/profile-image
// @desc    Upload profile image
// @access  Private
router.post('/profile-image', async (req, res) => {
  try {
    // In a real application, you would handle file upload here
    // For now, we'll just update the profile image URL
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Image URL is required'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile image updated successfully',
      data: {
        profileImage: imageUrl
      }
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload profile image'
    });
  }
});

// @route   GET /api/users/preferences
// @desc    Get user preferences
// @access  Private
router.get('/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get preferences'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be a boolean'),
  body('notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification preference must be a boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be a boolean'),
  body('privacy.shareHealthData')
    .optional()
    .isBoolean()
    .withMessage('Health data sharing preference must be a boolean'),
  body('privacy.allowResearch')
    .optional()
    .isBoolean()
    .withMessage('Research participation preference must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const { notifications, privacy } = req.body;

    if (notifications) {
      user.preferences.notifications = {
        ...user.preferences.notifications,
        ...notifications
      };
    }

    if (privacy) {
      user.preferences.privacy = {
        ...user.preferences.privacy,
        ...privacy
      };
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update preferences'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Instead of deleting, mark as inactive
    user.isActive = false;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete account'
    });
  }
});

// @route   GET /api/users/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard-stats', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's appointments
    const Appointment = require('../models/Appointment');
    const upcomingAppointments = await Appointment.find({
      patient: userId,
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDateTime: { $gte: new Date() }
    }).countDocuments();

    // Get user's health records
    const HealthRecord = require('../models/HealthRecord');
    const totalHealthRecords = await HealthRecord.find({
      patient: userId
    }).countDocuments();

    // Get recent health records
    const recentHealthRecords = await HealthRecord.find({
      patient: userId
    })
    .sort({ date: -1 })
    .limit(5)
    .populate('doctor', 'firstName lastName specialization');

    // Get unread messages count
    const unreadMessages = 0; // This would be calculated from chat system

    res.status(200).json({
      status: 'success',
      data: {
        upcomingAppointments,
        totalHealthRecords,
        recentHealthRecords,
        unreadMessages,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard statistics'
    });
  }
});

module.exports = router; 