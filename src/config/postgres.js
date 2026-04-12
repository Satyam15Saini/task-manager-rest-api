const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
});

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully.');
    // Sync models
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
  }
};

module.exports = { sequelize, connectPostgres };
