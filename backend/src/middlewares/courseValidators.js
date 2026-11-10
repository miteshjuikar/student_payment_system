const { body, param } = require("express-validator");

const createCourseRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Course name is required")
    .isLength({ max: 150 })
    .withMessage("Course name cannot exceed 150 characters"),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Course type is required")
    .isLength({ max: 100 })
    .withMessage("Course type cannot exceed 100 characters"),

  body("amount")
    .exists()
    .withMessage("Amount is required")
    .bail()
    .isFloat({ min: 0, max: 9999999999.99 })
    .withMessage("Amount must be a valid non-negative number")
    .custom((value) => {
      if (Math.round(Number(value) * 100) !== Number(value) * 100) {
        throw new Error("Amount can have at most two decimal places");
      }

      return true;
    }),
];

const courseIdRules = [
  param("id").isMongoId().withMessage("Invalid course ID"),
];

module.exports = {
  createCourseRules,
  courseIdRules,
};