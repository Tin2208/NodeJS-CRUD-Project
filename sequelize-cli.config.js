const dbConfig = require("./config/db.config");

module.exports = {
  development: {
    username: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
  },
  test: {
    username: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
  },
  production: {
    username: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
  },
};
