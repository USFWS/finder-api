module.exports = function(req, res, next) {
  var accountType = req.user[0].accountType;
  if (['editor', 'admin'].includes(accountType)) {
    next();
  } else if (accountType === 'range editor') {
    // Only pass along the range parameter (blacklist everything else)
    var ignoreFields = [
      'scientificName',
      'commonName',
      'taxon',
      'leadOffice',
      'status',
      'proposedDetermination',
      'ssa',
      'categorization',
      'ecos',
      'itis',
      'offices',
      'experts',
      'lands'
    ];
    req.options.values = req.options.values || {};
    req.options.values.blacklist = req.options.values.blacklist || [];
    pushValues(req.options.values.blacklist, ignoreFields);
    next();
  } else {
    // Viewers can't edit anything
    return res.send(403, { message: 'You do not have editing privileges.' });
  }
  function pushValues(target, src) {
    src.forEach(function(value) {
      target.push(value);
    });
  };
};
