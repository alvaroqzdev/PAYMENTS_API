const prisma = require('../../config/database.js')
const { transactionWebHook } = require('../webhooks/webhooks.service.js')
const logger = require('../../utils/logger.js');

const transaction = async (senderId, recipientId, amount) => {

    logger.info('Init transaction', {
        senderId: senderId,
        recipientId: recipientId,
        amount: amount
    });

    if (senderId === recipientId) {
        await prisma.transaction.create({
            data: {
                user_sent: senderId,
                user_received: recipientId,
                payment: amount,
                status: 'CANCELADO'
            }

        })

        logger.warn("SenderId and recipientId are equals: ", {
            sender: senderId,
            receiver: recipientId,
            status: "CANCELADO"
        })

        try {
            await transactionWebHook({
                sender: senderId,
                receiver: recipientId,
                status: "CANCELADO"
            })
        } catch (error) {
            logger.warn("WebHook Error: ", {
                sender: senderId,
                receiver: recipientId,
                status: "CANCELADO",
                error: error.message
            })
        }

        throw new Error("SenderId and recipientId are equals")
    }


    try {

        const result = await prisma.$transaction(async (tx) => {

            const sender = await tx.wallet.findUnique({
                where: { user_id: senderId },
                select: { balance: true, user_id: true }
            })

            const recipient = await tx.wallet.findUnique({
                where: { user_id: recipientId },
                select: { balance: true, user_id: true }
            })

            if (!sender || !recipient) {

                logger.warn("User Not Found: ", {
                    sender: senderId,
                    receiver: recipientId,
                    status: "CANCELADO"
                })

                throw new Error("User Not Found")
            }

            if (sender.balance < amount) {

                logger.warn("Insuficient Balance: ", {
                    sender: senderId,
                    receiver: recipientId,
                    status: "CANCELADO"
                })

                throw new Error("Insuficient Balance")
            }

            const debitCount = await tx.wallet.updateMany({
                where: { user_id: senderId, balance: { gte: amount } },
                data: { balance: { decrement: amount } }
            })

            const creditCount = await tx.wallet.updateMany({
                where: { user_id: recipientId },
                data: { balance: { increment: amount } }
            })

            const createTransactionTableData = await tx.transaction.create({
                data: {
                    user_sent: senderId,
                    user_received: recipientId,
                    payment: amount,
                    status: 'ENVIADO'
                }

            })

            return { debitCount, creditCount, createTransactionTableData }
        })

        logger.info('Transaction Successful', {
            sender: senderId,
            receiver: recipientId,
            status: "ENVIADO"
        })

        try {
            await transactionWebHook({
                sender: senderId,
                receiver: recipientId,
                status: "ENVIADO"
            })
        }
        catch (error) {

            logger.warn({
                sender: senderId,
                receiver: recipientId,
                status: "ENVIADO",
                error: error.message
            })
        }

        return result

    } catch (error) {

        if (error.message === 'Insuficient Balance') {

            await prisma.transaction.create({
                data: {
                    user_sent: senderId,
                    user_received: recipientId,
                    payment: amount,
                    status: 'CANCELADO'
                }

            })
        }

        if (error.message !== 'Insuficient Balance' && error.message !== 'User Not Found') {
            await prisma.transaction.create({
                data: {
                    user_sent: senderId,
                    user_received: recipientId,
                    payment: amount,
                    status: 'CANCELADO'
                }

            })

            logger.warn('Failed Transaction', {
                senderId: senderId,
                recipientId: recipientId,
                amount: amount
            })

            await transactionWebHook({ status: "CANCELADO" })
        }
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