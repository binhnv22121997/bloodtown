var mongoose = require("mongoose");

var GymSchema = new mongoose.Schema({
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
  energy: {
    type: Number,
    default: 0
  },
  time: {
    type: Number,
    default: 0
  },
  health: {
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
  endurance: {
    type: Number,
    default: 0
  },
  respect: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false
});

var Gym = mongoose.model("Gym", GymSchema);
module.exports = Gym;
