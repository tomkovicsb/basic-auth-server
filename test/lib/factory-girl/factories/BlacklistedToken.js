const factory = require('../factory');
const BlacklistedToken = require('../../../../services/mongo/models/BlacklistedToken');

const { chance } = factory;

factory.define('BlacklistedToken', BlacklistedToken, {
	expireAt: chance('date', {max: new Date()}),
});
