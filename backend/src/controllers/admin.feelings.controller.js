const Feeling = require("../models/Feeling");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require("../utils/apiResponse");

/**
 * @desc    Create a new feeling
 * @route   POST /api/admin/feelings
 * @access  Private (Admin)
 */
const createFeeling = asyncHandler(async (req, res) => {
  const { slug, title, emoji, preview, reminder, actions } = req.body;

  // Check if feeling with slug already exists
  const existingFeeling = await Feeling.findOne({ slug: slug.toLowerCase() });
  if (existingFeeling) {
    return errorResponse(
      res,
      400,
      `A feeling with slug "${slug}" already exists`,
    );
  }

  // Create feeling
  const feeling = await Feeling.create({
    slug: slug.toLowerCase(),
    title,
    emoji: emoji || "",
    preview,
    reminder,
    actions,
  });

  return successResponse(res, 201, "Feeling created successfully", feeling);
});

/**
 * @desc    Update a feeling
 * @route   PUT /api/admin/feelings/:id
 * @access  Private (Admin)
 */
const updateFeeling = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Find the feeling
  const feeling = await Feeling.findById(id);

  if (!feeling) {
    return errorResponse(res, 404, "Feeling not found");
  }

  // If slug is being updated, check for duplicates
  if (updateData.slug && updateData.slug.toLowerCase() !== feeling.slug) {
    const existingFeeling = await Feeling.findOne({
      slug: updateData.slug.toLowerCase(),
    });
    if (existingFeeling) {
      return errorResponse(
        res,
        400,
        `A feeling with slug "${updateData.slug}" already exists`,
      );
    }
    updateData.slug = updateData.slug.toLowerCase();
  }

  // Update the feeling
  const updatedFeeling = await Feeling.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  return successResponse(
    res,
    200,
    "Feeling updated successfully",
    updatedFeeling,
  );
});

/**
 * @desc    Delete a feeling
 * @route   DELETE /api/admin/feelings/:id
 * @access  Private (Admin)
 */
const deleteFeeling = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feeling = await Feeling.findById(id);

  if (!feeling) {
    return errorResponse(res, 404, "Feeling not found");
  }

  await Feeling.findByIdAndDelete(id);

  return successResponse(res, 200, "Feeling deleted successfully", { id });
});

/**
 * @desc    Get all feelings (admin - with pagination)
 * @route   GET /api/admin/feelings
 * @access  Private (Admin)
 */
const getAllFeelingsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [feelings, total] = await Promise.all([
    Feeling.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Feeling.countDocuments(),
  ]);

  return paginatedResponse(
    res,
    200,
    "Feelings retrieved successfully",
    feelings,
    {
      page,
      limit,
      total,
    },
  );
});

/**
 * @desc    Get single feeling by ID (admin)
 * @route   GET /api/admin/feelings/:id
 * @access  Private (Admin)
 */
const getFeelingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feeling = await Feeling.findById(id);

  if (!feeling) {
    return errorResponse(res, 404, "Feeling not found");
  }

  return successResponse(res, 200, "Feeling retrieved successfully", feeling);
});

module.exports = {
  createFeeling,
  updateFeeling,
  deleteFeeling,
  getAllFeelingsAdmin,
  getFeelingById,
};
