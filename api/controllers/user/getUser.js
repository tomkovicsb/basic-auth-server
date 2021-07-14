const Response = require('../../../services/response');
const userCache = require('../../../services/userCache');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');

/**
 * @api {get} /user Get user
 * @apiDescription Get the authenticated user's profile data
 * @apiName Get user
 * @apiGroup User
 * @apiPermission jwt
 *
 * @apiSuccess {Boolean} isSuccess The requested operation was successful or not
 * @apiSuccess {Object} result If isSuccess equals true
 * @apiSuccess {String} result.userId User's db id.
 * @apiSuccess {String} result.email User's email
 * @apiSuccess {String} result.nickname User's nickname.
 * @apiSuccess {String} result.firstName User's first name.
 * @apiSuccess {String} result.lastName User's last name.
 * @apiSuccess {Object} error If isSuccess equals false.
 * @apiSuccess {String} error.message Error message.
 * @apiSuccess {Number} error.code Error code.
 */

module.exports = async (req, res) => {
    const { user } = req;
    const response = new Response(res);
    let userData = await User.findById(user.userId).lean();

    userData = User.toResponse(userData);

    response.data(userData);

    await userCache.set({
        id: user.userId,
        data: userData
    });

    return response.send();
};