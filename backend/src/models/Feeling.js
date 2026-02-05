const mongoose = require("mongoose");

// Sub-schema for Quran reference
const quranSubSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Quran text is required"],
      trim: true,
    },
    reference: {
      type: String,
      required: [true, "Quran reference is required"],
      trim: true,
    },
    suraNumber: {
      type: Number,
      min: [1, "Sura number must be at least 1"],
      max: [114, "Sura number cannot exceed 114"],
      default: null,
    },
    verseNumber: {
      type: Number,
      min: [1, "Verse number must be at least 1"],
      default: null,
    },
  },
  { _id: false },
);

// Sub-schema for Dua
const duaSubSchema = new mongoose.Schema(
  {
    arabic: {
      type: String,
      trim: true,
      default: "",
    },
    transliteration: {
      type: String,
      trim: true,
      default: "",
    },
    meaning: {
      type: String,
      required: [true, "Dua meaning is required"],
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const feelingSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    emoji: {
      type: String,
      trim: true,
      default: "",
    },
    preview: {
      type: String,
      required: [true, "Preview is required"],
      trim: true,
    },
    reminder: {
      type: String,
      required: [true, "Reminder is required"],
      trim: true,
    },
    quran: {
      type: quranSubSchema,
      required: [true, "Quran reference is required"],
    },
    dua: {
      type: duaSubSchema,
      required: [true, "Dua is required"],
    },
    actions: {
      type: [String],
      required: [true, "Actions are required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one action is required",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
feelingSchema.index({ slug: 1 });
feelingSchema.index({ title: "text", preview: "text" });

// Transform output to match frontend JSON shape
feelingSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Static method to get feeling in frontend-compatible format
feelingSchema.statics.toFrontendFormat = function (feeling) {
  return {
    slug: feeling.slug,
    title: feeling.title,
    emoji: feeling.emoji || "",
    preview: feeling.preview,
    reminder: feeling.reminder,
    quran: {
      text: feeling.quran.text,
      reference: feeling.quran.reference,
      ...(feeling.quran.suraNumber && { suraNumber: feeling.quran.suraNumber }),
      ...(feeling.quran.verseNumber && {
        verseNumber: feeling.quran.verseNumber,
      }),
    },
    dua: {
      arabic: feeling.dua.arabic || "",
      transliteration: feeling.dua.transliteration || "",
      meaning: feeling.dua.meaning,
      reference: feeling.dua.reference || "",
    },
    actions: feeling.actions,
  };
};

const Feeling = mongoose.model("Feeling", feelingSchema);

module.exports = Feeling;
