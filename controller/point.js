const db = require("../models")
const { Point } = db

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
    console.log("call back: ", req.body)
    res.end()
  }
}

module.exports = PointsController
