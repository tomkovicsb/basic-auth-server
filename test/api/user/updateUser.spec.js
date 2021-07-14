const chai = require('chai');
const expect = chai.expect;
const factory = require('../../lib/factory-girl');
const Request = require('../../lib/request');
const { tokenHandler } = require('../../../services/authentication');

describe('User#getUser', () => {
	it('should return with missing auth exception',  async () => {
		const response = await new Request().post('/user').send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1008);
	});

	it('should return with invalid auth exception',  async () => {
		const response = await new Request().post('/user')
			.setHeader('authorization', 'invalid')
			.send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1009);
	});

	it('should return with user data',  async () => {
		const firstName = factory.chance('first')();
		const lastName = factory.chance('last')();
		const user = await factory.create('User', {});
		const refreshToken = await factory.create('RefreshToken', {
			userId: user._id
		});
		const token = await tokenHandler.createAccessToken({
			user,
			refreshToken
		});
		const response = await new Request().post('/user/')
			.setHeader('authorization', `Bearer ${token}`)
			.send({
				firstName,
				lastName
			});

		expect(response.data.isSuccess).to.equal(true);
		expect(response.data.result.userId).to.equal(user._id.toString());
		expect(response.data.result.nickname).to.equal(user.nickname);
		expect(response.data.result.email).to.equal(user.email);
		expect(response.data.result.firstName).to.equal(firstName);
		expect(response.data.result.lastName).to.equal(lastName);
	});
});