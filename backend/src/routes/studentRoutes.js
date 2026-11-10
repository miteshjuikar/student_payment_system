const express = require("express");

const { createStudent, getStudents, getStudentById, } = require("../controllers/studentController");

const validateRequest = require("../middlewares/validateRequest");
const { createStudentRules, studentIdRules, } = require("../middlewares/studentValidators");

const router = express.Router();

router.post("/students",createStudentRules,validateRequest,createStudent);
router.get("/students", getStudents);
router.get("/students/:id",studentIdRules,validateRequest,getStudentById);

module.exports = router;