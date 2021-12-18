const express = require("express")
const bodyParser = require("body-parser")
const membersRouter = require("./routes/members")
const teachersRouter = require("./routes/teachers")
const studentsRouter = require("./routes/students")
const shoppingCartRouter = require("./routes/shoppingCart")
const usersRouter = require("./routes/users")
const CommonController = require("./controller/common")
const FrontCalendarController = require("./controller/frontCalendar")
const filterRouter = require("./routes/filter")
const auth = require("./middlewares/auth/auth")
const app = express()
const port = 5006
const cors = require("cors")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get("/categories", CommonController.getAllCategories)
app.get("/front-course/:id", CommonController.getCourseInfo)
app.use("/front-calendar/", FrontCalendarController.getCourseCalendar)
app.use("/members", membersRouter)
app.use("/filter", filterRouter)
app.use(auth)
app.use("/shopping-cart", shoppingCartRouter)
app.use("/teacher", teachersRouter)
app.use("/student", studentsRouter)
app.use("/user", usersRouter)

app.listen(port, () => {
  console.log(`Skilfor app listening on port ${port}!`)
})
