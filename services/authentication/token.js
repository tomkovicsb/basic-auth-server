const jwt = require('jsonwebtoken');
const moment = require('moment');
const {
  auth: authConfig,
  oidc: oidcConfig,
  server: serverConfig,
} = require('../../config');
const mongo = require('../mongo');

const RefreshToken = mongo.get('RefreshToken');
const AuthCode = mongo.get('AuthCode');

const {
  InvalidAccessTokenException,
  InvalidRefreshTokenException,
  InvalidAuthCodeException,
} = require('../error');

const claimsFromUser= function (user) {
  return {
    sub: user._id,
    iss: serverConfig.host,
    auth_time: moment().unix(),
    name: name,
    firstName: _.get(user, 'firstName') || '',
    lastName: _.get(user, 'lastName') || '',
    nickname:  _.get(user, 'nickname') || '',
    updated_at: moment(user.updatedAt).unix(),
    email: _.get(user, 'email'),
  };
};

const idTokenData = (params) => {
 const {user, scope, claims} = params;
  const userInfo = {};
  const supportedClaims = oidcConfig.claims;
  const scopeRelatedClaims = oidcConfig.mappedScopeRelatedClaims;

  let neededClaims = [];
  // Get the scope mapped claims from config
  scope.forEach(function (oneScope) {
    if (scopeRelatedClaims[oneScope]) {
      neededClaims = neededClaims.concat(scopeRelatedClaims[oneScope]);
    }
  });
  // Add the extra claims requested
  neededClaims = neededClaims.concat(claims);

  //Sort out duplicates and remove not supported claims
  neededClaims = _.uniq(neededClaims);
  neededClaims = _.intersection(neededClaims, supportedClaims);

  const claimedData = claimsFromUser(user);

  neededClaims.forEach(function (oneClaim) {
    userInfo[oneClaim] = claimedData[oneClaim];
  });

  return userInfo;
};

module.exports = {
  createAccessToken(params) {
    const {
      user,
      refreshToken,
    } = params;
    return jwt.sign({
        userId: user._id.toString(),
        nickname: user.nickname,
        email: user.email,
        jti: refreshToken.jti,
      },
      authConfig.jwt.secret,
      {
        expiresIn: authConfig.jwt.expire / 1000
      });
  },
  validateAccessToken(token) {
    try {
      return jwt.verify(token, authConfig.jwt.secret);
    } catch (err) {
      // Ignore token expired errors
      if (err.name !== 'TokenExpiredError') {
        consol.log(err);
      }
      throw new InvalidAccessTokenException();
    }
  },
  createRefreshToken: async (user) => {
    return await RefreshToken.create({
      userId: user._id,
      expireAt: Date.now() + authConfig.refreshToken.expire
    });
  },
  refreshRefreshToken: async (user) => {
    const currentToken = await RefreshToken.findOne({
      userId: user._id
    });

    if (currentToken) {
      return await RefreshToken.findByIdAndUpdate(currentToken._id,{ expireAt: Date.now() + authConfig.refreshToken.expire },{ new: true })
        .lean();
    } else {
      return await this.createRefreshToken(user);
    }
  },
  validateRefreshToken: async (refreshToken) => {
    const currentToken = await RefreshToken.findOne({
      jti: refreshToken.jti,
    });

    if (!currentToken) {
      throw new InvalidRefreshTokenException();
    }
  },
  createIdToken(params) {
    const {
      user,
      scope,
      claims,
      jwk,
      clientId,
    } = params;

    let payload = idTokenData({user, scope, claims});

    // These attributes are must be present in id tokens.
    payload.aud = clientId; // audience
    payload.iat = moment().unix(); // issued at

    return jwt.sign(payload, authConfig.oidc.secret, {
      expiresIn: authConfig.jwt.expire / 1000,
      header: {
        kid: jwk.kid
      },
      algorithm: 'RS256'
    });
  },
  createAuthCode: async (user) => {
    return await AuthCode.create({
      userId: user._id,
      expireAt: Date.now() + authConfig.authCode.expire
    });
  },
  checkAuthCode: async (code) => {
    const authCode = await AuthCode.findOneAndUpdate({
        code: code,
        isUsed: false,
      }, {
        isUsed: true,
      }, {
        new: true
      })
      .lean();

    if (!authCode) {
      throw new InvalidAuthCodeException();
    }

    return authCode;
  },
};