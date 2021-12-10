const db = require("../models")
const moment = require("moment")
const { Student, Course, Schedule } = db
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
    const { id } = req.body
    try {
      const targetSchedule = await Schedule.findOne({
        where: {
          id,
          teacherId: jwtId
        }
      })
      if (!targetSchedule) {
        res.status(400)
        res.json({
          success: false,
          value: id,
          errMessage: ["找不到此行程"]
        })
        return
      }
      await targetSchedule.destroy()
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
  },

  getCalendarInfo: async (req, res) => {
    const { jwtId } = req
    const { month } = req.query
    let schedules
    try {
      schedules = await Schedule.findAll({
        where: {
          teacherId: jwtId,
          month
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
  }
}

module.exports = CalendarsController
