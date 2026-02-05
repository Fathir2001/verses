const express = require("express");
const router = express.Router();
const {
  createDua,
  updateDua,
  deleteDua,
  getAllDuasAdmin,
  getDuaById,
} = require("../controllers/dua.controller");
const { protect, isAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { mongoIdParamSchema } = require("../utils/validationSchemas");
const Joi = require("joi");

// Validation schemas for Dua
const createDuaSchema = Joi.object({
  title: Joi.string().required().trim().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  slug: Joi.string()
    .required()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .messages({
      "string.empty": "Slug is required",
      "any.required": "Slug is required",
      "string.pattern.base":
        "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  arabic: Joi.string().required().trim().messages({
    "string.empty": "Arabic text is required",
    "any.required": "Arabic text is required",
  }),
  transliteration: Joi.string().allow("").trim(),
  meaning: Joi.string().required().trim().messages({
    "string.empty": "Meaning is required",
    "any.required": "Meaning is required",
  }),
  reference: Joi.string().allow("").trim(),
  category: Joi.string().allow("").trim(),
  benefits: Joi.string().allow("").trim(),
});

const updateDuaSchema = Joi.object({
  title: Joi.string().trim(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .messages({
      "string.pattern.base":
        "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  arabic: Joi.string().trim(),
  transliteration: Joi.string().allow("").trim(),
  meaning: Joi.string().trim(),
  reference: Joi.string().allow("").trim(),
  category: Joi.string().allow("").trim(),
  benefits: Joi.string().allow("").trim(),
}).min(1);

// All routes are protected
router.use(protect, isAdmin);

/**
 * @route   GET /api/admin/duas
 * @desc    Get all duas (admin - with pagination)
 * @access  Private (Admin)
 */
router.get("/", getAllDuasAdmin);

/**
 * @route   GET /api/admin/duas/:id
 * @desc    Get dua by ID
 * @access  Private (Admin)
 */
router.get("/:id", validate(mongoIdParamSchema, "params"), getDuaById);

/**
 * @route   POST /api/admin/duas
 * @desc    Create a new dua
 * @access  Private (Admin)
 */
router.post("/", validate(createDuaSchema), createDua);

/**
 * @route   PUT /api/admin/duas/:id
 * @desc    Update a dua
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  validate(mongoIdParamSchema, "params"),
  validate(updateDuaSchema),
  updateDua,
);

/**
 * @route   DELETE /api/admin/duas/:id
 * @desc    Delete a dua
 * @access  Private (Admin)
 */
router.delete("/:id", validate(mongoIdParamSchema, "params"), deleteDua);

module.exports = router;
