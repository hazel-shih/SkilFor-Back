const express = require('express');
const bodyParser = require('body-parser')
const membersRouter = require('./routes/members')

const app = express();
const port = 5006;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res)=> {
  res.send('hello, this is api server for skifor')
})

app.use('/members', membersRouter)


app.listen(port, () => {
  console.log(`Skilfor app listening on port ${port}!`)
})

