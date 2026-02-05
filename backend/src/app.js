const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const { env } = require("./config/env");
const { errorHandler } = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// Import routes
const authRoutes = require("./routes/auth.routes");
const publicFeelingsRoutes = require("./routes/public.feelings.routes");
const adminFeelingsRoutes = require("./routes/admin.feelings.routes");
const publicQuranRoutes = require("./routes/public.quran.routes");
const adminQuranRoutes = require("./routes/admin.quran.routes");

// Initialize express app
const app = express();

// ============ SECURITY MIDDLEWARE ============

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use("/api/", limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter);

// ============ BODY PARSING ============

// Parse JSON body
app.use(express.json({ limit: "10kb" }));

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ============ DATA SANITIZATION ============

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP parameter pollution
app.use(hpp());

// ============ ROUTES ============

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/feelings", publicFeelingsRoutes);
app.use("/api/suras", publicQuranRoutes);

// Admin routes
app.use("/api/admin/feelings", adminFeelingsRoutes);
app.use("/api/admin", adminQuranRoutes);

// ============ ERROR HANDLING ============

// Handle 404 - Route not found
app.use(notFound);

// Central error handler
app.use(errorHandler);

module.exports = app;
