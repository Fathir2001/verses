/**
 * Seed Admin Script
 *
 * This script creates the first admin user in the database.
 *
 * Usage:
 *   node src/scripts/seedAdmin.js
 *
 * Or with CLI arguments:
 *   node src/scripts/seedAdmin.js --email admin@example.com --password yourpassword
 *
 * Environment variables (alternative to CLI args):
 *   ADMIN_EMAIL - Admin email address
 *   ADMIN_PASSWORD - Admin password
 */

const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const Admin = require("../models/Admin");

// Parse CLI arguments
const parseArgs = () => {
  const args = process.argv.slice(2);
  const result = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, "");
    const value = args[i + 1];
    if (key && value) {
      result[key] = value;
    }
  }

  return result;
};

const seedAdmin = async () => {
  try {
    // Parse CLI arguments
    const cliArgs = parseArgs();

    // Get credentials from CLI args or environment variables
    const email = cliArgs.email || process.env.ADMIN_EMAIL;
    const password = cliArgs.password || process.env.ADMIN_PASSWORD;

    // Validate credentials
    if (!email || !password) {
      console.error(`
❌ Error: Admin credentials are required.

Usage:
  1. Via CLI arguments:
     node src/scripts/seedAdmin.js --email admin@example.com --password yourpassword

  2. Via environment variables:
     Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file, then run:
     node src/scripts/seedAdmin.js
      `);
      process.exit(1);
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      console.error("❌ Error: Invalid email format");
      process.exit(1);
    }

    // Validate password length
    if (password.length < 6) {
      console.error("❌ Error: Password must be at least 6 characters");
      process.exit(1);
    }

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/verses";
    console.log(
      `📡 Connecting to MongoDB: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`,
    );

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      console.log(`
⚠️  Admin with email "${email}" already exists.

If you want to update the password, you can:
1. Delete the existing admin from MongoDB
2. Run this script again

Existing admin details:
  - ID: ${existingAdmin._id}
  - Email: ${existingAdmin.email}
  - Created: ${existingAdmin.createdAt}
      `);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed by pre-save hook
      role: "admin",
    });

    await admin.save();

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ Admin Created Successfully!                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Admin Details:
  - ID: ${admin._id}
  - Email: ${admin.email}
  - Role: ${admin.role}
  - Created: ${admin.createdAt}

You can now login with these credentials at:
  POST /api/auth/admin/login
  
Body:
{
  "email": "${admin.email}",
  "password": "your-password"
}
    `);

    await mongoose.connection.close();
    console.log("📴 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding admin: ${error.message}`);

    if (error.code === 11000) {
      console.error(
        "   A duplicate key error occurred. The admin may already exist.",
      );
    }

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      // Ignore close errors
    }

    process.exit(1);
  }
};

// Run the seed script
seedAdmin();
