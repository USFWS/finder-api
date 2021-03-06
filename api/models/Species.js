/**
 * Species.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    scientificName: {
      type: "string",
      required: true,
      unique: true
    },

    commonName: {
      type: "string"
    },

    taxon: {
      type: "string",
      required: true,
      enum: [
        "Amphibian",
        "Amphipod",
        "Bee",
        "Beetle",
        "Bird",
        "Butterfly",
        "Caddisfly",
        "Crayfish",
        "Crustacean",
        "Dragonfly",
        "Fly",
        "Fish",
        "Isopod",
        "Mammal",
        "Moth",
        "Mussel",
        "Non-Vascular Plant",
        "Reptile",
        "Snail",
        "Stonefly",
        "Vascular Plant"
      ]
    },

    leadOffice: {
      type: "string"
    },

    range: {
      type: "array"
    },

    status: {
      type: "array"
    },

    proposedDetermination: {
      type: "string"
    },

    ssa: {
      type: "string"
    },

    categorization: {
      type: "array"
    },

    // Four digit species code in ECOS
    ecos: {
      type: "string"
    },

    // Integrated taxonomic information system number; itis.gov
    itis: {
      type: "string"
    },

    // A species can be associated with one or more offices
    offices: {
      collection: "offices",
      via: "species"
    },

    // A species can be associated with one or more users (lead biologist)
    experts: {
      collection: "user",
      via: "species"
    },

    // A species can be associated with one or more public lands
    lands: {
      collection: "lands",
      via: "land",
      through: "specieslands"
    }
  }
};
