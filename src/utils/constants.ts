require('dotenv').config()

export const secret = process.env.JWT_TOKEN;
export const dbUrl = process.env.DATABASE_URL;