const Response = require('../../services/response');
const userCache = require('../../services/userCache');
const config = require('../../config');
const cacheConfig = config.cache;

module.exports = (type) => {
	let cache, param, key;

	switch (type) {
		case 'userCache':
			cache = userCache;
			param = 'userId';
			break;
		case 'profileCache':
			cache = userCache;
			param = 'userId';
			key = cacheConfig.keys.userProfile
			break;
	}

	return async (req, res, next) => {
		const response = new Response(res);

		if (!cache || !cacheConfig.redis.enabled) {
			return next();
		}

		let id;

		if (req.params[param]) {
			id = req.params[param];
		} else if (req.query[param]) {
			id = req.query[param];
		} else if (req.body[param]) {
			id = req.body[param];
		}

		const data = await cache.get({
			id,
			key
		});

		if (data) {
			return response.data(data)
				.send();
		}

		return next();
	};
};
