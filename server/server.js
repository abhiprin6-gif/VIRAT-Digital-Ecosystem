const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = 3000;

app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(express.json({ limit: '100kb' }));

// Backend health check
app.get('/api/health', (req, res) => {
  res.json({
    project: 'VIRAT Digital Ecosystem',
    status: 'running',
    version: '1.0.0',
    backend: 'Express'
  });
});

// Preserve and serve original website
const websitePath = path.join(
  __dirname,
  '../baseline/virat-homepage'
);

app.use(express.static(websitePath));

// Start server locally
app.listen(PORT, '127.0.0.1', () => {
  console.log('================================');
  console.log(' VIRAT DIGITAL ECOSYSTEM');
  console.log('================================');
  console.log(`Website: http://127.0.0.1:${PORT}`);
  console.log(`API: http://127.0.0.1:${PORT}/api/health`);
});
