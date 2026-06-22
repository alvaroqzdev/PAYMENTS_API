const login = require('./auth.service.js')

const userLogin = async (req, res) => {
    try {
        const newLogin = await login(req.body.email, req.body.password)

        return res.status(200).json(newLogin)

    } catch (error) {

        return res.status(403).json({ error: 'Login Failed' })
    }
}

module.exports = userLogin