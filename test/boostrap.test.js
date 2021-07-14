const factory = require('./lib/factory-girl');

before((done) => {
  require('../index').on('listened', done);
});

afterEach((done) => {
  factory.cleanUp().then(() => done());
});

