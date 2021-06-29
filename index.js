const express = require('express');
const dotenv = require('dotenv');

require('dotenv').config()

const config = require('./config');
const port = config.server.port;
const server = express();

server.listen(port);

console.log(`Auth server started on port ${port}`);
