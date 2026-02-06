/**
 * Seed All Data Script
 *
 * NEW DATA MODEL:
 * - Feelings are standalone (no verse/dua references)
 * - Verses have a `feeling` field that references a Feeling
 * - Duas have a `feeling` field that references a Feeling
 * - One feeling can have MULTIPLE verses and MULTIPLE duas
 *
 * This script seeds:
 * 1. Suras - Basic Quran sura information
 * 2. Feelings - Standalone feelings with no references
 * 3. Verses - Quran verses that reference their associated feeling
 * 4. Duas - Supplications that reference their associated feeling
 *
 * Usage:
 *   node src/scripts/seedAll.js
 *
 * Options:
 *   --clear    Clear existing data before seeding
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const Feeling = require("../models/Feeling");
const Verse = require("../models/Verse");
const Sura = require("../models/Sura");
const Dua = require("../models/Dua");

// Parse CLI arguments
const parseArgs = () => {
  const args = process.argv.slice(2);
  return {
    clear: args.includes("--clear"),
  };
};

// Parse Quran reference string to get sura and verse numbers
// Examples: "Qur'an 94:5-6", "Qur'an 65:3", "Qur'an 2:286"
const parseQuranReference = (reference) => {
  if (!reference) return null;

  // Match patterns like "Qur'an 94:5-6" or "Qur'an 65:3"
  const match = reference.match(/Qur'?an\s+(\d+):(\d+)(?:-(\d+))?/i);
  if (!match) return null;

  return {
    suraNumber: parseInt(match[1], 10),
    verseStart: parseInt(match[2], 10),
    verseEnd: match[3] ? parseInt(match[3], 10) : parseInt(match[2], 10),
  };
};

// Basic Sura data (you can expand this later)
const getSuraData = () => {
  return [
    {
      suraNumber: 1,
      nameArabic: "الفاتحة",
      nameEnglish: "The Opening",
      transliteration: "Al-Fatiha",
      totalVerses: 7,
    },
    {
      suraNumber: 2,
      nameArabic: "البقرة",
      nameEnglish: "The Cow",
      transliteration: "Al-Baqarah",
      totalVerses: 286,
    },
    {
      suraNumber: 3,
      nameArabic: "آل عمران",
      nameEnglish: "Family of Imran",
      transliteration: "Ali 'Imran",
      totalVerses: 200,
    },
    {
      suraNumber: 4,
      nameArabic: "النساء",
      nameEnglish: "The Women",
      transliteration: "An-Nisa",
      totalVerses: 176,
    },
    {
      suraNumber: 13,
      nameArabic: "الرعد",
      nameEnglish: "The Thunder",
      transliteration: "Ar-Ra'd",
      totalVerses: 43,
    },
    {
      suraNumber: 14,
      nameArabic: "إبراهيم",
      nameEnglish: "Abraham",
      transliteration: "Ibrahim",
      totalVerses: 52,
    },
    {
      suraNumber: 21,
      nameArabic: "الأنبياء",
      nameEnglish: "The Prophets",
      transliteration: "Al-Anbiya",
      totalVerses: 112,
    },
    {
      suraNumber: 29,
      nameArabic: "العنكبوت",
      nameEnglish: "The Spider",
      transliteration: "Al-Ankabut",
      totalVerses: 69,
    },
    {
      suraNumber: 39,
      nameArabic: "الزمر",
      nameEnglish: "The Troops",
      transliteration: "Az-Zumar",
      totalVerses: 75,
    },
    {
      suraNumber: 41,
      nameArabic: "فصلت",
      nameEnglish: "Explained in Detail",
      transliteration: "Fussilat",
      totalVerses: 54,
    },
    {
      suraNumber: 50,
      nameArabic: "ق",
      nameEnglish: "Qaf",
      transliteration: "Qaf",
      totalVerses: 45,
    },
    {
      suraNumber: 65,
      nameArabic: "الطلاق",
      nameEnglish: "The Divorce",
      transliteration: "At-Talaq",
      totalVerses: 12,
    },
    {
      suraNumber: 94,
      nameArabic: "الشرح",
      nameEnglish: "The Relief",
      transliteration: "Ash-Sharh",
      totalVerses: 8,
    },
  ];
};

const seedAll = async () => {
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
    console.log(`   Found ${feelingsData.length} feelings`);

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/verses";
    console.log(`📡 Connecting to MongoDB...`);

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Clear existing data if requested
    if (options.clear) {
      console.log("\n🗑️  Clearing existing data...");
      await Promise.all([
        Sura.deleteMany({}),
        Verse.deleteMany({}),
        Feeling.deleteMany({}),
        Dua.deleteMany({}),
      ]);
      console.log("   All data cleared");
    }

    // ========================================
    // STEP 1: Seed Suras
    // ========================================
    console.log("\n📚 Seeding Suras...");
    const suraData = getSuraData();
    let surasCreated = 0;

    for (const sura of suraData) {
      try {
        await Sura.findOneAndUpdate(
          { suraNumber: sura.suraNumber },
          { $set: sura },
          { upsert: true, new: true },
        );
        surasCreated++;
      } catch (err) {
        console.error(
          `   ❌ Error seeding sura ${sura.suraNumber}: ${err.message}`,
        );
      }
    }
    console.log(`   ✅ Seeded ${surasCreated} suras`);

    // ========================================
    // STEP 2: Seed Feelings (standalone - no verse/dua refs)
    // ========================================
    console.log("\n💭 Seeding Feelings (standalone)...");
    let feelingsCreated = 0;
    let feelingsUpdated = 0;
    const feelingsIdMap = new Map(); // Map slug -> feeling._id

    for (const feeling of feelingsData) {
      try {
        const result = await Feeling.findOneAndUpdate(
          { slug: feeling.slug },
          {
            $set: {
              slug: feeling.slug,
              title: feeling.title,
              emoji: feeling.emoji || "",
              preview: feeling.preview,
              reminder: feeling.reminder,
              actions: feeling.actions || [],
            },
          },
          { upsert: true, new: true, runValidators: true },
        );

        feelingsIdMap.set(feeling.slug, result._id);

        if (
          result.createdAt &&
          result.updatedAt &&
          result.createdAt.getTime() === result.updatedAt.getTime()
        ) {
          feelingsCreated++;
        } else {
          feelingsUpdated++;
        }
      } catch (err) {
        console.error(
          `   ❌ Error with feeling "${feeling.slug}": ${err.message}`,
        );
      }
    }
    console.log(
      `   ✅ Created ${feelingsCreated} feelings, updated ${feelingsUpdated}`,
    );

    // ========================================
    // STEP 3: Seed Verses with Feeling references
    // ========================================
    console.log("\n📖 Seeding Verses (with feeling references)...");
    let versesCreated = 0;

    for (const feeling of feelingsData) {
      if (!feeling.quran || !feeling.quran.reference) continue;

      const parsed = parseQuranReference(feeling.quran.reference);
      if (!parsed) {
        console.log(
          `   ⚠️  Could not parse reference: ${feeling.quran.reference}`,
        );
        continue;
      }

      const feelingId = feelingsIdMap.get(feeling.slug);
      if (!feelingId) {
        console.log(`   ⚠️  No feeling found for slug: ${feeling.slug}`);
        continue;
      }

      try {
        await Verse.findOneAndUpdate(
          {
            suraNumber: parsed.suraNumber,
            verseNumber: parsed.verseStart,
          },
          {
            $set: {
              suraNumber: parsed.suraNumber,
              verseNumber: parsed.verseStart,
              arabicText: feeling.quran.arabic || "",
              translationText: feeling.quran.text || "",
              reference: feeling.quran.reference,
              feeling: feelingId, // Link to the feeling
            },
          },
          { upsert: true, new: true },
        );
        versesCreated++;
      } catch (err) {
        if (err.code === 11000) {
          console.log(
            `   ⚠️  Verse ${parsed.suraNumber}:${parsed.verseStart} already exists, updating...`,
          );
        } else {
          console.error(
            `   ❌ Error seeding verse ${parsed.suraNumber}:${parsed.verseStart}: ${err.message}`,
          );
        }
      }
    }
    console.log(`   ✅ Seeded ${versesCreated} verses`);

    // ========================================
    // STEP 4: Seed Duas with Feeling references
    // ========================================
    console.log("\n🤲 Seeding Duas (with feeling references)...");
    let duasCreated = 0;
    let duasUpdated = 0;

    // Helper function to get category based on feeling
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

    for (const feeling of feelingsData) {
      if (!feeling.dua) continue;

      const feelingId = feelingsIdMap.get(feeling.slug);
      if (!feelingId) {
        console.log(`   ⚠️  No feeling found for slug: ${feeling.slug}`);
        continue;
      }

      const duaData = {
        title: `Dua for ${feeling.title}`,
        slug: `dua-for-${feeling.slug}`,
        arabic: feeling.dua.arabic || "",
        transliteration: feeling.dua.transliteration || "",
        meaning: feeling.dua.meaning || "",
        reference: feeling.dua.reference || "",
        category: getCategoryFromFeeling(feeling.title),
        benefits: `This dua is recommended when feeling ${feeling.title.toLowerCase()}.`,
        feeling: feelingId, // Link to the feeling
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
      } catch (err) {
        console.error(
          `   ❌ Error with dua "${duaData.title}": ${err.message}`,
        );
      }
    }
    console.log(`   ✅ Created ${duasCreated} duas, updated ${duasUpdated}`);

    // ========================================
    // Summary
    // ========================================
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ All Data Seeded Successfully!                         ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║   📚 Suras:    ${String(surasCreated).padStart(3)}                                        ║
║   📖 Verses:   ${String(versesCreated).padStart(3)}                                        ║
║   💭 Feelings: ${String(feelingsCreated + feelingsUpdated).padStart(3)}                                        ║
║   🤲 Duas:     ${String(duasCreated + duasUpdated).padStart(3)}                                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);

    await mongoose.connection.close();
    console.log("📴 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding data: ${error.message}`);
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
seedAll();
