const { Router } = require('express')
const { transactionController, transactionStatusController, getTransactionsController } = require('./transactions.controller.js')
const { authenticate } = require('../../middlewares/auth.middleware.js')
const router = Router()

router.post('/transaction', authenticate, transactionController)
router.post('/transaction/status', authenticate, transactionStatusController)
router.get('/transactions/page', authenticate, getTransactionsController)

module.exports = router