require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/chat", require("./routes/chat"));
app.use("/api/schemes", require("./routes/schemes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiKey: process.env.ANTHROPIC_API_KEY ? "configured" : "missing",
  });
});

// Generate session ID
app.get("/api/session", (req, res) => {
  res.json({ sessionId: uuidv4() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Jan Saathi Backend running on http://localhost:${PORT}`);
  console.log(`📋 API Key: ${process.env.GEMINI_API_KEY ? "✅ Configured" : "❌ Missing — set GEMINI_API_KEY in .env"}\n`);
});
