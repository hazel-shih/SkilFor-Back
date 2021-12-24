const db = require("../models")
const { sequelize } = require("../models")
const moment = require("moment")
const { Student, Course, Schedule, Cart } = db
const CalendarsController = {
  addCalendar: async (req, res) => {
    const { jwtId } = req
    const {
      id,
      courseId,
      start,
      end,
      title,
      resource: { eventColor }
    } = req.body
    // 檢查是否為自己的課程並且已經通過審核
    try {
      const targetCourse = await Course.findOne({
        where: {
          id: courseId,
          teacherId: jwtId
        }
      })
      if (!targetCourse || targetCourse.audit !== "success") {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["權限不足"]
        })
        return
      }
      // 新增行事曆
      const month = Number(moment(start).tz("Asia/Taipei").format("MM"))
      if (
        await Schedule.findOne({
          where: {
            courseId,
            startTime: start
          }
        })
      ) {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["不得在同時段新增一樣的課程"]
        })
      }
      await Schedule.create({
        id,
        teacherId: jwtId,
        courseId,
        title,
        startTime: start,
        finishTime: end,
        eventColor,
        month
      })
      return res.json({
        success: true,
        data: {
          ...req.body
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
  },

  deleteCalendar: async (req, res) => {
    const { jwtId } = req
    const { scheduleId } = req.body
    try {
      const targetSchedule = await Schedule.findOne({
        where: {
          id: scheduleId,
          teacherId: jwtId
        }
      })
      if (!targetSchedule) {
        res.status(400)
        res.json({
          success: false,
          value: scheduleId,
          errMessage: ["找不到此行程"]
        })
        return
      }
      await targetSchedule.destroy()
    } catch (err) {
      console.log("delete error: ", err)
      res.status(400)
      res.json({
        success: false,
        errMessage: err
      })
      return
    }
    res.json({
      success: true
    })
    return
  },

  getCalendarInfo: async (req, res) => {
    const { jwtId, identity } = req
    const { month } = req.query
    let schedules
    try {
      if (identity === "teacher") {
        schedules = await Schedule.findAll({
          where: {
            teacherId: jwtId,
            month
          }
        })
      } else {
        schedules = await Schedule.findAll({
          where: {
            studentId: jwtId,
            month
          }
        })
      }
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
    const data = await Promise.all(
      schedules.map(async (schedule) => {
        const {
          id,
          courseId,
          title,
          startTime,
          finishTime,
          studentId,
          studentNote,
          eventColor
        } = schedule
        const student = await Student.findOne({
          where: {
            id: studentId
          }
        })
        return {
          id,
          courseId,
          title,
          start: startTime,
          end: finishTime,
          resource: {
            reserved: student ? student.username : null,
            studentNotes: studentNote,
            eventColor: eventColor,
            timePeriod: `${moment(startTime)
              .tz("Asia/Taipei")
              .format("h:mm")} ~ ${moment(finishTime)
              .tz("Asia/Taipei")
              .format("h:mm")}`
          }
        }
      })
    )
    res.json({
      success: true,
      data
    })
    return
  },

  //學生取消已預訂的課程
  cancelCalendar: async (req, res) => {
    const { jwtId } = req
    const { scheduleId } = req.body
    try {
      await sequelize.transaction(async (t) => {
        const checkSchedule = await Schedule.findOne({
          where: {
            id: scheduleId,
            studentId: jwtId
          },
          transaction: t
        })

        if (!checkSchedule) {
          res.status(400)
          res.json({
            success: false,
            errMessage: ["找不到此行程"]
          })
          return
        }
        //1. 判斷時間是否超過 24 小時
        const time =
          (new Date(checkSchedule.startTime) - new Date()) / (1000 * 60 * 60)
        if (time < 24) {
          res.status(400)
          res.json({
            success: false,
            errMessage: ["24 小時內無法取消課程"]
          })
          return
        }

        //2. 取出復原的點數
        const recoveredPoint = checkSchedule.reservedPrice
        //3. 做更新復原
        await Schedule.update(
          {
            studentId: null,
            studentNote: null,
            reservedPrice: null
          },
          {
            where: {
              id: scheduleId,
              studentId: jwtId
            },
            transaction: t
          }
        )

        // 4.加點數到到原本學生資料表
        await Student.increment("points", {
          by: recoveredPoint,
          where: {
            id: jwtId
          },
          transaction: t
        })

        // 5.刪除購物車
        const deleteResult = await Cart.destroy({
          where: {
            studentId: jwtId,
            scheduleId,
            deducted: 1
          },
          transaction: t
        })
        // 成功為 1 ，失敗為 0 ，但失敗 transaction: t 不會啟動 rollback
        if (deleteResult === 0) {
          throw new Error()
        }

        res.json({
          success: true,
          data: ["成功取消預定課程"]
        })
        return
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
}

module.exports = CalendarsController
