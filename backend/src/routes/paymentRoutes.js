const express = require("express");
const { makePayment } = require("../controllers/paymentController");

const validateRequest = require("../middlewares/validateRequest");
const { createPaymentRules, } = require("../middlewares/paymentValidators");

const router = express.Router();

router.post( "/payment", createPaymentRules, validateRequest, makePayment );

module.exports = router;