const { acessTokenGeneration, refreshTokenGeneration } = require('../../utils/token.js')
const { compareHash } = require('../../utils/hash.js')
const { selectUserByEmail } = require('../users/users.service.js')
const logger = require('../../utils/logger.js')
const AppError = require('../../utils/AppError.js')


const login = async (email, password) => {
    logger.info("Init Login", {
        email: email,
    })

    const tableData = await selectUserByEmail(email)

    const emailTable = tableData?.email
    if (!emailTable) {
        logger.warn("Email or Passwsrd Incorrect", { email: email })
        throw new AppError('Email or Password Incorrect', 401)
    }

    const passwordTable = tableData.password
    const correctPassword = await compareHash(password, passwordTable)
    if (!correctPassword) {
        logger.warn("Email or Passsword Incorrect", { email: email })

        throw new AppError('Email or Password Incorrect', 401)
    }

    const payload = {
        id: tableData.id,
        email: tableData.email
    }

    const acessToken = await acessTokenGeneration(payload)
    const refreshToken = await refreshTokenGeneration(tableData.id)

    logger.info("Final Login", {
        email: email
    })

    return { acessToken, refreshToken }
}

module.exports = login