# basic-auth-server
A basic authentication server for demonstration purposes

It uses NodeJS, MongoDB and optionally Redis.

## Required minimum versions for running the server

- Node v12.22
- Npm v6.14
- MongoDB v3.6

Node version manager (nvm) is advised for smooth context switches.

## Installation

### Clone the authentication-server
```
sudo apt-get install git
git clone << repository url >>
npm i
```

### Install or upgrade Docker and Docker-compose
To install or upgrade Docker and Docker-compose build applications use the command line and type:

```
sudo apt-get update
wget -qO- https://get.docker.com/ | sudo sh
sudo curl -L https://github.com/docker/compose/releases/download/1.7.1/docker-compose-`uname -s`-`uname -m` > sudo /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
*note: Make sure you've always got the correct version of docker and docker-compose:*

```
sudo docker --version #requires at least version 1.8.1
sudo docker-compose --version #requires at least version 1.7.1
```

### Prepared commands
```
npm run server - Starts the server on localhost
npm run test - Runs the API unit tests
npm run doc - Generates the API docs. It will be in the docs folder.
```

### Start the server with Docker

Before start, build the docker image:

```bash
sudo docker-compose build
```

Start the server in a different screen

```bash
screen -S basic_auth_server
sudo docker-compose up
```
You can press “Ctrl-A” and “d“ to detach the screen. (If you want re-attach the screen just type: `screen -r` )

## Environment variables

Set environment variables in `.env` file (if needed, define new one):

```bash
cp .env.example .env
nano .env
```

```
- NODE_ENV - The environment of the server. Default is 'local'. The contents of config depend from this.
- SERVER_PORT - The port which the server will listen on.
- SERVER_HOST - The server's host uri. It's for the id token's contents.
- MONGODB_URI - The URI for the MongoDB.
- MONGODB_MONGOS - Is it a mongo cluster. Possible values 'true' or 'false'.
- REDIS_ENABLED - Is the redis enabled, or the server is only mongo dependant.
- REDIS_PORT - The redis server port.
- REDIS_HOST - The redis server host.
- PASSWORD_SALT - The custom salt variable for password encryption. Default is 5.
- JWT_SECRET - The secret for json web token encryption. Default is 'tokensecret'.
- JWT_EXPIRE - The expiration time for the jwt access tokens. Default is 86400000 (1 day).
- REFRESH_TOKEN_EXPIRE - The expiration time for the jwt refresh tokens. Default is 7776000000 (3 months).
- AUTH_CODE_EXPIRE - The expiration time for the authorization code. Default is 120000 (2 minutes).
- OIDC_SECRET - The secret for id token encryption. Default is 'oidcsecret'.
```