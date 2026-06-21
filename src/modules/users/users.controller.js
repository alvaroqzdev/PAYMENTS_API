const { selectUserByEmail, createUser } = require('./users.service.js');

const createNewUser = async (req, res) => {

    try {
        const newUser = await createUser(req.body)

        return res.status(201).json(newUser)

    } catch (error) {

        return res.status(500).json({ error: error.message })
    }
}

const selectUser = async (req, res) => {

    try {
        const user = await selectUserByEmail(req.params.email)

        return res.status(200).json(user)

    } catch (error) {

        return res.status(404).json({ error: 'user not found' })
    }
}

module.exports = { createNewUser, selectUser }