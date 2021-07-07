const { tokenHandler } = require('../../../services/authentication');
const Response = require('../../../services/response');
const mongo = require('../../../services/mongo');

const User = mongo.get('User');
const { MissingParamsException } = require('../../../services/error');

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