const { Router } = require('express');
const userLogin  = require('./auth.controller');

const router = Router();

router.post('/login', userLogin)

module.exports = router