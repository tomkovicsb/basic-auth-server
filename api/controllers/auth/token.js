const { tokenHandler } = require('../../../services/authentication');
const Response = require('../../../services/response');

const { MissingParamsException } = require('../../../services/error');

module.exports = async (req, res) => {
  const { query } = req;
  const response = new Response(res);

  if (!query.code && !query.refreshToken ) {
    return response.error(new MissingParamsException('code or refreshToken'))
      .send();
  }

  try {

  } catch (error) {
    response.error(error);
  }

  await emailAuth.registerUser(body);

  return response.send();
};