const { Router } = require('express');
const userLogin = require('./auth.controller');
const zodValidate = require('../../middlewares/validate.middleware.js')
const { loginSchemaCreate } = require('../auth/auth.schema.js')
const { loginLimiter } = require('../../middlewares/rateLimit.middleware.js')

const router = Router();

router.post('/login', loginLimiter, zodValidate(loginSchemaCreate), userLogin)

module.exports = router