const { body, validationResult } = require("express-validator")

exports.validateCourseStatus = [
  body("courseId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("courseId 不得為空")
    .bail(),
  body("changeStatus")
    .trim()
    .not()
    .isEmpty()
    .withMessage("欲改變狀態不得為空")
    .isIn(["success", "fail", "pending"])
    .withMessage("欲改變狀態需為 success, fail, pending")
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
