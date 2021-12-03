const { body, validationResult } = require("express-validator")

exports.validateEditTeacherInfo = [
  body("username").trim().not().isEmpty().withMessage("暱稱不得為空").bail(),
  body("contactEmail").not().isEmpty().withMessage("聯絡信箱不得為空").bail(),
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

exports.validateRegisterCourse = [
  body("category")
    .trim()
    .not()
    .isEmpty()
    .withMessage("課程種類不得為空")
    .bail(),
  body("courseName").not().isEmpty().withMessage("課程名稱不得為空").bail(),
  body("courseDescription")
    .trim()
    .not()
    .isEmpty()
    .withMessage("課程介紹不得為空")
    .bail(),
  body("price").trim().not().isEmpty().withMessage("課程價格不得為空").bail(),
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

exports.validateEditCourseInfo = [
  body("id").trim().not().isEmpty().withMessage("課程編號不得為空").bail(),
  body("courseName").not().isEmpty().withMessage("課程名稱不得為空").bail(),
  body("courseDescription")
    .not()
    .isEmpty()
    .withMessage("課程介紹不得為空")
    .bail(),
  body("price").not().isEmpty().withMessage("課程價格不得為空").bail(),
  body("published").not().isEmpty().withMessage("是否發布不得為空").bail(),
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

exports.validateDeleteCourse = [
  body("id").trim().not().isEmpty().withMessage("課程編號不得為空").bail(),
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
