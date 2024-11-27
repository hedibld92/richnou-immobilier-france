require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    API_KEYS: {
        EDUCATION: process.env.API_EDUCATION,
        SIRENE: {
            KEY: process.env.API_SIRENE_KEY,
            SECRET: process.env.API_SIRENE_SECRET
        },
        TRANSPORT: process.env.API_TRANSPORT
    }
};