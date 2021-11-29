const express = require("express")
const bodyParser = require("body-parser")
const membersRouter = require("./routes/members")
const teachersRouter = require("./routes/teachers")
const auth = require("./middlewares/auth/auth")
const app = express()
const port = 5006

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/members", membersRouter)
app.use(auth)
app.use("/teacher", teachersRouter)

app.listen(port, () => {
  console.log(`Skilfor app listening on port ${port}!`)
})
