const mongoose = require('mongoose');
const uuid = require('uuid-v4');
const { Schema } = mongoose;

const schema = new Schema({
	jti: { type: String, default: uuid },
	expireAt: { type: Date, expires: 0 }
}, {
	timestamps: true
});

schema.index({ jti: 1 });

const model = mongoose.model('BlacklistedToken', schema, 'blacklistedtokens');

module.exports = model;
