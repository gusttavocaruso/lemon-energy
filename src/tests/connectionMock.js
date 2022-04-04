const mongodb = require('mongodb').MongoClient;
const { MongoMemoryServer } = require('mongodb-memory-server');

const DB_MOCK = new MongoMemoryServer();
const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

const getConnection = async () => {
  const URL_MOCK = await DB_MOCK.getUri();
  return mongodb.connect(URL_MOCK, OPTIONS);
}

module.exports = {
  getConnection,
};
