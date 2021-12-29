const express = require("express")
const router = express.Router()
const AdministratorsController = require("../controller/administrators")
const { checkIsAdministrator } = require("../middlewares/identity/identity")
const {
  validateCourseStatus
} = require("../middlewares/validators/administratorValidator")

router.use(checkIsAdministrator)
router.get("/course", AdministratorsController.getCourseStatus)
router.put(
  "/course",
  validateCourseStatus,
  AdministratorsController.editCourseStatus
)

module.exports = router
