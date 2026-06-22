const { z } = require('zod')

const usersSchemaCreate = z.object({

    name: z.string()
        .min(3, "the name must have at least 3 characters")
        .max(100, "too long name")
        .trim(),

    email: z.string()
        .email("invalid Email")
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(8, "the password must have at least 8 characters")
        .max(100),

    phone: z.string()
        .regex(/^\d{2}9?\d{8}$/, "Format: 12999999999"),

    cpf: z.string()
        .regex(/^\d{11}$/, "Format: 12345678911")


})

module.exports = { usersSchemaCreate }