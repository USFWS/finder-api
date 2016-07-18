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
			state: state,
	    endangered: [],
	    threatened: []
	  };

	  var options = {
	    'uri': '',
	    'baseUrl': 'http://ecos.fws.gov/tess_public/reports/species-listed-by-state-report',
	    'qs': {
	      'state': state,
	      'status': 'listed'
	    }
	  };

	  function findListedSpecies(i, row) {
	    var status = $(row).find('td')['0'].children[0].data;
      var animal = $(row).find('td')['1'].children[0].data;

      // Remove newline character, whtitespace, opening paren at the end of the line
      var commonName = animal.replace('\n', '').slice(0, -1).trim();
      var scientificName = $(row).find('i')['0'].children[0].data;
      var ecosLink = $(row).find('a')['0'].attribs.href;

      var species = {
        ecos: 'https://ecos.fws.gov' + ecosLink,
        scientific: scientificName,
        common: commonName
      };

	    if (status === 'E') listed.endangered.push(species);
	    else if (status === 'T') listed.threatened.push(species);
	  }

	  request(options, function(err, response, body) {
	    if (err) return res.negotiate(err);
	    $ = cheerio.load(body);

			var animals = $('table')[0];
	    var plants = $('table')[1];

			// Pull data out of the animals and plants tables respectively
	    $(animals).find('tbody').find('tr').each(findListedSpecies);
	    $(plants).find('tbody').find('tr').each(findListedSpecies);

	    res.send(listed);
	  });

	}
};
