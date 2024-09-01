const MagazineInformation = require('../models/MagazineInformation');
const MagazineContent = require('../models/MagazineContent');
const { QueryTypes } = require('sequelize');

const sequelize = require('../config/db');

const embedder = require('../utils/embedder');


// service function for adding new magazine
async function addMagazineWithContent(magazineData) {
    const transaction = await MagazineInformation.sequelize.transaction();

    try {
        const embedding = await embedder(magazineData.content);
        // console.log(embedding);

        try {
            // Creating a new entry in the table
            const magazineInfo = await MagazineInformation.create({
                title: magazineData.title,
                author: magazineData.author,
                publication_date: Date.now(),
                category: magazineData.category,
            }, { transaction });
    
            console.log("id: " + magazineInfo.id);
    
    
            // process tsVector for content (indexing)
            const contentTsvector = sequelize.literal(`to_tsvector('english', '${magazineData.content}')`);
    
            // creating new entry in table using magazineInfo.id
            const magazineContent = await MagazineContent.create({
                magazine_id: magazineInfo.id,
                content: magazineData.content,
                content_embedding: embedding.embedding,
                content_tsvector: contentTsvector,
            }, { transaction });

    
            // commit the transaction
            await transaction.commit();
    
            return {
                magazineInfo,
                magazineContent
            };
        } catch (error) {
            // rollback the transaction in case of error
            await transaction.rollback();
            console.error('Error adding magazine:', error);
            throw new Error('Could not add magazine.');
        }

    } catch (error) {
        console.error('Failed to generate embedding while adding magazine', error);
    }
    
}


// get all magazine
// async function getAllMagazineInfo() {
//     try {

//         const mag = await MagazineInformation.findAll();
//         return mag;

//     } catch (error) {

//         console.error('Failed to generate embedding', error);

//     }
// }

// service function for vector search
// not directly called, used in controller
// page: page number
// pageSize: page size
async function getVectorSearch(query, page = 1, pageSize = 10) {
    try {
        const response = await embedder(query);

        const vectorString = `${`[${response.embedding.join(",")}]`}`;

        const offset = (page - 1) * pageSize;

        try {
            const results = await sequelize.query(`
            SELECT
                mi.id,
                mi.title,
                mi.author,
                mc.content
            FROM
                magazine_content mc
            JOIN
                magazine_information mi
            ON
                mi.id = mc.magazine_id
            ORDER BY
                content_embedding <#> '${vectorString}'::vector 
            LIMIT ${pageSize}
            OFFSET ${offset}`
            , {
                type: QueryTypes.SELECT,
            });
            console.log(results);
            return results;

        } catch (error) {

            console.error('Query failed', error);

        }

    } catch (error) {
        console.error('Failed to generate embedding while vector search', error);
    }
}

// service function for full text search
// not directly called, used in controller
// page: page number
// pageSize: page size
async function fullTextSearch(query, page = 1, pageSize = 10) {

    const offset = (page - 1) * pageSize;

    try {

        const sqlQuery = `
            SELECT
                mi.id,
                mi.title,
                mi.author,
                mc.content
            FROM
                magazine_content mc
            JOIN
                magazine_information mi
            ON
                mi.id = mc.magazine_id
            WHERE
                mc.content_tsvector @@ plainto_tsquery('english', '${query}')
                OR mi.title ILIKE '%${query}%'
                OR mi.author ILIKE '%${query}%'
            ORDER BY
                ts_rank(mc.content_tsvector, plainto_tsquery('english', '${query}')) DESC
            LIMIT ${pageSize}
            OFFSET ${offset}
        `;

        const results = await sequelize.query(sqlQuery, {
            type: QueryTypes.SELECT
        });
        console.log(results);
        return results;
    } catch (error) {
        console.error('Error performing full-text search:', error);
        throw error;
    }
}

module.exports = {
    addMagazineWithContent,
    // getAllMagazineInfo,
    getVectorSearch,
    fullTextSearch
};