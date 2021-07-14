'use strict';

const config = require('../../config');
const axios = require('axios');

class Request {
	constructor(host, port) {
		this.url = `http://${ host || config.server.host }:${ port || config.server.port }`;
		this.address = this.url;
		this.headers = {'Content-Type': 'application/json'};
		this.type = 'POST';
	}

	post(path) {
		this.address = this.url + path;
		this.type = 'POST';
		return this;
	}

	get(path) {
		this.address = this.url + path;
		this.type = 'GET';
		return this;
	}

	setHeader(key, value) {
		this.headers[key] = value;
		return this;
	}

	async send(data) {
		return axios({
			headers: this.headers,
			method: this.type,
			url: this.address,
			data: data
		});
	}
}

module.exports = Request;
