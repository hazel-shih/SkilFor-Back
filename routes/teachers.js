const express = require("express")
const router = express.Router()
const TeachersController = require("../controller/teachers")
const {
  validateRegisterCourse,
  validateEditTeacherInfo,
  validateEditCourseInfo,
  validateDeleteCourse
} = require("../middlewares/validators/teachersValidator")

router.get("/info", TeachersController.getTeacherInfo)
router.put("/info", validateEditTeacherInfo, TeachersController.editTeacherInfo)
router.get("/course/info", TeachersController.getCourseInfo)
router.post(
  "/course/info",
  validateRegisterCourse,
  TeachersController.registerCourse
)
router.put(
  "/course/info",
  validateEditCourseInfo,
  TeachersController.editCourseInfo
)
router.delete(
  "/course/info",
  validateDeleteCourse,
  TeachersController.deleteCourse
)

module.exports = router
