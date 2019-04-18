/**
 * AuthController
 *
 * @description :: Server-side logic for managing authentication
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var { google } = require("googleapis");
var request = require("request");

function isValidEmail(profile) {
  var partnerEmails = ["msowers90@gmail.com", "royhewitt07@gmail.com"];

  // All USFWS email addresses are OK
  if (profile.hd === "fws.gov") return true;

  // Check against a white-list of parterns
  if (partnerEmails.includes(profile.email)) return true;
  return false;
}

module.exports = {
  google: function(req, res) {
    var CLIENT_ID = req.body.clientId,
      CLIENT_SECRET = sails.config.GOOGLE_SECRET,
      REDIRECT_URI = req.body.redirectUri,
      oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );

    google.options({ auth: oauth2Client });

    oauth2Client.getToken(req.body.code, function(err, tokens) {
      if (err) return res.negotiate(err);
      oauth2Client.setCredentials(tokens);

      request(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          auth: { bearer: tokens.access_token }
        },
        function(err, response, body) {
          if (err) return res.negotiate(err);
          const profile = JSON.parse(body);

          var validEmail = isValidEmail(profile);

          if (!validEmail)
            return res.send(
              403,
              "You must be a U.S. Fish & Wildlife Service Employee to create an account."
            );
          // Find or Create a user account
          User.findOne({ email: profile.email }).exec(function(err, foundUser) {
            if (err) return res.negotiate(err);
            if (foundUser) {
              var jwt = sailsTokenAuth.createToken(foundUser);
              return res.send({ token: jwt });
            } else {
              var params = {
                name: profile.name,
                email: profile.email
              };

              User.create(params).exec(function(err, newUser) {
                if (err) return res.negotiate(err);
                var jwt = sailsTokenAuth.createToken(newUser);
                res.send({ token: jwt });
              });
            }
          });
        }
      );
    });
  }
};
