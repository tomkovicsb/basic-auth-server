const mongoose = require('mongoose');
const uuid = require('uuid-v4');
const _ = require('lodash');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  userId: { type: ObjectId, ref: 'User' },
  code: { type: String, default: uuid },
  isUsed: { type: Boolean, default: false },
  expireAt: { type: Date, expires: 0 }
});

schema.index({ userId: 1, code: 1, isUsed: 1 });

const model = mongoose.model('AuthCode', schema, 'authcodes');

module.exports = model;
