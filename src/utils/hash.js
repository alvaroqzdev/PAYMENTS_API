const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10

const passwordHash = async (password) => {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    return hash
}

const compareHash = async (userPassword, dbHash) => {

    const compare = await bcrypt.compare(userPassword, dbHash)
    return compare
}

module.exports = { passwordHash, compareHash }