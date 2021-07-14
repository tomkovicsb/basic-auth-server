const Response = require('../../../services/response');
const userCache = require('../../../services/userCache');
const config = require('../../../config');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');
const cacheConfig = config.cache;

const { MissingParamsException } = require('../../../services/error');

/**
 * @api {get} /user Get public profile
 * @apiDescription Get the provided user's public profile data
 * @apiName Get public profile
 * @apiGroup User
 * @apiPermission public
 *
 * @apiSuccess {Boolean} isSuccess The requested operation was successful or not
 * @apiSuccess {Object} result If isSuccess equals true
 * @apiSuccess {String} result.userId User's db id.
 * @apiSuccess {String} result.nickname User's nickname.
 * @apiSuccess {Object} error If isSuccess equals false.
 * @apiSuccess {String} error.message Error message.
 * @apiSuccess {Number} error.code Error code.
 */

module.exports = async (req, res) => {
    const { params } = req;
    const response = new Response(res);

    if (!params.userId) {
        return response.error(new MissingParamsException('userId'))
            .send();
    }

    let userData = await User.findById(params.userId).lean();
    userData = User.toPublicProfile(userData);

    response.data(userData);

    await userCache.set({
        id: params.userId,
        key: cacheConfig.keys.userProfile,
        data: userData
    });
    return response.send();
};