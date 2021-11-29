const express = require("express")
const router = express.Router()
const Teachers = require("../controller/teachers")

router.get("/:username/info", Teachers.getTeacherInfo)
router.get("/:username/course/info", Teachers.getCourseInfo)

module.exports = router
