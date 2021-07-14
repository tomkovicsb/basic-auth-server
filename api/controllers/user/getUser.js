const Response = require('../../../services/response');
const userCache = require('../../../services/userCache');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');

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