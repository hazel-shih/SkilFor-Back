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
        month,
        exist: 1
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
      await sequelize.transaction(async (t) => {
        const targetSchedule = await Schedule.findOne({
          where: {
            id: scheduleId,
            teacherId: jwtId,
            exist: 1
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
        //1. 判斷時間是否超過 24 小時
        const time =
          (new Date(targetSchedule.startTime) - new Date()) / (1000 * 60 * 60)
        if (time < 24) {
          res.status(400)
          res.json({
            success: false,
            errMessage: ["24 小時內無法取消課程"]
          })
          return
        }
        //2. 更新 Schedule 狀態
        await targetSchedule.update(
          {
            exist: 0
          },
          {
            transaction: t
          }
        )
        //3. 如果有學生預訂要還錢
        const { recoveredPrice, studentId } = targetSchedule
        if (studentId) {
          await Student.increment("points", {
            by: recoveredPrice,
            where: {
              id: jwtId
            },
            transaction: t
          })
        }
      })
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: "系統錯誤"
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
            month,
            exist: 1
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
          eventColor,
          exist
        } = schedule
        const student = await Student.findOne({
          where: {
            id: studentId
          }
        })
        const startPrefix =
          Number(moment(startTime).tz("Asia/Taipei").format("H")) >= 12
            ? "下午"
            : "上午"
        const endPrefix =
          Number(moment(finishTime).tz("Asia/Taipei").format("H")) >= 12
            ? "下午"
            : "上午"
        return {
          id,
          courseId,
          title,
          start: startTime,
          end: finishTime,
          ...(identity === "student" && { exist }),
          resource: {
            reserved: student ? student.username : null,
            studentNotes: studentNote,
            eventColor: eventColor,
            timePeriod: `${startPrefix} ${moment(startTime)
              .tz("Asia/Taipei")
              .format("h:mm")} ~ ${endPrefix} ${moment(finishTime)
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
            studentId: jwtId,
            exist: 1
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
  },

  //學生刪除已過期的課程
  removeCalendar: async (req, res) => {
    const { jwtId } = req
    const { scheduleId } = req.body
    try {
      const checkSchedule = await Schedule.findOne({
        where: {
          id: scheduleId,
          studentId: jwtId
        }
      })
      if (!checkSchedule) {
        return res.status(400).json({
          success: false,
          errMessage: ["找不到此行程"]
        })
      }

      if (new Date() <= new Date(checkSchedule.finishTime)) {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["課程尚未過期無法移除"]
        })
        return
      }

      await checkSchedule.destroy()

      return res.status(200).json({
        success: true,
        data: ["成功移除過期課程"]
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        errMessage: ["系統錯誤"]
      })
    }
  }
}

module.exports = CalendarsController
