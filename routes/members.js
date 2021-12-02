const express = require("express")
const router = express.Router()
const MembersController = require("../controller/members")

const {
  validateRegister,
  validateLogin
} = require("../middlewares/validators/membersValidator")

router.post("/login", validateLogin, MembersController.login)
router.post("/register", validateRegister, MembersController.register)
router.get("/me", MembersController.getInfo)

module.exports = router
