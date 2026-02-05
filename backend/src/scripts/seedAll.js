/**
 * Seed All Data Script
 *
 * This script seeds:
 * 1. Suras - Basic Quran sura information
 * 2. Verses - Quran verses extracted from feelings.json
 * 3. Feelings - Linked to verses via suraNumber and verseNumber
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
    // STEP 2: Extract and Seed Verses from Feelings
    // ========================================
    console.log("\n📖 Extracting and seeding Verses from feelings...");
    const versesMap = new Map(); // To avoid duplicates
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

      // For verse ranges like 94:5-6, we create one verse entry with combined text
      const key = `${parsed.suraNumber}:${parsed.verseStart}${parsed.verseEnd !== parsed.verseStart ? `-${parsed.verseEnd}` : ""}`;

      if (!versesMap.has(key)) {
        versesMap.set(key, {
          suraNumber: parsed.suraNumber,
          verseNumber: parsed.verseStart,
          verseEnd: parsed.verseEnd,
          arabicText: feeling.quran.arabic || "",
          translationText: feeling.quran.text || "",
          reference: feeling.quran.reference,
        });
      }
    }

    // Insert verses
    for (const [key, verseData] of versesMap) {
      try {
        await Verse.findOneAndUpdate(
          {
            suraNumber: verseData.suraNumber,
            verseNumber: verseData.verseNumber,
          },
          {
            $set: {
              suraNumber: verseData.suraNumber,
              verseNumber: verseData.verseNumber,
              arabicText: verseData.arabicText,
              translationText: verseData.translationText,
              reference: verseData.reference,
            },
          },
          { upsert: true, new: true },
        );
        versesCreated++;
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate key - just update
          console.log(`   ⚠️  Verse ${key} already exists, updating...`);
        } else {
          console.error(`   ❌ Error seeding verse ${key}: ${err.message}`);
        }
      }
    }
    console.log(`   ✅ Seeded ${versesCreated} verses`);

    // ========================================
    // STEP 3: Seed Feelings with Verse References
    // ========================================
    console.log("\n💭 Seeding Feelings with verse references...");
    let feelingsCreated = 0;
    let feelingsUpdated = 0;

    for (const feeling of feelingsData) {
      try {
        // Parse the Quran reference to get sura and verse numbers
        let suraNumber = null;
        let verseNumber = null;

        if (feeling.quran && feeling.quran.reference) {
          const parsed = parseQuranReference(feeling.quran.reference);
          if (parsed) {
            suraNumber = parsed.suraNumber;
            verseNumber = parsed.verseStart;
          }
        }

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
                suraNumber: suraNumber,
                verseNumber: verseNumber,
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
