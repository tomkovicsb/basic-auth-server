const factory = require('../factory');
const AuthCode = require('../../../../../services/mongo/models/AuthCode');

const { chance, assoc } = factory;

factory.define('AuthCode', AuthCode, {
  userId: assoc('User', '_id'),
  expireAt: chance('date', {max: new Date()}),
});
