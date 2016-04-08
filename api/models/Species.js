/**
* Species.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    scientificName: {
      type: 'string',
      required: true,
      unique: true
    },

    commonName: {
      type: 'string'
    },

    taxon: {
      type: 'string',
      required: true,
      enum: [
        'Amphibian',
        'Amphipod',
        'Bee',
        'Beetle',
        'Bird',
        'Butterfly',
        'Caddisfly',
        'Crayfish',
        'Crustacean',
        'Dragonfly',
        'Fly',
        'Fish',
        'Isopod',
        'Mammal',
        'Moth',
        'Mussel',
        'Non-Vascular Plant',
        'Reptile',
        'Snail',
        'Stonefly',
        'Vascular Plant'
      ]
    },

    region: {
      type: 'string',
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

    leadOffice: {
      type: 'string',
      required: true
    },

    range: {
      type: 'array'
    },

    status: {
      type: 'array'
    },

    // Four digit species code in ECOS
    ecos: {
      type: 'string'
    }

  }
};
