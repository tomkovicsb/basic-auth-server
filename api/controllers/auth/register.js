const { emailAuth } = require('../../../services/authentication');
const Response = require('../../../services/response');

const { MissingParamsException } = require('../../../services/error');

/**
 * @api {post} /auth/register Email registration
 * @apiDescription Email and password based registration
 * @apiName Email registration
 * @apiGroup Authentication
 * @apiPermission public
 *
 * @apiParam {String} email Email.
 * @apiParam {String} password Password. At least 8 characters long and must contain letters and numbers.
 *
 * @apiSuccess {Boolean} isSuccess The requested operation was successful or not
 * @apiSuccess {Object} error If isSuccess equals false
 * @apiSuccess {String} error.message Error message
 * @apiSuccess {Number} error.code Error code
 */

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