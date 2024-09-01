const express = require('express');
const bodyParser = require('body-parser');


const magazineRoutes = require('./routes/MagazineRoutes');
const createPgVectorExtension = require('./utils/vectorExtensionCreate');
const sequelize = require('./config/db');

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/magazine', magazineRoutes);


const PORT = process.env.PORT || 3000;



createPgVectorExtension();

sequelize
.sync()
.then(async () => {
    // console.log(result)
    try {
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_content_embedding_ip ON magazine_content USING hnsw (content_embedding vector_ip_ops);`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_content_embedding_cosine ON magazine_content USING hnsw (content_embedding vector_cosine_ops);`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_content_embedding_l1 ON magazine_content USING hnsw (content_embedding vector_l1_ops);`);
        console.log('HNSW indexes created successfully.');
    } catch (error) {
        console.error('Error creating HNSW indexes:', error);
        throw error;
    }

    try {
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_magazine_title ON magazine_information (title)`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_magazine_author ON magazine_information (author);`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_magazine_content_tsvector ON magazine_content USING GIN (content_tsvector);`);
        console.log('Author and title indexes created successfully.');
    } catch (error) {
        console.error('Error creating Author and title indexes:', error);
        throw error;
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.log(err);
})