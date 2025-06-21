const { spawn } = require('child_process');

// Start Next.js server with increased timeout tolerance
const nextProcess = spawn('npx', ['next', 'dev', '-p', '3003'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

nextProcess.on('error', (error) => {
  console.error('Failed to start super admin:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
});