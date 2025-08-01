const express = require('express');
const { body, validationResult } = require('express-validator');
const HealthRecord = require('../models/HealthRecord');
const Doctor = require('../models/Doctor');
const router = express.Router();

// @route   POST /api/health-records
// @desc    Create a new health record
// @access  Private
router.post('/', [
  body('doctorId')
    .isMongoId()
    .withMessage('Valid doctor ID is required'),
  body('recordType')
    .isIn([
      'Medical History',
      'Test Results',
      'Medication',
      'Appointment',
      'Vital Signs',
      'Immunization',
      'Surgery',
      'Allergy',
      'Chronic Condition',
      'Lab Report',
      'Imaging',
      'Prescription',
      'Progress Note',
      'Discharge Summary'
    ])
    .withMessage('Valid record type is required'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required')
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

    const {
      doctorId,
      recordType,
      title,
      description,
      date,
      diagnosis,
      symptoms,
      vitalSigns,
      testResults,
      medications,
      treatment,
      notes,
      priority,
      tags,
      isConfidential
    } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Create health record
    const healthRecord = new HealthRecord({
      patient: req.user._id,
      doctor: doctorId,
      recordType,
      title,
      description,
      date: date || new Date(),
      diagnosis,
      symptoms,
      vitalSigns,
      testResults,
      medications,
      treatment,
      notes,
      priority: priority || 'medium',
      tags: tags || [],
      isConfidential: isConfidential || false
    });

    await healthRecord.save();

    // Populate doctor information
    await healthRecord.populate('doctor', 'firstName lastName specialization');

    res.status(201).json({
      status: 'success',
      message: 'Health record created successfully',
      data: {
        healthRecord
      }
    });
  } catch (error) {
    console.error('Create health record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create health record'
    });
  }
});

// @route   GET /api/health-records
// @desc    Get user's health records
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      recordType,
      status,
      priority,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const options = {};
    if (recordType) options.recordType = recordType;
    if (status) options.status = status;
    if (priority) options.priority = priority;
    if (startDate || endDate) {
      options.date = {};
      if (startDate) options.date.$gte = new Date(startDate);
      if (endDate) options.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const healthRecords = await HealthRecord.findByPatient(req.user._id, {
      ...options,
      limit: parseInt(limit),
      skip
    });

    const total = await HealthRecord.countDocuments({
      patient: req.user._id,
      ...options
    });

    res.status(200).json({
      status: 'success',
      data: {
        healthRecords,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get health records error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get health records'
    });
  }
});

// @route   GET /api/health-records/overview
// @desc    Get health records overview/statistics
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    // Get statistics
    const stats = await HealthRecord.getStats(req.user._id, start, end);

    // Get recent records
    const recentRecords = await HealthRecord.findByPatient(req.user._id, {
      limit: 5
    });

    // Get vital signs trends (if available)
    const vitalSignsRecords = await HealthRecord.find({
      patient: req.user._id,
      recordType: 'Vital Signs',
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 }).limit(10);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        recentRecords,
        vitalSignsTrends: vitalSignsRecords
      }
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get overview'
    });
  }
});

// @route   GET /api/health-records/:id
// @desc    Get specific health record
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id)
      .populate('doctor', 'firstName lastName specialization email phoneNumber')
      .populate('patient', 'firstName lastName email phoneNumber');

    if (!healthRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Health record not found'
      });
    }

    // Check if user has access to this record
    if (healthRecord.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        healthRecord
      }
    });
  } catch (error) {
    console.error('Get health record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get health record'
    });
  }
});

