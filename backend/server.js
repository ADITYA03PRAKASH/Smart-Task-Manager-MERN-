require('dotenv').config();
require('express-async-errors'); // Patches Express to auto-forward async rejections to error handler

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ status: 'OK', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
);

// ── API Routes ────────────────────────────────────────────────────────────────


// ── Error handling (must be last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`)
);

module.exports = app;
