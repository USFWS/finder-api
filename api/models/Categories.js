/**
* Categories.js
*
* @description :: This model represents species categories described in
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      unique: true
    },

    code: {
      type: 'string',
      required: true,
      unique: true
    },

    description: {
      type: 'string',
      required: true,
      unique: true
    }

  }
};
