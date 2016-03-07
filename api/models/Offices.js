/**
* Offices.js
*
* @description :: This model represents USFWS Field Stations.  Each instance of
*   a Species model is required to be associated with a lead office.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      unique: true
    },

    street: {
      type: 'string',
      required: true
    },

    city: {
      type: 'string',
      required: true
    },

    state: {
      type: 'string',
      required: true
    },

    zip: {
      type: 'string',
      required: true
    },

    phone: {
      type: 'string'
    }
  }
};
