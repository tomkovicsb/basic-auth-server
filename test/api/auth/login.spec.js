const chai = require('chai');
const bcrypt = require('bcryptjs');
const expect = chai.expect;
const factory = require('../../lib/factory-girl');
const Request = require('../../lib/request');
const config = require('../../../config');

describe('Auth#login', () => {
	it('should return with missing params exception',  async () => {
		const response = await new Request().post('/auth/login').send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1007);
	});

	it('should return with account not found exception',  async () => {
		const response = await new Request().post('/auth/login').send({
			email: factory.chance('email')(),
			password: factory.chance('word')({ min:3, max: 5 })
		});

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1001);
	});

	it('should return with password mismatch',  async () => {
		const existingUser = await factory.create('User', {
			password: factory.chance('word')({ min:8, max: 9 })
		});
		const response = await new Request().post('/auth/login').send({
			email: existingUser.email,
			password: factory.chance('word')({ min:10, max: 12 })
		});

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1002);
	});

	it('should return with auth code after succesful login',  async () => {
		const password = factory.chance('word')({ min:10, max: 12 });
		const existingUser = await factory.create('User', {
			password: await bcrypt.hash(password, config.password.salt),
			passwordSalt: config.password.salt,
		});
		const response = await new Request().post('/auth/login').send({
			email: existingUser.email,
			password
		});

		expect(response.data.isSuccess).to.equal(true);
		expect(response.data.result.code).to.not.null;
	});
});