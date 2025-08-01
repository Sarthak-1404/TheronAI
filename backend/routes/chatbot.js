const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const router = express.Router();

// Python chatbot service URL
const PYTHON_CHATBOT_URL = 'http://localhost:5001/api';

// @route   POST /api/chatbot/chat
// @desc    Send message to Python AI chatbot
// @access  Public
router.post('/chat', [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('Valid user ID is required'),
  body('conversationHistory')
    .optional()
    .isArray()
    .withMessage('Conversation history must be an array')
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

    const { message, userId, conversationHistory = [] } = req.body;

    // Check for emergency keywords first
    const emergencyKeywords = [
      'chest pain', 'heart attack', 'stroke', 'unconscious', 'bleeding',
      'broken bone', 'severe pain', 'can\'t breathe', 'choking', 'emergency'
    ];

    const hasEmergencyKeywords = emergencyKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    if (hasEmergencyKeywords) {
      return res.status(200).json({
        status: 'success',
        data: {
          response: 'This appears to be a medical emergency. Please call emergency services (911) immediately. Do not rely on this chatbot for emergency medical advice.',
          isEmergency: true,
          recommendations: [
            'Call 911 immediately',
            'Do not delay seeking medical attention',
            'This chatbot is not a substitute for emergency medical care'
          ]
        }
      });
    }

    // Forward request to Python chatbot
    let pythonResponse;
    try {
      const response = await axios.post(`${PYTHON_CHATBOT_URL}/chat`, {
        message: message
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200 && response.data.status === 'success') {
        pythonResponse = response.data.response;
      } else {
        throw new Error('Python chatbot returned error');
      }
    } catch (pythonError) {
      console.error('Python chatbot error:', pythonError.message);
      
      // Fallback to basic response if Python service is unavailable
      pythonResponse = 'I\'m here to help with health questions. For specific medical concerns, please consult a healthcare provider. How can I assist you today?';
    }

    res.status(200).json({
      status: 'success',
      data: {
        response: pythonResponse,
        recommendations: [],
        condition: null,
        isEmergency: false,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process message'
    });
  }
});

// @route   POST /api/chatbot/symptom-checker
// @desc    Analyze symptoms and provide recommendations
// @access  Public
router.post('/symptom-checker', [
  body('symptoms')
    .isArray({ min: 1 })
    .withMessage('At least one symptom is required'),
  body('severity')
    .optional()
    .isIn(['mild', 'moderate', 'severe'])
    .withMessage('Severity must be mild, moderate, or severe'),
  body('duration')
    .optional()
    .isString()
    .withMessage('Duration must be a string')
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

    const { symptoms, severity = 'moderate', duration } = req.body;

    // Check for emergency symptoms
    const emergencySymptoms = [
      'chest pain', 'shortness of breath', 'severe bleeding',
      'unconsciousness', 'seizure', 'stroke symptoms'
    ];

    const hasEmergencySymptoms = emergencySymptoms.some(symptom =>
      symptoms.some(s => s.toLowerCase().includes(symptom))
    );

    if (hasEmergencySymptoms) {
      return res.status(200).json({
        status: 'success',
        data: {
          urgency: 'emergency',
          message: 'These symptoms require immediate medical attention.',
          recommendations: [
            'Call emergency services (911) immediately',
            'Do not delay seeking medical care',
            'These symptoms could indicate a serious medical condition'
          ],
          shouldSeekCare: true
        }
      });
    }

    // Forward symptoms to Python chatbot
    const symptomMessage = `I have the following symptoms: ${symptoms.join(', ')}. Severity: ${severity}. Duration: ${duration || 'Not specified'}`;
    
    let pythonResponse;
    try {
      const response = await axios.post(`${PYTHON_CHATBOT_URL}/chat`, {
        message: symptomMessage
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200 && response.data.status === 'success') {
        pythonResponse = response.data.response;
      } else {
        throw new Error('Python chatbot returned error');
      }
    } catch (pythonError) {
      console.error('Python chatbot error:', pythonError.message);
      pythonResponse = 'I recommend consulting a healthcare provider for proper symptom evaluation.';
    }

    res.status(200).json({
      status: 'success',
      data: {
        analysis: {
          causes: ['Various factors could contribute to these symptoms'],
          seekCare: severity === 'severe' ? 'Consult a healthcare provider' : 'Monitor symptoms and seek care if they persist',
          recommendations: [
            'Monitor symptoms closely',
            'Rest and stay hydrated',
            'Consider over-the-counter remedies for mild symptoms',
            'Maintain good hygiene practices',
            'Get adequate sleep and nutrition'
          ],
          urgency: severity === 'severe' ? 'high' : severity === 'moderate' ? 'moderate' : 'low'
        },
        pythonResponse: pythonResponse,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Symptom checker error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to analyze symptoms'
    });
  }
});

// @route   GET /api/chatbot/health-tips
// @desc    Get health tips and wellness advice
// @access  Public
router.get('/health-tips', async (req, res) => {
  try {
    const { category, limit = 5 } = req.query;

    const healthTips = {
      general: [
        'Stay hydrated by drinking 8 glasses of water daily',
        'Get 7-9 hours of quality sleep each night',
        'Exercise for at least 30 minutes most days',
        'Eat a balanced diet rich in fruits and vegetables',
        'Practice stress management techniques like meditation'
      ],
      nutrition: [
        'Include a variety of colorful fruits and vegetables',
        'Choose whole grains over refined grains',
        'Limit processed foods and added sugars',
        'Include lean proteins in your diet',
        'Stay hydrated throughout the day'
      ],
      exercise: [
        'Aim for 150 minutes of moderate exercise weekly',
        'Include both cardio and strength training',
        'Start slowly and gradually increase intensity',
        'Find activities you enjoy to stay motivated',
        'Don\'t forget to warm up and cool down'
      ],
      mental: [
        'Practice mindfulness and meditation',
        'Maintain social connections',
        'Get adequate sleep for mental health',
        'Seek professional help when needed',
        'Practice gratitude and positive thinking'
      ]
    };

    const tips = category && healthTips[category] 
      ? healthTips[category].slice(0, parseInt(limit))
      : healthTips.general.slice(0, parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        tips,
        category: category || 'general'
      }
    });
  } catch (error) {
    console.error('Get health tips error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get health tips'
    });
  }
});

// @route   GET /api/chatbot/capabilities
// @desc    Get chatbot capabilities from Python service
// @access  Public
router.get('/capabilities', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_CHATBOT_URL}/capabilities`, {
      timeout: 5000
    });

    res.status(200).json({
      status: 'success',
      data: response.data
    });
  } catch (error) {
    console.error('Get capabilities error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get capabilities'
    });
  }
});

module.exports = router; 