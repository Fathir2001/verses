const mongoose = require("mongoose");

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
  },
  {
    timestamps: true,
  },
);

// Compound unique index for suraNumber + verseNumber
verseSchema.index({ suraNumber: 1, verseNumber: 1 }, { unique: true });

// Additional indexes for queries
verseSchema.index({ suraNumber: 1 });

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
