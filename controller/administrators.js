const db = require("../models")
const { Course, Category } = db
const AdministratorsController = {
  getCourseStatus: async (req, res) => {
    const { audit } = req.query
    let courses
    try {
      courses = await Course.findAll({
        where: {
          ...(audit && { audit: audit })
        },
        include: Category,
        order: [["updatedAt", "DESC"]]
      })
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
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
  },

  editCourseStatus: async (req, res) => {
    const { courseId, changeStatus } = req.body
    let targetCourse
    let changePublish = true
    try {
      targetCourse = await Course.findOne({
        where: {
          id: courseId
        }
      })

      if (!targetCourse) {
        res.status(400)
        res.json({
          success: false,
          courseId,
          errMessage: ["找不到此課程"]
        })
        return
      }

      const { audit } = targetCourse
      if (audit === "fail" || changeStatus === "pending") {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["課程狀態無法更改"]
        })
        return
      }
      // 管理員只能把 pending 改成 success & fail，或是把 success 改成 fail
      if (changeStatus === "fail") {
        changePublish = false
      }
      await Course.update(
        {
          audit: changeStatus,
          published: changePublish
        },
        {
          where: {
            id: courseId
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
        id: courseId,
        audit: changeStatus,
        published: changePublish
      }
    })
    return
  }
}

module.exports = AdministratorsController
