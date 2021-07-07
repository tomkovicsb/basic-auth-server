const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config()

const config = require('./config');
const mongo = require('./services/mongo');
const redis = require('./services/redis');

const port = config.server.port;
const server = express();

const initServer = async () => {
  server.use(cookieParser());
  server.use(bodyParser.json({ limit: '6mb' }));
  server.use(bodyParser.urlencoded({ extended: true, limit: '6mb' }));
  server.use(bodyParser.text({ limit: '6mb' }));
  server.use(bodyParser.raw({ limit: '6mb' }));

  await mongo.init();
  await redis.init();
  server.use(require('./api/routes'));
  server.listen(port);
  console.log(`Auth server started on port ${port}`);
};

initServer().catch(console.error);
