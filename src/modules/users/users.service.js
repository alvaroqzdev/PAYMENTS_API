const prisma = require('../../config/database.js')
const { passwordHash } = require('../../utils/hash.js')



const createUser = async (userData) => {
    let userPassword = await passwordHash(userData.password)

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                cpf: userData.cpf,
                password: userPassword
            }
        });

        const wallet = await tx.wallet.create({
            data: {
                user_id: user.id,
                balance: 0.00
            }

        });

        return { user, wallet }
    })
};

const selectUserByEmail = async (userEmail) => {

    return prisma.user.findUnique({
        where: { email: userEmail },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            cpf: true,
            password: true
        }
    });
};

module.exports = { createUser, selectUserByEmail }