const mongoose = require("mongoose");

/**
 * Feeling Model
 *
 * Represents an emotional state with Islamic guidance.
 * - Verses and Duas link TO this model (one feeling can have many verses/duas)
 * - Admin creates feeling first, then links verses/duas to it
 */
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

const Feeling = mongoose.model("Feeling", feelingSchema);

module.exports = Feeling;
