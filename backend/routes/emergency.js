const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Emergency contact information
const emergencyContacts = {
  '911': {
    name: 'Emergency Services',
    number: '911',
    description: 'For life-threatening emergencies',
    available: '24/7'
  },
  'poison': {
    name: 'Poison Control Center',
    number: '1-800-222-1222',
    description: 'For poison-related emergencies',
    available: '24/7'
  },
  'suicide': {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: 'For mental health crises',
    available: '24/7'
  }
};

// @route   POST /api/emergency/alert
// @desc    Send emergency alert
// @access  Public
router.post('/alert', [
  body('type')
    .isIn(['medical', 'trauma', 'cardiac', 'respiratory', 'neurological', 'other'])
    .withMessage('Valid emergency type is required'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('location')
    .optional()
    .isObject()
    .withMessage('Location must be an object'),
  body('contactInfo')
    .optional()
    .isObject()
    .withMessage('Contact info must be an object')
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

    const { type, description, location, contactInfo } = req.body;

    // Log emergency alert (in a real system, this would trigger notifications)
    console.log('EMERGENCY ALERT:', {
      type,
      description,
      location,
      contactInfo,
      timestamp: new Date().toISOString()
    });

    // Determine appropriate emergency response
    let emergencyResponse = {
      immediateAction: 'Call 911 immediately',
      additionalContacts: [],
      instructions: []
    };

    switch (type) {
      case 'cardiac':
        emergencyResponse.instructions = [
          'Call 911 immediately',
          'If trained, begin CPR if person is unresponsive',
          'Use AED if available',
          'Stay with the person until help arrives'
        ];
        break;
      case 'respiratory':
        emergencyResponse.instructions = [
          'Call 911 immediately',
          'Help person into comfortable position',
          'Loosen tight clothing',
          'Stay calm and reassure the person'
        ];
        break;
      case 'trauma':
        emergencyResponse.instructions = [
          'Call 911 immediately',
          'Do not move person if spinal injury is suspected',
          'Apply direct pressure to bleeding wounds',
          'Keep person warm and comfortable'
        ];
        break;
      default:
        emergencyResponse.instructions = [
          'Call 911 immediately',
          'Stay with the person',
          'Follow dispatcher instructions'
        ];
    }

    res.status(200).json({
      status: 'success',
      message: 'Emergency alert received',
      data: {
        emergencyResponse,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process emergency alert'
    });
  }
});

// @route   GET /api/emergency/contacts
// @desc    Get emergency contact information
// @access  Public
router.get('/contacts', async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        contacts: emergencyContacts
      }
    });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get emergency contacts'
    });
  }
});

// @route   POST /api/emergency/symptom-check
// @desc    Check if symptoms require emergency care
// @access  Public
router.post('/symptom-check', [
  body('symptoms')
    .isArray({ min: 1 })
    .withMessage('At least one symptom is required'),
  body('severity')
    .isIn(['mild', 'moderate', 'severe'])
    .withMessage('Valid severity level is required')
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

    const { symptoms, severity } = req.body;

    // Emergency symptoms that require immediate attention
    const emergencySymptoms = [
      'chest pain', 'shortness of breath', 'severe bleeding',
      'unconsciousness', 'seizure', 'stroke symptoms',
      'severe head injury', 'broken bone', 'severe burns'
    ];

    // Check if any symptoms are emergency-level
    const hasEmergencySymptoms = emergencySymptoms.some(symptom =>
      symptoms.some(s => s.toLowerCase().includes(symptom))
    );

    let recommendation;
    let urgency;

    if (hasEmergencySymptoms || severity === 'severe') {
      recommendation = {
        action: 'Call 911 immediately',
        reason: 'These symptoms require immediate medical attention',
        instructions: [
          'Call emergency services (911)',
          'Do not delay seeking medical care',
          'Stay with the person until help arrives'
        ]
      };
      urgency = 'emergency';
    } else if (severity === 'moderate') {
      recommendation = {
        action: 'Seek medical attention soon',
        reason: 'These symptoms should be evaluated by a healthcare provider',
        instructions: [
          'Contact your healthcare provider',
          'Visit urgent care if symptoms worsen',
          'Monitor symptoms closely'
        ]
      };
      urgency = 'moderate';
    } else {
      recommendation = {
        action: 'Monitor symptoms',
        reason: 'These symptoms may resolve on their own',
        instructions: [
          'Rest and stay hydrated',
          'Monitor symptoms for 24-48 hours',
          'Seek care if symptoms persist or worsen'
        ]
      };
      urgency = 'low';
    }

    res.status(200).json({
      status: 'success',
      data: {
        symptoms,
        severity,
        recommendation,
        urgency,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Symptom check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check symptoms'
    });
  }
});

