const db = require("../models")
const { Teacher, Student, Course, Category, Administrator } = db

const UsersController = {
  getUserInfo: async (req, res) => {
    const { jwtId, identity } = req
    let userInfo
    if (identity === "teacher") {
      try {
        userInfo = await Teacher.findOne({
          where: {
            id: jwtId
          },
          include: [
            {
              model: Course,
              include: [
                {
                  model: Category
                }
              ]
            }
          ]
        })
        const { avatar, username, email, contactEmail, Courses } = userInfo
        const categories = Courses.map((course) => course.Category.displayName)
        res.json({
          success: true,
          data: {
            id: jwtId,
            username,
            avatar,
            email,
            contactEmail,
            categories
          }
        })
        return
      } catch (err) {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["系統錯誤"]
        })
        return
      }
    } else if (identity === "administrator") {
      try {
        userInfo = await Administrator.findOne({
          where: {
            id: jwtId
          }
        })
        const { username, email, contactEmail } = userInfo
        res.json({
          success: true,
          data: {
            id: jwtId,
            username,
            email,
            contactEmail
          }
        })
        return
      } catch (err) {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["系統錯誤"]
        })
        return
      }
    } else {
      try {
        userInfo = await Student.findOne({
          where: {
            id: jwtId
          }
        })
        const { avatar, username, email, contactEmail, points } = userInfo
        res.json({
          success: true,
          data: {
            id: jwtId,
            username,
            avatar,
            email,
            contactEmail,
            points
          }
        })
        return
      } catch (err) {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["系統錯誤"]
        })
        return
      }
    }
  },

  editUserInfo: async (req, res) => {
    const editInfo = async (username, avatar, contactEmail, isTeacher) => {
      const table = isTeacher ? Teacher : Student
      try {
        await table.update(
          {
            username,
            avatar,
            contactEmail
          },
          {
            where: {
              id: jwtId
            }
          }
        )
        const { email } = await table.findOne({
          where: { id: jwtId }
        })
        return res.json({
          success: true,
          data: {
            id: jwtId,
            username,
            avatar,
            email,
            contactEmail
          }
        })
      } catch (err) {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["系統錯誤"]
        })
        return
      }
    }
    const { jwtId, identity } = req
    const { username, avatar, contactEmail } = req.body
    if (identity === "teacher") {
      editInfo(username, avatar, contactEmail, true)
    } else {
      editInfo(username, avatar, contactEmail, false)
    }
  }
}

module.exports = UsersController
