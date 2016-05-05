/**
 * ListedController
 *
 * @description :: Server-side logic for managing listeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	byState: function (req, res) {

		var state = req.param('state');

		if (!state) return res.badRequest('You must provide a state e.g. \'?state=AL\' or \'?state=Alabama\'.');
		if (state.length > 2) {
			state = StateService.getAbbreviationFromState(state);
			if (state.length !== 2) return res.badRequest('State must be provided as a two letter abbreviation e.g. \'AL\'');
		}

	  var $;
	  var listed = {
			'state': state,
	    'endangered': 0,
	    'threatened': 0
	  };

	  var options = {
	    'uri': '',
	    'baseUrl': 'http://ecos.fws.gov/tess_public/reports/species-listed-by-state-report',
	    'qs': {
	      'state': state,
	      'status': 'listed'
	    }
	  };

	  function countListedSpecies(i, row) {
	    var status = $(row).find('td')['0'].children[0].data;
	    if (status === 'E') listed.endangered += 1;
	    else if (status === 'T') listed.threatened += 1;
	  }

	  request(options, function(err, response, body) {
	    if (err) return res.negotiate(err);
	    $ = cheerio.load(body);

			var animals = $('table')[0];
	    var plants = $('table')[1];

			// Pull data out of the animals and plants tables respectively
	    $(animals).find('tbody').find('tr').each(countListedSpecies);
	    $(plants).find('tbody').find('tr').each(countListedSpecies);

	    res.send(listed);
	  });

	}
};
