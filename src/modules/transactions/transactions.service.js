const prisma = require('../../config/database.js')
const { transactionWebHook } = require('../webhooks/webhooks.service.js')
const logger = require('../../utils/logger.js')

const transaction = async (senderId, recipientId, amount) => {

    logger.info('Init transaction', {
        senderId: senderId,
        recipientId: recipientId,
        amount: amount
    });

    const sender = await prisma.wallet.findFirstOrThrow({
        where: { user_id: senderId }
    })

    const recipient = await prisma.wallet.findFirstOrThrow({
        where: { user_id: recipientId }
    })

    if (sender.balance < amount) {
        logger.warn('Insuficient Balance', {
            senderId: senderId,
            recipientId: recipientId,
            amount: amount
        });
        throw new Error('Insuficient balance')
    }

    try {
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

        logger.info('Transaction Successful', {
            sender: senderId,
            receiver: recipientId,
            status: "ENVIADO"
        })

        await transactionWebHook({
            sender: senderId,
            receiver: recipientId,
            status: "ENVIADO"
        })
        return { debitCount, creditCount }
    } catch (error) {
        await prisma.transaction.create({
            data: {
                user_sent: senderId,
                user_received: recipientId,
                payment: amount,
                status: 'CANCELADO'
            }

        }),

            logger.warn('failed transaction', {
                senderId: senderId,
                recipientId: recipientId,
                amount: amount
            });

        await transactionWebHook({
            sender: senderId,
            receiver: recipientId,
            status: "CANCELADO"
        })

        throw error
    } 

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