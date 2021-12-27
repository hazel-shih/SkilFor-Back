const db = require("../models")
const moment = require("moment")
const { Schedule } = db
const FrontCalendarController = {
  getCourseCalendar: async (req, res) => {
    const { courseId, month } = req.query
    let courseCalendar
    let data
    try {
      courseCalendar = await Schedule.findAll({
        where: {
          courseId,
          month,
          exist: 1
        }
      })
      //此課程 id 沒找到任何時段
      if (courseCalendar.length === 0) {
        res.json({
          success: true,
          data: []
        })
        return
      }
      data = courseCalendar.map((item) => {
        const { id, courseId, startTime, finishTime, studentId, eventColor } =
          item
        const startPrefix =
          Number(moment(startTime).tz("Asia/Taipei").format("h")) >= 12
            ? "下午"
            : "上午"
        const endPrefix =
          Number(moment(finishTime).tz("Asia/Taipei").format("h")) >= 12
            ? "下午"
            : "上午"
        return {
          scheduleId: id,
          courseId,
          title: `${startPrefix} ${moment(startTime)
            .tz("Asia/Taipei")
            .format("h:mm")} ~ ${endPrefix} ${moment(finishTime)
            .tz("Asia/Taipei")
            .format("h:mm")}`,
          start: startTime,
          end: finishTime,
          resource: {
            reserved: studentId ? "reserved" : null,
            eventColor
          }
        }
      })
    } catch (err) {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
    }

    res.json({
      success: true,
      data
    })
  }
}

module.exports = FrontCalendarController
