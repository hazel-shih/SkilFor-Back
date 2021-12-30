const db = require("../models")
const { Point, Student } = db
const { sequelize } = require("../models")
const PointsController = {
  buyPoint: async (req, res) => {
    const { jwtId } = req
    const { ItemName, TotalPoint, TotalAmount } = req.body
    try {
      const newRecord = await Point.create({
        studentId: jwtId,
        totalPoint: TotalPoint,
        totalAmount: TotalAmount,
        itemName: ItemName,
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
    const { MerchantTradeNo } = req.body
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
          const { studentId, totalPoint } = pointRecord
          await Student.increment("points", {
            by: totalPoint,
            where: {
              id: studentId
            },
            transaction: t
          })
        }
      })
    } catch (err) {
      res.end()
    }
    res.end()
  }
}

module.exports = PointsController
