const { body, param } = require("express-validator");

const createStudentRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("mobile")
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Mobile must contain 10–15 digits"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ max: 100 })
    .withMessage("State cannot exceed 100 characters"),
];

const studentIdRules = [
  param("id").isMongoId().withMessage("Invalid student ID"),
];

module.exports = {
  createStudentRules,
  studentIdRules,
};