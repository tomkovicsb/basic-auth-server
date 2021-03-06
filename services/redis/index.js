const redis = require('redis');
const config = require('../../config');
const redisConfig = config.cache.redis;

let client;

module.exports = {
  init() {
    return new Promise((resolve, reject) => {
      if (!redisConfig.enabled) {
        console.log('Redis is not enabled');
        return resolve();
      }

      client = redis.createClient(redisConfig.port, redisConfig.host);

      client.on('error', error => {
          console.error(error);
        })
        .on('connect', () => {
          console.log('Redis connected');
          resolve();
        })
        .on('reconnecting', () => {
          console.log('Redis reconnecting');
        })
        .on('ready', () => {
          console.log('Redis connection ready');
        });
    });
  },

  set(key, data) {
    return new Promise((resolve, reject) => {
      if (!redisConfig.enabled) {
        return resolve();
      }

      client.set(key, data, function(err, redisResponse) {
        if (err) {
          return reject(err);
        }

        resolve(redisResponse);
      });
    });
  },

  get(key) {
    return new Promise((resolve, reject) => {
      if (!redisConfig.enabled) {
        return resolve();
      }

      client.get(key, function(err, redisResponse) {
        if (err) {
          return reject(err);
        }

        resolve(redisResponse);
      });
    });
  },

  del(key) {
    return new Promise((resolve, reject) => {
      if (!redisConfig.enabled) {
        return resolve();
      }

      client.del(key, function(err, redisResponse) {
        if (err) {
          return reject(err);
        }

        resolve(redisResponse);
      });
    });
  },

  expire(key, ttl) {
    return new Promise((resolve, reject) => {
      if (!redisConfig.enabled) {
        return resolve();
      }

      client.expire(key, ttl, function(err, redisResponse) {
        if (err) {
          return reject(err);
        }

        resolve(redisResponse);
      });
    });
  },

  ttl(key) {
    return new Promise((resolve, reject) => {
      if (!redisConfig.enabled) {
        return resolve();
      }

      client.ttl(key, function(err, redisResponse) {
        if (err) {
          return reject(err);
        }

        resolve(redisResponse);
      });
    });
  }
};