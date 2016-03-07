/**
* History.js
*
* @description :: This model contains information about modifications to the databse.
*                Each time a CRUD operation is performed a history record is created.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var moment = require('moment');

module.exports = {

  adaptor: 'mongo',

  attributes: {

    action: {
      type: 'string',
      required: true
    },

    content: {
      type: 'string',
      required: true
    },

    data: {
      type: 'json',
      required: true,
      defaultsTo: {}
    },

    date: {
      type: 'date',
      required: true,
      defaultsTo: new Date()
    },

    modifiedBy: {
      model: 'user'
    }
  }
};
