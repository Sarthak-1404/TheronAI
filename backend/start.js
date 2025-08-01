#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🏥 Healthcare Management System - Backend');
console.log('==========================================\n');

// Check if MongoDB is running
async function checkMongoDB() {
  return new Promise((resolve) => {
    const mongoCheck = spawn('mongod', ['--version'], { stdio: 'ignore' });
    mongoCheck.on('close', (code) => {
      if (code === 0) {
        console.log('✅ MongoDB is available');
        resolve(true);
      } else {
        console.log('⚠️  MongoDB might not be running. Please start MongoDB first.');
        console.log('   You can download MongoDB from: https://www.mongodb.com/try/download/community');
        resolve(false);
      }
    });
    mongoCheck.on('error', () => {
      console.log('❌ MongoDB is not installed or not in PATH');
      console.log('   Please install MongoDB: https://www.mongodb.com/try/download/community');
      resolve(false);
    });
  });
}

// Start the server
function startServer() {
  console.log('🚀 Starting the server...\n');
  
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });

  server.on('close', (code) => {
    if (code !== 0) {
      console.log(`\n❌ Server exited with code ${code}`);
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
    process.exit(0);
  });
}

// Run tests
async function runTests() {
  console.log('🧪 Running API tests...\n');
  
  return new Promise((resolve) => {
    const testProcess = spawn('node', ['test-api.js'], {
      stdio: 'inherit',
      cwd: __dirname
    });

    testProcess.on('close', (code) => {
      console.log(`\n📊 Tests completed with exit code: ${code}`);
      resolve(code === 0);
    });

    testProcess.on('error', (error) => {
      console.error('❌ Failed to run tests:', error.message);
      resolve(false);
    });
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'test':
      console.log('🧪 Test Mode');
      console.log('=============\n');
      await runTests();
      break;
      
    case 'dev-no-mongo':
      console.log('🔧 Development Mode (No MongoDB Check)');
      console.log('=====================================\n');
      console.log('⚠️  Starting server without MongoDB check...');
      console.log('   Make sure to configure your database connection properly.');
      startServer();
      break;
      
    case 'dev':
      console.log('🔧 Development Mode');
      console.log('==================\n');
      const mongoAvailableDev = await checkMongoDB();
      if (mongoAvailableDev) {
        startServer();
      } else {
        console.log('\n❌ Cannot start server without MongoDB');
        console.log('💡 You can try: npm run dev-no-mongo');
        process.exit(1);
      }
      break;
      
    case 'start':
    default:
      console.log('🚀 Production Mode');
      console.log('==================\n');
      const mongoAvailableProd = await checkMongoDB();
      if (mongoAvailableProd) {
        startServer();
      } else {
        console.log('\n❌ Cannot start server without MongoDB');
        process.exit(1);
      }
      break;
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  console.error('❌ Startup error:', error);
  process.exit(1);
}); 