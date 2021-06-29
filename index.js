const express = require('express');

require('dotenv').config()

const config = require('./config');
const mongo = require('./services/mongo');

const port = config.server.port;
const server = express();

const initServer = async () => {
  await mongo.init();

  server.listen(port);
  console.log(`Auth server started on port ${port}`);
};

initServer();
