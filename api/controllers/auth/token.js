const { tokenHandler } = require('../../../services/authentication');
const Response = require('../../../services/response');
const mongo = require('../../../services/mongo');

const User = mongo.get('User');
const { MissingParamsException } = require('../../../services/error');

/**
 * @api {get} /auth/token Token exchange
 * @apiDescription Access token and refresh token exchange endpoint
 * @apiName Token exchange
 * @apiGroup Authentication
 * @apiPermission public
 *
 * @apiParam {String} [code] Auth code received during login.
 * @apiParam {String} [refreshToken] Refresh token received during login.
 *
 * @apiSuccess {Boolean} isSuccess The requested operation was successful or not
 * @apiSuccess {Object} result If isSuccess equals true
 * @apiSuccess {String} result.refreshToken The authenticated user's refresh token. Only provided if 'code' param was used.
 * @apiSuccess {String} result.accessToken The authenticated user's access token.
 * @apiSuccess {Object} result.user The authenticated users data. Only provided if 'code' param was used.
 * @apiSuccess {String} result.user.userId User's db id.
 * @apiSuccess {String} result.user.email User's email
 * @apiSuccess {String} result.user.nickname User's nickname.
 * @apiSuccess {String} result.user.firstName User's first name.
 * @apiSuccess {String} result.user.lastName User's last name.
 * @apiSuccess {Object} error If isSuccess equals false.
 * @apiSuccess {String} error.message Error message.
 * @apiSuccess {Number} error.code Error code.
 */

module.exports = async (req, res) => {
  const { query } = req;
  const response = new Response(res);

  if (!query.code && !query.refreshToken ) {
    return response.error(new MissingParamsException('code or refreshToken'))
      .send();
  }

  try {
    if (query.code) {
      const appliedAuthCode = await tokenHandler.checkAuthCode(query.code);
      const user = await User.findById(appliedAuthCode.userId).lean();
      const refreshToken = await tokenHandler.createRefreshToken(user);
      const accessToken = tokenHandler.createAccessToken({user, refreshToken});

      response.data({
        refreshToken: refreshToken.token,
        accessToken: accessToken,
        user: User.toResponse(user),
      });
    } else if (query.refreshToken) {
      let refreshToken = await tokenHandler.validateRefreshToken(query.refreshToken);
      refreshToken = await tokenHandler.refreshRefreshToken(refreshToken);
      const user = await User.findById(refreshToken.userId).lean();
      const accessToken = tokenHandler.createAccessToken({user, refreshToken});

      response.data({
        accessToken: accessToken,
      });
    }
  } catch (error) {
    response.error(error);
  }

  return response.send();
};