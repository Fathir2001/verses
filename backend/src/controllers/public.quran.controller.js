const Sura = require("../models/Sura");
const Verse = require("../models/Verse");
const { asyncHandler } = require("../middleware/errorHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * @desc    Get all suras (public)
 * @route   GET /api/suras
 * @access  Public
 */
const getAllSuras = asyncHandler(async (req, res) => {
  const suras = await Sura.find().sort({ suraNumber: 1 });

  return successResponse(res, 200, "Suras retrieved successfully", suras);
});

/**
 * @desc    Get single sura by sura number (public)
 * @route   GET /api/suras/:suraNumber
 * @access  Public
 */
const getSuraBySuraNumber = asyncHandler(async (req, res) => {
  const { suraNumber } = req.params;

  const sura = await Sura.findOne({ suraNumber: parseInt(suraNumber, 10) });

  if (!sura) {
    return errorResponse(res, 404, `Sura not found with number: ${suraNumber}`);
  }

  return successResponse(res, 200, "Sura retrieved successfully", sura);
});

/**
 * @desc    Get all verses of a sura (public)
 * @route   GET /api/suras/:suraNumber/verses
 * @access  Public
 */
const getVersesBySura = asyncHandler(async (req, res) => {
  const { suraNumber } = req.params;
  const suraNum = parseInt(suraNumber, 10);

  // Check if sura exists
  const sura = await Sura.findOne({ suraNumber: suraNum });
  if (!sura) {
    return errorResponse(res, 404, `Sura not found with number: ${suraNumber}`);
  }

  const verses = await Verse.find({ suraNumber: suraNum }).sort({
    verseNumber: 1,
  });

  return successResponse(res, 200, "Verses retrieved successfully", {
    sura,
    verses,
    totalVerses: verses.length,
  });
});

/**
 * @desc    Get single verse (public)
 * @route   GET /api/suras/:suraNumber/verses/:verseNumber
 * @access  Public
 */
const getVerse = asyncHandler(async (req, res) => {
  const { suraNumber, verseNumber } = req.params;
  const suraNum = parseInt(suraNumber, 10);
  const verseNum = parseInt(verseNumber, 10);

  const verse = await Verse.findOne({
    suraNumber: suraNum,
    verseNumber: verseNum,
  });

  if (!verse) {
    return errorResponse(
      res,
      404,
      `Verse not found: ${suraNumber}:${verseNumber}`,
    );
  }

  return successResponse(res, 200, "Verse retrieved successfully", verse);
});

module.exports = {
  getAllSuras,
  getSuraBySuraNumber,
  getVersesBySura,
  getVerse,
};
