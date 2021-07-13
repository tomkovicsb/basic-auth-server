before((done) => {
  this.timeout(120000);
  require('../index').on('listened', done);
});

afterEach((done) => {
  factory.cleanUp().then(() => done());
});

