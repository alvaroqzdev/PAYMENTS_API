require('dotenv').config();
const { z } = require('zod');

const envSchema = z.object({
    DATABASE_URL: z.string(),
    DB_ROOT_PASSWORD: z.string(),
    DB_NAME: z.string(),
    API_PORT: z.string()
})

const results = envSchema.safeParse(process.env)

if (!results.success){
    console.log(`Wrong environment variables `);
    results.error.issues.forEach(issue => {
        console.error(`${issue.path.join('.')}: ${issue.message}`)
    });
    process.exit(1)
};

const env = results.data;

module.exports = {
    dbUrl: env.DATABASE_URL,
    dbRootPassWord: env.DB_ROOT_PASSWORD,
    dbName: env.DB_NAME,
    apiPort: env.API_PORT
}