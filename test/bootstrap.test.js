var Sails = require('sails'),
  Barrels = require('barrels'),
  app;

before(function(done) {

  Sails.lift({
    log: {
      level: 'error'
    },
    models: {
      connection: 'test',
      migrate: 'drop'
    }
  }, function(err, server) {
    app = server;
    if (err) return done(err);

    var barrels = new Barrels();
    fixtures = barrels.data;

    barrels.populate(function(err) {
      done(err, sails);
    });
  });
});

after(function (done) {
  console.log(); // Skip a line before displaying Sails lowering logs
  Sails.lower(done);
});
