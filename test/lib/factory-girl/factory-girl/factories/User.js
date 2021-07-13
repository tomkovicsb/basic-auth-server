const factory = require('../factory');
const User = require('../../../../../services/mongo/models/User');

const { chance } = factory;

factory.define('User', User, {
	email: chance('email'),
	nickname: chance('name'),
	firstName: chance('first'),
	lastName: chance('last'),
});