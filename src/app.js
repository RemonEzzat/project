const express=require('express')
var cors = require('cors')
require('./db/db')
const userRouter = require('./router/users')
const articalRouter = require('./router/articals')
const app = express()
const port = process.env.PORT ||3000

app.use(express.json())

app.use(cors())

app.use(userRouter)
app.use(articalRouter)

app.listen(port)
