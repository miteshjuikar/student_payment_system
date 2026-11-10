const express = require("express");

const { createCourse, getCourses, getCourseById, } = require("../controllers/courseController");

const validateRequest = require("../middlewares/validateRequest");
const { createCourseRules, courseIdRules, } = require("../middlewares/courseValidators");

const router = express.Router();

router.post("/courses",createCourseRules,validateRequest,createCourse);
router.get("/courses", getCourses);
router.get("/courses/:id",courseIdRules,validateRequest,getCourseById);

module.exports = router;