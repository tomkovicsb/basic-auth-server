module.exports = {
  server: {
    port: process.env.SERVER_PORT || 3000,
  },
  db: {
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-db',
      debug: false,
      opt: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        mongos: process.env.MONGODB_MONGOS === 'true' ? true : false
      }
    }
  }
};
