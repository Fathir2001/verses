const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { env } = require("../config/env");
const { errorResponse } = require("../utils/apiResponse");

/**
 * Middleware to protect routes - verifies JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, 401, "Access denied. No token provided.");
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Get admin from token
      const admin = await Admin.findById(decoded.id).select("-passwordHash");

      if (!admin) {
        return errorResponse(res, 401, "Admin not found. Token is invalid.");
      }

      // Attach admin to request object
      req.admin = admin;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return errorResponse(
          res,
          401,
          "Token has expired. Please login again.",
        );
      }
      if (error.name === "JsonWebTokenError") {
        return errorResponse(res, 401, "Invalid token. Please login again.");
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
    return next();
  }
  return errorResponse(res, 403, "Access denied. Admin privileges required.");
};

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

module.exports = { protect, isAdmin, generateToken };
