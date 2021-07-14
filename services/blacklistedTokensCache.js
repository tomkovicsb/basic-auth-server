const redis = require('./redis');
const config = require('../config');
const cacheConfig = config.cache;
const mongo = require('./mongo');
const BlacklistedToken = mongo.get('BlacklistedToken');

/**
 * A wrapper service for redis to handle the blacklisted tokens data
 * */

module.exports = {
	get: async ({jti, key}) => {
		const redisToken = await redis.get(`${key || cacheConfig.keys.blacklistedToken}:${jti}`);

		if (redisToken) {
			return JSON.parse(redisToken);
		}

		const token = await BlacklistedToken.findOne({ jti }).lean();

		if (!token) {
			return null;
		}

		await redis.set(`${ key || cacheConfig.keys.blacklistedToken}:${jti}`, JSON.stringify(token));
		await redis.expire(`${ key || cacheConfig.keys.blacklistedToken}:${jti}`, cacheConfig.ttl.blacklistedToken);

		return token;
	},
	set: async ({jti, key, data}) => {
		const token = await redis.set(`${ key || cacheConfig.keys.blacklistedToken}:${jti}`, JSON.stringify(data));
		await redis.expire(`${ key || cacheConfig.keys.blacklistedToken}:${jti}`, cacheConfig.ttl.blacklistedToken);

		return token;
	},
	clear: async ({jti, key}) => {
		return await redis.del(`${ key || cacheConfig.keys.blacklistedToken }:${jti}`);
	},
};