const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Educational Management System...\n');

// Start Backend Server
const backend = spawn('node', ['simple-server.js'], {
  cwd: path.join(__dirname, '..', 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start Frontend Server
const frontend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, '..', 'frontend'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Handle errors
backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
});

console.log('✅ Both servers are starting...');
console.log('📱 Frontend: http://localhost:3000');
console.log('🔧 Backend: http://localhost:3001');
console.log('💡 Press Ctrl+C to stop both servers');



