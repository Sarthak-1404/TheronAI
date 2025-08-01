const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test configuration
const testConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'test123456',
  phoneNumber: '+1234567890',
  dateOfBirth: '1990-01-01',
  gender: 'other',
  address: {
    street: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    country: 'USA'
  },
  emergencyContact: {
    name: 'Test Emergency Contact',
    relationship: 'Spouse',
    phoneNumber: '+1234567891'
  }
};

let authToken = null;

// Helper function to log test results
function logTest(testName, success, message = '') {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}${message ? ` - ${message}` : ''}`);
}

// Test health check
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`, testConfig);
    logTest('Health Check', response.status === 200);
    return true;
  } catch (error) {
    logTest('Health Check', false, error.message);
    return false;
  }
}

// Test user registration
async function testUserRegistration() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser, testConfig);
    logTest('User Registration', response.status === 201);
    return true;
  } catch (error) {
    logTest('User Registration', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test user login
async function testUserLogin() {
  try {
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData, testConfig);
    
    if (response.status === 200 && response.data.data.token) {
      authToken = response.data.data.token;
      logTest('User Login', true);
      return true;
    } else {
      logTest('User Login', false, 'No token received');
      return false;
    }
  } catch (error) {
    logTest('User Login', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test demo login
async function testDemoLogin() {
  try {
    const demoData = {
      email: 'user@123',
      password: 'user123'
    };
    const response = await axios.post(`${BASE_URL}/auth/demo-login`, demoData, testConfig);
    
    if (response.status === 200 && response.data.data.token) {
      logTest('Demo Login', true);
      return true;
    } else {
      logTest('Demo Login', false, 'No token received');
      return false;
    }
  } catch (error) {
    logTest('Demo Login', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test get current user (authenticated)
async function testGetCurrentUser() {
  if (!authToken) {
    logTest('Get Current User', false, 'No auth token');
    return false;
  }

  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      ...testConfig,
      headers: {
        ...testConfig.headers,
        'Authorization': `Bearer ${authToken}`
      }
    });
    logTest('Get Current User', response.status === 200);
    return true;
  } catch (error) {
    logTest('Get Current User', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test get all doctors (public)
async function testGetDoctors() {
  try {
    const response = await axios.get(`${BASE_URL}/doctors`, testConfig);
    logTest('Get Doctors', response.status === 200);
    return true;
  } catch (error) {
    logTest('Get Doctors', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test chatbot endpoint
async function testChatbot() {
  try {
    const chatData = {
      message: 'Hello, I have a headache'
    };
    const response = await axios.post(`${BASE_URL}/chatbot/chat`, chatData, testConfig);
    logTest('Chatbot Chat', response.status === 200);
    return true;
  } catch (error) {
    logTest('Chatbot Chat', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test emergency alert
async function testEmergencyAlert() {
  try {
    const alertData = {
      userId: 'test-user-id',
      location: 'Test Location',
      description: 'Test emergency'
    };
    const response = await axios.post(`${BASE_URL}/emergency/alert`, alertData, testConfig);
    logTest('Emergency Alert', response.status === 200);
    return true;
  } catch (error) {
    logTest('Emergency Alert', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  const tests = [
    testHealthCheck,
    testUserRegistration,
    testUserLogin,
    testDemoLogin,
    testGetCurrentUser,
    testGetDoctors,
    testChatbot,
    testEmergencyAlert
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    const result = await test();
    if (result) passedTests++;
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! The API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server logs and configuration.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testHealthCheck,
  testUserRegistration,
  testUserLogin,
  testDemoLogin,
  testGetCurrentUser,
  testGetDoctors,
  testChatbot,
  testEmergencyAlert
}; 