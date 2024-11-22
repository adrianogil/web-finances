const { Sequelize } = require('sequelize');
const config = require('config');

// Carregar configurações baseadas no ambiente
const dbConfig = config.get('database');

const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging, // Define true para exibir queries no console
});

module.exports = sequelize;
