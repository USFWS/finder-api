var moment = require('moment');

module.exports = {
  current: function (species) {
    var fakeDate = moment('1990-01-01');
    var currentStatus = {
      date: fakeDate
    };

    _.each(species.status, function (status) {
      if (moment(status.date).isAfter(currentStatus.date)) {
        currentStatus = status;
      }
    });

    if (currentStatus.date === fakeDate) return null;
    else return currentStatus.name;
  }
};
