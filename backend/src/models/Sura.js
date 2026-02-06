const mongoose = require("mongoose");

const suraSchema = new mongoose.Schema(
  {
    suraNumber: {
      type: Number,
      required: [true, "Sura number is required"],
      unique: true,
      min: [1, "Sura number must be at least 1"],
      max: [114, "Sura number cannot exceed 114"],
    },
    nameArabic: {
      type: String,
      trim: true,
      default: "",
    },
    nameEnglish: {
      type: String,
      trim: true,
      default: "",
    },
    transliteration: {
      type: String,
      trim: true,
      default: "",
    },
    totalVerses: {
      type: Number,
      min: [1, "Total verses must be at least 1"],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Note: unique: true on suraNumber already creates an index

// Transform output
suraSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Sura = mongoose.model("Sura", suraSchema);

module.exports = Sura;
