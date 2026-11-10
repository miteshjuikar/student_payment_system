const express = require("express");
const { refundPayment } = require("../controllers/refundController");

const validateRequest = require("../middlewares/validateRequest");
const { refundRules, } = require("../middlewares/paymentValidators");

const router = express.Router();

router.post( "/refund", refundRules, validateRequest, refundPayment );

module.exports = router;