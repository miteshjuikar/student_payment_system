const pool = require("../config/postgresql");

const createTransactionLog = async ({
  txnId,
  txnAmount,
  txnStatus,
  previousTxnId,
  transactionDateTime,
  student,
  course,
}) => {
  const query = `
    INSERT INTO transaction_logs (
      txn_id,
      txn_amount,
      txn_status,
      previous_txn_id,
      txn_date_time,
      std_id,
      std_name,
      std_mobile,
      std_email,
      std_state,
      course_id,
      course_name,
      course_type
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13
    )
    RETURNING *;
  `;

  const values = [
    txnId,
    txnAmount,
    txnStatus,
    previousTxnId || null,
    transactionDateTime,
    student._id.toString(),
    student.name,
    student.mobile,
    student.email,
    student.state,
    course._id.toString(),
    course.name,
    course.type,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = {
  createTransactionLog,
};