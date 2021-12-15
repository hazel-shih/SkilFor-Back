const { body, validationResult } = require("express-validator")

exports.validateEditUserInfo = [
  body("username").trim().not().isEmpty().withMessage("暱稱不得為空").bail(),
  body("contactEmail").not().isEmpty().withMessage("聯絡信箱不得為空").bail(),
  body("avatar").not().isEmpty().withMessage("大頭貼位址不得為空").bail(),
  (req, res, next) => {
    var errors = validationResult(req)
    var errorsMsg = []
    errors.errors.filter(function (item) {
      errorsMsg.push(item.msg)
    })

    if (!errors.isEmpty()) {
      res.status(422)
      res.json({
        success: false,
        errMessage: errorsMsg
      })
      return
    }
    next()
  }
]
