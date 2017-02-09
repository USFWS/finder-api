/**
* PublicLands.js
*
* @description :: This model represents a protected land.  The database uses
*  the USGS Protected Areas Database (PAD-US v1.4)
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    agency: {
      type: 'string',
      required: true
    },

    // This is equivalent to UNIT_NAME in PAD-US v1.4
    name: {
      type: 'string',
      required: true,
      unique: true
    },

    // If name above isn't clear we can optionally create/display a label
    label: {
      type: 'string',
      unique: false
    },

    // If this public land was not included in PAD-US v1.4
    custom: {
      type: 'boolean',
      defaultsTo: false
    },

    notes: {
      type: 'text'
    },

    // A public land can be associated with one or more species
    species: {
      collection: 'species',
      via: 'species',
      through: 'specieslands'
    }
  }
};
