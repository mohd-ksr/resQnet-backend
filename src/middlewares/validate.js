/**
 * src/middlewares/validate.js
 * Middleware to validate request body/query/params using Joi schemas.
 */
const Joi = require("joi");
const ApiError = require("../utils/errors");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new ApiError(400, `Validation Error: ${details.join(", ")}`));
    }
    next();
  };
};

module.exports = validate;