// @route   GET /api/emergency/instructions/:type
// @desc    Get emergency instructions for specific situations
// @access  Public
router.get('/instructions/:type', async (req, res) => {
  try {
    const { type } = req.params;

    const instructions = {
      'cardiac-arrest': {
        title: 'Cardiac Arrest Emergency',
        steps: [
          'Call 911 immediately',
          'Check if person is responsive',
          'If unresponsive, begin chest compressions',
          'Use AED if available',
          'Continue until help arrives'
        ],
        warning: 'Time is critical - every minute counts'
      },
      'choking': {
        title: 'Choking Emergency',
        steps: [
          'Ask "Are you choking?"',
          'If person can speak, encourage coughing',
          'If person cannot speak, perform abdominal thrusts',
          'Call 911 if person becomes unresponsive',
          'Begin CPR if needed'
        ],
        warning: 'Act quickly - choking can be fatal within minutes'
      },
      'bleeding': {
        title: 'Severe Bleeding Emergency',
        steps: [
          'Call 911 immediately',
          'Apply direct pressure to wound',
          'Use clean cloth or sterile bandage',
          'Elevate injured area if possible',
          'Keep pressure until help arrives'
        ],
        warning: 'Severe bleeding can be life-threatening'
      },
      'stroke': {
        title: 'Stroke Emergency',
        steps: [
          'Call 911 immediately',
          'Remember FAST: Face, Arms, Speech, Time',
          'Note time symptoms began',
          'Do not give aspirin',
          'Keep person calm and comfortable'
        ],
        warning: 'Time is critical - seek immediate medical attention'
      },
      'seizure': {
        title: 'Seizure Emergency',
        steps: [
          'Call 911 if seizure lasts more than 5 minutes',
          'Clear area of dangerous objects',
          'Do not restrain the person',
          'Do not put anything in mouth',
          'Stay with person until seizure ends'
        ],
        warning: 'Most seizures are brief and resolve on their own'
      }
    };

    const instruction = instructions[type];
    if (!instruction) {
      return res.status(404).json({
        status: 'error',
        message: 'Emergency type not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        instruction
      }
    });
  } catch (error) {
    console.error('Get emergency instructions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get emergency instructions'
    });
  }
});

// @route   POST /api/emergency/location
// @desc    Get nearest emergency facilities
// @access  Public
router.post('/location', [
  body('latitude')
    .isFloat()
    .withMessage('Valid latitude is required'),
  body('longitude')
    .isFloat()
    .withMessage('Valid longitude is required')
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

    const { latitude, longitude } = req.body;

    // Mock emergency facilities (in a real app, this would use a mapping API)
    const emergencyFacilities = [
      {
        name: 'City General Hospital',
        type: 'Hospital',
        distance: '2.3 miles',
        address: '123 Main St, City, State',
        phone: '555-123-4567',
        emergency: true
      },
      {
        name: 'Urgent Care Center',
        type: 'Urgent Care',
        distance: '1.1 miles',
        address: '456 Oak Ave, City, State',
        phone: '555-987-6543',
        emergency: false
      },
      {
        name: 'Emergency Medical Center',
        type: 'Emergency Center',
        distance: '3.7 miles',
        address: '789 Pine Rd, City, State',
        phone: '555-456-7890',
        emergency: true
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        facilities: emergencyFacilities,
        userLocation: { latitude, longitude }
      }
    });
  } catch (error) {
    console.error('Get emergency facilities error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get emergency facilities'
    });
  }
});

module.exports = router; 