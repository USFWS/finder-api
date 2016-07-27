/*jshint expr: true*/
var expect = require('chai').expect;

describe('User model', function() {

  it('should be pre-populated with a few users for tests', function(done) {
    User.find().exec(function(err, users) {
      expect(users.length).to.be.at.least(1);
      done();
    });
  });

  it('should default to viewer privileges', function(done) {
    User.create({
      "name": "Chuck bagadompalopous",
      "email": "new_email@fws.gov"
    }).exec(function(err, user) {
      expect(err).to.be.null;
      expect(user.accountType).to.equal('viewer');
      done();
    });
  });

  describe('creation should throw validation error', function() {

    it('if email already exists', function(done) {
      User.create({
        "name": "Vernon davis",
        "email": "roy_hewitt@fws.gov",
        "accountType": "admin"
      }).exec(function(err, user) {
        expect(err.invalidAttributes.email).to.include({
          "value": 'roy_hewitt@fws.gov',
          "rule": 'unique',
          "message": 'A record with that `email` already exists (`roy_hewitt@fws.gov`).'
        });
        expect(user).to.not.exist;
        done();
      });
    });

    it('if bad account type', function(done) {
      User.create({
        "name": "Wendy webber",
        "email": "roy_hewitt@fws.gov",
        "accountType": "batman"
      }).exec(function(err, user) {
        expect(err).to.exist;
        expect(user).to.not.exist;
        done();
      });
    });
  });
});
