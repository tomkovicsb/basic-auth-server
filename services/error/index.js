const util = require('util');

function CustomError (message, code) {
  Error.captureStackTrace(this, this.constructor);
  this.code = code;
  this.message = `${message} (${code})`;
}

util.inherits(CustomError, Error);

class AccountAlreadyExistsException extends CustomError {
  constructor() {
    const message = 'Account already exists';
    const code = 1000;
    super(message, code);
  }
}

class AccountNotFoundException extends CustomError {
  constructor() {
    const message = 'Account not found';
    const code = 1001;
    super(message, code);
  }
}

class PasswordMismatchException extends CustomError {
  constructor() {
    const message = 'Password mismatch';
    const code = 1002;
    super(message, code);
  }
}

class PasswordMalformedException extends CustomError {
  constructor() {
    const message = 'Password is not strong enough';
    const code = 1003;
    super(message, code);
  }
}

class InvalidAccessTokenException extends CustomError {
  constructor() {
    const message = 'Invalid access token';
    const code = 1004;
    super(message, code);
  }
}

class InvalidRefreshTokenException extends CustomError {
  constructor() {
    const message = 'Invalid refresh token';
    const code = 1005;
    super(message, code);
  }
}

class InvalidAuthCodeException extends CustomError {
  constructor() {
    const message = 'Invalid auth code';
    const code = 1006;
    super(message, code);
  }
}

class MissingParamsException extends CustomError {
  constructor(paramsString) {
    const message = `Missing params: ${paramsString}`;
    const code = 1007;
    super(message, code);
  }
}

class MissingAuthException extends CustomError {
  constructor() {
    const message = `Missing auth`;
    const code = 1008;
    super(message, code);
  }
}

class InvalidAuthException extends CustomError {
  constructor() {
    const message = `Invalid Auth`;
    const code = 1009;
    super(message, code);
  }
}

class InvalidObjectIdException extends CustomError {
  constructor() {
    const message = `Invalid ObjectId`;
    const code = 1010;
    super(message, code);
  }
}

module.exports = {
  AccountAlreadyExistsException,
  AccountNotFoundException,
  PasswordMismatchException,
  PasswordMalformedException,
  InvalidAccessTokenException,
  InvalidRefreshTokenException,
  InvalidAuthCodeException,
  MissingParamsException,
  MissingAuthException,
  InvalidAuthException,
  InvalidObjectIdException,
};
