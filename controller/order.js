const db = require("../models")
const { Schedule, Student, Cart, Course } = db
const { sequelize } = require("../models")
const { checkTimeOverlap } = require("../utils.js")
const { Op } = require("sequelize")

const OrderController = {
  orderCourse: async (req, res) => {
    const { jwtId } = req
    const { scheduleId, studentNote, reservedPrice, totalPrice } = req.body
    var scheduleData = [] // scheduleData: [[scheduleId[i], studentId, startTime, finishTime], [scheduleId[i], studentId, startTime, finishTime], ...]
    var errMessage = {} // errMessage = {scheduleId: "", scheduleId: "",...}

    try {
      //確認是否學生具有足夠的點數
      const studentPoint = await Student.findOne({
        where: {
          id: jwtId
        }
      })

      if (totalPrice > studentPoint.points) {
        res.status(400)
        res.json({
          success: false,
          errMessage: ["請加值點數"]
        })
        return
      }

      //進行各欲預定課程的檢查
      for (let i = 0; i < scheduleId.length; i++) {
        const checkSchedule = await Schedule.findOne({
          where: {
            id: scheduleId[i],
            exist: 1
          }
        })

        // 0. 檢查 scheduleId 是否存在資料庫
        if (!checkSchedule) {
          errMessage[scheduleId[i]] = "無此課程時段"
          continue
        }

        const { studentId, startTime, finishTime, courseId } = checkSchedule

        //1. 檢查此課程是否過期
        if (new Date(startTime) < new Date()) {
          errMessage[scheduleId[i]] = "此時段課程已過期"
          continue
        }

        //2. 檢查此課程是否與學生已預定課程衝突 3. 此課程是否已被其他人預訂
        if (studentId === jwtId) {
          errMessage[scheduleId[i]] = "您已預訂此課程"
          continue
        } else if (studentId) {
          errMessage[scheduleId[i]] = "此課程已被預訂"
          continue
        }

        //3. 檢查課程是否已下架
        const checkPublish = await Course.findOne({
          where: {
            id: courseId
          }
        })
        const { published } = checkPublish
        if (!published) {
          errMessage[scheduleId[i]] = "此課程已下架"
        }

        //存到 scheduleData 的物件，便於後續檢查
        scheduleData.push([scheduleId[i], studentId, startTime, finishTime])
      }

      // 檢查 errMessage 狀態
      if (Object.keys(errMessage).length > 0) {
        res.status(400)
        res.json({
          success: false,
          errMessage
        })
        return
      }

      //4. 此時段與其他欲預定課程衝突
      for (let i = 0; i < scheduleData.length - 1; i++) {
        for (let j = i + 1; j < scheduleData.length; j++) {
          const overLapResult = checkTimeOverlap(
            scheduleData[i][2],
            scheduleData[i][3],
            scheduleData[j][2],
            scheduleData[j][3]
          )
          if (overLapResult) {
            errMessage[scheduleData[i][0]] = "時段與其他欲預定課程衝突"
            errMessage[scheduleData[j][0]] = "時段與其他欲預定課程衝突"
          }
        }
      }

      // 檢查 errMessage 狀態
      if (Object.keys(errMessage).length > 0) {
        res.json({
          success: false,
          errMessage
        })
        return
      }

      // 將學生已預訂課程取出，時間的條件為欄位 startTime 大於等於現在時間
      let resersedSchedule = await Schedule.findAll({
        where: {
          studentId: jwtId,
          startTime: {
            [Op.gte]: new Date()
          }
        }
      })

      // 5. 判斷欲預定時段與學生已預定課程是否衝突
      if (resersedSchedule.length !== 0) {
        for (let i = 0; i < scheduleData.length; i++) {
          for (let j = 0; j < resersedSchedule.length; j++) {
            const overLapResult = checkTimeOverlap(
              scheduleData[i][2],
              scheduleData[i][3],
              resersedSchedule[j].startTime,
              resersedSchedule[j].finishTime
            )
            if (overLapResult) {
              errMessage[scheduleData[i][0]] = "時段與已預定課程衝突"
            }
          }
        }
      }

      // 檢查 errMessage 狀態
      if (Object.keys(errMessage).length > 0) {
        res.json({
          success: false,
          errMessage
        })
        return
      }

      //確認無誤後開始進行預定 Schedule
      await sequelize.transaction(async (t) => {
        //此處也可以改成 promise all 寫法
        for (let i = 0; i < scheduleId.length; i++) {
          await Schedule.update(
            {
              studentId: jwtId,
              studentNote: studentNote[i],
              reservedPrice: reservedPrice[i],
              meetingLink: "https://meet.google.com/zkr-qzed-vxt?authuser=0"
            },
            {
              where: {
                id: scheduleId[i]
              },
              transaction: t
            }
          )

          await Cart.update(
            {
              deducted: true
            },
            {
              where: {
                scheduleId: scheduleId[i],
                studentId: jwtId
              },
              transaction: t
            }
          )
        }
        //扣點

        await Student.decrement("points", {
          by: totalPrice,
          where: {
            id: jwtId
          },
          transaction: t
        })
      })

      res.json({
        success: true,
        data: ["成功預定課程"]
      })
      return
    } catch {
      res.status(400)
      res.json({
        success: false,
        errMessage: ["系統錯誤"]
      })
      return
    }
  }
}

module.exports = OrderController
