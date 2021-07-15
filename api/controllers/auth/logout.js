const { tokenHandler } = require('../../../services/authentication');
const Response = require('../../../services/response');

/**
 * @api {post} /auth/logout Logout
 * @apiDescription Authenticated user logout by removing, banning current tokens
 * @apiName Logout
 * @apiGroup Authentication
 * @apiPermission jwt
 *
 * @apiSuccess {Boolean} isSuccess The requested operation was successful or not
 * @apiSuccess {Object} error If isSuccess equals false
 * @apiSuccess {String} error.message Error message
 * @apiSuccess {Number} error.code Error code
 */

module.exports = async (req, res) => {
	const { user } = req;
	const response = new Response(res);

	await tokenHandler.invalidateRefreshToken({ jti: user.jti });

	return response.send();
};