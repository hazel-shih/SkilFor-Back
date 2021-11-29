const express = require("express")
const router = express.Router()
const Teachers = require("../controller/teachers")

router.get("/:requestEmail/info", Teachers.getTeacherInfo)
router.get("/:requestEmail/course/info", Teachers.getCourseInfo)

module.exports = router
