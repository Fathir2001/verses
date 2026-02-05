const mongoose = require("mongoose");

/**
 * Verse Model
 *
 * Represents a Quran verse.
 * - References a Feeling (many verses can link to one feeling)
 * - Admin links verse to a feeling when creating/editing
 */
const verseSchema = new mongoose.Schema(
  {
    suraNumber: {
      type: Number,
      required: [true, "Sura number is required"],
      min: [1, "Sura number must be at least 1"],
      max: [114, "Sura number cannot exceed 114"],
    },
    verseNumber: {
      type: Number,
      required: [true, "Verse number is required"],
      min: [1, "Verse number must be at least 1"],
    },
    arabicText: {
      type: String,
      required: [true, "Arabic text is required"],
      trim: true,
    },
    translationText: {
      type: String,
      required: [true, "Translation text is required"],
      trim: true,
    },
    transliteration: {
      type: String,
      trim: true,
      default: "",
    },
    reference: {
      type: String,
      trim: true,
      default: "",
    },
    // Link to the feeling this verse is associated with
    feeling: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feeling",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Compound unique index for suraNumber + verseNumber
verseSchema.index({ suraNumber: 1, verseNumber: 1 }, { unique: true });

// Note: The compound index above includes suraNumber, so a separate suraNumber index is redundant
// If you need to query by suraNumber alone frequently, you can add: verseSchema.index({ suraNumber: 1 });

// Virtual for generating reference if not provided
verseSchema.pre("save", function (next) {
  if (!this.reference) {
    this.reference = `Qur'an ${this.suraNumber}:${this.verseNumber}`;
  }
  next();
});

// Transform output
verseSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Verse = mongoose.model("Verse", verseSchema);

module.exports = Verse;
