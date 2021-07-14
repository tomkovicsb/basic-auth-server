const {
  factory,
  MongooseAdapter
} = require('factory-girl');
const mongoose = require('mongoose');
const _ = require('lodash');

const adapter = new MongooseAdapter();
factory.setAdapter(adapter);

factory.cleanUp = () => {
  const promises = Object.keys(mongoose.models).map((model) => mongoose.models[model].deleteMany());
  return Promise.all(promises);
};

// export factory to models. So it can use it
module.exports = factory;
