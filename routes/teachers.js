const express = require("express")
const router = express.Router()
const TeachersController = require("../controller/teachers")
const {
  validateRegisterCourse,
  validateEditTeacherInfo,
  validateEditCourseInfo,
  validateDeleteCourse,
  validateAddCalendar,
  validateGetCalendarInfo,
  validateDeleteCalendar
} = require("../middlewares/validators/teachersValidator")

router.use(TeachersController.checkIsTeacher)
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

router.get(
  "/calendar",
  validateGetCalendarInfo,
  TeachersController.getCalendarInfo
)
router.post("/calendar", validateAddCalendar, TeachersController.addCalendar)
router.delete(
  "/calendar",
  validateDeleteCalendar,
  TeachersController.deleteCalendar
)

module.exports = router
