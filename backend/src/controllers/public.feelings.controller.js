const Feeling = require("../models/Feeling");
const Verse = require("../models/Verse");
const Dua = require("../models/Dua");
const { asyncHandler } = require("../middleware/errorHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * Helper function to enrich feeling with verses and duas that reference it
 */
const enrichFeelingWithContent = async (feeling) => {
  // Find all verses and duas that reference this feeling
  const [verses, duas] = await Promise.all([
    Verse.find({ feeling: feeling._id }).sort({
      suraNumber: 1,
      verseNumber: 1,
    }),
    Dua.find({ feeling: feeling._id }).sort({ title: 1 }),
  ]);

  return {
    slug: feeling.slug,
    title: feeling.title,
    emoji: feeling.emoji || "",
    preview: feeling.preview,
    reminder: feeling.reminder,
    actions: feeling.actions,
    // Return arrays of verses and duas
    verses: verses.map((v) => ({
      _id: v._id,
      suraNumber: v.suraNumber,
      verseNumber: v.verseNumber,
      arabicText: v.arabicText,
      translationText: v.translationText,
      transliteration: v.transliteration,
      reference: v.reference,
    })),
    duas: duas.map((d) => ({
      _id: d._id,
      title: d.title,
      slug: d.slug,
      arabic: d.arabic,
      transliteration: d.transliteration,
      meaning: d.meaning,
      reference: d.reference,
    })),
    // For backward compatibility, also provide quran and dua objects with first item
    quran:
      verses.length > 0
        ? {
            arabic: verses[0].arabicText,
            text: verses[0].translationText,
            reference: verses[0].reference,
            suraNumber: verses[0].suraNumber,
            verseNumber: verses[0].verseNumber,
          }
        : null,
    dua:
      duas.length > 0
        ? {
            arabic: duas[0].arabic,
            transliteration: duas[0].transliteration,
            meaning: duas[0].meaning,
            reference: duas[0].reference,
          }
        : null,
  };
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
    feelings.map((feeling) => enrichFeelingWithContent(feeling)),
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
  const formattedFeeling = await enrichFeelingWithContent(feeling);

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
