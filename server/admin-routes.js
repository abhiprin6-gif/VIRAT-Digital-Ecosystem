const express = require("express");

module.exports = function adminRoutes(db, save) {
  const router = express.Router();

  function requireAdmin(req, res, next) {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const email = process.env.ADMIN_EMAIL;
    if (!email || email === "YOUR_EMAIL@example.com" ||
        req.session.user.email !== email.trim().toLowerCase()) {
      return res.status(403).json({ success: false, message: "Admin access denied" });
    }

    next();
  }

  router.use(requireAdmin);

  router.get("/overview", (req, res) => {
    const count = table => {
      const result = db.exec(`SELECT COUNT(*) FROM ${table}`);
      return result[0]?.values[0][0] || 0;
    };

    res.json({
      success: true,
      users: count("users"),
      services: count("services"),
      activities: count("activity")
    });
  });

  router.get("/users", (req, res) => {
    const result = db.exec(
      "SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 100"
    );
    res.json(result.length ? result[0].values : []);
  });

  router.get("/services", (req, res) => {
    const result = db.exec(
      "SELECT * FROM services ORDER BY id DESC"
    );
    res.json(result.length ? result[0].values : []);
  });

  router.post("/services", (req, res) => {
    const { name, category } = req.body || {};

    if (
      typeof name !== "string" || !name.trim() || name.length > 80 ||
      typeof category !== "string" || !category.trim() || category.length > 60
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid service name and category required"
      });
    }

    try {
      db.run(
        "INSERT INTO services (name, category) VALUES (?, ?)",
        [name.trim(), category.trim()]
      );
      save();
      res.status(201).json({ success: true, message: "Service added" });
    } catch {
      res.status(409).json({
        success: false,
        message: "Service already exists"
      });
    }
  });

  router.get("/activity", (req, res) => {
    const result = db.exec(
      "SELECT * FROM activity ORDER BY id DESC LIMIT 100"
    );
    res.json(result.length ? result[0].values : []);
  });

  return router;
};
