const Response = require('../../services/response');
const { mongoose } = require('../../services/mongo');
const ObjectId = mongoose.Types.ObjectId;

const {
	InvalidObjectIdException,
} = require('../../services/error');

module.exports = (checkParams) => {
	return (req, res, next) => {
		const response = new Response(res);
		try {
			for (let param of checkParams) {
				new ObjectId(req.params[param]);
			}
		} catch (err) {
			return response.error(new InvalidObjectIdException())
				.send();
		}

		return next();
	};
};
