const environment = process.env.NODE_ENV;
const _ = require('lodash');
const fs = require('fs');

let defaultConfig = require('./config');

let config;

if (environment && fs.existsSync(`./${environment}.js`)) {
  const evnConfig = require(`./${environment}`);

  config = _.merge(_.cloneDeep(defaultConfig), evnConfig);
  console.info(`The server uses the ${environment} configuration`);
} else {
  config = defaultConfig;
  console.warn(`The server uses the local configuration because ${environment} is not available`);
}

module.exports = config;
