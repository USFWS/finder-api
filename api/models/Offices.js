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

    adminRegion: {
      type: 'string',
      required: true,
      unique: false,
      enum: [
        'Pacific',
        'Southwest',
        'Midwest',
        'Southeast',
        'Northeast',
        'Mountain-Prairie',
        'Alaska',
        'Pacific Southwest'
      ]
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
    },

    email: {
      type: 'email'
    },

    url: {
      type: 'string'
    },

    species: {
      model: 'species'
    }
  }
};
