const logger = require('../utils/logger.js')

const errorHandler = (error, req, res, next) => {
     console.log('ERROR HANDLER CALLED', error.message)
    const statusCode = error.statusCode || 500

    if (statusCode === 500) {
        logger.error('intern error', {error: error, url: req.url, method: req.method})
    } else {
        logger.warn('operational error', {message: error.message, url: req.url, statusCode})
    }

    return res.status(statusCode).json({
        status: 'error',
        message: error.message
    })
}

module.exports = errorHandler