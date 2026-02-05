const Admin = require("../models/Admin");
const { generateToken } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * @desc    Admin login
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find admin by email
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return errorResponse(res, 401, "Invalid email or password");
  }

  // Check password
  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return errorResponse(res, 401, "Invalid email or password");
  }

  // Generate token
  const token = generateToken(admin._id);

  return successResponse(res, 200, "Login successful", {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  });
});

/**
 * @desc    Get current admin profile
 * @route   GET /api/auth/admin/me
 * @access  Private (Admin)
 */
const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-passwordHash");

  if (!admin) {
    return errorResponse(res, 404, "Admin not found");
  }

  return successResponse(res, 200, "Admin profile retrieved", {
    id: admin._id,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
  });
});

module.exports = {
  login,
  getMe,
};
