(function () {
  'use strict';

  var json2csv = require("json2csv").parse;

  function normalizeDataForCSV(species) {
    return {
      id: species.id,
      scientificName: species.scientificName,
      commonName: species.commonName,
      taxon: species.taxon,
      range: species.range.join(', '),
      leadOffice: species.leadOffice,
      currentStatus: StatusService.current(species)
    }
  }

  module.exports.speciesListToCSV = function (species) {
    var fields = ['id', 'scientificName', 'commonName', 'taxon', 'range', 'leadOffice', 'currentStatus'];
    var data = species.map(normalizeDataForCSV);
    try {
      var csv = json2csv(data, { fields: fields });
    } catch (e) {
      return new Error('Could not create CSV file from species list.');
    }
    return csv;
  };

  module.exports.getFileName = function () {
    var now = new Date();
    return "at-risk-species-finder-custom-query" + now
        .toISOString()
        .slice(0, 10);
  }

})();
