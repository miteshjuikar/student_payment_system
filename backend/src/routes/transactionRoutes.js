const express = require("express");
const { getStudentTransactions, } = require("../controllers/transactionController");

const validateRequest = require("../middlewares/validateRequest");
const { transactionHistoryRules, } = require("../middlewares/paymentValidators");

const router = express.Router();

router.get( "/transactions/:studentId", transactionHistoryRules, validateRequest, getStudentTransactions );

module.exports = router;