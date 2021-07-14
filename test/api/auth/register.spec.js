const chai = require('chai');
const expect = chai.expect;
const factory = require('../../lib/factory-girl');
const Request = require('../../lib/request');

describe('Auth#register', () => {
	it('should return with missing params exception',  async () => {
		const response = await new Request().post('/auth/register').send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1007);
	});

	it('should return with weak password exception',  async () => {
		const response = await new Request().post('/auth/register').send({
			email: factory.chance('email')(),
			password: factory.chance('word')({ min:3, max: 5 })
		});

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1003);
	});

	it('should return with account already exists',  async () => {
		const existingUser = await factory.create('User', {});
		const response = await new Request().post('/auth/register').send({
			email: existingUser.email,
			password: factory.chance('word')({ min:10, max: 12 })
		});

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1000);
	});

	it('should return with success',  async () => {
		const response = await new Request().post('/auth/register').send({
			email: factory.chance('email')(),
			password: 'asdf1234'
		});

		expect(response.data.isSuccess).to.equal(true);
	});
});