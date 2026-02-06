/**
 * Seed Duas Script
 *
 * This script extracts duas from the feelings.json file
 * and seeds them into the Dua collection.
 *
 * Usage:
 *   node src/scripts/seedDuas.js
 *
 * Options:
 *   --clear    Clear existing duas before seeding
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const Dua = require("../models/Dua");

// Parse CLI arguments
const parseArgs = () => {
  const args = process.argv.slice(2);
  return {
    clear: args.includes("--clear"),
  };
};

// Generate a slug from title
const generateSlug = (title, feelingSlug) => {
  // Create a unique slug based on the feeling it's associated with
  return `dua-for-${feelingSlug}`;
};

// Get category based on the feeling
const getCategoryFromFeeling = (feelingTitle) => {
  const categories = {
    Sad: "Comfort & Solace",
    Anxious: "Peace & Trust",
    Lonely: "Connection",
    Angry: "Self-Control",
    Hopeless: "Hope & Mercy",
    Grateful: "Gratitude",
    Overwhelmed: "Ease & Relief",
    Lost: "Guidance",
    Guilty: "Forgiveness",
    Afraid: "Protection",
    Jealous: "Contentment",
    Peaceful: "Peace & Dhikr",
  };
  return categories[feelingTitle] || "General";
};

const seedDuas = async () => {
  try {
    const options = parseArgs();

    // Read feelings.json
    const feelingsPath = path.resolve(__dirname, "../../../data/feelings.json");
    if (!fs.existsSync(feelingsPath)) {
      console.error(`❌ Error: Feelings file not found at: ${feelingsPath}`);
      process.exit(1);
    }

    console.log(`📖 Reading feelings from: ${feelingsPath}`);
    const feelingsData = JSON.parse(fs.readFileSync(feelingsPath, "utf-8"));
    console.log(`   Found ${feelingsData.length} feelings with duas`);

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/verses";
    console.log(`📡 Connecting to MongoDB...`);

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Clear existing duas if requested
    if (options.clear) {
      console.log("\n🗑️  Clearing existing duas...");
      const deleteResult = await Dua.deleteMany({});
      console.log(`   Deleted ${deleteResult.deletedCount} duas`);
    }

    // Extract and seed duas
    console.log("\n🤲 Seeding Duas from feelings...");
    let duasCreated = 0;
    let duasUpdated = 0;
    let errors = 0;

    for (const feeling of feelingsData) {
      if (!feeling.dua) continue;

      const duaData = {
        title: `Dua for ${feeling.title}`,
        slug: generateSlug(feeling.title, feeling.slug),
        arabic: feeling.dua.arabic || "",
        transliteration: feeling.dua.transliteration || "",
        meaning: feeling.dua.meaning || "",
        reference: feeling.dua.reference || "",
        category: getCategoryFromFeeling(feeling.title),
        benefits: `This dua is recommended when feeling ${feeling.title.toLowerCase()}. ${feeling.reminder ? feeling.reminder.substring(0, 100) + "..." : ""}`,
      };

      try {
        const result = await Dua.findOneAndUpdate(
          { slug: duaData.slug },
          { $set: duaData },
          { upsert: true, new: true, runValidators: true },
        );

        if (
          result.createdAt &&
          result.updatedAt &&
          result.createdAt.getTime() === result.updatedAt.getTime()
        ) {
          duasCreated++;
        } else {
          duasUpdated++;
        }
        console.log(`   ✅ ${duaData.title}`);
      } catch (err) {
        console.error(
          `   ❌ Error with dua "${duaData.title}": ${err.message}`,
        );
        errors++;
      }
    }

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🤲 Duas Seeded Successfully!                             ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║   Created: ${String(duasCreated).padStart(3)}                                          ║
║   Updated: ${String(duasUpdated).padStart(3)}                                          ║
║   Errors:  ${String(errors).padStart(3)}                                          ║
║   Total:   ${String(feelingsData.length).padStart(3)}                                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);

    await mongoose.connection.close();
    console.log("📴 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding duas: ${error.message}`);
    console.error(error.stack);

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      // Ignore close errors
    }

    process.exit(1);
  }
};

// Run the seed script
seedDuas();
