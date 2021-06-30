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
        mongos: process.env.MONGODB_MONGOS === 'true' ? true : false,
      },
    },
  },
  cache: {
    redis: {
      enabled: process.env.REDIS_ENABLED === 'true' ? true : false,
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    },
  },
  password: {
    salt: process.env.PASSWORD_SALT || 5,
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'tokensecret',
      expire: process.env.JWT_EXPIRE || 60 * 60 * 24 * 1000,
    },
    refreshToken: {
      expire: process.env.REFRESH_TOKEN_EXPIRE || 3 * 30 * 24 * 60 * 60 * 1000,
    },
    authCode: {
      expire: process.env.AUTH_CODE_EXPIRE || 2 * 60 * 1000,
    },
  },
};
