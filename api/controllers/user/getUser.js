const Response = require('../../../services/response');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');

module.exports = async (req, res) => {
    const { user } = req;
    const response = new Response(res);
    const userData = await user.findById(user.userId).lean();

    response.data(User.toResponse(userData));

    return response.send();
};