const express = require("express")
const router = express.Router()
const Filter = require("../controller/filter")

router.get("/category", Filter.courseCategory)
router.get("/course", Filter.allCourse)
router.get("/course/:specific", Filter.specificCourse)

module.exports = router
