const chai = require('chai');
const expect = chai.expect;
const factory = require('../../lib/factory-girl');
const Request = require('../../lib/request');

describe('User#getPublicProfile', () => {
	it('should return with invalid objectId exception',  async () => {
		const response = await new Request().get('/user/invalid').send();

		expect(response.data.isSuccess).to.equal(false);
		expect(response.data.error.code).to.equal(1010);
	});

	it('should return with public profile data',  async () => {
		const user = await factory.create('User', {});

		const response = await new Request().get(`/user/${user._id.toString()}`).send();

		expect(response.data.isSuccess).to.equal(true);
		expect(response.data.result.userId).to.equal(user._id.toString());
		expect(response.data.result.nickname).to.equal(user.nickname);
	});
});