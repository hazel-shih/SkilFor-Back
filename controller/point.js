const db = require("../models")
const { Point, Student } = db
const { sequelize } = require("../models")
const PointsController = {
  buyPoint: async (req, res) => {
    const { jwtId } = req
    const { amount } = req.body
    try {
      const newRecord = await Point.create({
        studentId: jwtId,
        amount,
        success: false
      })
      return res.status(200).json({
        success: true,
        data: {
          serial: newRecord.id
        }
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        errMessage: ["系統錯誤"]
      })
    }
  },
  checkBuyPoint: async (req, res) => {
    const { MerchantTradeNo, TradeAmt } = req.body
    try {
      await sequelize.transaction(async (t) => {
        const pointRecord = await Point.findOne({
          where: {
            id: MerchantTradeNo
          }
        })
        if (pointRecord) {
          await pointRecord.update(
            {
              success: true
            },
            {
              transaction: t
            }
          )
          const { studentId } = pointRecord
          const student = await Student.findOne({
            where: {
              id: studentId
            }
          })
          if (student) {
            await student.increment("points", {
              by: Number(TradeAmt),
              transaction: t
            })
          }
        }
      })
    } catch (err) {
      console.log(err)
      res.end()
    }
    res.end()
  }
}

module.exports = PointsController
