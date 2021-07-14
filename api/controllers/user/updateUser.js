const Response = require('../../../services/response');
const userCache = require('../../../services/userCache');
const config = require('../../../config');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');
const cacheConfig = config.cache;

/**
 * @api {post} /user Update user
 * @apiDescription Update the authenticated user's profile data
 * @apiName Update user
 * @apiGroup User
 * @apiPermission jwt
 *
 * @apiParam {String} email User's email.
 * @apiParam {String} nickname User's nickname.
 * @apiParam {String} firstName User's first name.
 * @apiParam {String} lastName User's last name.
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
    const { user, body } = req;
    const response = new Response(res);
    const updatedUserData = await User.findOneAndUpdate({
        _id: user.userId
    }, body, {
        new: true
    }).lean();

    await userCache.clear({
        id: user.userId
    });
    await userCache.clear({
        id: user.userId,
        key: cacheConfig.keys.userProfile
    });

    response.data(User.toResponse(updatedUserData));

    return response.send();
};