const router = require('express').Router();
const contactsRoutes = require('./contacts')
const usersRoutes = require('./users')
const contacts = require('../../models/contacts');
const middlewares = require('../middlewares');

router.get('/', (req, res, next) => {
  contacts.findAll()
    .then((contacts) => {
      console.log('home', req.session.member)
      if(!req.session.member){
        res.redirect('/users/login')
      } else {
        res.render('contacts/index', { contacts, member: req.session.member })
      }
    })
    .catch(error => next(error))
})

router.use('/contacts', contactsRoutes);
router.use('/users', usersRoutes);

router.use(middlewares.logErrors);
router.use(middlewares.errorHandler);
router.use(middlewares.notFoundHandler)

module.exports = router;
