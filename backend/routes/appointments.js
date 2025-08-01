const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private
router.post('/', [
  body('doctorId')
    .isMongoId()
    .withMessage('Valid doctor ID is required'),
  body('appointmentDate')
    .isISO8601()
    .withMessage('Valid appointment date is required'),
  body('appointmentTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/)
    .withMessage('Valid appointment time is required (HH:MM AM/PM)'),
  body('type')
    .isIn([
      'Checkup',
      'Consultation',
      'Follow-up',
      'Emergency',
      'Surgery',
      'Test',
      'Vaccination',
      'Physical Therapy',
      'Mental Health',
      'Dental',
      'Eye Exam',
      'Laboratory',
      'Imaging',
      'Specialist Consultation'
    ])
    .withMessage('Valid appointment type is required'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array'),
  body('location.type')
    .optional()
    .isIn(['in-person', 'virtual', 'home-visit'])
    .withMessage('Valid location type is required')
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
      appointmentDate,
      appointmentTime,
      type,
      reason,
      symptoms,
      notes,
      location,
      duration
    } = req.body;

    // Check if doctor exists and is active
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    if (!doctor.isActive || !doctor.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor is not available for appointments'
      });
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(appointmentDate);
    const [time, period] = appointmentTime.split(' ');
    const [hours, minutes] = time.split(':');
    
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    appointmentDateTime.setHours(hour, parseInt(minutes), 0, 0);

    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment must be scheduled for a future date and time'
      });
    }

    // Check if doctor is available on the selected date
    const dayOfWeek = appointmentDateTime.toLocaleDateString('en-US', { weekday: 'lowercase' });
    if (!doctor.availability.workingDays.includes(dayOfWeek)) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor is not available on the selected date'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      type,
      reason,
      symptoms: symptoms || [],
      notes: {
        patient: notes?.patient || ''
      },
      location: location || { type: 'in-person' },
      duration: duration || doctor.availability.appointmentDuration,
      payment: {
        amount: doctor.consultationFee
      }
    });

    // Check for conflicts
    const hasConflict = await appointment.hasConflict();
    if (hasConflict) {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment time conflicts with existing appointment'
      });
    }

    await appointment.save();

    // Populate doctor information
    await appointment.populate('doctor', 'firstName lastName specialization profileImage');

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to book appointment'
    });
  }
});

// @route   GET /api/appointments
// @desc    Get user's appointments
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      status,
      type,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query = { patient: req.user._id };

    if (status) query.status = status;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) query.appointmentDate.$gte = new Date(startDate);
      if (endDate) query.appointmentDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(query)
      .populate('doctor', 'firstName lastName specialization profileImage')
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        appointments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get appointments'
    });
  }
});

// @route   GET /api/appointments/upcoming
// @desc    Get user's upcoming appointments
// @access  Private
router.get('/upcoming', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const appointments = await Appointment.findUpcoming(req.user._id, parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        appointments
      }
    });
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get upcoming appointments'
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get specific appointment
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'firstName lastName specialization profileImage email phoneNumber')
      .populate('patient', 'firstName lastName email phoneNumber');

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get appointment'
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', [
  body('appointmentDate')
    .optional()
    .isISO8601()
    .withMessage('Valid appointment date is required'),
  body('appointmentTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/)
    .withMessage('Valid appointment time is required (HH:MM AM/PM)'),
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
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

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Check if appointment can be modified
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot modify completed or cancelled appointment'
      });
    }

    const {
      appointmentDate,
      appointmentTime,
      reason,
      notes
    } = req.body;

    // Update fields
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (reason) appointment.reason = reason;
    if (notes?.patient) appointment.notes.patient = notes.patient;

    // Check for conflicts if date/time changed
    if (appointmentDate || appointmentTime) {
      const hasConflict = await appointment.hasConflict();
      if (hasConflict) {
        return res.status(400).json({
          status: 'error',
          message: 'Appointment time conflicts with existing appointment'
        });
      }
    }

    await appointment.save();

    // Populate doctor information
    await appointment.populate('doctor', 'firstName lastName specialization profileImage');

    res.status(200).json({
      status: 'success',
      message: 'Appointment updated successfully',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update appointment'
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment cannot be cancelled'
      });
    }

    // Cancel appointment
    await appointment.cancelAppointment('patient', reason || 'Cancelled by patient');

    res.status(200).json({
      status: 'success',
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel appointment'
    });
  }
});

// @route   POST /api/appointments/:id/rate
// @desc    Rate appointment
// @access  Private
router.post('/:id/rate', [
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

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Check if appointment is completed
    if (appointment.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Can only rate completed appointments'
      });
    }

    // Check if already rated
    if (appointment.rating.rating) {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment already rated'
      });
    }

    // Add rating
    appointment.rating = {
      rating,
      comment,
      submittedAt: new Date()
    };

    await appointment.save();

    // Update doctor's rating
    const doctor = await Doctor.findById(appointment.doctor);
    if (doctor) {
      await doctor.addReview(req.user._id, rating, comment);
    }

    res.status(200).json({
      status: 'success',
      message: 'Appointment rated successfully'
    });
  } catch (error) {
    console.error('Rate appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to rate appointment'
    });
  }
});

// @route   GET /api/appointments/doctors/:doctorId/availability
// @desc    Get doctor's availability for a specific date
// @access  Private
router.get('/doctors/:doctorId/availability', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        status: 'error',
        message: 'Date parameter is required'
      });
    }

    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });

    // Check if doctor works on this day
    if (!doctor.availability.workingDays.includes(dayOfWeek)) {
      return res.status(200).json({
        status: 'success',
        data: {
          available: false,
          message: 'Doctor does not work on this day'
        }
      });
    }

    // Get existing appointments for this date
    const existingAppointments = await Appointment.find({
      doctor: req.params.doctorId,
      appointmentDate: requestedDate,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Generate available time slots
    const availableSlots = [];
    const startTime = new Date(`2000-01-01 ${doctor.availability.workingHours.start}`);
    const endTime = new Date(`2000-01-01 ${doctor.availability.workingHours.end}`);
    const slotDuration = doctor.availability.appointmentDuration;

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      // Check if this slot is available
      const slotEndTime = new Date(currentTime.getTime() + slotDuration * 60000);
      const conflictingAppointment = existingAppointments.find(apt => {
        const aptStart = new Date(`2000-01-01 ${apt.appointmentTime}`);
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
        return (currentTime < aptEnd && slotEndTime > aptStart);
      });

      if (!conflictingAppointment) {
        availableSlots.push(timeString);
      }

      currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
    }

    res.status(200).json({
      status: 'success',
      data: {
        available: availableSlots.length > 0,
        availableSlots,
        workingHours: doctor.availability.workingHours,
        appointmentDuration: doctor.availability.appointmentDuration
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get availability'
    });
  }
});

module.exports = router; 