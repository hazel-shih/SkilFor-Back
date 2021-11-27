const { body, validationResult } = require("express-validator")

exports.validateRegister = [
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("使用者名稱不得為空")
    .bail(),
  body("identity").not().isEmpty().withMessage("身份不得為空").bail(),
  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("信箱不得為空")
    .bail()
    .isEmail()
    .withMessage("信箱格式錯誤")
    .bail(),
  body("contactEmail")
    .trim()
    .not()
    .isEmpty()
    .withMessage("聯絡信箱不得為空")
    .bail()
    .isEmail()
    .withMessage("聯絡信箱格式錯誤")
    .bail(),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("密碼不得為空")
    .bail()
    .isLength({ min: 6 })
    .withMessage("密碼不得少於六位數")
    .bail()
    .isAlphanumeric()
    .withMessage("密碼格式錯誤")
    .bail(),
  body("checkPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("再次輸入密碼不得為空")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        // 驗證失敗時的錯誤訊息
        throw new Error("密碼和再次輸入密碼不相符")
      }
      return true
    })
    .bail(),
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

exports.validateLogin = [
  body("identity").not().isEmpty().withMessage("身份不得為空").bail(),
  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("信箱不得為空")
    .bail()
    .isEmail()
    .withMessage("信箱格式錯誤")
    .bail(),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("密碼不得為空")
    .bail()
    .isLength({ min: 6 })
    .withMessage("密碼不得少於六位數")
    .bail(),
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
