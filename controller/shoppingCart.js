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
        res.status(400)
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
        attributes: ["scheduleId"],
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
      const startPrefix =
        Number(moment(item.Schedule.startTime).tz("Asia/Taipei").format("H")) >=
        12
          ? "下午"
          : "上午"
      const endPrefix =
        Number(
          moment(item.Schedule.finishTime).tz("Asia/Taipei").format("H")
        ) >= 12
          ? "下午"
          : "上午"
      return {
        scheduleId: item.scheduleId,
        courseId: item.Schedule.Course.id,
        courseName: item.Schedule.title,
        price: item.Schedule.Course.price,
        teacherId: item.Schedule.Teacher.id,
        teacherName: item.Schedule.Teacher.username,
        start: item.Schedule.startTime,
        end: item.Schedule.finishTime,
        timePeriod: `${startPrefix} ${moment(item.Schedule.startTime)
          .tz("Asia/Taipei")
          .format("h:mm")} ~ ${endPrefix} ${moment(item.Schedule.finishTime)
          .tz("Asia/Taipei")
          .format("h:mm")}`
      }
    })
    res.json({
      success: true,
      data
    })
    return
  },

  deleteItem: async (req, res) => {
    const { jwtId } = req
    const { scheduleId } = req.body
    let result
    try {
      result = await Cart.findOne({
        where: {
          studentId: jwtId,
          scheduleId,
          deducted: null
        }
      })
      if (!result) {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["無此課程存在於購物車"]
        })
        return
      }
      await result.destroy()
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    res.status(200)
    res.json({
      success: true,
      data: ["品項刪除成功"]
    })
    return
  }
}

module.exports = ShoppingCartController
