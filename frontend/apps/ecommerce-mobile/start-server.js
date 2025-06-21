const { spawn } = require('child_process');

// Start Next.js server with increased timeout tolerance
const nextProcess = spawn('npx', ['next', 'dev', '-p', '3001'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

nextProcess.on('error', (error) => {
  console.error('Failed to start mobile app:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
});