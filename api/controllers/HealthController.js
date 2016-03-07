/**
 * HealthController
 *
 * @description :: Endpoint to let AWS know we're still up and running.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	checkHealth: function (req, res) {
		res.ok();
	}
};
