const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const refundRoutes = require("./routes/refundRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Student Payment System API is running", });
});

app.use("/api", studentRoutes);
app.use("/api", courseRoutes);
app.use("/api", paymentRoutes);
app.use("/api", refundRoutes);
app.use("/api", transactionRoutes);

app.use(errorHandler);

module.exports = app;