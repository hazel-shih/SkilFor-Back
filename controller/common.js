const db = require("../models")
const { Category } = db

const CommonController = {
  getAllCategories: async (req, res) => {
    const categories = await Category.findAll()
    const data = categories.map((category) => {
      const { id, name, displayName } = category
      return {
        id,
        name,
        displayName
      }
    })
    res.json({
      success: true,
      data
    })
    return
  }
}

module.exports = CommonController
