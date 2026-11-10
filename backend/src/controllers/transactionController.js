const mongoose = require("mongoose");
const TransactionLog = require("../models/TransactionLog");

const getStudentTransactions = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const transactions = await TransactionLog.find({ studentId })
      .sort({ transactionDateTime: -1 })
      .populate("courseId", "name type amount")
      .lean();

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Transaction history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch transaction history",
    });
  }
};

module.exports = { getStudentTransactions };