/*jshint expr: true*/
var expect = require('chai').expect;

describe('Species model', function() {

  it ('should be pre-populated with a few species for tests', function(done) {
    Species.find().exec(function(err, species) {
      expect(species.length).to.be.at.least(1);
      done();
    });
  });

  it('saves a new record when supplied with required fields', function(done) {
    Species.create({
      "scientificName": "Ambystoma barbouri",
      "taxon": "Amphibian",
      "leadOffice": "Frankfort",
    }, function(err, created) {
      expect(err).to.not.exist;
      expect(created.scientificName).to.equal('Ambystoma barbouri');
      done();
    });
  });

  describe('creation should throw validation error', function() {

    it('if the scientific name already exists', function(done) {
      Species.create({
        "scientificName": "Ambystoma barbouri",
        "taxon": "Amphibian",
        "leadOffice": "Frankfort",
      }, function(err, created) {
        expect(err.invalidAttributes.scientificName).to.include({
          value: 'Ambystoma barbouri',
          rule: 'unique',
          message: 'A record with that `scientificName` already exists (`Ambystoma barbouri`).'
        });
        expect(created).to.not.exist;
        done();
      });
    });

    it('if the scientific name is empty', function(done) {
      Species.create({
        "commonName": "Streamside salamander",
        "taxon": "Amphibian",
        "leadOffice": "Frankfort",
      }, function(err, created) {
        expect(err.invalidAttributes.scientificName).to.include({
          rule: 'required',
          message: '"required" validation rule failed for input: null'
        });
        expect(created).to.not.exist;
        done();
      });
    });

    it('if taxon is empty', function(done) {
      Species.create({
        "scientificName": "Fake name",
        "commonName": "Streamside salamander",
        "leadOffice": "Frankfort",
      }, function(err, created) {
        expect(err.invalidAttributes.taxon).to.include({
          rule: 'required',
          message: '"required" validation rule failed for input: null'
        });
        expect(created).to.not.exist;
        done();
      });
    });

    it('if no lead office is identified', function(done) {
      Species.create({
        "scientificName": "Another Fake name",
        "taxon": "Amphibian",
        "commonName": "Streamside salamander",
      }, function(err, created) {
        expect(err.invalidAttributes.leadOffice).to.include({
          rule: 'required',
          message: '"required" validation rule failed for input: null'
        });
        expect(created).to.not.exist;
        done();
      });
    });

  });
});
