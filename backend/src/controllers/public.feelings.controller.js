const Feeling = require("../models/Feeling");
const { asyncHandler } = require("../middleware/errorHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * @desc    Get all feelings (public - same format as feelings.json)
 * @route   GET /api/feelings
 * @access  Public
 */
const getAllFeelings = asyncHandler(async (req, res) => {
  const feelings = await Feeling.find().sort({ title: 1 });

  // Transform to frontend-compatible format
  const formattedFeelings = feelings.map((feeling) =>
    Feeling.toFrontendFormat(feeling),
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

  // Transform to frontend-compatible format
  const formattedFeeling = Feeling.toFrontendFormat(feeling);

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
