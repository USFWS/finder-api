/*jshint expr: true*/
(function () {
  'use strict';

  var expect = require('chai').expect;
  var StatusService = require('../../api/services/StatusService');

  describe('Status Service', function() {
    var allAnimals;

    before(function (done) {
      Species.find().exec(function (err, species) {
        expect(err).to.not.exist;
        allAnimals = species;
        done();
      });
    });

    describe('current status', function () {

      it('should return the most recent status name', function (done) {
        var currentStatus = StatusService.current(allAnimals[0]);
        expect(currentStatus).to.equal('Substantial 90-day Finding');
        done();
      });

      it('should return null given an empty array of statuses', function (done) {
        var fakeAnimal = { status: [] };
        var currentStatus = StatusService.current(fakeAnimal);
        expect(currentStatus).to.be.null;
        done();
      });
    });

    describe('filter by current status', function () {

      it('should return an empty array for a status that doesn\'t exist', function (done) {
        var filtered = StatusService.filterByCurrentStatus(allAnimals, 'Bazooka');
        var expected = [];
        expect(filtered).to.be.empty;
        done();
      });

      it('should return array of species w/most recent status matches a test status', function (done) {
        var testStatus = 'Substantial 90-day Finding';
        var filtered = StatusService.filterByCurrentStatus(allAnimals, testStatus);
        var currentStatus = StatusService.current(filtered[0]);
        expect(filtered.length).to.equal(2);
        expect(currentStatus).to.equal(testStatus);
        done();
      });

      it('should return array of species w/most recent status matches any in an array of statuses', function (done) {
        var testStatusArray = ['Not Substantial 90-day Finding', 'Petition Withdrawn'];
        var filtered = StatusService.filterByCurrentStatus(allAnimals, testStatusArray);
        var firstAnimalStatus = StatusService.current(filtered[0]);
        var secondAnimalStatus = StatusService.current(filtered[1]);
        expect(filtered.length).to.equal(2);
        expect(testStatusArray).to.include(firstAnimalStatus);
        expect(testStatusArray).to.include(secondAnimalStatus);
        done();
      });
    });

  });


})();
