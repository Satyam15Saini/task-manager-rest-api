const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the MongoDB database:', error);
  }
};

module.exports = { connectMongo };
