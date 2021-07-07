const Response = require('../../../services/response');
const mongo = require('../../../services/mongo');
const User = mongo.get('User');

module.exports = async (req, res) => {
    const { user, body } = req;
    const response = new Response(res);
    const updatedUserData = await User.findOneAndUpdate({
        _id: user.userId
    }, body, {
        new: true
    }).lean();

    response.data(User.toResponse(updatedUserData));

    return response.send();
};