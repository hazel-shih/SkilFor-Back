<<<<<<< HEAD
const { check, validationResult } = require("express-validator")

exports.validateRegister = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("username is required")
    .bail(),
  check("identity").not().isEmpty().withMessage("identity is required").bail(),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email format is wrong")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password length cannot be less then 6")
    .bail(),
  check("checkPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("checkPassword is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        // 驗證失敗時的錯誤訊息
        throw new Error("password is not same as checkPassword")
      }
      return true
    })
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ errMessage: errors.array() })
    next()
  }
]

exports.validateLogin = [
  check("identity").not().isEmpty().withMessage("identity is required").bail(),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email format is wrong")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password length cannot be less then 6")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) res.status(422)
    res.json({
      success: false,
      errMessage: errors.array()
    })
    next()
  }
]
=======
const {check, validationResult} = require('express-validator');

exports.validateRegister = [
    check('username')
        .trim()
        .not()
        .isEmpty()
        .withMessage('username is required')
        .bail(),
    check('identity')
        .not()
        .isEmpty()
        .withMessage('identity is required')
        .bail(),
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('email is required')
        .bail()
        .isEmail()
        .withMessage('email format is wrong')
        .bail(),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('password length cannot be less then 6')
        .bail()
        .isAlphanumeric()
        .withMessage('password format is wrong')
        .bail(),
    check('checkPassword')
        .trim()
        .not()
        .isEmpty()
        .withMessage('checkPassword is required')
        .bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                // 驗證失敗時的錯誤訊息
                throw new Error('password is not same as checkPassword')
            }
            return true
        })
        .bail(),
    (req, res, next) => {
        var errors = validationResult(req);
        var errorsMsg = []
        errors.errors.filter(function(item){
            errorsMsg.push(item.msg);
        })
    
        if (!errors.isEmpty()) {
            res.status(422)
            res.json({   
                success: false,
                errMessage:errorsMsg
            })
            return
        }
        next();
    },
]


exports.validateLogin = [
    check('identity')
        .not()
        .isEmpty()
        .withMessage('identity is required')
        .bail(),
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('email is required')
        .bail()
        .isEmail()
        .withMessage('email format is wrong')
        .bail(),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('password length cannot be less then 6')
        .bail(),
    (req, res, next) => {
        var errors = validationResult(req);
        var errorsMsg = []
        errors.errors.filter(function(item){
            errorsMsg.push(item.msg)
        })
        if (!errors.isEmpty()) {
            res.status(422)
            res.json({   
                success: false,
                errMessage:errorsMsg
            })
            return
        }
        next();
    },
]
>>>>>>> week2-memberAPI
