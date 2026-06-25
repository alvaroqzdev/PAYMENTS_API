const { transaction, transactionStatus } = require('./transactions.service')

const transactionController = async (req, res) => {
    try {
        const walletTransaction = await transaction( req.user.id, req.body.recipient, req.body.amount)

        res.status(200).json(walletTransaction)

    } catch (error) {
        res.status(400).json({ error: 'Transaction Failed' })
        console.error(error.message)
    }
}

const transactionStatusController = async (req, res) => {
    try {

        const walletStatus = await transactionStatus(req.body.id, req.body.status)

        res.status(200).json(walletStatus)

    } catch (error) {
        res.status(404).json({ error: 'Transaction Failed' })
    }
}

module.exports = { transactionController, transactionStatusController }