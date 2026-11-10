const { v4: uuidv4 } = require("uuid");

const Student = require("../models/Student");
const Course = require("../models/Course");
const TransactionLog = require("../models/TransactionLog");

const { createTransactionLog, } = require("./postgresqlTransactionService");

const createPayment = async ({ studentId, courseId }) => {
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  const txnId = uuidv4();

  const transactionDateTime = new Date();

  // Create transaction in MongoDB
  const mongoTransaction = await TransactionLog.create({
    txnId,
    studentId: student._id,
    courseId: course._id,
    amount: course.amount,
    status: "paid",
    previousTxnId: null,
    transactionDateTime,
  });

  // Create transaction log in PostgreSQL
  const postgresTransaction = await createTransactionLog({
    txnId,
    txnAmount: course.amount,
    txnStatus: "paid",
    previousTxnId: null,
    transactionDateTime,
    student,
    course,
  });

  return {
    transaction: mongoTransaction,
    postgresTransaction,
  };
};

module.exports = {
  createPayment,
};