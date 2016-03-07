/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  Species.find().exec(function (err, species) {
    if (err) cb(err);

    if (species.length === 0) {
      var speciesData = require('../finder');
      sails.log.info('Seeding the database...');
      Species.create(speciesData).exec(function (err, newSpecies) {
        sails.log.info('Added ' + newSpecies.length + ' species to the database. Lift off!');
        sails.log.info('');
        cb();
      });
    } else {
      sails.log.info('Database already contains ' + species.length + ' species. Lift off!');
      sails.log.info('');
      cb();
    }
  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  // cb();
};
