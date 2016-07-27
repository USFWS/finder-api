var jwt = require('jwt-simple');
var moment = require('moment');

var TOKEN_SECRET = sails.config.TOKEN_SECRET || process.env.TOKEN_SECRET;

module.exports.createToken = function(user) {

  var payload = {
    exp: moment().add(7, 'days').unix(),
    iat: moment().unix(),
    iss: 'www.fws.gov',
    sub: user.id,
    act: user.accountType,
    name: user.email
  };

  return jwt.encode(payload, TOKEN_SECRET);
};

module.exports.verifyToken = function(token) {
  return jwt.decode(token, TOKEN_SECRET);
};

module.exports.decodeToken = function(token) {
  var parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Bad authorization token.');
  }

  var signature = parts[2];
  var headers = JSON.parse(base64urlDecode(parts[0]));
  var payload = JSON.parse(base64urlDecode(parts[1]));

  return {
    headers: headers,
    payload: payload,
    signature: signature
  };
};

function base64urlDecode(str) {
  return new Buffer(base64urlUnescape(str), 'base64').toString();
}

function base64urlUnescape(str) {
  str += Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}
