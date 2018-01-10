const users = require('../../models/users')
const bcrypt = require('bcryptjs')

const router = require('express').Router()

// client-sessions version commented out
// if using client-sessions and csrfToken the following should be in all relevant forms:
// <input type='hidden' name="_csrf" value="<%= csrfToken %>" />

router.get('/register', (req, res) => {
  // res.render('users/register', {csrfToken: req.csrfToken()})
  res.render('users/register')
})
router.post('/register', (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 14)
  const firstName = req.body.first_name
  const lastName = req.body.last_name
  const username = req.body.username
  users.register(firstName, lastName, username, hash)
    .then((member) => {
      console.log('data', member)
      // res.clearCookie('error')
      req.session.member = member.first_name
      console.log(req.session.member);
      res.redirect('/')
    })
    .catch((error) => {
      console.log('error.code', error.code)
      if (error.code === '23505') {
        res.cookie('error', 'user with that username already exists')
      }
    })
})

router.get('/login', (req, res) => {
  console.log(req.session.member);
  // res.render('users/login', {csrfToken: req.csrfToken()})
  res.render('users/login')
})
router.post('/login', (req, res) => {
  users.login(req.body.username)
    .then((member) => {
      if (!member) {
        res.cookie('error', 'Invalid username/password combo')
      } else {
        console.log('user routes', member)
        console.log(req.body.password);
        if(member.message === 'user does not exist'){
          // res.render('users/login', { error: 'Invalid username/password combo', csrfToken: req.csrfToken() })
          res.render('users/login', { error: 'Invalid username/password combo' })
        } else if (bcrypt.compareSync(req.body.password, member.password)) {
          console.log('user/password match! member:', member.first_name)
          req.session.member = member.first_name
          console.log(req.session.member);
          res.redirect('/')
        } else {
          res.render('users/login', { error: 'Invalid username/password combo' })
        }
      }
    })
    .catch((error) => {
      console.log('error', error)
    })
})

router.get('/logout', (req, res) => {
  if (req.session) {
    // req.session.reset() // for client-sessions
    req.session.destroy(function(err) {
      // cannot access session here
      console.log(err);
    })
  }
  res.redirect('/users/login')
})

module.exports = router
