/**
 * QueryController
 *
 * @description :: Server-side logic for managing queries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 *
 * @notes ::  HARD DEPENENCY ON MONGODB:
 *            This query interface relies on the native mongo adaptor because
 *            SailsJS does not yet support searching nested documents.
 */

module.exports = {

  status: function(req, res) {
    var status = req.param('status');
    var filtered;

    if (!status) return res.badRequest('You must provide a status');

    Species.find({ 'status.name': status }).exec(function (err, species) {
      if (err) return res.negotiate(err);
      // We got the species, now we need to filter based on current status
      // The Service currently assumes you're passing in a string, not an array
      // Accepting an array will allow people to query based on several current
      // statuses instead of running multiple queries

      filtered = StatusService.filterByCurrentStatus(species, status);
      res.ok(filtered);
    });
  },

  endemic: function(req, res) {
    var state = req.param('state'),
        query;

    if (state) {
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
    var state = req.param('state'),
      type = req.param('type'),
      query;

    // User didn't give a state list, return all species with more than one state in range
    // Check if more than one item in array with index (as of MongoDB 2.2)
    if (state.length === 0) query = { 'range.1': { $exists: true } };
    else {
      // type = and: Includes all of the supplied states in it's range (where range.length > 1)
      if (type === 'and') {
        query = {
          $and: [
            { 'range.1': { $exists: true } },
            { range: { $all: state } }
          ]
        };
      }
      // type = or: Includes any of the supplied states in it's range (where range.length > 1)
      if (type === 'or') {
        query = {
          $and: [
            { 'range.1': { $exists: true } },
            { range: { $in: state } }
          ]
        };
      }
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
    var Query,
      params = req.allParams(),
      supportedParams = ['range', 'taxon'],
      query = _.pick(params, supportedParams);

    if (params.rangeQueryType === 'all') {
      // Use native MongoDB syntax
      query.range = { '$all': params.range };
    }

    Query = Species.find(query).populate('offices');
    if (params.status) Query.where({ 'status.name': params.status });
    Query.exec(function(err, species) {
      if (err) return res.negotiate(err);

      if ( params.status)
        species = StatusService.filterByCurrentStatus(species, params.status);

      if ( params.offices )
        species = OfficeService.filterByOffice(species, params.offices);

      if ( params.regions )
        species = OfficeService.filterByRegion(species, params.regions);

      res.ok(species);
    });
  }
};
