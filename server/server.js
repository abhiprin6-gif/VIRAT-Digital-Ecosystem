require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDatabase = require("./database");

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const { db, save } = await connectDatabase();
  require("./admin-setup")(db);
  app.use("/api/admin", require("./admin-routes")(db, save));

  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET missing in .env");
  }

  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: "1mb" }));

  app.use(session({
    name: "virat.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false
  });

  function findUser(email) {
    const stmt = db.prepare(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?"
    );
    stmt.bind([email]);
    const user = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return user;
  }

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      project: "VIRAT Digital Ecosystem",
      server: "Running",
      database: "Connected"
    });
  });

  app.get("/api/status", (req, res) => {
    res.json({
      name: "VIRAT Digital Ecosystem",
      status: "Development",
      backend: "Express.js",
      database: "SQLite"
    });
  });

  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const { name, email, password } = req.body || {};

      if (
        typeof name !== "string" || name.trim().length < 2 ||
        name.trim().length > 60 ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof password !== "string" ||
        password.length < 10 || password.length > 128
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid name, email and password (10-128 characters) required"
        });
      }

      const cleanEmail = email.trim().toLowerCase();

      if (findUser(cleanEmail)) {
        return res.status(409).json({
          success: false,
          message: "Account already exists"
        });
      }

      const hash = await bcrypt.hash(password, 12);

      db.run(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name.trim(), cleanEmail, hash]
      );
      save();

      const user = findUser(cleanEmail);
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email
      };

      res.status(201).json({
        success: true,
        message: "Account created",
        user: req.session.user
      });
    } catch (error) {
      console.error("Registration error:", error.message);
      res.status(500).json({
        success: false,
        message: "Registration failed"
      });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { email, password } = req.body || {};

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        password.length > 128
      ) {
        return res.status(400).json({
          success: false,
          message: "Email and password required"
        });
      }

      const user = findUser(email.trim().toLowerCase());

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      req.session.regenerate((error) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: "Login failed"
          });
        }

        req.session.user = {
          id: user.id,
          name: user.name,
          email: user.email
        };

        res.json({
          success: true,
          message: "Login successful",
          user: req.session.user
        });
      });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({
        success: false,
        message: "Login failed"
      });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    res.json({
      authenticated: Boolean(req.session.user),
      user: req.session.user || null
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Logout failed"
        });
      }

      res.clearCookie("virat.sid", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
      });

      res.json({
        success: true,
        message: "Logged out"
      });
    });
  });

  app.get("/api/services", (req, res) => {
    const result = db.exec(
      "SELECT * FROM services ORDER BY id DESC"
    );
    res.json(result.length ? result[0].values : []);
  });

  app.get("/api/activity", (req, res) => {
    const result = db.exec(
      "SELECT * FROM activity ORDER BY id DESC LIMIT 50"
    );
    res.json(result.length ? result[0].values : []);
  });

  app.use(express.static(
    path.join(__dirname, "../baseline/virat-homepage")
  ));

  app.use("/public", express.static(
    path.join(__dirname, "../public")
  ));

  app.use("/api", (req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found"
    });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  });

  
// Safe Module Integration
try {
  const moduleRoutes = require('./modules-routes');
  app.use('/', moduleRoutes);
  console.log('VIRAT Modules Engine loaded successfully.');
} catch (e) {
  console.log('Module route load note:', e.message);
}


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

app.listen(PORT, "0.0.0.0", () => {
    console.log("VIRAT Backend Started");
    console.log("Website: http://127.0.0.1:" + PORT);
    console.log("Auth API: /api/auth");
  });
}

startServer().catch(error => {
  console.error("Startup failed:", error);
  process.exit(1);
});
