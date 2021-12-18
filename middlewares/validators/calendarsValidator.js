const { body, query, validationResult } = require("express-validator")

exports.validateAddCalendar = [
  body("courseId").not().isEmpty().withMessage("課程編號不得為空").bail(),
  body("id").not().isEmpty().withMessage("行程編號不得為空").bail(),
  body("start").not().isEmpty().withMessage("行程起始時間不得為空").bail(),
  body("end").not().isEmpty().withMessage("行程結束時間不得為空").bail(),
  body("resource.eventColor")
    .not()
    .isEmpty()
    .withMessage("行程顏色不得為空")
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

exports.validateGetCalendarInfo = [
  query("month").not().isEmpty().withMessage("請帶上請求的月份").bail(),
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

exports.validateDeleteCalendar = [
  body("scheduleId").not().isEmpty().withMessage("scheduleId 不得為空").bail(),
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
