# basic-auth-server
A basic authentication server for demonstration purposes

It uses NodeJS, MongoDB and optionaly Redis.

##Required minimum versions
Node v12 

Npm v6

##Environment variables
NODE_ENV - The environment of the server. Default is 'local'. The contents of onfig depends from this.
SERVER_PORT - The port which the server will listen on.
MONGODB_URI - The URI for the MongoDB.
MONGODB_MONGOS - Is it a mongo cluster. Possible values 'true' or 'false'.
REDIS_ENABLED - Is the redis enabled or the server is only mongo dependant.
REDIS_PORT - The redis server port.
REDIS_HOST - THe redis server host.