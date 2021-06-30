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
REDIS_HOST - The redis server host.
PASSWORD_SALT - The custom salt variable for password encryption. Default is 5.
JWT_SECRET - The secret for json webtoken encrypzion. Default is 'tokensecret'.
JWT_EXPIRE - The expiration time for the jwt access tokens. Default is 86400000 (1 day).
REFRESH_TOKEN_EXPIRE - The expiration time for the jwt refresh tokens. Default is 7776000000 (3 months).
AUTH_CODE_EXPIRE - The expiration time for the authorization code. Default is 120000 (2 minutes).