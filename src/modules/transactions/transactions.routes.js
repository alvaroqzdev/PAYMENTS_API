const { Router } = require('express')
const { transactionController, transactionStatusController } = require('./transactions.controller.js')
const { authenticate } = require('../../middlewares/auth.middleware.js')
const router = Router()

router.post('/transaction', authenticate, transactionController)
router.post('/transaction/status', authenticate, transactionStatusController)

module.exports = router