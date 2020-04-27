var mongoose = require("mongoose");

var PetSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  btamin: {
    type: Number,
    default: 0
  },
  btamin_sell: {
    type: Number,
    default: 0
  },
  respect: {
    type: Number,
    default: 0
  },
  min_level: {
    type: Number,
    default: 0
  },
  endurance: {
    type: Number,
    default: 0
  },
  intelligence: {
    type: Number,
    default: 0
  },
  power: {
    type: Number,
    default: 0
  },
  agility: {
    type: Number,
    default: 0
  },
  vip: {
    type: String,
    default: 'No'
  },
  type: {
    type: String,
    default: 'PETS'
  }
}, {
  versionKey: false
});

var Pet = mongoose.model("Pet", PetSchema);
module.exports = Pet;
