const express = require("express")
const router = express.Router()
const TeachersController = require("../controller/teachers")
const CalendarsController = require("../controller/calendars")
const {
  validateRegisterCourse,
  validateEditCourseInfo,
  validateDeleteCourse
} = require("../middlewares/validators/teachersValidator")

const {
  validateAddCalendar,
  validateGetCalendarInfo,
  validateDeleteCalendar
} = require("../middlewares/validators/calendarsValidator")
const { checkIsTeacher } = require("../middlewares/identity/identity")

router.use(checkIsTeacher)
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
  CalendarsController.getCalendarInfo
)
router.post("/calendar", validateAddCalendar, CalendarsController.addCalendar)
router.delete(
  "/calendar",
  validateDeleteCalendar,
  CalendarsController.deleteCalendar
)

module.exports = router
