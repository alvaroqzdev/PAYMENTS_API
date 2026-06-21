const prisma = require('../../config/database.js')
const { passwordHash } = require('../../utils/hash.js')



const createUser = async (userData) => {
    let userPassword = await passwordHash(userData.password)

    return prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            cpf: userData.cpf,
            password: userPassword
        }
    });
};

const selectUserByEmail = async (userEmail) => {

    return prisma.user.findUnique({
        where: { email: userEmail },
        select: {
            name: true,
            email: true,
            phone: true,
            cpf: true,
            password: true
        }
    });
};

module.exports = { createUser, selectUserByEmail }