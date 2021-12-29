exports.checkIsTeacher = (req, res, next) => {
  const { identity } = req
  if (identity !== "teacher") {
    res.status(400)
    res.json({
      success: false,
      errMessage: ["你不是老師"]
    })
    return
  }
  next()
}

exports.checkIsStudent = (req, res, next) => {
  const { identity } = req
  if (identity !== "student") {
    res.status(400)
    res.json({
      success: false,
      errMessage: ["你不是學生"]
    })
    return
  }
  next()
}

exports.checkIsAdministrator = (req, res, next) => {
  const { identity } = req
  if (identity !== "administrator") {
    res.status(400)
    res.json({
      success: false,
      errMessage: ["你不是管理員"]
    })
    return
  }
  next()
}
