const express = require("express")
const router = express.Router()
const PointController = require("../controller/point")
const { checkIsStudent } = require("../middlewares/identity/identity")

const {
  validateBuyPoint
} = require("../middlewares/validators/pointsValidator")

router.use(checkIsStudent)
router.post("/", validateBuyPoint, PointController.buyPoint)

module.exports = router
