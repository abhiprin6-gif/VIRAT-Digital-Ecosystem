const fs = require('fs');
const path = require('path');
const serverPath = path.join(__dirname, 'server.js');

let code = fs.readFileSync(serverPath, 'utf8');

if (!code.includes("modules-routes")) {
    const patch = `\n// Safe Module Integration\ntry {\n  const moduleRoutes = require('./modules-routes');\n  app.use('/', moduleRoutes);\n  console.log('VIRAT Modules Engine loaded successfully.');\n} catch (e) {\n  console.log('Module route load note:', e.message);\n}\n`;
    
    if (code.includes('app.listen')) {
        code = code.replace('app.listen', patch + '\napp.listen');
    } else {
        code += patch;
    }
    fs.writeFileSync(serverPath, code);
    console.log('server.js patched safely without modifying baseline code.');
} else {
    console.log('server.js already includes module routes.');
}
