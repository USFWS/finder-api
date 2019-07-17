var moment = require('moment');

module.exports = {

  filterByCurrentStatus: function (species, status) {
    var filtered = [];

    if (typeof status === 'string') {
      _.each(species, function (animal) {
        if (StatusService.current(animal) === status) {
          filtered.push(animal);
        }
      });
    } else { // Handles the case where 'status' is an Array
      _.each(status, function (theStatus) {
        _.each(species, function (animal) {
          if (StatusService.current(animal) === theStatus) filtered.push(animal);
        });
      });
    }

    return filtered;
  },

  filterByStatusOnDate: function (species, matchStatus, date) {
    var filtered = [],
      statusIsAfterDate,
      previousStatus;

    _.each(species, function (animal) {
      _.each(animal.status, function (status, i, statusList) {
        // If the status date is after the date provided by the user, grab the previous status
        statusIsAfterDate = moment(status.date).isAfter(moment(date));

        if (i > 0) previousStatus = statusList[i - 1].name;
        if (statusIsAfterDate && previousStatus === matchStatus)
          filtered.push(animal);
      });
    });

    return filtered;
  },

  current: function (species, field) {
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
    else return field ? currentStatus[field] : currentStatus.name;
  }
};
