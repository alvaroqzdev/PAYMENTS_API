const { acessTokenVerification } = require('../utils/token.js')

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: 'Token is not Found' })
    }

    const [type, token] = authHeader.split(' ');

    if (type != 'Bearer' || !token) {
        return res.status(401).json({ error: 'Format is incorrect. Use: Bearer' })
    }

    const result = await acessTokenVerification(token)

    if (!result.validate) {
        if (result.error === "TokenExpiredError") {
            return res.status(401).json({ error: 'TokenExpired', code: 'TOKEN_EXPIRED' })
        }

        return res.status(401).json({ error: 'invalid token' })
    }

    req.user = result.payload
    next()
}

module.exports = { authenticate }