require('dotenv').config();
const app = require('./src/app');
const { connectPostgres } = require('./src/config/postgres');
const { connectMongo } = require('./src/config/mongo');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectPostgres();
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
