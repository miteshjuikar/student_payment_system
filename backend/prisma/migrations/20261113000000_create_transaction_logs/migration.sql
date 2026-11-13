CREATE TABLE IF NOT EXISTS "transaction_logs" (
    "txn_id" TEXT NOT NULL,
    "txn_amount" DECIMAL(18,2) NOT NULL,
    "txn_status" TEXT NOT NULL,
    "previous_txn_id" TEXT,
    "txn_date_time" TIMESTAMPTZ(6) NOT NULL,
    "std_id" TEXT NOT NULL,
    "std_name" TEXT NOT NULL,
    "std_mobile" TEXT,
    "std_email" TEXT,
    "std_state" TEXT,
    "course_id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_type" TEXT,

    CONSTRAINT "transaction_logs_pkey" PRIMARY KEY ("txn_id")
);
