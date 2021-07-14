const _ = require('lodash');

const scopes = {
  OPEN_ID: 'openid',
  PROFILE: 'profile',
  EMAIL: 'email',
};

const claims = {
  SUB: 'sub',
  ISS: 'iss',
  AUTH_TIME: 'auth_time',
  LAST_NAME: 'lastName',
  FIRST_NAME: 'firstName',
  NICKNAME: 'nickname',
  EMAIL: 'email',
};

const mappedScopeRelatedClaims = {};

mappedScopeRelatedClaims[scopes.OPEN_ID] = [
  claims.SUB,
  claims.ISS,
  claims.AUTH_TIME,
];

mappedScopeRelatedClaims[scopes.PROFILE] = [
  claims.NICKNAME,
  claims.LAST_NAME,
  claims.FIRST_NAME,
];
mappedScopeRelatedClaims[scopes.EMAIL] = [
  claims.EMAIL,
];

module.exports = {
  server: {
    port: process.env.SERVER_PORT || 3000,
    host: process.env.SERVER_HOST || 'localhost',
  },
  db: {
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-db',
      debug: false,
      opt: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        mongos: process.env.MONGODB_MONGOS === 'true' ? true : false,
        useFindAndModify: false,
      },
    },
  },
  cache: {
    redis: {
      enabled: process.env.REDIS_ENABLED === 'true' ? true : false,
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    },
    keys: {
      user: 'user',
      userProfile: 'user:profile',
    }
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
  oidc: {
    secret: process.env.OIDC_SECRET || 'oidcsecret',
    availableScopes: _.values(scopes),
    availableClaims: _.values(claims),
    mappedScopeRelatedClaims: mappedScopeRelatedClaims
  },
};
