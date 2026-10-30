const express = require("express");

module.exports = function adminRoutes(db, save) {
  const router = express.Router();

  function requireAdmin(req, res, next) {
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Login required"
      });
    }

    if (!adminEmail || adminEmail === "your_email@example.com" ||
        req.session.user.email !== adminEmail) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied"
      });
    }

    next();
  }

  router.use(requireAdmin);

  router.get("/overview", (req, res) => {
    function count(table) {
      const result = db.exec(`SELECT COUNT(*) FROM ${table}`);
      return result[0]?.values[0][0] || 0;
    }

    res.json({
      success: true,
      users: count("users"),
      services: count("services"),
      activities: count("activity")
    });
  });

  router.get("/services", (req, res) => {
    const result = db.exec(
      "SELECT * FROM services ORDER BY id"
    );
    res.json(result.length ? result[0].values : []);
  });

  router.put("/services/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, category, status } = req.body || {};

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID"
      });
    }

    if (
      typeof name !== "string" || !name.trim() || name.length > 80 ||
      typeof category !== "string" || !category.trim() || category.length > 60 ||
      !["planned", "active", "maintenance"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid service data or status"
      });
    }

    try {
      db.run(
        `UPDATE services
         SET name = ?, category = ?, status = ?
         WHERE id = ?`,
        [name.trim(), category.trim(), status, id]
      );

      const changed = db.getRowsModified();

      if (!changed) {
        return res.status(404).json({
          success: false,
          message: "Service not found"
        });
      }

      save();

      res.json({
        success: true,
        message: "Service updated"
      });
    } catch {
      res.status(409).json({
        success: false,
        message: "Service name already exists"
      });
    }
  });

  router.delete("/services/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID"
      });
    }

    db.run("DELETE FROM services WHERE id = ?", [id]);

    if (!db.getRowsModified()) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    save();

    res.json({
      success: true,
      message: "Service deleted"
    });
  });

  router.get("/users", (req, res) => {
    const result = db.exec(
      "SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 100"
    );
    res.json(result.length ? result[0].values : []);
  });

  router.get("/activity", (req, res) => {
    const result = db.exec(
      "SELECT * FROM activity ORDER BY id DESC LIMIT 100"
    );
    res.json(result.length ? result[0].values : []);
  });

  return router;
};
