const prisma = require('../../config/database.js')
const { transactionWebHook } = require('../webhooks/webhooks.service.js')

const transaction = async (senderId, recipientId, amount) => {



    const sender = await prisma.wallet.findFirstOrThrow({
        where: { user_id: senderId }
    })

    const recipient = await prisma.wallet.findFirstOrThrow({
        where: { user_id: recipientId }
    })

    if (sender.balance < amount) {
        throw new Error('Insuficient balance')
    }

    const [debitCount, creditCount] = await prisma.$transaction([

        prisma.wallet.update({
            where: { user_id: senderId },
            data: { balance: { decrement: amount } }
        }),

        prisma.wallet.update({
            where: { user_id: recipientId },
            data: { balance: { increment: amount } }
        }),

        prisma.transaction.create({
            data: {
                user_sent: senderId,
                user_received: recipientId,
                payment: amount,
                status: 'ENVIADO'
            }

        }),

    ])
    await transactionWebHook({
        sender: senderId,
        receiver: recipientId,
        status: "ENVIADO"
    })
    return { debitCount, creditCount }
}

const transactionStatus = async (transactionId, status) => {
    return prisma.transaction.update({
        where: { id: transactionId },
        data: {
            status: status
        }

    })
}

const getTransactions = async (userId, page, limit) => {
    return prisma.transaction.findMany({
        where: { OR: [{ user_sent: userId }, { user_received: userId }] },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: "desc" }
    })
}

module.exports = { transaction, transactionStatus, getTransactions }