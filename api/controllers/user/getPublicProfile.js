const Response = require('../../../services/response');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');

const { MissingParamsException } = require('../../../services/error');

module.exports = async (req, res) => {
    const { params } = req;
    const response = new Response(res);

    if (!params.userId) {
        return response.error(new MissingParamsException('userId'))
            .send();
    }

    const userData = await User.findById(params.userId).lean();

    response.data(User.toPublicProfile(userData));

    return response.send();
};