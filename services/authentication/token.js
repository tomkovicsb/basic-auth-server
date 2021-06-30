const config = require('../../config');
const mongo = require('../mongo');
const jwt = require('jsonwebtoken');

const authConfig = config.auth;
const RefreshToken = mongo.get('RefreshToken');
const AuthCode = mongo.get('AuthCode');

const {
  InvalidAccessTokenException,
  InvalidRefreshTokenException,
  InvalidAuthCodeException,
} = require('../error');

module.exports = {
  createAccessToken(user, refreshToken) {
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
  createIdToken() {
    //TODO: Finish id token creation
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