const db = require("../models")
const { Category, Teacher, Course } = db

const CommonController = {
  getAllCategories: async (req, res) => {
    const categories = await Category.findAll()
    const data = categories.map((category) => {
      const { id, name, displayName } = category
      return {
        id,
        name,
        displayName
      }
    })
    res.json({
      success: true,
      data
    })
    return
  },

  getCourseInfo: async (req, res) => {
    const { id } = req.params
    let course
    try {
      course = await Course.findOne({
        where: {
          id
        },
        include: [
          {
            model: Category
          },
          {
            model: Teacher
          }
        ]
      })
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    if (!course) {
      res.status(400)
      res.json({
        success: false,
        value: id,
        errMessage: ["找不到此課程"]
      })
      return
    }
    const { name, description, price, audit, published } = course
    if (audit !== "success" || !published) {
      res.status(400)
      res.json({
        success: false,
        value: id,
        errMessage: ["此課程尚未發布"]
      })
      return
    }
    const category = course.Category.displayName
    const { username, avatar } = course.Teacher
    const data = {
      username,
      avatar,
      category,
      courseName: name,
      courseDescription: description,
      price
    }
    res.json({
      success: true,
      data
    })
    return
  }
}

module.exports = CommonController
