const bcrypt = require('bcryptjs');
const config = require('../../config');
const mongo = require('../mongo');

const User = mongo.get('User');

const {
  AccountAlreadyExistsException,
  AccountNotFoundException,
  PasswordMismatchException,
  PasswordMalformedException,
} = require('../error');

module.exports = {
  registerUser: async (user) => {
    const registeredUser = await User.findOne({ email: user.email }).lean();

    if (registeredUser) {
      throw new AccountAlreadyExistsException();
    }

    const isPasswordStrong = User.checkPasswordStrength(user.password);

    if (!isPasswordStrong) {
      throw new PasswordMalformedException();
    }

    const hashedPassword = await bcrypt.hash(user.password, config.password.salt);

    return await User.create({
      email: user.email,
      password: hashedPassword,
      passwordSalt: config.password.salt,
    });
  },

  loginUser: async (user) => {
    const dbUser = await User.findOne({
        email: user.email,
        status: User.ACCOUNT_STATUSES.ACTIVE
      })
      .lean();

    if (!dbUser) {
      throw new AccountNotFoundException();
    }

    const passwordMatch = await bcrypt.compare(user.password, dbUser.password);

    if (!passwordMatch) {
      throw new PasswordMismatchException();
    }

    return dbUser;
  }
};
