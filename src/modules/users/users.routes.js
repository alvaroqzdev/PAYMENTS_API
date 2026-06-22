const { Router } = require('express')
const { createNewUser, selectUser } = require('./users.controller.js')
const zodValidate = require('../../middlewares/validate.middleware.js')
const { usersSchemaCreate } = require('../../modules/users/users.schema.js')

const router = Router()

router.post('/user', zodValidate(usersSchemaCreate), createNewUser)
router.get('/user/:email', selectUser)

module.exports = router