const express = require("express")
const router = express.Router()
const CalendarsController = require("../controller/calendars")
const {
  validateGetCalendarInfo,
  validateDeleteCalendar
} = require("../middlewares/validators/calendarsValidator")
const { checkIsStudent } = require("../middlewares/identity/identity")

router.use(checkIsStudent)
router.get(
  "/calendar",
  validateGetCalendarInfo,
  CalendarsController.getCalendarInfo
)
router.put(
  "/calendar",
  validateDeleteCalendar,
  CalendarsController.cancelCalendar
)
router.delete(
  "/calendar",
  validateDeleteCalendar,
  CalendarsController.removeCalendar
)

module.exports = router
