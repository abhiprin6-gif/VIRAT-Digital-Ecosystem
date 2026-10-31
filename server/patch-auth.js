const fs = require('fs');
const path = require('path');
const serverPath = path.join(__dirname, 'server.js');

let code = fs.readFileSync(serverPath, 'utf8');

if (!code.includes("auth-routes")) {
    const authSetup = `
// Safe Authentication & Session Integration
try {
  const session = require('express-session');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: 'virat-ecosystem-secure-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  }));
  const authRoutes = require('./auth-routes');
  app.use('/', authRoutes);
  console.log('VIRAT Security & Authentication Engine loaded.');
} catch (e) {
  console.log('Auth setup note:', e.message);
}
`;
    if (code.includes('app.listen')) {
        code = code.replace('app.listen', authSetup + '\napp.listen');
    } else {
        code += authSetup;
    }
    fs.writeFileSync(serverPath, code);
    console.log('Authentication engine patched safely!');
} else {
    console.log('Authentication engine already present in server.js.');
}
