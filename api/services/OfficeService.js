(function () {
  'use strict';

  module.exports.filterByOffice = function (species, officeList) {
    var filtered = [];

    _.each(species, function (animal) {
      _.each(animal.offices, function (office) {
        if (officeList.indexOf(office.name) > -1) filtered.push(animal);
      });
    });
    return filtered;
  };

  module.exports.filterByRegion = function (species, regions) {
    var filtered = [];

      _.each(species, function (animal) {
        _.each(animal.offices, function (office) {
          if (regions.indexOf(office.adminRegion) > -1) filtered.push(animal);
        });
      });
    return filtered;
  };

})();
