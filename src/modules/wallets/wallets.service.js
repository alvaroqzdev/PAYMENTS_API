const prisma = require('../../config/database.js')

const selectBalanceById = async (userId) => {
    return prisma.wallet.findUnique({
        where: { user_id: userId },
        select: { balance: true }
    })
}

module.exports = { selectBalanceById }