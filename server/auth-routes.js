const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const path = require('path');
const initSqlJs = require('sql.js');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database/virat.db');

async function getDB() {
    const SQL = await initSqlJs();
    if (fs.existsSync(dbPath)) {
        const filebuffer = fs.readFileSync(dbPath);
        return new SQL.Database(filebuffer);
    }
    return new SQL.Database();
}

function saveDB(db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
}

// User Registration API
router.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ status: 'error', message: 'Username and password required' });
        }

        const db = await getDB();
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT,
            password_hash TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`);

        const hashedPassword = await bcrypt.hash(password, 10);
        const stmt = db.prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);");
        stmt.run([username, email || '', hashedPassword]);
        stmt.free();

        saveDB(db);
        res.json({ status: 'success', message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message || 'Registration failed' });
    }
});

// User Login API
router.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await getDB();

        const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
        stmt.bind([username]);

        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            const validPassword = await bcrypt.compare(password, row.password_hash);
            if (validPassword) {
                if (req.session) {
                    req.session.user = { id: row.id, username: row.username };
                }
                return res.json({ status: 'success', message: 'Logged in successfully', user: { username: row.username } });
            }
        } else {
            stmt.free();
        }
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Current User Session Status API
router.get('/api/auth/me', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false, user: null });
    }
});

module.exports = router;