// @route   PUT /api/health-records/:id
// @desc    Update health record
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('diagnosis.primary')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Primary diagnosis cannot exceed 200 characters'),
  body('notes.patient')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Patient notes cannot exceed 1000 characters')
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

    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Health record not found'
      });
    }

    // Check if user has access to this record
    if (healthRecord.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Check if record can be modified
    if (healthRecord.status === 'archived') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot modify archived record'
      });
    }

    const {
      title,
      description,
      diagnosis,
      symptoms,
      vitalSigns,
      testResults,
      medications,
      treatment,
      notes,
      priority,
      tags,
      isConfidential
    } = req.body;

    // Update fields
    if (title) healthRecord.title = title;
    if (description) healthRecord.description = description;
    if (diagnosis) healthRecord.diagnosis = diagnosis;
    if (symptoms) healthRecord.symptoms = symptoms;
    if (vitalSigns) healthRecord.vitalSigns = vitalSigns;
    if (testResults) healthRecord.testResults = testResults;
    if (medications) healthRecord.medications = medications;
    if (treatment) healthRecord.treatment = treatment;
    if (notes) healthRecord.notes = notes;
    if (priority) healthRecord.priority = priority;
    if (tags) healthRecord.tags = tags;
    if (typeof isConfidential === 'boolean') healthRecord.isConfidential = isConfidential;

    await healthRecord.save();

    // Populate doctor information
    await healthRecord.populate('doctor', 'firstName lastName specialization');

    res.status(200).json({
      status: 'success',
      message: 'Health record updated successfully',
      data: {
        healthRecord
      }
    });
  } catch (error) {
    console.error('Update health record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update health record'
    });
  }
});

// @route   DELETE /api/health-records/:id
// @desc    Delete health record
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Health record not found'
      });
    }

    // Check if user has access to this record
    if (healthRecord.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Instead of deleting, mark as archived
    healthRecord.status = 'archived';
    await healthRecord.save();

    res.status(200).json({
      status: 'success',
      message: 'Health record archived successfully'
    });
  } catch (error) {
    console.error('Delete health record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete health record'
    });
  }
});

// @route   POST /api/health-records/:id/share
// @desc    Share health record with doctor
// @access  Private
router.post('/:id/share', [
  body('doctorId')
    .isMongoId()
    .withMessage('Valid doctor ID is required'),
  body('permission')
    .optional()
    .isIn(['read', 'write'])
    .withMessage('Permission must be read or write')
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

    const { doctorId, permission = 'read' } = req.body;

    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Health record not found'
      });
    }

    // Check if user has access to this record
    if (healthRecord.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Share record with doctor
    await healthRecord.shareWithDoctor(doctorId, permission);

    res.status(200).json({
      status: 'success',
      message: 'Health record shared successfully'
    });
  } catch (error) {
    console.error('Share health record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to share health record'
    });
  }
});

// @route   DELETE /api/health-records/:id/share/:doctorId
// @desc    Remove doctor access to health record
// @access  Private
router.delete('/:id/share/:doctorId', async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Health record not found'
      });
    }

    // Check if user has access to this record
    if (healthRecord.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Remove doctor access
    await healthRecord.removeDoctorAccess(req.params.doctorId);

    res.status(200).json({
      status: 'success',
      message: 'Doctor access removed successfully'
    });
  } catch (error) {
    console.error('Remove doctor access error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove doctor access'
    });
  }
});

// @route   POST /api/health-records/:id/attachments
// @desc    Add attachment to health record
// @access  Private
router.post('/:id/attachments', async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Health record not found'
      });
    }

    // Check if user has access to this record
    if (healthRecord.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const { fileName, fileUrl, fileType, fileSize } = req.body;

    if (!fileName || !fileUrl || !fileType || !fileSize) {
      return res.status(400).json({
        status: 'error',
        message: 'File information is required'
      });
    }

    // Add attachment
    await healthRecord.addAttachment(fileName, fileUrl, fileType, fileSize);

    res.status(200).json({
      status: 'success',
      message: 'Attachment added successfully'
    });
  } catch (error) {
    console.error('Add attachment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add attachment'
    });
  }
});

// @route   GET /api/health-records/types
// @desc    Get available health record types
// @access  Private
router.get('/types', async (req, res) => {
  try {
    const recordTypes = [
      'Medical History',
      'Test Results',
      'Medication',
      'Appointment',
      'Vital Signs',
      'Immunization',
      'Surgery',
      'Allergy',
      'Chronic Condition',
      'Lab Report',
      'Imaging',
      'Prescription',
      'Progress Note',
      'Discharge Summary'
    ];

    res.status(200).json({
      status: 'success',
      data: {
        recordTypes
      }
    });
  } catch (error) {
    console.error('Get record types error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get record types'
    });
  }
});

module.exports = router; 