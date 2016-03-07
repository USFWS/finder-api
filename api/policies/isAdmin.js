module.exports = function(req, res, next) {
  var accountType = req.user[0].accountType;
  if (accountType !== 'admin') {
    return res.send(403, { message: 'You must have admin privileges to complete this task.' });
  }
  next();
};
