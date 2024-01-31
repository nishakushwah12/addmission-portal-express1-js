const express = require('express')
const FrontController = require('./controllers/FrontController')
const app = express()
const port = 5000
// for file upload ex.image file
const fileUpload = require("express-fileupload");
app.use(fileUpload({useTempFiles: true}));

const connectDb = require('./db/connect_db')
// connect flash and session
const session = require('express-session')
const flash = require('connect-flash')

// cookies token get karne ke liye use karte h
const cookieparser = require('cookie-parser')
app.use(cookieparser())
//connect DB
connectDb()
const web = require("./routes/web")
// template engin html css views
app.set('view engine', 'ejs')
//static files css image link

app.use(express.static('public'))
//data get
//parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//session
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,

}));
//Flash messages
app.use(flash());

//route load
app.use('/', web)







//server create
app.listen(port, () => {
  console.log(`Server start localhost:5000`)
})