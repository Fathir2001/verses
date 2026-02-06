const express = require("express");
const router = express.Router();
const {
  getAllFeelings,
  getFeelingBySlug,
} = require("../controllers/public.feelings.controller");
const { validate } = require("../middleware/validate");
const { slugParamSchema } = require("../utils/validationSchemas");

/**
 * @route   GET /api/feelings
 * @desc    Get all feelings (public - same format as feelings.json)
 * @access  Public
 */
router.get("/", getAllFeelings);

/**
 * @route   GET /api/feelings/:slug
 * @desc    Get single feeling by slug
 * @access  Public
 */
router.get("/:slug", validate(slugParamSchema, "params"), getFeelingBySlug);

module.exports = router;
