const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const ACCOUNT_STATUSES= {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED'
}

const schema = new Schema({
  email: { type: String },
  nickname: { type: String },
  password: { type: String },
  passwordSalt: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  status: {
    type: String,
    enum: _.keys(ACCOUNT_STATUSES),
    default: ACCOUNT_STATUSES.ACTIVE
  },
}, {
  timestamps: true
});

schema.index({ email: 1 });
schema.index({ nickname: 1 });

schema.statics.ACCOUNT_STATUSES = ACCOUNT_STATUSES;

schema.statics.checkPasswordStrength = password => {
  let regexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&.-]{8,}$/;

  return regexp.test(password);
};

schema.statics.toResponse = user => {
  const responseData = {
    userId: user._id.toString(),
    email: user.email,
    nickname: user.nickname,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return responseData;
};

schema.statics.toPublicProfile = user => {
  const responseData = {
    userId: user._id.toString(),
    nickname: user.nickname,
  };

  return responseData;
};

const model = mongoose.model('User', schema, 'users');

module.exports = model;
