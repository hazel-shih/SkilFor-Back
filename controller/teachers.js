const db = require("../models")
const { Teacher, Course, Category } = db
const TeachersController = {
  checkIsTeacher: async (req, res, next) => {
    const { identity } = req
    if (identity !== "teacher") {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["你不是老師"]
      })
      return
    }
    next()
  },
  getTeacherInfo: async (req, res) => {
    const { jwtId } = req
    let teacherInfo
    try {
      teacherInfo = await Teacher.findOne({
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
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    const { avatar, username, email, contactEmail, Courses } = teacherInfo
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
  },

  editTeacherInfo: async (req, res) => {
    const { jwtId } = req
    try {
      const { username, avatar, contactEmail } = req.body
      await Teacher.update(
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
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    const { avatar, username, email, contactEmail } = await Teacher.findOne({
      where: { id: jwtId }
    })
    res.json({
      success: true,
      data: {
        id: jwtId,
        username,
        avatar,
        email,
        contactEmail
      }
    })
    return
  },

  getCourseInfo: async (req, res) => {
    const { jwtId } = req
    let courses
    try {
      courses = await Course.findAll({
        where: {
          teacherId: jwtId,
          ...(req.query.audit === "success" && { audit: "success" })
        },
        include: Category
      })
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    const data = courses.map((course) => {
      const { id, name, description, price, published, audit } = course
      const category = course.Category.displayName
      return {
        id,
        category,
        courseName: name,
        courseDescription: description,
        price,
        published,
        audit
      }
    })
    res.json({
      success: true,
      data
    })
    return
  },

  registerCourse: async (req, res) => {
    const { jwtId } = req
    let newCourse
    try {
      const { category, courseName, courseDescription, price } = req.body
      // 找 category
      const targetCategory = await Category.findOne({
        where: {
          name: category
        }
      })
      if (!targetCategory) {
        res.status(400)
        res.json({
          success: false,
          value: category,
          errMessage: ["此種類課程尚未開放註冊"]
        })
        return
      }
      // 檢查課程是否已經註冊過
      const checkDoubleRegister = await Course.findOne({
        where: {
          teacherId: jwtId,
          categoryId: targetCategory.id
        }
      })
      if (checkDoubleRegister) {
        res.status(400)
        res.json({
          success: false,
          value: category,
          errMessage: ["不得重複註冊課程"]
        })
        return
      }
      newCourse = await Course.create({
        teacherId: jwtId,
        categoryId: targetCategory.id,
        name: courseName,
        description: courseDescription,
        price,
        published: 0,
        audit: "pending"
      })
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    const { id, name, description, price } = newCourse
    res.json({
      success: true,
      data: {
        id,
        category: req.body.category,
        courseName: name,
        courseDescription: description,
        price,
        published: false,
        audit: "pending"
      }
    })
    return
  },

  editCourseInfo: async (req, res) => {
    const { jwtId } = req
    const { id, courseName, courseDescription, price } = req.body
    let { published } = req.body
    let targetCourse
    try {
      targetCourse = await Course.findOne({
        where: {
          id,
          teacherId: jwtId
        }
      })
      if (!targetCourse) {
        res.status(400)
        res.json({
          success: false,
          value: id,
          errMessage: ["找不到此課程"]
        })
        return
      }
      let { audit } = targetCourse
      if (audit !== "success") {
        audit = "pending"
        published = 0
      }
      await Course.update(
        {
          name: courseName,
          description: courseDescription,
          price,
          published,
          audit
        },
        {
          where: {
            id,
            teacherId: jwtId
          }
        }
      )
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    res.json({
      success: true,
      data: {
        id,
        courseName,
        courseDescription,
        price,
        published: Boolean(published),
        audit: targetCourse.audit
      }
    })
    return
  },

  deleteCourse: async (req, res) => {
    const { jwtId } = req
    const { id } = req.body
    try {
      const result = await Course.destroy({
        where: {
          id,
          teacherId: jwtId
        }
      })
      if (!result) {
        res.status(400)
        res.json({
          success: false,
          value: id,
          errMessage: ["找不到此課程"]
        })
        return
      }
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    res.json({
      success: true
    })
    return
  }
}

module.exports = TeachersController
