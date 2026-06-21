const { Router } = require('express')
const { createNewUser, selectUser } = require('./users.controller.js')

const router = Router()

router.post('/user', createNewUser)
router.get('/user/:email', selectUser)

module.exports = router