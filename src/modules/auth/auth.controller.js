const login = require('./auth.service.js')

const userLogin = async (req, res, next) => {
    try {
        const newLogin = await login(req.body.email, req.body.password)

        return res.status(200).json(newLogin)

    } catch (error) {

        next(error)
    }
}

module.exports = userLogin