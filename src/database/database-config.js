const config = require('config');

const dbConfig = config.database;

module.exports = {
    development: {
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.name,
      host: dbConfig.host,
      dialect: dbConfig.dialect,
    },
    // ... other environments
  };