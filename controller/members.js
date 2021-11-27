require("dotenv").config()
const bcrypt = require("bcrypt") // 做密碼雜湊需要引入
const jwt = require("jsonwebtoken") //做 jwt token 需引入
const db = require("../models")
const Teacher = db.Teacher
const Student = db.Student

const MembersController = {
  login: async (req, res) => {
    const { identity, email, password } = req.body
    //去資料庫找是否有其 email，有則回傳該使用者
    let user
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
      return res.json({
        success: true,
        token: jwt.sign(
          {
            name: user.username,
            email: email,
            userId: user.id,
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

    // 新增資料到資料庫並返回 userId
    let userId
    const avatarStudent = "https://i.imgur.com/f9bnLUM.png"
    const avatarTeahcer = "https://i.imgur.com/7AGhwxo.png"
    try {
      if (identity === "teacher") {
        const user = await Teacher.create({
          username,
          password,
          email,
          avatar: avatarTeahcer,
          contactEmail
        })
        userId = user.id
      } else if (identity === "student") {
        const points = process.env.MB_INITIALPOINTS
        const user = await Student.create({
          username,
          password,
          email,
          contactEmail,
          avatar: avatarStudent,
          points
        })
        userId = user.id
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
          name: req.body.username,
          email,
          userId,
          identity
        },
        process.env.MB_SECRETKEY
      )
    })
  },

  getInfo: async (req, res) => {
    let authHeader = req.header("Authorization") || ""
    const token = authHeader.replace("Bearer ", "")
    //比對 token
    let jwtData
    try {
      jwtData = jwt.verify(token, process.env.MB_SECRETKEY)
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["token 錯誤"]
      })
      return
    }
    // 如果沒有 token 時回傳錯誤
    if (!jwtData) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["token 錯誤"]
      })
      return
    }

    //確認 jwtData 和資料庫是否吻合
    let user
    const { email, identity } = jwtData
    if (jwtData.identity === "teacher") {
      user = await Teacher.findOne({
        where: {
          email
        }
      })
    } else if (jwtData.identity === "student") {
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

    //如果 jwtData 和資料庫不吻合則回傳無此使用者
    if (!user) {
      res.status(400)
      res.json({
        success: false,
        value: email,
        errMessage: ["找不到此使用者"]
      })
      return
    }

    //正確的 token
    return res.json({
      success: true,
      user: jwtData
    })
  }
}

module.exports = MembersController
