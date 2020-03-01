import dotenv from "dotenv";

dotenv.config();

export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.SERVER_PORT || 3000,
}
