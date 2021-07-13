const Response = require('../../../services/response');
const userCache = require('../../../services/userCache');
const config = require('../../../config');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');
const cacheConfig = config.cache;

const { MissingParamsException } = require('../../../services/error');

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