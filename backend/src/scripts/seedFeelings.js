/**
 * Seed Feelings Script
 *
 * This script imports feelings from the frontend's feelings.json file
 * into the MongoDB database.
 *
 * Usage:
 *   node src/scripts/seedFeelings.js
 *
 * Options:
 *   --clear    Clear existing feelings before seeding
 *   --file     Path to feelings.json (default: ../../data/feelings.json)
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const Feeling = require("../models/Feeling");

// Parse CLI arguments
const parseArgs = () => {
  const args = process.argv.slice(2);
  const result = {
    clear: false,
    file: path.resolve(__dirname, "../../../data/feelings.json"),
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--clear") {
      result.clear = true;
    } else if (args[i] === "--file" && args[i + 1]) {
      result.file = path.resolve(args[i + 1]);
      i++;
    }
  }

  return result;
};

const seedFeelings = async () => {
  try {
    const options = parseArgs();

    // Check if feelings.json exists
    if (!fs.existsSync(options.file)) {
      console.error(`❌ Error: Feelings file not found at: ${options.file}`);
      console.log(`
Make sure the feelings.json file exists. Expected location:
  ${options.file}

Or specify a custom path:
  node src/scripts/seedFeelings.js --file /path/to/feelings.json
      `);
      process.exit(1);
    }

    // Read feelings.json
    console.log(`📖 Reading feelings from: ${options.file}`);
    const feelingsData = JSON.parse(fs.readFileSync(options.file, "utf-8"));

    if (!Array.isArray(feelingsData) || feelingsData.length === 0) {
      console.error(
        "❌ Error: feelings.json must contain an array of feelings",
      );
      process.exit(1);
    }

    console.log(`   Found ${feelingsData.length} feelings`);

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/verses";
    console.log(
      `📡 Connecting to MongoDB: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`,
    );

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Clear existing feelings if requested
    if (options.clear) {
      console.log("🗑️  Clearing existing feelings...");
      const deleteResult = await Feeling.deleteMany({});
      console.log(`   Deleted ${deleteResult.deletedCount} feelings`);
    }

    // Insert feelings
    console.log("📥 Inserting feelings...");

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const feeling of feelingsData) {
      try {
        // Upsert feeling by slug
        const result = await Feeling.findOneAndUpdate(
          { slug: feeling.slug },
          {
            $set: {
              slug: feeling.slug,
              title: feeling.title,
              emoji: feeling.emoji || "",
              preview: feeling.preview,
              reminder: feeling.reminder,
              quran: {
                text: feeling.quran?.text || "",
                reference: feeling.quran?.reference || "",
                suraNumber: feeling.quran?.suraNumber || null,
                verseNumber: feeling.quran?.verseNumber || null,
              },
              dua: {
                arabic: feeling.dua?.arabic || "",
                transliteration: feeling.dua?.transliteration || "",
                meaning: feeling.dua?.meaning || "",
                reference: feeling.dua?.reference || "",
              },
              actions: feeling.actions || [],
            },
          },
          { upsert: true, new: true, runValidators: true },
        );

        if (result.isNew) {
          created++;
        } else {
          updated++;
        }
      } catch (err) {
        console.error(
          `   ❌ Error with feeling "${feeling.slug}": ${err.message}`,
        );
        errors++;
      }
    }

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ Feelings Seeded Successfully!                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Results:
  - Created: ${created}
  - Updated: ${updated}
  - Errors: ${errors}
  - Total: ${feelingsData.length}
    `);

    await mongoose.connection.close();
    console.log("📴 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding feelings: ${error.message}`);

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      // Ignore close errors
    }

    process.exit(1);
  }
};

// Run the seed script
seedFeelings();
