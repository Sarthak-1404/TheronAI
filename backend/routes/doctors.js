const express = require('express');
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all available doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      specialization,
      city,
      state,
      rating,
      experience,
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true, isVerified: true };

    if (specialization) query.specialization = specialization;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');
    if (rating) query['rating.average'] = { $gte: parseFloat(rating) };
    if (experience) query['experience.years'] = { $gte: parseInt(experience) };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const doctors = await Doctor.find(query)
      .select('-__v')
      .sort({ 'rating.average': -1, 'experience.years': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        doctors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get doctors'
    });
  }
});

// @route   GET /api/doctors/specializations
// @desc    Get all available specializations
// @access  Public
router.get('/specializations', async (req, res) => {
  try {
    const specializations = [
      'Cardiologist',
      'Neurologist',
      'Dermatologist',
      'Orthopedic Surgeon',
      'Pediatrician',
      'Psychiatrist',
      'Oncologist',
      'Radiologist',
      'Anesthesiologist',
      'Emergency Medicine',
      'Family Medicine',
      'Internal Medicine',
      'Obstetrics and Gynecology',
      'Ophthalmologist',
      'Otolaryngologist',
      'Pathologist',
      'Pulmonologist',
      'Rheumatologist',
      'Urologist',
      'General Surgeon'
    ];

    res.status(200).json({
      status: 'success',
      data: {
        specializations
      }
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get specializations'
    });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get specific doctor details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-__v');

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    if (!doctor.isActive || !doctor.isVerified) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not available'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        doctor
      }
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get doctor details'
    });
  }
});

// @route   GET /api/doctors/:id/reviews
// @desc    Get doctor reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = doctor.rating.reviews
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(skip, skip + parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: doctor.rating.reviews.length,
          pages: Math.ceil(doctor.rating.reviews.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get doctor reviews'
    });
  }
});

// @route   POST /api/doctors/:id/reviews
// @desc    Add review to doctor
// @access  Private
router.post('/:id/reviews', [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
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

    const { rating, comment } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if user has already reviewed this doctor
    const existingReview = doctor.rating.reviews.find(
      review => review.patientId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this doctor'
      });
    }

    // Add review
    await doctor.addReview(req.user._id, rating, comment);

    res.status(200).json({
      status: 'success',
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add doctor review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add review'
    });
  }
});

// @route   GET /api/doctors/search
// @desc    Search doctors
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      q,
      specialization,
      city,
      state,
      rating,
      experience,
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true, isVerified: true };

    // Text search
    if (q) {
      query.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { specialization: { $regex: q, $options: 'i' } },
        { 'address.city': { $regex: q, $options: 'i' } },
        { 'address.state': { $regex: q, $options: 'i' } }
      ];
    }

    if (specialization) query.specialization = specialization;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');
    if (rating) query['rating.average'] = { $gte: parseFloat(rating) };
    if (experience) query['experience.years'] = { $gte: parseInt(experience) };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const doctors = await Doctor.find(query)
      .select('-__v')
      .sort({ 'rating.average': -1, 'experience.years': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        doctors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search doctors'
    });
  }
});

// @route   GET /api/doctors/featured
// @desc    Get featured doctors (top rated)
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const doctors = await Doctor.find({
      isActive: true,
      isVerified: true,
      'rating.average': { $gte: 4.0 }
    })
      .select('-__v')
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        doctors
      }
    });
  } catch (error) {
    console.error('Get featured doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get featured doctors'
    });
  }
});

// @route   GET /api/doctors/nearby
// @desc    Get doctors near a location
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { city, state, limit = 10 } = req.query;

    if (!city && !state) {
      return res.status(400).json({
        status: 'error',
        message: 'City or state is required'
      });
    }

    const query = { isActive: true, isVerified: true };

    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');

    const doctors = await Doctor.find(query)
      .select('-__v')
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        doctors
      }
    });
  } catch (error) {
    console.error('Get nearby doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get nearby doctors'
    });
  }
});

// @route   POST /api/doctors
// @desc    Add a new doctor
// @access  Private (Admin only)
router.post('/', [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phoneNumber')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('specialization')
    .isIn([
      'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic Surgeon',
      'Pediatrician', 'Psychiatrist', 'Oncologist', 'Radiologist',
      'Anesthesiologist', 'Emergency Medicine', 'Family Medicine',
      'Internal Medicine', 'Obstetrics and Gynecology', 'Ophthalmologist',
      'Otolaryngologist', 'Pathologist', 'Pulmonologist', 'Rheumatologist',
      'Urologist', 'General Surgeon'
    ])
    .withMessage('Please provide a valid specialization'),
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('License number is required'),
  body('experience.years')
    .isInt({ min: 0 })
    .withMessage('Years of experience must be a positive number'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('consultationFee')
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a positive number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      specialization,
      licenseNumber,
      experience,
      address,
      consultationFee,
      bio,
      profileImage,
      languages
    } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { licenseNumber }
      ]
    });
    
    if (existingDoctor) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor with this email or license number already exists'
      });
    }

    // Create new doctor
    const doctor = new Doctor({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber,
      specialization,
      licenseNumber,
      experience: {
        years: experience.years || 0,
        description: experience.description || ''
      },
      address,
      consultationFee,
      bio: bio || '',
      profileImage: profileImage || null,
      languages: languages || ['English'],
      isActive: true,
      isVerified: true,
      rating: {
        average: 0,
        count: 0,
        reviews: []
      },
      availability: {
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        },
        appointmentDuration: 30
      }
    });

    await doctor.save();

    res.status(201).json({
      status: 'success',
      message: 'Doctor added successfully',
      data: {
        doctor: doctor.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Add doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add doctor'
    });
  }
});

module.exports = router; 