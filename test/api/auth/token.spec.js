const chai = require('chai');
const expect = chai.expect;
const factory = require('../../lib/factory-girl');
const Request = require('../../lib/request');

describe('Auth#token', () => {
	it('should return with missing params exception',  async () => {
		const response = await new Request().get('/auth/token').send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1007);
	});

	it('should return with invalid auth code exception because code not exists',  async () => {
		const response = await new Request().get('/auth/token?code=invalid').send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1006);
	});

	it('should return with invalid auth code exception because code is already used',  async () => {
		const authCode = await factory.create('AuthCode', {
			isUsed: true
		});
		const response = await new Request().get(`/auth/token?code=${authCode.code}`).send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1006);
	});

	it('should return with valid tokens and user data',  async () => {
		const authCode = await factory.create('AuthCode', {
			expiresAt: factory.chance('date', {min: new Date()})
		});
		const response = await new Request().get(`/auth/token?code=${authCode.code}`).send();

		expect(response.data.isSuccess).to.equal(true);
		expect(response.data.result.refreshToken).to.not.null;
		expect(response.data.result.accessToken).to.not.null;
		expect(response.data.result.user).to.not.null;
	});
});