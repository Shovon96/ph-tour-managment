import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_ACCESS_TOKEN: string,
    JWT_TOKEN_EXPIRES: string,
    BCRYPT_SALT_ROUND: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariable: string[] = ['PORT', 'DB_URL', 'NODE_ENV', 'JWT_ACCESS_TOKEN', 'JWT_TOKEN_EXPIRES', 'BCRYPT_SALT_ROUND', 'SUPER_ADMIN_EMAIL', 'SUPER_ADMIN_PASSWORD']
    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required env variable ${key}`)
        }
    });

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN as string,
        JWT_TOKEN_EXPIRES: process.env.JWT_TOKEN_EXPIRES as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string
    }

}

export const envVars = loadEnvVariables()