const mongoose = require('mongoose');
const uuid = require('uuid-v4');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  userId: { type: ObjectId, ref: 'User' },
  token: { type: String, default: uuid },
  jti: { type: String, default: uuid },
  expireAt: { type: Date, expires: 0 }
}, {
  timestamps: true
});

schema.index({ userId: 1 });

const model = mongoose.model('RefreshToken', schema, 'refreshtokens');

module.exports = model;
