const db = require("../models")
const { Category, Course, Teacher } = db

const FilterController = {
  allCourse: async (req, res) => {
    let allCourse
    try {
      allCourse = await Course.findAll({
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
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    if (allCourse.length === 0) {
      res.json({
        success: true,
        data: ["目前尚未有課程"]
      })
      return
    }

    const allCourseResult = allCourse.map((item) => {
      return {
        courseName: item.name,
        courseDescription: item.description,
        courseId: item.id,
        price: item.price,
        teacherName: item.Teacher.username,
        teacherAvatar: item.Teacher.avatar,
        teacherId: item.Teacher.id
      }
    })

    res.json({
      success: true,
      data: allCourseResult
    })
    return
  },

  specificCourse: async (req, res) => {
    const { specific } = req.params
    let specificCourse
    try {
      specificCourse = await Course.findAll({
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
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    if (specificCourse.length === 0) {
      res.json({
        success: true,
        data: ["目前尚未有課程"]
      })
      return
    }

    const specificCourseResult = specificCourse.map((item) => {
      return {
        courseName: item.name,
        courseDescription: item.description,
        courseId: item.id,
        price: item.price,
        teacherName: item.Teacher.username,
        teacherAvatar: item.Teacher.avatar,
        teacherId: item.Teacher.id
      }
    })

    res.json({
      success: true,
      data: specificCourseResult
    })
    return
  }
}

module.exports = FilterController
