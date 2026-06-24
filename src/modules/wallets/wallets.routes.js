const { Router } = require('express')
const { selectBalance } = require('./wallets.controller.js')
const { authenticate } = require('../../middlewares/auth.middleware.js')
const router = Router()

router.get('/balance/:id', authenticate, selectBalance)

module.exports = router