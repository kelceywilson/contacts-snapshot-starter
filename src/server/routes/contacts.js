const contacts = require('../../models/contacts')

const router = require('express').Router()

router.get('/new', (request, response) => {
  if (request.session.role === 'admin'){
    response.render('contacts/new')
  } else {
    response.status(403)
    response.render('common/error403')
  }
})

router.post('/', (request, response, next) => {
  contacts.create(request.body)
    .then(function(contact) {
      if (contact) return response.redirect(`/contacts/${contact[0].id}`)
      next()
    })
    .catch( error => next(error) )
})

router.get('/:contactId', (request, response, next) => {
  const contactId = parseInt(request.params.contactId)
  console.log('here', contactId);
  if (!contactId || !/^\d+$/.test(contactId)) return next()
  contacts.findById(contactId)
    .then(function(contact) {
      console.log(contact);
      if (contact){
        const role = request.session.role
        return response.render('contacts/show', { contact, role })
      }
      next()
    })
    .catch( error => next(error) )
})


router.delete('/:contactId', (request, response, next) => {
  console.log('delete');
  if (request.session.role !== 'admin'){
    response.status(403)
    response.render('common/error403')
  } else {
    const contactId = request.params.contactId
    contacts.destroy(contactId)
    .then(function(contact) {
      if (contact) return response.redirect('/')
      next()
    })
    .catch( error => next(error) )
  }
})

router.get('/search', (request, response, next) => {
  const query = request.query.q
  contacts.search(query)
    .then(function(contacts) {
      if (contacts) return response.render('contacts/index', { query, contacts })
      next()
    })
    .catch( error => next(error) )
})

module.exports = router
