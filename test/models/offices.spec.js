/*jshint expr: true*/
(function () {
  'use strict';

  var expect = require('chai').expect;

  describe('Offices model', function() {

    it ('should be pre-populated with a few offices for tests', function(done) {
      Offices.find().exec(function(err, offices) {
        expect(offices.length).to.be.at.least(1);
        done();
      });
    });

    it('saves a new record when supplied with required fields', function(done) {
      Offices.create({
        "adminRegion": "Northeast",
        "name": "Chesapeake Bay Field Office",
        "street": "177 Admiral Cochrane Drive",
        "city": "Annapolis",
        "state": "MD",
        "zip": "21401"
      }, function(err, created) {
        expect(err).to.not.exist;
        expect(created.name).to.equal('Chesapeake Bay Field Office');
        done();
      });
    });

    describe('creation should throw a validation error', function() {

      it('if the office name already exists', function (done) {
        Offices.create({
          "adminRegion": "Northeast",
          "name": "Chesapeake Bay Field Office",
          "street": "177 Admiral Cochrane Drive",
          "city": "Annapolis",
          "state": "MD",
          "zip": "21401"
        }, function(err, created) {
          expect(err.invalidAttributes.name).to.include({
            value: 'Chesapeake Bay Field Office',
            rule: 'unique',
            message: 'A record with that `name` already exists (`Chesapeake Bay Field Office`).'
          });
          expect(created).to.not.exist;
          done();
        });
      });

      it('if the office name is not provided', function (done) {
        Offices.create({
          "adminRegion": "Northeast",
          "street": "177 Admiral Cochrane Drive",
          "city": "Annapolis",
          "state": "MD",
          "zip": "21401"
        }, function(err, created) {
          expect(err).to.exist;
          expect(created).to.not.exist;
          done();
        });
      });

      it('if a street is not provided', function (done) {
        Offices.create({
          "adminRegion": "Northeast",
          "name": "Atlanta Field Office",
          "city": "Atlanta",
          "state": "GA",
          "zip": "30345"
        }, function(err, created) {
          expect(err).to.exist;
          expect(created).to.not.exist;
          done();
        });
      });

      it('if a city is not provided', function (done) {
        Offices.create({
          "adminRegion": "Northeast",
          "name": "Atlanta Field Office",
          "street": "1875 Century Blvd NE",
          "state": "GA",
          "zip": "30345"
        }, function(err, created) {
          expect(err).to.exist;
          expect(created).to.not.exist;
          done();
        });
      });

      it('if a state is not provided', function (done) {
        Offices.create({
          "adminRegion": "Northeast",
          "name": "Atlanta Field Office",
          "street": "1875 Century Blvd NE",
          "city": "Atlanta",
          "zip": "30345"
        }, function(err, created) {
          expect(err).to.exist;
          expect(created).to.not.exist;
          done();
        });
      });

      it('if a zip code is not provided', function (done) {
        Offices.create({
          "adminRegion": "Northeast",
          "name": "Atlanta Field Office",
          "street": "1875 Century Blvd NE",
          "city": "Atlanta",
          "state": "GA"
        }, function(err, created) {
          expect(err).to.exist;
          expect(created).to.not.exist;
          done();
        });
      });

      it('if a region is not provided', function (done) {
        Offices.create({
          "name": "Atlanta Field Office",
          "street": "1875 Century Blvd NE",
          "city": "Atlanta",
          "state": "GA",
          "zip": "30345"
        }, function(err, created) {
          expect(err).to.exist;
          expect(created).to.not.exist;
          done();
        });
      });
    });
  });
})();
