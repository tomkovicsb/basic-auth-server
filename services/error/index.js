class AccountAlreadyExistsException extends Error {
  constructor() {
    const message = 'Account already exists';
    const code = 1000;
    super(message, code);
  }
}

class AccountNotFoundException extends Error {
  constructor() {
    const message = 'Account not found';
    const code = 1001;
    super(message, code);
  }
}

class PasswordMismatchException extends Error {
  constructor() {
    const message = 'Password mismatch';
    const code = 1002;
    super(message, code);
  }
}

class PasswordMalformedException extends Error {
  constructor() {
    const message = 'Password is not strong enough';
    const code = 1003;
    super(message, code);
  }
}

class InvalidAccessTokenException extends Error {
  constructor() {
    const message = 'Invalid access token';
    const code = 1004;
    super(message, code);
  }
}

class InvalidRefreshTokenException extends Error {
  constructor() {
    const message = 'Invalid refresh token';
    const code = 1005;
    super(message, code);
  }
}

class InvalidAuthCodeException extends Error {
  constructor() {
    const message = 'Invalid auth code';
    const code = 1006;
    super(message, code);
  }
}

class MissingParamsException extends Error {
  constructor(paramsString) {
    const message = `Missing params: ${paramsString}`;
    const code = 1007;
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
};
