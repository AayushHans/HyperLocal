require("dotenv").config({ path: "../.env" });

// Fail fast if required env vars are missing
const REQUIRED_ENV = [
  "JWT_SECRET",
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

// Warn if Stream keys are missing — chat/video features will be unavailable
if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
  console.warn(
    "Warning: STREAM_API_KEY or STREAM_API_SECRET not set — chat and video features will be unavailable",
  );
} else {
  console.log(
    `Stream configured — key starts with: ${process.env.STREAM_API_KEY.substring(0, 4)}...`,
  );
}

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");

const pool = require("./config/db");
const initSocket = require("./socket");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const streamRoutes = require("./routes/stream");

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const io = socketIo(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Security headers
app.use(helmet());

// CORS — locked to CLIENT_URL only
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use("/uploads", express.static(uploadsDir));

// Attach db pool and io instance to every request
app.use((req, res, next) => {
  req.db = pool;
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stream", streamRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Socket.IO
initSocket(io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
