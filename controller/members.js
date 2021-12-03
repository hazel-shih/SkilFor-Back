require("dotenv").config()
const bcrypt = require("bcrypt") // 做密碼雜湊需要引入
const jwt = require("jsonwebtoken") //做 jwt token 需引入
const checkAuth = require("../utils.js")
const db = require("../models")
const Teacher = db.Teacher
const Student = db.Student

const MembersController = {
  login: async (req, res) => {
    const { identity, email, password } = req.body
    let user
    //去資料庫找是否有其 email，有則回傳該使用者
    if (identity === "teacher") {
      user = await Teacher.findOne({
        where: {
          email
        }
      })
    } else if (identity === "student") {
      user = await Student.findOne({
        where: {
          email
        }
      })
    } else {
      res.json({
        success: false,
        value: identity,
        errMessage: ["無此身份"]
      })
      return
    }
    //沒有此使用者則回傳找無此使用者
    if (!user) {
      res.status(400)
      res.json({
        success: false,
        value: email,
        errMessage: ["找不到此使用者"]
      })
      return
    }

    //比對密碼
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["密碼錯誤"]
      })
      return
    }
    //登入成功回傳 token
    if (isValid) {
      const { id, username, email } = user
      return res.json({
        success: true,
        token: jwt.sign(
          {
            id,
            username,
            email,
            identity
          },
          process.env.MB_SECRETKEY
        )
      })
    }
  },

  register: async (req, res) => {
    let { password } = req.body
    const { username, identity, email, contactEmail } = req.body
    //雜湊加鹽密碼
    try {
      const hash = await bcrypt.hash(
        password,
        parseInt(process.env.PW_SALTROUNDS)
      )
      // Store hash in your password DB.
      password = hash
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        value: identity,
        errMessage: ["系統錯誤"]
      })
      return
    }

    // 新增資料到資料庫
    const avatarStudent = "https://i.imgur.com/f9bnLUM.png"
    const avatarTeahcer = "https://i.imgur.com/7AGhwxo.png"
    let user
    try {
      if (identity === "teacher") {
        user = await Teacher.create({
          username,
          password,
          email,
          avatar: avatarTeahcer,
          contactEmail
        })
      } else if (identity === "student") {
        const points = process.env.MB_INITIALPOINTS
        user = await Student.create({
          username,
          password,
          email,
          contactEmail,
          avatar: avatarStudent,
          points
        })
      } else {
        res.status(400)
        res.json({
          success: false,
          value: identity,
          errMessage: ["無此身份"]
        })
        return
      }
    } catch (err) {
      //email 是否被註冊過或其他錯誤
      const errMessage =
        err.name === "SequelizeUniqueConstraintError"
          ? "信箱已被註冊"
          : "聯絡信箱已被註冊"
      res.status(400)
      res.json({
        success: false,
        errMessage: [errMessage]
      })
      return
    }
    //註冊成功回傳 token
    return res.json({
      success: true,
      token: jwt.sign(
        {
          id: user.id,
          username,
          email,
          identity
        },
        process.env.MB_SECRETKEY
      )
    })
  },

  getInfo: async (req, res) => {
    const result = await checkAuth(req, res)
    return res.json({
      ...result
    })
  }
}

module.exports = MembersController
