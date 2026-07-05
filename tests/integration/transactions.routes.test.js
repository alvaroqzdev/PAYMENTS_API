const request = require('supertest')
const app = require('../../src/app.js')

jest.mock('../../src/config/database.js', () => ({
    $transaction: jest.fn(),
    wallet: {
        findUnique: jest.fn(),
        updateMany: jest.fn()
    },
    transaction: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn()
    }
}))

jest.mock('../../src/middlewares/auth.middleware.js', () => ({
    authenticate: (req, res, next) => {
        req.user = { id: '678e3f90-9fab-4216-829a-e007889b2f36' }
        next()
    }
}))

jest.mock('../../src/modules/webhooks/webhooks.service.js', () => ({
    transactionWebHook: jest.fn()
}))

jest.mock('../../src/utils/logger.js', () => ({
    info: jest.fn(),
    warn: jest.fn()
}))

const prisma = require('../../src/config/database.js')
const { transactionWebHook } = require('../../src/modules/webhooks/webhooks.service.js')
const { transaction } = require('../../src/modules/transactions/transactions.service')

describe('transaction()', () => {

    beforeEach(() => {
        jest.clearAllMocks()
        transactionWebHook.mockResolvedValue()
    })

    it('deve retornar uma transacao valida', async () => {

        const amount = 100
        const sender = '678e3f90-9fab-4216-829a-e007889b2f36'
        const recipient = 'bdfa608a-4023-479f-a731-deaad887d317'
        const debitCount = { count: 1 }
        const creditCount = { count: 1 }
        const createTransactionTableData = { id: 'xyz', status: 'ENVIADO' }

        const tx = {
            wallet: {
                findUnique: jest.fn()
                    .mockResolvedValueOnce({ balance: 1000, user_id: sender })
                    .mockResolvedValueOnce({ balance: 500, user_id: recipient }),
                updateMany: jest.fn()
                    .mockResolvedValueOnce(debitCount)
                    .mockResolvedValueOnce(creditCount)
            },
            transaction: {
                create: jest.fn().mockResolvedValue(createTransactionTableData)
            }
        }

        prisma.$transaction.mockImplementation(async (callback) => callback(tx))

        const result = await request(app)
            .post('/api/v1/transaction')
            .send({ recipient: recipient, amount: amount });

        expect(result.status).toBe(200);

        expect(prisma.$transaction).toHaveBeenCalledTimes(1)
        expect(tx.wallet.findUnique).toHaveBeenNthCalledWith(1, {
            where: { user_id: sender },
            select: { balance: true, user_id: true }
        })
        expect(tx.wallet.findUnique).toHaveBeenNthCalledWith(2, {
            where: { user_id: recipient },
            select: { balance: true, user_id: true }
        })
        expect(tx.wallet.updateMany).toHaveBeenNthCalledWith(1, {
            where: { user_id: sender, balance: { gte: amount } },
            data: { balance: { decrement: amount } }
        })
        expect(tx.wallet.updateMany).toHaveBeenNthCalledWith(2, {
            where: { user_id: recipient },
            data: { balance: { increment: amount } }
        })
        expect(tx.transaction.create).toHaveBeenCalledWith({
            data: {
                user_sent: sender,
                user_received: recipient,
                payment: amount,
                status: 'ENVIADO'
            }
        })
        expect(transactionWebHook).toHaveBeenCalledWith({
            sender,
            receiver: recipient,
            status: 'ENVIADO'
        })
    })

    it('deve retornar uma transacao invalida, saldo insuficiente', async () => {

        const amount = 20000
        const sender = '678e3f90-9fab-4216-829a-e007889b2f36'
        const recipient = 'bdfa608a-4023-479f-a731-deaad887d317'

        const tx = {
            wallet: {
                findUnique: jest.fn()
                    .mockResolvedValueOnce({ balance: 1000, user_id: sender })
                    .mockResolvedValueOnce({ balance: 500, user_id: recipient }),
                updateMany: jest.fn()
            },
            transaction: {
                create: jest.fn()
            }
        }

        prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        prisma.transaction.create.mockResolvedValue({ id: 'abc', status: 'CANCELADO' })

        const result = await request(app)
            .post('/api/v1/transaction')
            .send({ recipient: recipient, amount: amount });

        expect(result.status).toBe(400);

        expect(tx.wallet.updateMany).not.toHaveBeenCalled()
        expect(tx.transaction.create).not.toHaveBeenCalled()
        expect(prisma.transaction.create).toHaveBeenCalledWith({
            data: {
                user_sent: sender,
                user_received: recipient,
                payment: amount,
                status: 'CANCELADO'
            }
        })
        expect(transactionWebHook).not.toHaveBeenCalled()
    })

    it('deve retornar uma transacao invalida, usuarios iguais', async () => {

        const amount = 100
        const sender = '678e3f90-9fab-4216-829a-e007889b2f36'
        const recipient = '678e3f90-9fab-4216-829a-e007889b2f36'

        prisma.transaction.create.mockResolvedValue({ id: 'abc', status: 'CANCELADO' })

        const result = await request(app)
            .post('/api/v1/transaction')
            .send({ recipient: recipient, amount: amount });

        expect(result.status).toBe(400);

        expect(prisma.$transaction).not.toHaveBeenCalled()
        expect(prisma.transaction.create).toHaveBeenCalledWith({
            data: {
                user_sent: sender,
                user_received: recipient,
                payment: amount,
                status: 'CANCELADO'
            }
        })
        expect(transactionWebHook).toHaveBeenCalledWith({
            sender,
            receiver: recipient,
            status: 'CANCELADO'
        })
    })
})
