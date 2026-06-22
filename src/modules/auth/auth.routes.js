const { Router } = require('express');
const userLogin = require('./auth.controller');
const zodValidate = require('../../middlewares/validate.middleware.js')
const { loginSchemaCreate } = require('../auth/auth.schema.js')

const router = Router();

router.post('/login', zodValidate(loginSchemaCreate), userLogin )

module.exports = router