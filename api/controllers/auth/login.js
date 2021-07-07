const { emailAuth, tokenHandler } = require('../../../services/authentication');
const Response = require('../../../services/response');

const { MissingParamsException } = require('../../../services/error');

module.exports = async (req, res) => {
  const { body } = req;
  const response = new Response(res);

  if (!body.email || !body.password) {
    return response.error(new MissingParamsException('email, password'))
      .send();
  }

  try {
    const user = await emailAuth.loginUser(body);
    const authCode = await tokenHandler.createAuthCode(user);

    response.data({
      code: authCode.code
    });
  } catch (error) {
    response.error(error);
  }

  return response.send();
};