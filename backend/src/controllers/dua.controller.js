const Dua = require("../models/Dua");
const Feeling = require("../models/Feeling");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require("../utils/apiResponse");

// ============ ADMIN CONTROLLERS ============

/**
 * @desc    Create a new dua
 * @route   POST /api/admin/duas
 * @access  Private (Admin)
 */
const createDua = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    arabic,
    transliteration,
    meaning,
    reference,
    category,
    benefits,
    feelingId,
  } = req.body;

  // Check if dua with slug already exists
  const existingDua = await Dua.findOne({ slug: slug.toLowerCase() });
  if (existingDua) {
    return errorResponse(res, 400, `A dua with slug "${slug}" already exists`);
  }

  // If feelingId provided, validate it exists
  if (feelingId) {
    const feeling = await Feeling.findById(feelingId);
    if (!feeling) {
      return errorResponse(res, 400, "Selected feeling not found");
    }
  }

  const dua = await Dua.create({
    title,
    slug: slug.toLowerCase(),
    arabic,
    transliteration: transliteration || "",
    meaning,
    reference: reference || "",
    category: category || "",
    benefits: benefits || "",
    feeling: feelingId || null,
  });

  const populated = await dua.populate("feeling");

  return successResponse(res, 201, "Dua created successfully", populated);
});

/**
 * @desc    Update a dua
 * @route   PUT /api/admin/duas/:id
 * @access  Private (Admin)
 */
const updateDua = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const dua = await Dua.findById(id);

  if (!dua) {
    return errorResponse(res, 404, "Dua not found");
  }

  // If slug is being updated, check for duplicates
  if (updateData.slug && updateData.slug.toLowerCase() !== dua.slug) {
    const existingDua = await Dua.findOne({
      slug: updateData.slug.toLowerCase(),
    });
    if (existingDua) {
      return errorResponse(
        res,
        400,
        `A dua with slug "${updateData.slug}" already exists`,
      );
    }
    updateData.slug = updateData.slug.toLowerCase();
  }

  // Handle feelingId
  if (updateData.feelingId !== undefined) {
    if (updateData.feelingId) {
      const feeling = await Feeling.findById(updateData.feelingId);
      if (!feeling) {
        return errorResponse(res, 400, "Selected feeling not found");
      }
      updateData.feeling = updateData.feelingId;
    } else {
      updateData.feeling = null;
    }
    delete updateData.feelingId;
  }

  const updatedDua = await Dua.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).populate("feeling");

  return successResponse(res, 200, "Dua updated successfully", updatedDua);
});

/**
 * @desc    Delete a dua
 * @route   DELETE /api/admin/duas/:id
 * @access  Private (Admin)
 */
const deleteDua = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const dua = await Dua.findById(id);

  if (!dua) {
    return errorResponse(res, 404, "Dua not found");
  }

  await Dua.findByIdAndDelete(id);

  return successResponse(res, 200, "Dua deleted successfully", { id });
});

/**
 * @desc    Get all duas (admin - with pagination)
 * @route   GET /api/admin/duas
 * @access  Private (Admin)
 */
const getAllDuasAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const { feelingId } = req.query;

  const filter = {};
  if (feelingId) filter.feeling = feelingId;

  const [duas, total] = await Promise.all([
    Dua.find(filter)
      .populate("feeling")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Dua.countDocuments(filter),
  ]);

  return paginatedResponse(res, 200, "Duas retrieved successfully", duas, {
    page,
    limit,
    total,
  });
});

/**
 * @desc    Get dua by ID (admin)
 * @route   GET /api/admin/duas/:id
 * @access  Private (Admin)
 */
const getDuaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const dua = await Dua.findById(id).populate("feeling");

  if (!dua) {
    return errorResponse(res, 404, "Dua not found");
  }

  return successResponse(res, 200, "Dua retrieved successfully", dua);
});

// ============ PUBLIC CONTROLLERS ============

/**
 * @desc    Get all duas (public)
 * @route   GET /api/duas
 * @access  Public
 */
const getAllDuasPublic = asyncHandler(async (req, res) => {
  const duas = await Dua.find().sort({ title: 1 });

  return successResponse(res, 200, "Duas retrieved successfully", duas);
});

/**
 * @desc    Get dua by slug (public)
 * @route   GET /api/duas/:slug
 * @access  Public
 */
const getDuaBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const dua = await Dua.findOne({ slug: slug.toLowerCase() });

  if (!dua) {
    return errorResponse(res, 404, `Dua not found with slug: ${slug}`);
  }

  return successResponse(res, 200, "Dua retrieved successfully", dua);
});

module.exports = {
  // Admin
  createDua,
  updateDua,
  deleteDua,
  getAllDuasAdmin,
  getDuaById,
  // Public
  getAllDuasPublic,
  getDuaBySlug,
};
