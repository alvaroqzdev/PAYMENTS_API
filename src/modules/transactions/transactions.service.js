const prisma = require('../../config/database.js')

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

module.exports = { transaction, transactionStatus }