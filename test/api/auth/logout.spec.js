const chai = require('chai');
const bcrypt = require('bcryptjs');
const expect = chai.expect;
const factory = require('../../lib/factory-girl');
const Request = require('../../lib/request');
const config = require('../../../config');
const { tokenHandler } = require('../../../services/authentication');

describe('Auth#logout', () => {
	it('should return with missing auth exception', async () => {
		const response = await new Request().post('/auth/logout').send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1008);
	});


	it('should return with invalid auth exception', async () => {
		const response = await new Request().post('/auth/logout')
			.setHeader('authorization', 'invalid')
			.send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1009);
	});

	it('should logout successfully', async () => {
		const user = await factory.create('User', {});
		const refreshToken = await factory.create('RefreshToken', {
			userId: user._id
		});
		const token = await tokenHandler.createAccessToken({
			user,
			refreshToken
		});
		const response = await new Request().post('/auth/logout')
			.setHeader('authorization', `Bearer ${token}`)
			.send();

		expect(response.data.isSuccess).to.equal(true);
	});
});
