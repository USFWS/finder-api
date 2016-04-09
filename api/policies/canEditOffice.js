module.exports = function(req, res, next) {
  if (req.user[0].accountType === 'viewer') {
    return res.send(403, { message: 'You do not have editing privileges.' });
  }
  next();
};
