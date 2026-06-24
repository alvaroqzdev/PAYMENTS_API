const { selectBalanceById } = require('./wallets.service')

const selectBalance = async (req, res) => {
    try {
        const balance = await selectBalanceById(req.params.id)

        return res.status(200).json(balance)
    } catch (error) {

        return res.status(404).json({ error: "not find balance for this id" })
    }
}

module.exports = { selectBalance }