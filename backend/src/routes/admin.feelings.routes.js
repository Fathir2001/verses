const express = require("express");
const router = express.Router();
const {
  createFeeling,
  updateFeeling,
  deleteFeeling,
  getAllFeelingsAdmin,
  getFeelingById,
} = require("../controllers/admin.feelings.controller");
const { protect, isAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  createFeelingSchema,
  updateFeelingSchema,
  mongoIdParamSchema,
} = require("../utils/validationSchemas");

// All routes are protected
router.use(protect, isAdmin);

/**
 * @route   GET /api/admin/feelings
 * @desc    Get all feelings (admin - with pagination)
 * @access  Private (Admin)
 */
router.get("/", getAllFeelingsAdmin);

/**
 * @route   GET /api/admin/feelings/:id
 * @desc    Get single feeling by ID
 * @access  Private (Admin)
 */
router.get("/:id", validate(mongoIdParamSchema, "params"), getFeelingById);

/**
 * @route   POST /api/admin/feelings
 * @desc    Create a new feeling
 * @access  Private (Admin)
 */
router.post("/", validate(createFeelingSchema), createFeeling);

/**
 * @route   PUT /api/admin/feelings/:id
 * @desc    Update a feeling
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  validate(mongoIdParamSchema, "params"),
  validate(updateFeelingSchema),
  updateFeeling,
);

/**
 * @route   DELETE /api/admin/feelings/:id
 * @desc    Delete a feeling
 * @access  Private (Admin)
 */
router.delete("/:id", validate(mongoIdParamSchema, "params"), deleteFeeling);

module.exports = router;
