const db = require("../models")
const { Category, Course, Teacher } = db

const FilterController = {
  courseCategory: async (req, res) => {
    const categoryResult = await Category.findAll()
    if (!categoryResult) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["目前無結果"]
      })
      return
    }

    const allCategory = categoryResult.map((item) => {
      return item.name
    })

    res.json({
      success: true,
      data: allCategory
    })
    return
  },

  allCourse: async (req, res) => {
    const allCourseResult = await Course.findAll({
      where: {
        published: true,
        audit: "success"
      },
      include: [
        {
          model: Teacher
        }
      ]
    })
    if (!allCourseResult) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["目前無結果"]
      })
      return
    }

    const allCourse = allCourseResult.map((item) => {
      return {
        courseName: item.name,
        courseDescription: item.description,
        price: item.price,
        teacherName: item.Teacher.username,
        teacherAvatar: item.Teacher.avatar
      }
    })

    res.json({
      success: true,
      data: allCourse
    })
    return
  },

  specificCourse: async (req, res) => {
    const { specific } = req.params
    const specificCourseResult = await Course.findAll({
      where: {
        published: true,
        audit: "success"
      },
      include: [
        {
          model: Teacher
        },
        {
          model: Category,
          where: {
            name: specific
          }
        }
      ]
    })
    if (!specificCourseResult) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["目前無結果"]
      })
      return
    }

    const specificCourse = specificCourseResult.map((item) => {
      return {
        courseName: item.name,
        courseDescription: item.description,
        price: item.price,
        teacherName: item.Teacher.username,
        teacherAvatar: item.Teacher.avatar
      }
    })

    res.json({
      success: true,
      data: specificCourse
    })
    return
  }
}

module.exports = FilterController
