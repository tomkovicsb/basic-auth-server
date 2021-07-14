const jwt = require('jsonwebtoken');
const {
  auth: authConfig,
} = require('../../config');
const mongo = require('../mongo');
const blacklistedTokensCache = require('../blacklistedTokensCache');

const RefreshToken = mongo.get('RefreshToken');
const BlacklistedToken = mongo.get('BlacklistedToken');
const AuthCode = mongo.get('AuthCode');

const {
  InvalidAccessTokenException,
  InvalidRefreshTokenException,
  InvalidAuthCodeException,
} = require('../error');

/**
 * Token handler
 *
 * This service handles the different authentication tokens.
 * Creates and validates auth codes, access tokens and refresh tokens.
 * */

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
        console.log(err);
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
  refreshRefreshToken: async (tokenData) => {
    const currentToken = await RefreshToken.findByIdAndUpdate(tokenData._id, { expireAt: Date.now() + authConfig.refreshToken.expire }, { new: true })
      .lean();

    if (!currentToken) {
      throw new InvalidRefreshTokenException();
    }

    return currentToken;
  },
  validateRefreshToken: async (refreshToken) => {
    const currentToken = await RefreshToken.findOne({
      token: refreshToken,
    });

    if (!currentToken) {
      throw new InvalidRefreshTokenException();
    }

    return currentToken;
  },
  invalidateRefreshToken: async ({params}) => {
    const { jti } = params;
    await RefreshToken.remove({ jti });
    const blacklistedToken = await BlacklistedToken.create({
      jti: jti,
      expireAt: Date.now() + authConfig.refreshToken.expire
    });
    await blacklistedTokensCache.set({
      jti,
      data: blacklistedToken
    });
  },
  createAuthCode: async (user) => {
    return await AuthCode.create({
      userId: user._id,
      expireAt: Date.now() + authConfig.authCode.expire,
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