const express = require("express")
const router = express.Router()
const UsersController = require("../controller/users")
const {
  validateEditUserInfo
} = require("../middlewares/validators/usersValidator")

router.get("/info", UsersController.getUserInfo)
router.put("/info", validateEditUserInfo, UsersController.editUserInfo)

module.exports = router
