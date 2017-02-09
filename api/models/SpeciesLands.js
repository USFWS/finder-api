/**
* SpeciesLands.js
*
* @description :: This model is a join table between Species and Lands
*  models.  Using a model and through association allows us to add additional
*  fields to the join table.  In this case we're adding a population descriptor.
*
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    species: {
      model: 'species'
    },

    land: {
      model: 'lands'
    },

    population: {
      type: 'string',
      required: true,
      enum: ['O+', 'O', 'P', 'U']
    }
  }
};
