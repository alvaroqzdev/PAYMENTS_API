const rateLimit = require('express-rate-limit')

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too much requests. Try again in some minutes",
        code: 'RATE_LIMIT_EXCEEDED'
    },
    skipFailedRequests: false,
    keyGenerator: (req) => {
        return req.ip || req.headers['x-forwarded-for']?.split(',')[0];
    }
});

const loginLimiter = rateLimit({
    windowMS: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    message: {
        error: "Too much requests. Try again in some minutes",
        code: 'LOGIN_EXCEEDED'
    },
    skipSuccessfulRequests: true,
    legacyHeaders: false
})

module.exports = { globalLimiter, loginLimiter }