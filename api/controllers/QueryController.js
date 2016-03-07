/**
 * QueryController
 *
 * @description :: Server-side logic for managing queries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 *
 *
 *
 * @notes ::  HARD DEPENENCY ON MONGODB:
 *            This query interface relies on the native mongo adaptor because
 *            SailsJS does not yet support searching nested documents.
 */

module.exports = {

  endemic: function(req, res) {
    var state,
      query;

    if (req.param('state')) {
      state = req.param('state');
      query = {
        $and: [
          { range: { $size: 1 } },
          { range: state }
        ]
      };
    } else {
      query = {
        range: { $size: 1 }
      };
    }

    Species.native(function(err, collection) {
      if (err) return res.negotiate(err);
      collection.find(query).toArray(function(err, results) {
        if (err) return res.negotiate(err);
        res.ok(results);
      });
    });
  },

  nonEndemic: function(req, res) {
    var state,
      query;

    if (req.param('state')) {
      state = req.param('state');
      query = {
        $and: [
          // Check if more than one item in array with index (as of MongoDB 2.2)
          { 'range.1': { $exists: true } },
          { range: state }
        ]
      };
    } else {
      query = {
        'range.1': { $exists: true }
      };
    }

    Species.native(function(err, collection) {
      if (err) return res.negotiate(err);
      collection.find(query).toArray(function(err, results) {
        if (err) return res.negotiate(err);
        res.ok(results);
      });
    });
  },

  otherRegion: function(req, res) {
    var query = {
      leadOffice: [
        'Region 1',
        'Region 2',
        'Region 3',
        'Region 5',
        'Region 6',
        'Region 7',
        'Region 8',
        'Region 9'
      ]
    };

    Species.find(query).exec(function(err, species) {
      if (err) return res.negotiate(err);
      res.ok(species);
    });
  },

  custom: function(req, res) {
    // Grab the parsed query string
    var params = req.allParams(),
      supportedParams = ['leadOffice', 'range', 'taxon', 'status'],
      query = _.pick(params, supportedParams);

    if (params.rangeQueryType === 'all') {
      // Use native MongoDB syntax
      query.range = { "$all": params.range };
    }
    console.log(query);

    Species.find(query).exec(function(err, species) {
      if (err) return res.serverError(err);
      res.ok(species);
    });
  }
};

