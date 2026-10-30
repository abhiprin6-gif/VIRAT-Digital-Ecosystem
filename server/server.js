const express = require("express");
const helmet = require("helmet");
const path = require("path");
const connectDatabase = require("./database");

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const { db, save } = await connectDatabase();

  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: "1mb" }));

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

  app.post("/api/activity", (req, res) => {
    const { type, details = "" } = req.body || {};

    if (typeof type !== "string" || !type.trim() || type.length > 80 ||
        typeof details !== "string" || details.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity data"
      });
    }

    db.run(
      "INSERT INTO activity (type, details) VALUES (?, ?)",
      [type.trim(), details]
    );

    save();

    res.status(201).json({
      success: true,
      message: "Activity saved"
    });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log("VIRAT Backend Started");
    console.log("Website: http://127.0.0.1:" + PORT);
    console.log("Database: Connected");
  });
}

startServer().catch(error => {
  console.error("Startup failed:", error);
  process.exit(1);
});
