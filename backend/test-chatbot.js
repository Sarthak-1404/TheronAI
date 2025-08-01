const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testChatbot() {
  console.log('🧪 Testing Custom Chatbot...\n');

  const testCases = [
    {
      message: 'I have a headache',
      expectedKeywords: ['headache', 'stress', 'dehydration']
    },
    {
      message: 'I have a fever',
      expectedKeywords: ['fever', 'infection', 'temperature']
    },
    {
      message: 'Hello',
      expectedKeywords: ['healthcare assistant', 'help']
    },
    {
      message: 'I have chest pain',
      expectedKeywords: ['emergency', '911']
    },
    {
      message: 'I have trouble sleeping',
      expectedKeywords: ['sleep', 'schedule', 'routine']
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`Test ${i + 1}: "${testCase.message}"`);
    
    try {
      const response = await axios.post(`${BASE_URL}/chatbot/chat`, {
        message: testCase.message
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      if (response.status === 200) {
        const data = response.data.data;
        console.log(`✅ Response: ${data.response.substring(0, 100)}...`);
        
        // Check if response contains expected keywords
        const responseLower = data.response.toLowerCase();
        const hasExpectedKeywords = testCase.expectedKeywords.some(keyword => 
          responseLower.includes(keyword.toLowerCase())
        );
        
        if (hasExpectedKeywords) {
          console.log(`✅ Contains expected keywords`);
        } else {
          console.log(`⚠️  Missing expected keywords`);
        }
        
        if (data.recommendations && data.recommendations.length > 0) {
          console.log(`✅ Has recommendations: ${data.recommendations.length} items`);
        }
        
        if (data.isEmergency !== undefined) {
          console.log(`✅ Emergency flag: ${data.isEmergency}`);
        }
      } else {
        console.log(`❌ Unexpected status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('---\n');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('🎉 Chatbot testing completed!');
}

// Test symptom checker
async function testSymptomChecker() {
  console.log('🧪 Testing Symptom Checker...\n');

  try {
    const response = await axios.post(`${BASE_URL}/chatbot/symptom-checker`, {
      symptoms: ['headache', 'fever'],
      severity: 'moderate',
      duration: '2 days'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    if (response.status === 200) {
      const data = response.data.data;
      console.log(`✅ Symptom analysis: ${data.analysis.causes.join(', ')}`);
      console.log(`✅ Urgency: ${data.analysis.urgency}`);
      console.log(`✅ Recommendations: ${data.analysis.recommendations.length} items`);
    } else {
      console.log(`❌ Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Test health tips
async function testHealthTips() {
  console.log('🧪 Testing Health Tips...\n');

  try {
    const response = await axios.get(`${BASE_URL}/chatbot/health-tips?category=general&limit=3`);
    
    if (response.status === 200) {
      const data = response.data.data;
      console.log(`✅ Health tips (${data.category}): ${data.tips.length} tips`);
      console.log(`✅ First tip: ${data.tips[0]}`);
    } else {
      console.log(`❌ Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Run all tests
async function runAllTests() {
  await testChatbot();
  console.log('\n');
  await testSymptomChecker();
  console.log('\n');
  await testHealthTips();
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testChatbot,
  testSymptomChecker,
  testHealthTips,
  runAllTests
}; 