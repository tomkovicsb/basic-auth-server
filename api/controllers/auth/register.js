const { emailAuth } = require('../../../services/authentication');
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
    await emailAuth.registerUser(body);
  } catch (error) {
    response.error(error);
  }

  return response.send();
};