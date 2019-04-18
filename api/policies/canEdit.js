module.exports = function(req, res, next) {
  var accountType = req.user[0].accountType;
  if (['editor', 'admin'].includes(accountType)) {
    next();
  } else if (accountType === 'range editor') {
    return res.send(403, { message: 'You only have permission to update a species’ range.' });
  } else {
    return res.send(403, { message: 'You do not have editing privileges.' });
  }
};
