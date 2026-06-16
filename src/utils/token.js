const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpires, jwtRefreshSecret, jwtRefreshExpires } = require('../config/env.js');

const acessTokenGeneration = (payload) => {

    return jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpires,
        issuer: 'payments_api',
        audience: 'client'
    });
};

const refreshTokenGeneration = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        jwtRefreshSecret,
        { expiresIn: jwtRefreshExpires }
    );
}

const acessTokenVerification = (token) => {
    try {
        const decoded = jwt.verify(token, jwtSecret, {
            issuer: 'payments_api',
            audience: 'client'
        });
        return {
            payload: decoded,
            validate: true
        }
    } catch (error) {
        return {
            validate: false,
            error: error.name,
            message: error.message
        }
    }
}

const acessRefreshTokenVerification = (token) => {
    try {
        const decoded = jwt.verify(token, jwtRefreshSecret);
        return {
            validate: true,
            payload: decoded
        }
    } catch (error) {
        return {
            validate: false,
            error: error.name,
            message: error.message
        }
    }
}


module.exports = { acessTokenGeneration, refreshTokenGeneration, acessTokenVerification, acessRefreshTokenVerification }

