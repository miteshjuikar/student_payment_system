const prisma = require("../config/postgresql");

const createTransactionLog = async ({
  txnId,
  txnAmount,
  txnStatus,
  previousTxnId,
  transactionDateTime,
  student,
  course,
}) => {
  return prisma.transactionLog.create({
    data: {
      txn_id: txnId,
      txn_amount: String(txnAmount),
      txn_status: txnStatus,
      previous_txn_id: previousTxnId || null,
      txn_date_time: transactionDateTime,
      std_id: student._id.toString(),
      std_name: student.name,
      std_mobile: student.mobile,
      std_email: student.email,
      std_state: student.state,
      course_id: course._id.toString(),
      course_name: course.name,
      course_type: course.type,
    },
  });
};

module.exports = {
  createTransactionLog,
};