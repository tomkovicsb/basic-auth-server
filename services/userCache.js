const redis = require('./redis');
const config = require('../config');
const cacheConfig = config.cache;

/**
 * A wrapper service for redis to handle only the user related cache calls
 * */

module.exports = {
	get: async ({id, key}) => {
		const redisUser = await redis.get(`${key || cacheConfig.keys.user}:${id}`);

		if (!redisUser) {
			return null;
		}

		return JSON.parse(redisUser);
	},
	set: async ({id, key, data}) => {
		return await redis.set(`${ key || cacheConfig.keys.user} :${id}`, JSON.stringify(data));
	},
	clear: async ({id, key}) => {
		return await redis.del(`${ key || cacheConfig.keys.user }:${id}`);
	},
};