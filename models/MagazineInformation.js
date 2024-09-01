const { Sequelize }  = require('sequelize');
const sequelize = require('../config/db');

const MagazineInformation = sequelize.define('MagazineInformation', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    author: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    publication_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    category: {
        type: Sequelize.TEXT,
    },
}, {
    tableName: 'magazine_information',
});

module.exports = MagazineInformation;
