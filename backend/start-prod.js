#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🏥 Healthcare Management System - Backend');
console.log('==========================================\n');

console.log('🚀 Production Mode');
console.log('==================\n');

// Start the server directly without MongoDB check
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

// Start the server
startServer(); 