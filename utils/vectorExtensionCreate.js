const sequelize = require('../config/db')

module.exports = async function createPgVectorExtension() {
    try {
        await sequelize.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
        console.log('pgvector extension created successfully.');
    } catch (error) {
        console.error('Error creating pgvector extension:', error);
        throw error; // Ensure to stop if this fails
    }
};