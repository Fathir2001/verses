const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/admin.quran.controller");
const { protect, isAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  createSuraSchema,
  updateSuraSchema,
  createVerseSchema,
  updateVerseSchema,
  mongoIdParamSchema,
} = require("../utils/validationSchemas");

// All routes are protected
router.use(protect, isAdmin);

// ============ SURA ROUTES ============

/**
 * @route   GET /api/admin/suras
 * @desc    Get all suras (admin - with pagination)
 * @access  Private (Admin)
 */
router.get("/suras", getAllSurasAdmin);

/**
 * @route   POST /api/admin/suras
 * @desc    Create a new sura
 * @access  Private (Admin)
 */
router.post("/suras", validate(createSuraSchema), createSura);

/**
 * @route   PUT /api/admin/suras/:id
 * @desc    Update a sura
 * @access  Private (Admin)
 */
router.put(
  "/suras/:id",
  validate(mongoIdParamSchema, "params"),
  validate(updateSuraSchema),
  updateSura,
);

/**
 * @route   DELETE /api/admin/suras/:id
 * @desc    Delete a sura and its verses
 * @access  Private (Admin)
 */
router.delete("/suras/:id", validate(mongoIdParamSchema, "params"), deleteSura);

// ============ VERSE ROUTES ============

/**
 * @route   GET /api/admin/verses
 * @desc    Get all verses (admin - with pagination)
 * @access  Private (Admin)
 */
router.get("/verses", getAllVersesAdmin);

/**
 * @route   GET /api/admin/verses/:id
 * @desc    Get verse by ID
 * @access  Private (Admin)
 */
router.get("/verses/:id", validate(mongoIdParamSchema, "params"), getVerseById);

/**
 * @route   POST /api/admin/verses
 * @desc    Create a new verse
 * @access  Private (Admin)
 */
router.post("/verses", validate(createVerseSchema), createVerse);

/**
 * @route   POST /api/admin/verses/bulk
 * @desc    Bulk create verses
 * @access  Private (Admin)
 */
router.post("/verses/bulk", bulkCreateVerses);

/**
 * @route   PUT /api/admin/verses/:id
 * @desc    Update a verse
 * @access  Private (Admin)
 */
router.put(
  "/verses/:id",
  validate(mongoIdParamSchema, "params"),
  validate(updateVerseSchema),
  updateVerse,
);

/**
 * @route   DELETE /api/admin/verses/:id
 * @desc    Delete a verse
 * @access  Private (Admin)
 */
router.delete(
  "/verses/:id",
  validate(mongoIdParamSchema, "params"),
  deleteVerse,
);

module.exports = router;
