/**
* User.js
*
* @description :: This model represents a user of the At-Risk Species Finder
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  adapter: 'mongo',

  attributes: {

    name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      unique: true,
      required: true
    },

    organization: {
      type: 'string'
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

    // A user can be associated with one or more species
    species: {
      collection: 'species',
      via: 'experts'
    }

  }
};
