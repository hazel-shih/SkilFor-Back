const express = require("express")
const bodyParser = require("body-parser")
const membersRouter = require("./routes/members")
const teachersRouter = require("./routes/teachers")
const CommonController = require("./controller/common")
const filterRouter = require("./routes/filter")
const auth = require("./middlewares/auth/auth")
const app = express()
const port = 5006
const cors = require("cors")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get("/categories", CommonController.getAllCategories)
app.use("/members", membersRouter)
app.use("/filter", filterRouter)
app.use(auth)
app.use("/teacher", teachersRouter)

app.listen(port, () => {
  console.log(`Skilfor app listening on port ${port}!`)
})
