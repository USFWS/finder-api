/*jshint expr: true*/
var expect = require('chai').expect;

describe('Categories model', function() {

  it('should create a new category when supplied with required fields', function(done) {
    Categories.create({
      "name": "New Science Underway to Inform Key Uncertainties",
      "code": "3",
      "description": "As stated previously, a higher quality of scientific information leads to better decision-making, which focuses our resources on providing protections associated with endangered and threatened species listing on species most in need. Scientific uncertainty regarding a species&#39; status is often encountered in listing decisions. For circumstances when that uncertainty can be resolved within a reasonable timeframe because emerging science (e.g., taxonomy, genetics, threats) is underway to answer key questions that may influence the listing determination, those species will be prioritized for action next after those with existing strong information bases. This bin is appropriate when the emerging science or study is already underway, or a report is expected soon, or the data exist, but they need to be compiled and analyzed"
    }).exec(function(err, category) {
      expect(err).to.be.null;
      expect(category.name).to.equal('New Science Underway to Inform Key Uncertainties');
      done();
    });
  });

  describe('creation should throw validation error', function (done) {

    it('if the category name already exists', function(done) {
      Categories.create({
        "name": "New Science Underway to Inform Key Uncertainties",
        "code": "4",
        "description": "test"
      }).exec(function(err, category) {
        expect(category).to.not.exist;
        expect(err.invalidAttributes.name).to.include({
          "rule": "unique",
          "value": "New Science Underway to Inform Key Uncertainties",
          "message": "A record with that `name` already exists (`New Science Underway to Inform Key Uncertainties`)."
        });
        done();
      });
    });

    it('if the category code already exists', function(done) {
      Categories.create({
        "name": "test",
        "code": "3",
        "description": "test"
      }).exec(function(err, category) {
        expect(category).to.not.exist;
        expect(err.invalidAttributes.code).to.include({
          "rule": "unique",
          "value": "3",
          "message": "A record with that `code` already exists (`3`)."
        });
        done();
      });
    });

    it('if the category description already exists', function(done) {
      Categories.create({
        "name": "test",
        "code": "test",
        "description": "As stated previously, a higher quality of scientific information leads to better decision-making, which focuses our resources on providing protections associated with endangered and threatened species listing on species most in need. Scientific uncertainty regarding a species&#39; status is often encountered in listing decisions. For circumstances when that uncertainty can be resolved within a reasonable timeframe because emerging science (e.g., taxonomy, genetics, threats) is underway to answer key questions that may influence the listing determination, those species will be prioritized for action next after those with existing strong information bases. This bin is appropriate when the emerging science or study is already underway, or a report is expected soon, or the data exist, but they need to be compiled and analyzed"
      }).exec(function(err, category) {
        expect(category).to.not.exist;
        expect(err.invalidAttributes.description).to.include({
          "rule": "unique",
          "value": "As stated previously, a higher quality of scientific information leads to better decision-making, which focuses our resources on providing protections associated with endangered and threatened species listing on species most in need. Scientific uncertainty regarding a species&#39; status is often encountered in listing decisions. For circumstances when that uncertainty can be resolved within a reasonable timeframe because emerging science (e.g., taxonomy, genetics, threats) is underway to answer key questions that may influence the listing determination, those species will be prioritized for action next after those with existing strong information bases. This bin is appropriate when the emerging science or study is already underway, or a report is expected soon, or the data exist, but they need to be compiled and analyzed",
          "message": "A record with that `description` already exists (`As stated previously, a higher quality of scientific information leads to better decision-making, which focuses our resources on providing protections associated with endangered and threatened species listing on species most in need. Scientific uncertainty regarding a species&#39; status is often encountered in listing decisions. For circumstances when that uncertainty can be resolved within a reasonable timeframe because emerging science (e.g., taxonomy, genetics, threats) is underway to answer key questions that may influence the listing determination, those species will be prioritized for action next after those with existing strong information bases. This bin is appropriate when the emerging science or study is already underway, or a report is expected soon, or the data exist, but they need to be compiled and analyzed`)."
        });
        done();
      });
    });

    it('if the category name is not provided', function (done) {
      Categories.create({
        "code": "test",
        "description": "test"
      }).exec(function(err, created) {
        expect(err.invalidAttributes.name).to.be.a('array');
        expect(err.invalidAttributes.name).to.include({
          "rule": "string",
          "message": "Value should be a string (instead of null, which is an object)"
        });
        expect(created).to.not.exist;
        done();
      });
    });

    it('if the category code is not provided', function (done) {
      Categories.create({
        "name": "test",
        "description": "test"
      }).exec(function(err, created) {
        expect(err.invalidAttributes.code).to.be.a('array');
        expect(err.invalidAttributes.code).to.include({
          "rule": "string",
          "message": "Value should be a string (instead of null, which is an object)"
        });
        expect(created).to.not.exist;
        done();
      });
    });

    it('if the category description is not provided', function (done) {
      Categories.create({
        "code": "test",
        "name": "test"
      }).exec(function(err, created) {
        expect(err.invalidAttributes.description).to.be.a('array');
        expect(err.invalidAttributes.description).to.include({
          "rule": "string",
          "message": "Value should be a string (instead of null, which is an object)"
        });
        expect(created).to.not.exist;
        done();
      });
    });

  });

});
