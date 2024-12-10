const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

mongoose.Promise = Promise;
let mongoServer = MongoMemoryServer;

module.exports.getUri = async () => {
  mongoServer = await MongoMemoryServer.create();
  if (process.env.NODE_ENV === 'test') {
    return mongoServer.getUri();
  }
  return process.env.MONGO_URL;
};

module.exports.connect = async ({ uri }) => {
  await mongoose.connect(uri);

  mongoose.connection.once('open', () => {
    console.log(`Mongo DB successfully connected to ${uri}`);
  });
};

module.exports.closeDb = async () => {
  await mongoose.connection.close();

  if (process.env.NODE_ENV === 'test') {
    await mongoServer.stop();
  }
};
