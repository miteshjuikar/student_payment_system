const { body, param } = require("express-validator");

const createPaymentRules = [
  body("studentId")
    .isMongoId()
    .withMessage("Valid studentId is required"),

  body("courseId")
    .isMongoId()
    .withMessage("Valid courseId is required"),
];

const refundRules = [
  body("txnId")
    .isString()
    .withMessage("txnId must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("txnId is required")
    .isLength({ max: 100 })
    .withMessage("txnId is too long"),
];

const transactionHistoryRules = [
  param("studentId")
    .isMongoId()
    .withMessage("Invalid student ID"),
];

module.exports = {
  createPaymentRules,
  refundRules,
  transactionHistoryRules,
};