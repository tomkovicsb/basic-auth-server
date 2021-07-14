const { tokenHandler } = require('../../../services/authentication');

module.exports = async (req, res) => {
	const { user } = req;
	const response = new Response(res);

	await tokenHandler.invalidateRefreshToken({ jti: user.jti }).lean();

	return response.send();
};