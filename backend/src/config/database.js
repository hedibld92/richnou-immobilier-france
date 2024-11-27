require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/immobilier-prestige',
    JWT_SECRET: process.env.JWT_SECRET || 'votre_secret_jwt',
    API_KEYS: {
        EDUCATION_NATIONALE: process.env.API_EDUCATION,
        SIRENE: process.env.API_SIRENE,
        TRANSPORT: process.env.API_TRANSPORT
    }
};