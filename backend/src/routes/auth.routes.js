const express = require("express");
const router = express.Router();
const { login, getMe } = require("../controllers/auth.controller");
const { protect, isAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { loginSchema } = require("../utils/validationSchemas");

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post("/admin/login", validate(loginSchema), login);

/**
 * @route   GET /api/auth/admin/me
 * @desc    Get current admin profile
 * @access  Private (Admin)
 */
router.get("/admin/me", protect, isAdmin, getMe);

module.exports = router;
