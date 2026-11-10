const { createRefund } = require("../services/refundService");

const refundPayment = async (req, res) => {
  try {
    const { txnId } = req.body;

    if (!txnId || typeof txnId !== "string") {
      return res.status(400).json({
        success: false,
        message: "txnId is required",
      });
    }

    const result = await createRefund(txnId);

    return res.status(201).json({
      success: true,
      message: "Refund record created successfully",
      data: result,
    });
  } catch (error) {
    const clientErrors = [
      "Original transaction not found",
      "Only paid transactions can be refunded",
      "This transaction has already been refunded",
      "Student or course details not found",
    ];

    const statusCode = clientErrors.includes(error.message) ? 400 : 500;

    console.error("Refund error:", error.message);

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Unable to complete refund record creation"
          : error.message,
    });
  }
};

module.exports = { refundPayment };