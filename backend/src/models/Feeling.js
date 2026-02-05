const mongoose = require("mongoose");

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
    verse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Verse",
      required: [true, "Verse reference is required"],
    },
    dua: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dua",
      required: [true, "Dua reference is required"],
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
// Note: unique: true on slug already creates an index
feelingSchema.index({ title: "text", preview: "text" });

// Transform output to match frontend JSON shape
feelingSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Static method to get feeling in frontend-compatible format
feelingSchema.statics.toFrontendFormat = function (feeling) {
  const verse =
    feeling.verse && typeof feeling.verse === "object" ? feeling.verse : null;
  const dua =
    feeling.dua && typeof feeling.dua === "object" ? feeling.dua : null;

  return {
    slug: feeling.slug,
    title: feeling.title,
    emoji: feeling.emoji || "",
    preview: feeling.preview,
    reminder: feeling.reminder,
    quran: {
      arabic: verse?.arabicText || "",
      text: verse?.translationText || "",
      reference: verse?.reference || "",
      ...(verse?.suraNumber && { suraNumber: verse.suraNumber }),
      ...(verse?.verseNumber && { verseNumber: verse.verseNumber }),
    },
    dua: {
      arabic: dua?.arabic || "",
      transliteration: dua?.transliteration || "",
      meaning: dua?.meaning || "",
      reference: dua?.reference || "",
    },
    actions: feeling.actions,
  };
};

const Feeling = mongoose.model("Feeling", feelingSchema);

module.exports = Feeling;
