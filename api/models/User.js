/**
* User.js
*
* @description :: This model represents a user of the At-Risk Species Finder
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  adapter: 'mongo',

  attributes: {

    email: {
      type: 'string',
      unique: true,
      required: true
    },

    job: {
      type: 'string'
    },

    phone: {
      type: 'string'
    },

    accountType: {
      type: 'string',
      required: true,
      enum: ['viewer', 'editor', 'admin'],
      defaultsTo: 'viewer'
    },

    history: {
      collection: 'history',
      via: 'modifiedBy'
    }

  }
};
