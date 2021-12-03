require("dotenv").config()
const jwt = require("jsonwebtoken") //做 jwt token 需引入
const { Teacher, Student } = require("./models")

const checkAuth = async (req) => {
  let authHeader = req.header("Authorization") || ""
  const token = authHeader.replace("Bearer ", "")
  //比對 token
  let jwtData
  try {
    jwtData = jwt.verify(token, process.env.MB_SECRETKEY)
  } catch (err) {
    return {
      success: false,
      errorMessage: "token 錯誤"
    }
  }
  // 如果沒有 token 時回傳錯誤
  if (!jwtData) {
    return {
      success: false,
      errorMessage: "token 錯誤"
    }
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
    return {
      success: false,
      value: identity,
      errorMessage: "無此身分"
    }
  }

  //如果 jwtData 和資料庫不吻合則回傳無此使用者
  if (!user) {
    return {
      success: false,
      value: email,
      errorMessage: "找不到此使用者"
    }
  }
  req.jwtId = jwtData.id
  return {
    success: true,
    user: jwtData
  }
}

module.exports = checkAuth
