const db = require("../models")
const { Cart, Schedule, Teacher, Course } = db
const moment = require("moment")

const ShoppingCartController = {
  addItem: async (req, res) => {
    const { jwtId } = req
    const { scheduleId } = req.body
    let isDuplicate

    try {
      //先判斷購物車是否有相同的課程時段
      isDuplicate = await Cart.findOne({
        where: {
          studentId: jwtId,
          scheduleId
        }
      })
      if (isDuplicate) {
        res.status(200)
        res.json({
          success: false,
          errMessage: ["此時段已加入購物車"]
        })
        return
      }
      //新增購物車
      await Cart.create({
        studentId: jwtId,
        scheduleId
      })
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
      data: ["成功加入購物車"]
    })
  },

  getItem: async (req, res) => {
    const { jwtId } = req
    let results
    try {
      results = await Cart.findAll({
        where: {
          studentId: jwtId,
          deducted: null
        },
        attributes: ["scheduleId", "studentNote"],
        include: [
          {
            model: Schedule,
            attributes: ["title", "startTime", "finishTime"],
            include: [
              {
                model: Teacher,
                attributes: ["id", "username", "avatar"]
              },
              {
                model: Course,
                attributes: ["id", "price"]
              }
            ]
          }
        ]
      })
      if (results.length === 0) {
        res.json({
          success: true,
          data: []
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

    var data = results.map((item) => {
      return {
        scheduleId: item.scheduleId,
        note: item.studentNote,
        courseId: item.Schedule.Course.id,
        courseName: item.Schedule.title,
        price: item.Schedule.Course.price,
        teacherId: item.Schedule.Teacher.id,
        teacherName: item.Schedule.Teacher.username,
        start: item.Schedule.startTime,
        end: item.Schedule.finishTime,
        timePeriod: `${moment(item.Schedule.startTime)
          .tz("Asia/Taipei")
          .format("h:mm")} ~ ${moment(item.Schedule.finishTime)
          .tz("Asia/Taipei")
          .format("h:mm")}`
      }
    })
    res.json({
      success: true,
      data
    })
    return
  }
}

module.exports = ShoppingCartController
