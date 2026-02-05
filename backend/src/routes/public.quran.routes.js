const express = require("express");
const router = express.Router();
const {
  getAllSuras,
  getSuraBySuraNumber,
  getVersesBySura,
  getVerse,
} = require("../controllers/public.quran.controller");
const { validate } = require("../middleware/validate");
const {
  suraNumberParamSchema,
  verseNumberParamSchema,
} = require("../utils/validationSchemas");

/**
 * @route   GET /api/suras
 * @desc    Get all suras
 * @access  Public
 */
router.get("/", getAllSuras);

/**
 * @route   GET /api/suras/:suraNumber
 * @desc    Get single sura by sura number
 * @access  Public
 */
router.get(
  "/:suraNumber",
  validate(suraNumberParamSchema, "params"),
  getSuraBySuraNumber,
);

/**
 * @route   GET /api/suras/:suraNumber/verses
 * @desc    Get all verses of a sura
 * @access  Public
 */
router.get(
  "/:suraNumber/verses",
  validate(suraNumberParamSchema, "params"),
  getVersesBySura,
);

/**
 * @route   GET /api/suras/:suraNumber/verses/:verseNumber
 * @desc    Get single verse
 * @access  Public
 */
router.get(
  "/:suraNumber/verses/:verseNumber",
  validate(verseNumberParamSchema, "params"),
  getVerse,
);

module.exports = router;
