const Feeling = require("../models/Feeling");
const Verse = require("../models/Verse");
const { asyncHandler } = require("../middleware/errorHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * Helper function to enrich feeling with verse data from database
 */
const enrichFeelingWithVerse = async (feeling) => {
  const formatted = Feeling.toFrontendFormat(feeling);

  // If feeling has suraNumber and verseNumber, fetch the actual verse
  if (feeling.quran?.suraNumber && feeling.quran?.verseNumber) {
    const verse = await Verse.findOne({
      suraNumber: feeling.quran.suraNumber,
      verseNumber: feeling.quran.verseNumber,
    });

    if (verse) {
      // Enrich with verse data from database
      formatted.quran.arabic = verse.arabicText;
      formatted.quran.text = verse.translationText || formatted.quran.text;
      if (verse.transliteration) {
        formatted.quran.transliteration = verse.transliteration;
      }
    }
  }

  return formatted;
};

/**
 * @desc    Get all feelings (public - same format as feelings.json)
 * @route   GET /api/feelings
 * @access  Public
 */
const getAllFeelings = asyncHandler(async (req, res) => {
  const feelings = await Feeling.find().sort({ title: 1 });

  // Transform to frontend-compatible format with verse data
  const formattedFeelings = await Promise.all(
    feelings.map((feeling) => enrichFeelingWithVerse(feeling)),
  );

  return successResponse(
    res,
    200,
    "Feelings retrieved successfully",
    formattedFeelings,
  );
});

/**
 * @desc    Get single feeling by slug (public - same format as feelings.json)
 * @route   GET /api/feelings/:slug
 * @access  Public
 */
const getFeelingBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const feeling = await Feeling.findOne({ slug: slug.toLowerCase() });

  if (!feeling) {
    return errorResponse(res, 404, `Feeling not found with slug: ${slug}`);
  }

  // Transform to frontend-compatible format with verse data
  const formattedFeeling = await enrichFeelingWithVerse(feeling);

  return successResponse(
    res,
    200,
    "Feeling retrieved successfully",
    formattedFeeling,
  );
});

module.exports = {
  getAllFeelings,
  getFeelingBySlug,
};
