const { errorResponse } = require("../utils/apiResponse");

/**
 * Validation middleware factory using Zod
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return errorResponse(res, 400, "Validation failed", errors);
      }

      // Replace request data with parsed (and transformed) data
      req[source] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate multiple sources
 * @param {Object} schemas - Object with keys 'body', 'query', 'params' and Zod schemas as values
 */
const validateMultiple = (schemas) => {
  return (req, res, next) => {
    try {
      const errors = [];

      for (const [source, schema] of Object.entries(schemas)) {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
          result.error.errors.forEach((err) => {
            errors.push({
              source,
              field: err.path.join("."),
              message: err.message,
            });
          });
        } else {
          req[source] = result.data;
        }
      }

      if (errors.length > 0) {
        return errorResponse(res, 400, "Validation failed", errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { validate, validateMultiple };
