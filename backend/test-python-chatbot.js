const axios = require('axios');

const NODE_BACKEND_URL = 'http://localhost:5000/api';
const PYTHON_CHATBOT_URL = 'http://localhost:5001/api';

async function testPythonChatbotDirect() {
  console.log('🧪 Testing Python Chatbot Directly...\n');

  const testCases = [
    {
      message: 'What is diabetes?',
      expectedKeywords: ['diabetes', 'blood', 'glucose']
    },
    {
      message: 'Tell me about asthma',
      expectedKeywords: ['asthma', 'breathing', 'respiratory']
    },
    {
      message: 'What are the symptoms of fever?',
      expectedKeywords: ['fever', 'temperature', 'symptoms']
    },
    {
      message: 'How to treat headache?',
      expectedKeywords: ['headache', 'treatment', 'pain']
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`Test ${i + 1}: "${testCase.message}"`);
    
    try {
      const response = await axios.post(`${PYTHON_CHATBOT_URL}/chat`, {
        message: testCase.message
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        const data = response.data;
        console.log(`✅ Response: ${data.response.substring(0, 150)}...`);
        
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
      } else {
        console.log(`❌ Unexpected status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('---\n');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('🎉 Python chatbot testing completed!');
}

async function testNodeBackendIntegration() {
  console.log('🧪 Testing Node.js Backend Integration...\n');

  const testCases = [
    {
      message: 'What is hypertension?',
      expectedKeywords: ['hypertension', 'blood pressure']
    },
    {
      message: 'Tell me about cancer',
      expectedKeywords: ['cancer', 'treatment']
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`Test ${i + 1}: "${testCase.message}"`);
    
    try {
      const response = await axios.post(`${NODE_BACKEND_URL}/chatbot/chat`, {
        message: testCase.message
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        const data = response.data.data;
        console.log(`✅ Response: ${data.response.substring(0, 150)}...`);
        
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
        
        console.log(`✅ Emergency flag: ${data.isEmergency}`);
      } else {
        console.log(`❌ Unexpected status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('---\n');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('🎉 Node.js integration testing completed!');
}

async function testCapabilities() {
  console.log('🧪 Testing Chatbot Capabilities...\n');

  try {
    const response = await axios.get(`${PYTHON_CHATBOT_URL}/capabilities`, {
      timeout: 5000
    });

    if (response.status === 200) {
      const data = response.data;
      console.log(`✅ Capabilities: ${data.capabilities.length} features`);
      console.log(`✅ Data sources: ${data.data_sources.length} sources`);
      console.log(`✅ First capability: ${data.capabilities[0]}`);
    } else {
      console.log(`❌ Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Testing Python Chatbot Integration\n');
  console.log('=' * 50);
  
  await testPythonChatbotDirect();
  console.log('\n');
  await testNodeBackendIntegration();
  console.log('\n');
  await testCapabilities();
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testPythonChatbotDirect,
  testNodeBackendIntegration,
  testCapabilities,
  runAllTests
}; 