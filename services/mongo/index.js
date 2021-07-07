const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../../config');
const mongoConfig = config.db.mongo;

module.exports = {
  init: async () => {
    return new Promise((resolve, reject) => {
      if (!!mongoConfig.debug) {
        mongoose.set('debug', console.log);
      }
      if (mongoose.connection.readyState === 1) {
        resolve();
        return mongoose.connection;
      }

      mongoose.connection
        .on('error', err => {
          console.error(err);
        })
        .on('disconnected', () => {
          console.error('Disconnected from DB');
        })
        .once('open', () => {
          console.log(`Connection to Mongoose was successful! Connected to database: ${mongoose.connection.name}`);
          // Try to load the mongoose models
          try {
            const files = fs.readdirSync(path.join(__dirname, '/models'));

            files.filter(file => path.extname(file) === '.js')
              .forEach(file => {
                require(`./models/${file}`);
                console.log(`Loading model: ${file.split('.')[0]}`);
              });

            resolve();
          } catch (err) {
            return reject(err);
          }
        })
        .on('reconnected', ()=> {
          console.log('Reconnected to DB');
        });

      mongoose.connect(mongoConfig.uri, mongoConfig.opt, err => {
        if (!!err) {
          console.error(err);
          mongoose.disconnect();
          process.exit(1);
        }
      });
    });
  },

  mongoose: mongoose,

  get(modelName) {
    return mongoose.model(modelName);
  }
};
