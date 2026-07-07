const { transaction, transactionStatus, getTransactions } = require('./transactions.service')

const transactionController = async (req, res, next) => {
    try {
        const walletTransaction = await transaction(req.user.id, req.body.recipient, req.body.amount)

        res.status(200).json(walletTransaction)

    } catch (error) {
        next(error)
    }
}

const transactionStatusController = async (req, res, next) => {
    try {

        const walletStatus = await transactionStatus(req.body.id, req.body.status)

        res.status(200).json(walletStatus)

    } catch (error) {

        next(error)
    }
}

const getTransactionsController = async (req, res, next) => {
    try {

        const walletTransactions = await getTransactions(req.user.id, Number(req.query.page), Number(req.query.limit))

        res.status(200).json(walletTransactions)

    } catch (error) {
        next(error)

    }
}

module.exports = { transactionController, transactionStatusController, getTransactionsController }