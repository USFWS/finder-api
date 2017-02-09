// Check to see if a record already exists linking a species with a protected land
// If a record exists, return a 409 to prevent a duplicate
module.exports = function(req, res, next) {

  var query = {
    'species': req.param('species'),
    'land': req.param('land')
  };

  SpeciesLands
    .find(query)
    .then(function(records) {
      if (records.length === 0) return next();
      else return res.send(409, 'The species and protected land are already linked.');
    })
    .catch(function(err) {
      return res.serverError(err);
    });
};
