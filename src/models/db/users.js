const db = require('./db')

const register = (firstName, lastName, username, hash) => {
  const addUser = 'INSERT INTO users(first_name, last_name, username, password) VALUES($1, $2, $3, $4) RETURNING first_name'
  return db.one(addUser, [firstName, lastName, username, hash])
    .then((member) => {
      console.log('register', member)
      return member
    })
    .catch(err => Object({ success: false, message: err.message }))
}

const login = (username) => {
  const findUser = 'SELECT * FROM users WHERE username = $1'
  return db.oneOrNone(findUser, username)
    .then((member) => {
      console.log('login', member)
      if(!member){
        return Object({ success: false, message: 'user does not exist' })
      }
      return member
    })
    .catch(err => Object({ success: false, message: err.message }))
}

module.exports = {
  register,
  login
}
