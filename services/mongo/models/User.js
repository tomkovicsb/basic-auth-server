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
  firstName: { type: String },
  lastName: { type: String },
  status: {
    type: String,
    enum: _.keys(ACCOUNT_STATUSES),
    default: ACCOUNT_STATUSES.ACTIVE
  },
});

schema.index({ email: 1 });
schema.index({ nickname: 1 });

schema.statics.ACCOUNT_STAUSES = ACCOUNT_STATUSES;

schema.statics.toResponse = user => {
  const responseData = {
    email: user.email,
    nickname: user.nickname,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return responseData;
};

const model = mongoose.model('User', schema, 'users');

module.exports = model;
