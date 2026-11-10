const { v4: uuidv4 } = require("uuid");

const TransactionLog = require("../models/TransactionLog");
const Student = require("../models/Student");
const Course = require("../models/Course");

const {
  createTransactionLog,
} = require("./postgresqlTransactionService");

const createRefund = async (originalTxnId) => {
  // 1. Find original transaction
  const originalTxn = await TransactionLog.findOne({
    txnId: originalTxnId,
  });

  if (!originalTxn) {
    throw new Error("Original transaction not found");
  }

  // 2. Only paid transactions can be refunded
  if (originalTxn.status !== "paid") {
    throw new Error("Only paid transactions can be refunded");
  }

  // 3. Prevent a second refund
  const existingRefund = await TransactionLog.findOne({
    previousTxnId: originalTxnId,
    status: "refund",
  });

  if (existingRefund) {
    throw new Error("This transaction has already been refunded");
  }

  // 4. Load student and course details
  const student = await Student.findById(originalTxn.studentId);
  const course = await Course.findById(originalTxn.courseId);

  if (!student || !course) {
    throw new Error("Student or course details not found");
  }

  const refundTxnId = uuidv4();
  const transactionDateTime = new Date();

  // 5. Create refund record in MongoDB
  const refundTxn = await TransactionLog.create({
    txnId: refundTxnId,
    studentId: originalTxn.studentId,
    courseId: originalTxn.courseId,
    amount: originalTxn.amount,
    status: "refund",
    previousTxnId: originalTxn.txnId,
    transactionDateTime,
  });

  try {
    // 6. Write corresponding audit record to PostgreSQL
    const postgresTransaction = await createTransactionLog({
      txnId: refundTxnId,
      txnAmount: originalTxn.amount,
      txnStatus: "refund",
      previousTxnId: originalTxn.txnId,
      transactionDateTime,
      student,
      course,
    });

    return {
      refund: refundTxn,
      postgresTransaction,
    };
  } catch (error) {
    // Best-effort cleanup if PostgreSQL insert fails.
    // If cleanup also fails, reconciliation will be required.
    try {
      await TransactionLog.deleteOne({ _id: refundTxn._id });
    } catch (cleanupError) {
      console.error("Refund cleanup failed:", cleanupError.message);
    }

    throw error;
  }
};

module.exports = { createRefund };