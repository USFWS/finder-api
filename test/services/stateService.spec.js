(function () {
  'use strict';

  var expect = require('chai').expect;
  var StateService = require('../../api/services/StateService');

  describe('State Service', function () {

    it('should return the abbrev given a state name in all caps', function (done) {
      var state = 'ALABAMA';
      var expected = 'AL';
      var abbreviation = StateService.getAbbreviationFromState(state);
      expect(abbreviation).to.equal(expected);
      done();
    });

    it('should return the abbrev given a state name in all lower case', function (done) {
      var state = 'kentucky';
      var expected = 'KY';
      var abbreviation = StateService.getAbbreviationFromState(state);
      expect(abbreviation).to.equal(expected);
      done();
    });

    it('should throw if an invalid state is provided', function (done) {
      var state = 'zimbabwe';
      var abbreviation = StateService.getAbbreviationFromState.bind(StateService, state);
      expect(abbreviation).to.throw(Error);
      done();
    });

  });
})();
