const Response = require('../../../services/response');
const userCache = require('../../../services/userCache');
const config = require('../../../config');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');
const cacheConfig = config.cache;

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