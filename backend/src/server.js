const { env, validateEnv } = require("./config/env");
const { connectDB } = require("./config/db");
const app = require("./app");

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  console.error(`❌ Environment validation failed: ${error.message}`);
  process.exit(1);
}

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Verses API Server                                     ║
║                                                            ║
║   Environment: ${env.NODE_ENV.padEnd(42)}║
║   Port:        ${String(env.PORT).padEnd(42)}║
║   Local:       http://localhost:${env.PORT}${" ".repeat(Math.max(0, 25 - String(env.PORT).length))}║
║   Network:     http://192.168.1.15:${env.PORT}${" ".repeat(Math.max(0, 20 - String(env.PORT).length))}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌ UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("👋 SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated.");
      });
    });

    process.on("SIGINT", () => {
      console.log("👋 SIGINT received. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated.");
      });
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
