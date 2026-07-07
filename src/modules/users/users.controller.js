const { selectUserByEmail, createUser } = require('./users.service.js');

const createNewUser = async (req, res, next) => {

    try {
        const newUser = await createUser(req.body)

        return res.status(201).json(newUser)

    } catch (error) {

        next(error)
    }
}

const selectUser = async (req, res, next) => {

    try {
        const user = await selectUserByEmail(req.params.email)

        return res.status(200).json(user)

    } catch (error) {

        next(error)
    }
}

module.exports = { createNewUser, selectUser }