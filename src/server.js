const express = require('express')
const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const session = require('express-session')
// const sessions = require('client-sessions')
// const csrf = require('csurf')

const app = express()
const methodOverride = require('method-override')
const routes = require('./server/routes');
const middlewares = require('./server/middlewares');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.use(middlewares.setDefaultResponseLocals)
// app.use(cookieParser());

app.use(session({
  key: 'boogie.down',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { expires: 600000 }
}))

// app.use(sessions({
//   cookieName: 'session',
//   secret: 'some_random_string',
//   duration: 30 * 60 * 1000
// }))
// app.use(csrf())

app.use('/', routes)

app.use((request, response) => {
  response.render('common/not_found')
})

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
