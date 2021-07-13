const factory = require('../factory');
const RefreshToken = require('../../../../../services/mongo/models/RefreshToken');

const { chance, assoc } = factory;

factory.define('RefreshToken', RefreshToken, {
	userId: assoc('User', '_id'),
	expireAt: chance('date', {max: new Date()}),
});
