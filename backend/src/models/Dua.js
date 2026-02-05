const mongoose = require("mongoose");

/**
 * Dua Model
 *
 * Represents a supplication (dua).
 * - References a Feeling (many duas can link to one feeling)
 * - Admin links dua to a feeling when creating/editing
 */
const duaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
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
    arabic: {
      type: String,
      required: [true, "Arabic text is required"],
      trim: true,
    },
    transliteration: {
      type: String,
      trim: true,
      default: "",
    },
    meaning: {
      type: String,
      required: [true, "Meaning/translation is required"],
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    benefits: {
      type: String,
      trim: true,
      default: "",
    },
    // Link to the feeling this dua is associated with
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

// Indexes
// Note: unique: true on slug already creates an index
duaSchema.index({ title: "text", meaning: "text", category: "text" });

// Transform output
duaSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Dua = mongoose.model("Dua", duaSchema);

module.exports = Dua;
