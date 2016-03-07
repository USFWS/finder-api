var moment = require('moment');

module.exports = function (req, res, next) {
  var token;

  if (!(req.headers && req.headers.authorization)) {
    return res.status(401).send({
      message: 'No access token.'
    });
  }
  else {
    var header = req.headers.authorization.split(' ');
    if (header.length == 2) {
      var scheme = header[0];
      var credentials = header[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    }
    else {
      return res.json(401, {
        message: 'Format is Authorization: Bearer [token]'
      });
    }
  }

  var payload = sailsTokenAuth.verifyToken(token);
  var now = moment().unix();

  if (now > payload.exp) {
    return res.status(401).send({
      message: 'Token has expired.'
    });
  }

  User.findById(payload.sub, function (err, user) {
    if (!user) {
      return res.status(400).send({
        message: 'User does not exist.'
      });
    }

    req.user = user;
    next();
  });
};
