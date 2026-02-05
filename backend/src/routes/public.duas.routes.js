const express = require("express");
const router = express.Router();
const {
  getAllDuasPublic,
  getDuaBySlug,
} = require("../controllers/dua.controller");

/**
 * @route   GET /api/duas
 * @desc    Get all duas (public)
 * @access  Public
 */
router.get("/", getAllDuasPublic);

/**
 * @route   GET /api/duas/:slug
 * @desc    Get dua by slug
 * @access  Public
 */
router.get("/:slug", getDuaBySlug);

module.exports = router;
