'use strict';

const _ = require('lodash');

module.exports = class Response {
  constructor(res) {
    this.response = res;
    this.request = res.req;
    this.status = 200;
    this.template = {
      isSuccess: true,
      error: {
        code: null,
        message: null
      },
      result: null
    };
  }

  data(data) {
    this.template.result = data;
    return this;
  }

  status(status) {
    this.status = status;
    return this;
  }

  error(error) {
    this.template.isSuccess = false;
    console.error(`Response error: ${error}`);
    switch (typeof error) {
      case 'object':
        if (error.message) {
          this.template.error.message = error.message;
          this.template.error.code = error.code;
        } else {
          this.template.error.message = JSON.stringify(error);
        }
        break;
      default:
        this.template.error.message = error;
    }

    return this;
  }

  send() {
    if (!this.template.isSuccess) {
      delete this.template.result;
    } else {
      delete this.template.error;
    }

    return this.response.status(this.status).json(this.template);
  }

  toJSON() {
    return this._template;
  }

  redirect(uri) {
    return this.response.redirect(uri);
  }
};
