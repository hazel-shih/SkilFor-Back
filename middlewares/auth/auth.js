require("dotenv").config()
const { checkAuth } = require("../../utils.js")

const auth = async (req, res, next) => {
  const result = await checkAuth(req, res)
  if (result.success) {
    return next()
  }
  res.status(400)
  res.json({
    ...result
  })
  return
}

module.exports = auth
