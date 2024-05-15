require('dotenv').config()

const secret = process.env.JWT_TOKEN;
const dbUrl = process.env.DATABASE_URL;
const port = process.env.PORT;

export {secret, dbUrl, port};