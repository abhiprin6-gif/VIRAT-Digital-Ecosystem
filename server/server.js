const express = require("express");
const helmet = require("helmet");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const WEBSITE_DIR = path.join(
  __dirname,
  "../baseline/virat-homepage"
);

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// Backend health API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    project: "VIRAT Digital Ecosystem",
    server: "Running",
    version: "1.0.0",
    time: new Date().toISOString()
  });
});

// Project information API
app.get("/api/status", (req, res) => {
  res.json({
    name: "VIRAT Digital Ecosystem",
    status: "Development",
    totalPanels: 45,
    architecture: "Modular",
    backend: "Express.js"
  });
});

// Old website and its assets
app.use(express.static(WEBSITE_DIR));

// Additional public assets
app.use("/public", express.static(
  path.join(__dirname, "../public")
));

// API 404
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("VIRAT Backend Started");
  console.log(`Website: http://127.0.0.1:${PORT}`);
  console.log(`Health API: http://127.0.0.1:${PORT}/api/health`);
});
