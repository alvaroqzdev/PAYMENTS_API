const { selectBalanceById } = require('./wallets.service')

const selectBalance = async (req, res, next) => {
    try {
        const balance = await selectBalanceById(req.params.id)

        return res.status(200).json(balance)
    } catch (error) {

        next(error)
    }
}

module.exports = { selectBalance }