const Sura = require("../models/Sura");
const Verse = require("../models/Verse");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require("../utils/apiResponse");

// ============ SURA CONTROLLERS ============

/**
 * @desc    Create a new sura
 * @route   POST /api/admin/suras
 * @access  Private (Admin)
 */
const createSura = asyncHandler(async (req, res) => {
  const { suraNumber, nameArabic, nameEnglish, transliteration, totalVerses } =
    req.body;

  // Check if sura already exists
  const existingSura = await Sura.findOne({ suraNumber });
  if (existingSura) {
    return errorResponse(res, 400, `Sura ${suraNumber} already exists`);
  }

  const sura = await Sura.create({
    suraNumber,
    nameArabic: nameArabic || "",
    nameEnglish: nameEnglish || "",
    transliteration: transliteration || "",
    totalVerses: totalVerses || null,
  });

  return successResponse(res, 201, "Sura created successfully", sura);
});

/**
 * @desc    Update a sura
 * @route   PUT /api/admin/suras/:id
 * @access  Private (Admin)
 */
const updateSura = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const sura = await Sura.findById(id);

  if (!sura) {
    return errorResponse(res, 404, "Sura not found");
  }

  const updatedSura = await Sura.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  return successResponse(res, 200, "Sura updated successfully", updatedSura);
});

/**
 * @desc    Delete a sura
 * @route   DELETE /api/admin/suras/:id
 * @access  Private (Admin)
 */
const deleteSura = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sura = await Sura.findById(id);

  if (!sura) {
    return errorResponse(res, 404, "Sura not found");
  }

  // Also delete all verses of this sura
  await Verse.deleteMany({ suraNumber: sura.suraNumber });
  await Sura.findByIdAndDelete(id);

  return successResponse(res, 200, "Sura and its verses deleted successfully", {
    id,
    suraNumber: sura.suraNumber,
  });
});

/**
 * @desc    Get all suras (admin - with pagination)
 * @route   GET /api/admin/suras
 * @access  Private (Admin)
 */
const getAllSurasAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const [suras, total] = await Promise.all([
    Sura.find().sort({ suraNumber: 1 }).skip(skip).limit(limit),
    Sura.countDocuments(),
  ]);

  return paginatedResponse(res, 200, "Suras retrieved successfully", suras, {
    page,
    limit,
    total,
  });
});

// ============ VERSE CONTROLLERS ============

/**
 * @desc    Create a new verse
 * @route   POST /api/admin/verses
 * @access  Private (Admin)
 */
const createVerse = asyncHandler(async (req, res) => {
  const {
    suraNumber,
    verseNumber,
    arabicText,
    translationText,
    transliteration,
    reference,
  } = req.body;

  // Check if verse already exists
  const existingVerse = await Verse.findOne({ suraNumber, verseNumber });
  if (existingVerse) {
    return errorResponse(
      res,
      400,
      `Verse ${suraNumber}:${verseNumber} already exists`,
    );
  }

  const verse = await Verse.create({
    suraNumber,
    verseNumber,
    arabicText,
    translationText,
    transliteration: transliteration || "",
    reference: reference || `Qur'an ${suraNumber}:${verseNumber}`,
  });

  return successResponse(res, 201, "Verse created successfully", verse);
});

/**
 * @desc    Update a verse
 * @route   PUT /api/admin/verses/:id
 * @access  Private (Admin)
 */
const updateVerse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const verse = await Verse.findById(id);

  if (!verse) {
    return errorResponse(res, 404, "Verse not found");
  }

  const updatedVerse = await Verse.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  return successResponse(res, 200, "Verse updated successfully", updatedVerse);
});

/**
 * @desc    Delete a verse
 * @route   DELETE /api/admin/verses/:id
 * @access  Private (Admin)
 */
const deleteVerse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const verse = await Verse.findById(id);

  if (!verse) {
    return errorResponse(res, 404, "Verse not found");
  }

  await Verse.findByIdAndDelete(id);

  return successResponse(res, 200, "Verse deleted successfully", {
    id,
    suraNumber: verse.suraNumber,
    verseNumber: verse.verseNumber,
  });
});

/**
 * @desc    Get all verses (admin - with pagination)
 * @route   GET /api/admin/verses
 * @access  Private (Admin)
 */
const getAllVersesAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;
  const { suraNumber } = req.query;

  const filter = suraNumber ? { suraNumber: parseInt(suraNumber, 10) } : {};

  const [verses, total] = await Promise.all([
    Verse.find(filter)
      .sort({ suraNumber: 1, verseNumber: 1 })
      .skip(skip)
      .limit(limit),
    Verse.countDocuments(filter),
  ]);

  return paginatedResponse(res, 200, "Verses retrieved successfully", verses, {
    page,
    limit,
    total,
  });
});

/**
 * @desc    Get verse by ID (admin)
 * @route   GET /api/admin/verses/:id
 * @access  Private (Admin)
 */
const getVerseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const verse = await Verse.findById(id);

  if (!verse) {
    return errorResponse(res, 404, "Verse not found");
  }

  return successResponse(res, 200, "Verse retrieved successfully", verse);
});

/**
 * @desc    Bulk create verses
 * @route   POST /api/admin/verses/bulk
 * @access  Private (Admin)
 */
const bulkCreateVerses = asyncHandler(async (req, res) => {
  const { verses } = req.body;

  if (!Array.isArray(verses) || verses.length === 0) {
    return errorResponse(res, 400, "Verses array is required");
  }

  // Use insertMany with ordered: false to continue on errors
  try {
    const result = await Verse.insertMany(verses, { ordered: false });
    return successResponse(
      res,
      201,
      `${result.length} verses created successfully`,
      {
        created: result.length,
        verses: result,
      },
    );
  } catch (error) {
    if (error.writeErrors) {
      const successCount = verses.length - error.writeErrors.length;
      return successResponse(
        res,
        207,
        `Partial success: ${successCount} verses created, ${error.writeErrors.length} failed`,
        {
          created: successCount,
          failed: error.writeErrors.length,
          errors: error.writeErrors.map((e) => ({
            index: e.index,
            message: e.errmsg,
          })),
        },
      );
    }
    throw error;
  }
});

module.exports = {
  // Sura controllers
  createSura,
  updateSura,
  deleteSura,
  getAllSurasAdmin,
  // Verse controllers
  createVerse,
  updateVerse,
  deleteVerse,
  getAllVersesAdmin,
  getVerseById,
  bulkCreateVerses,
};
