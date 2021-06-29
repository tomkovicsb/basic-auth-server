const express = require('express');

require('dotenv').config()

const config = require('./config');
const mongo = require('./services/mongo');
const redis = require('./services/redis');

const port = config.server.port;
const server = express();

const initServer = async () => {
  await mongo.init();
  await redis.init();

  server.listen(port);
  console.log(`Auth server started on port ${port}`);
};

initServer().catch(console.error);
