const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const pgvector = require('pgvector/sequelize');
pgvector.registerType(Sequelize);

const MagazineInformation = require('./MagazineInformation');

const MagazineContent = sequelize.define('MagazineContent', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    magazine_id: {
        type: DataTypes.BIGINT,
        references: {
            model: MagazineInformation,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    content: DataTypes.TEXT,
    content_embedding: DataTypes.VECTOR(1024),
    content_tsvector: DataTypes.TSVECTOR,
}, {
    tableName: 'magazine_content',
});

module.exports = MagazineContent;
