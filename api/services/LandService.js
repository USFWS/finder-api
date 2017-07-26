(function () {
  'use strict';

  module.exports.filterByLand = function (species, lands) {
    var filtered = [];

      _.each(species, function(animal) {
        _.each(animal.lands, function(land) {
          if (lands.indexOf(land.name) > -1) filtered.push(animal);
        });
      });
    return filtered;
  };

})();
