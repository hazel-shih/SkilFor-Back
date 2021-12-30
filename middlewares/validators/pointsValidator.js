const { body, validationResult } = require("express-validator")

exports.validateBuyPoint = [
  body("ItemName").not().isEmpty().withMessage("商品名稱不可為空").bail(),
  body("TotalAmount").not().isEmpty().withMessage("購買價格不可為空").bail(),
  body("TotalPoint").not().isEmpty().withMessage("購買點數數量不可為空").bail(),
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
