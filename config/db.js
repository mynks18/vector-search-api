const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://mayanksharma:admin@localhost:5432/test', { dialect: 'postgres'});

module.exports = sequelize;