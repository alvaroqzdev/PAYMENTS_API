const request = require('supertest')
const app = require('../../src/app.js')

jest.mock('../../src/modules/users/users.service.js', () => ({
    selectUserByEmail: jest.fn()
}))

jest.mock('../../src/utils/hash.js', () => ({
    compareHash: jest.fn()
}))

jest.mock('../../src/utils/token.js', () => ({
    refreshTokenGeneration: jest.fn(),
    acessTokenGeneration: jest.fn()
}))

jest.mock('../../src/utils/logger.js', () => ({
    info: jest.fn(),
    warn: jest.fn()
}))

const { selectUserByEmail } = require('../../src/modules/users/users.service.js')
const { compareHash } = require('../../src/utils/hash.js')
const { acessTokenGeneration, refreshTokenGeneration } = require('../../src/utils/token.js')

describe('login()', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('deve retornar um login válido', async () => {

        const email = "alvaro@gmail.com"
        const password = "12345678"
        const acessToken = 'bGllbnQiLCJpc3MiOi'
        const refreshToken = 'bGllbnQiLCJpc3MiOifesewwfewfewfewf'

        selectUserByEmail.mockResolvedValue({ id: 'abc', email, password: 'hashedPassword' })
        compareHash.mockResolvedValue(true)
        acessTokenGeneration.mockResolvedValue(acessToken)
        refreshTokenGeneration.mockResolvedValue(refreshToken)

        const res = await request(app)
            .post('/api/v1/login')
            .send({ password: password, email: email });

        expect(res.status).toBe(200);
        expect(res.body.acessToken).toBe(acessToken);
        expect(res.body.refreshToken).toBe(refreshToken);
    })

    it('deve retornar uma senha inválida', async () => {

        const email = "alvaro@gmail.com"
        const password = "123457846546546546546546"

        selectUserByEmail.mockResolvedValue({ id: 'abc', email, password: 'hashedPassword' })
        compareHash.mockResolvedValue(false)

        const res = await request(app)
            .post('/api/v1/login')
            .send({ password: password, email: email });

        expect(res.status).toBe(403);

    })

    it('deve retornar um email inválido', async () => {

        const email = "alvarhjgjhgjhgo@gmail.com"
        const password = "12345678"

        selectUserByEmail.mockResolvedValue(null)

        const res = await request(app)
            .post('/api/v1/login')
            .send({ password: password, email: email });

        expect(res.status).toBe(403);

    })



})
