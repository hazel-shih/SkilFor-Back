const db = require("../models")
const { Teacher, Course, Category } = db

const TeachersController = {
  getTeacherInfo: async (req, res) => {
    const { requestEmail } = req.params
    const teacherInfo = await Teacher.findOne({
      where: {
        email: requestEmail
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
    if (!teacherInfo) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["找不到此使用者"]
      })
      return
    }
    const { id, avatar, email, contactEmail, Courses } = teacherInfo
    const name = teacherInfo.username
    const categories = Courses.map((course) => course.Category.name)
    res.json({
      success: true,
      data: {
        id,
        name,
        avatar,
        email,
        contactEmail,
        categories
      }
    })
    return
  },

  getCourseInfo: async (req, res) => {
    const { requestEmail } = req.params
    const courseInfo = await Teacher.findOne({
      where: {
        email: requestEmail
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
    if (!courseInfo) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["找不到此使用者"]
      })
      return
    }
    const { Courses } = courseInfo
    const data = Courses.map((course) => {
      const { id, name, description, fee, show, qualify } = course
      const category = course.Category.name
      return {
        id,
        category,
        courseName: name,
        courseIntro: description,
        price: fee,
        isPass: qualify,
        published: show
      }
    })
    res.json({
      success: true,
      data
    })
    return
  }
}

module.exports = TeachersController