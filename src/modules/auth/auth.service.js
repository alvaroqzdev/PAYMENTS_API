const { acessTokenGeneration, refreshTokenGeneration } = require('../../utils/token.js')
const { compareHash } = require('../../utils/hash.js')
const { selectUserByEmail } = require('../users/users.service.js')



const login = async (email, password) => {

    const tableData = await selectUserByEmail(email)

    const emailTable = tableData?.email
    if (!emailTable) {
        throw new Error('Email or Passwsrd Incorrect')
    }

    const passwordTable = tableData.password
    const correctPassword = await compareHash(password, passwordTable)
    if (!correctPassword) {
        throw new Error('Email or Passwsrd Incorrect')
    }

    const payload = {
        id: tableData.id,
        email: tableData.email
    }

    const acessToken = await acessTokenGeneration(payload)
    const refreshToken = await refreshTokenGeneration(tableData.id)

    return {acessToken, refreshToken}
}

module.exports = login